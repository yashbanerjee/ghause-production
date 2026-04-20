const prisma = require('../lib/prisma');

exports.getEnquiries = async (req, res) => {
    const { type } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    try {
        console.log(`[Enquiry API] Fetching enquiries for type: ${type || 'ALL'}, page: ${page}, search: ${search}`);
        
        const where = {
            ...(type ? { type } : {}),
            ...(search ? {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                    { subject: { contains: search, mode: 'insensitive' } },
                    { company: { contains: search, mode: 'insensitive' } },
                ]
            } : {})
        };

        const [enquiries, total] = await Promise.all([
            prisma.enquiry.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.enquiry.count({ where })
        ]);

        res.json({
            data: enquiries,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                currentPage: page,
                limit
            }
        });
    } catch (error) {
        console.error('[Enquiry API] Fetch Error:', error);
        res.status(500).json({ 
            message: 'Failed to fetch enquiries', 
            error: error.message,
            code: error.code 
        });
    }
};

exports.updateEnquiryStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const enquiry = await prisma.enquiry.update({
            where: { id },
            data: { status }
        });
        res.json(enquiry);
    } catch (error) {
        console.error('[Enquiry API] Update Error:', error);
        res.status(500).json({ message: 'Failed to update enquiry' });
    }
};

exports.deleteEnquiry = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.enquiry.delete({ where: { id } });
        res.json({ message: 'Enquiry deleted' });
    } catch (error) {
        console.error('[Enquiry API] Delete Error:', error);
        res.status(500).json({ message: 'Failed to delete enquiry' });
    }
};

exports.createEnquiry = async (req, res) => {
    const { 
        name, 
        email, 
        message, 
        phone, 
        address, 
        country, 
        company, 
        subject, 
        productName, 
        type 
    } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            error: 'Missing required fields'
        });
    }

    try {
        // 1. Save to Database
        const enquiry = await prisma.enquiry.create({
            data: {
                type: type || "PRODUCT",
                name,
                email,
                phone: phone || null,
                address: address || null,
                country: country || null,
                company: company || null,
                subject: subject || null,
                comment: message,
                productName: productName || null,
                status: "unread"
            }
        });

        // 2. Send Email
        const { Resend } = require('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
            from: "Ghaus Website <onboarding@resend.dev>",
            to: process.env.RECIPIENT_EMAIL || "saadbhati1002@gmail.com",
            subject: `[${type || "INQUIRY"}] ${subject || productName || "New Message"}`,
            replyTo: email,
            html: `
        <div style="font-family: sans-serif; color: #1a1a1a; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
            <div style="background: #a91d1d; color: #fff; padding: 20px; text-align: center;">
                <h2 style="margin: 0; text-transform: uppercase; letter-spacing: 2px;">New ${type || "General"} Inquiry</h2>
            </div>
            <div style="padding: 24px;">
                <p><strong>From:</strong> ${name} (${email})</p>
                ${productName ? `<p><strong>Product:</strong> ${productName}</p>` : ''}
                ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
                ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
                
                <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                    ${phone ? `<tr><td style="padding: 10px; border-bottom: 1px solid #eee; background: #fafafa; width: 140px;"><strong>Phone:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${phone}</td></tr>` : ''}
                    ${address ? `<tr><td style="padding: 10px; border-bottom: 1px solid #eee; background: #fafafa;"><strong>Address/City:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${address}</td></tr>` : ''}
                    ${country ? `<tr><td style="padding: 10px; border-bottom: 1px solid #eee; background: #fafafa;"><strong>Country:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${country}</td></tr>` : ''}
                </table>

                <div style="margin-top: 24px; padding: 16px; background: #f8f9fa; border-radius: 6px; border-left: 4px solid #a91d1d; text-align: left;">
                    <p style="margin: 0 0 10px 0;"><strong>Message/Comments:</strong></p>
                    <div style="white-space: pre-wrap; color: #444;">${message}</div>
                </div>

                <div style="margin-top: 30px; text-align: center;">
                    <a href="${process.env.ADMIN_PANEL_URL || 'http://localhost:3000'}" style="display: inline-block; padding: 12px 24px; background: #a91d1d; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">View in Dashboard</a>
                </div>
                
                <div style="margin-top: 30px; font-size: 11px; color: #999; text-align: center;">
                    <p>Sent from Ghaus Website - ${new Date().toLocaleString()}</p>
                </div>
            </div>
        </div>
      `,
        });

        res.status(200).json({
            success: true,
            message: 'Inquiry submitted successfully',
            enquiry
        });
    } catch (error) {
        console.error('[Enquiry API] Create Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to process enquiry',
            details: error.message
        });
    }
};
