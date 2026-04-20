import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import prisma from '@/lib/db';

    
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://www.ghausglobal.com",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Cache-Control, Pragma, Expires",
  "Cache-Control": "no-store, max-age=0, must-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      name, 
      email, 
      message, 
      phone, 
      company, 
      subject, 
      source, 
      address, 
      country, 
      productName, 
      type 
    } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required fields" },
        { status: 400, headers: corsHeaders }
      );
    }

    console.log(`[Send-Inquiry API] Attempting to save inquiry to database for ${email}...`);

    // 1. Save data into the database exactly per Prisma schema
    const inquiryData = await prisma.enquiry.create({
      data: {
        type: type || "General",
        name,
        email,
        phone: phone || null,
        address: address || null,
        company: company || null,
        subject: subject || null,
        country: country || null,
        comment: message,
        productName: productName || null,
        status: "unread",
      }
    });

    console.log(`[Send-Inquiry API] DB Insert Success! ID: ${inquiryData.id}`);
    console.log(`[Send-Inquiry API] Attempting to send email via Resend...`);

    // 2. Send the Email notification
    const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_fallback_for_build');
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
                <p><strong>Source:</strong> ${source || "General Contact Form"}</p>
                
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
                    <p>ID: ${inquiryData.id}</p>
                    <p>Sent from Ghaus Website - ${new Date().toLocaleString()}</p>
                </div>
            </div>
        </div>
      `,
    });

    console.log(`[Send-Inquiry API] Email Sent successfully!`);

    return NextResponse.json(
      { success: true, message: "Email sent successfully", data: inquiryData },
      { status: 200, headers: corsHeaders }
    );

  } catch (error: any) {
    console.error(`[Send-Inquiry API] SEVERE ERROR:`, error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process inquiry" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}
