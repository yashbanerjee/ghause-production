import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export type EnquiryEmailData = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  productName?: string;
  type: string;
};

export async function sendEnquiryEmail(data: EnquiryEmailData) {
  const { name, email, phone, message, productName, type } = data;

  const mailOptions = {
    from: `"${process.env.SMTP_FROM_NAME || 'Ghaus Website'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
    to: 'info@ghausglobal.com ',
    subject: `New Enquiry Received: [${type}] ${productName || 'General'}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #a91d1d; color: white; padding: 24px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">New Enquiry Submission</h1>
        </div>
        <div style="padding: 24px; color: #374151;">
          <p style="margin-top: 0;">You've received a new enquiry from the website.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 140px;">Enquiry Type:</td>
              <td style="padding: 8px 0;">${type}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Name:</td>
              <td style="padding: 8px 0;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Email:</td>
              <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #a91d1d; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
              <td style="padding: 8px 0;">${phone || 'Not provided'}</td>
            </tr>
            ${productName ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Product:</td>
              <td style="padding: 8px 0;">${productName}</td>
            </tr>` : ''}
          </table>

          <div style="background-color: #f9fafb; border-left: 4px solid #a91d1d; padding: 16px; border-radius: 4px;">
            <p style="margin-top: 0; font-weight: bold; margin-bottom: 8px;">Message:</p>
            <div style="white-space: pre-wrap;">${message}</div>
          </div>

          <div style="margin-top: 32px; text-align: center;">
            <a href="${process.env.ADMIN_PANEL_URL || 'https://admin.ghausglobal.com'}" style="background-color: #a91d1d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View in Admin Panel</a>
          </div>
        </div>
        <div style="background-color: #f3f4f6; color: #6b7280; padding: 16px; text-align: center; font-size: 12px;">
          This email was sent from the Ghaus Website Admin System.
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}
