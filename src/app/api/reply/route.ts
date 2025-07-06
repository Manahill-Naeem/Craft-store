// app/api/reply/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer'; // Nodemailer import karein

// Nodemailer transporter setup (same as in app/api/contact/route.ts)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Aapka Gmail ID jisse email bheja jayega (admin email)
    pass: process.env.EMAIL_APP_PASSWORD, // Aapka Gmail App Password
  },
});

export async function POST(request: Request) {
  try {
    const { to, subject, message } = await request.json(); // Frontend se data receive karein

    // Basic validation
    if (!to || !subject || !message) {
      return NextResponse.json({ message: 'Missing recipient, subject, or message for reply.' }, { status: 400 });
    }

    const mailOptions = {
      from: `My Store Admin <${process.env.EMAIL_USER}>`, // Admin ka email from .env.local
      to: to, // Customer ka email
      subject: subject,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #10B981;">Reply from My Store</h2>
          <p>Dear Customer,</p>
          <div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px; background-color: #f9f9f9;">
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <p style="margin-top: 20px;">Thank you for contacting us.</p>
          <p style="font-size: 0.9em; color: #777;">
            Best regards,<br/>
            The My Store Team
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Reply email sent successfully to ${to}`);

    return NextResponse.json({ message: 'Reply sent successfully!' }, { status: 200 });
  } catch (error: any) {
    console.error('Error sending reply email:', error);
    return NextResponse.json({ message: 'Failed to send reply email', error: error.message }, { status: 500 });
  }
}
