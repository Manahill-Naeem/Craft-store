// app/api/contact/route.ts
import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/mongodb';
import nodemailer from 'nodemailer';
import { ObjectId } from 'mongodb'; // ObjectId import kiya hai

// Declare global variables provided by the Canvas environment
declare const __app_id: string | undefined;

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const db = await getDb();
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const contactMessagesCollectionName = `contact_messages_${appId}`;
    const contactMessagesCollection = db.collection(contactMessagesCollectionName);

    const messageData = await request.json();

    if (!messageData.name || !messageData.email || !messageData.subject || !messageData.message) {
      return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
    }

    const messageToInsert = {
      ...messageData,
      createdAt: new Date(),
      read: false,
    };

    const result = await contactMessagesCollection.insertOne(messageToInsert);

    const adminEmail = process.env.ADMIN_RECEIVING_EMAIL;

    if (adminEmail) {
      const mailOptions = {
        from: `"${messageData.name}" <${messageData.email}>`,
        to: adminEmail,
        subject: `New Contact Message: ${messageData.subject}`,
        html: `
          <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #10B981;">New Contact Message from My Store</h2>
            <p><strong>Name:</strong> ${messageData.name}</p>
            <p><strong>Email:</strong> ${messageData.email}</p>
            <p><strong>Subject:</strong> ${messageData.subject}</p>
            <p><strong>Message:</strong></p>
            <div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px; background-color: #f9f9f9;">
              <p style="white-space: pre-wrap;">${messageData.message}</p>
            </div>
            <p style="font-size: 0.9em; color: #777; margin-top: 20px;">
              This message was sent via your store's contact form.
            </p>
          </div>
        `,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to admin.');
      } catch (emailError: any) {
        console.error('Error sending email:', emailError);
      }
    } else {
      console.warn('ADMIN_RECEIVING_EMAIL environment variable is not set. Email notification skipped.');
    }

    return NextResponse.json({
      message: 'Message sent successfully!',
      messageId: result.insertedId.toString(),
    }, { status: 200 });
  } catch (error: any) {
    console.error('Failed to send contact message or save to DB:', error);
    return NextResponse.json({ message: 'Failed to send message', error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const db = await getDb();
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const contactMessagesCollectionName = `contact_messages_${appId}`;
    const contactMessagesCollection = db.collection(contactMessagesCollectionName);

    const messages = await contactMessagesCollection.find({}).sort({ createdAt: -1 }).toArray();

    const messagesToSend = messages.map(message => ({
      ...message,
      _id: message._id.toString(),
    }));

    return NextResponse.json(messagesToSend);
  } catch (error: any) {
    console.error('Failed to fetch contact messages:', error);
    return NextResponse.json({ message: 'Failed to fetch messages', error: error.message }, { status: 500 });
  }
}
