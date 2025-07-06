// app/api/contact/[id]/route.ts
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDb } from '../../../../lib/mongodb'; // CORRECTED PATH: Go up four levels

// Declare global variables provided by the Canvas environment
declare const __app_id: string | undefined;

// This route will handle PUT requests to update a specific contact message
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params; // Message ID from the URL

  try {
    const db = await getDb();
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const contactMessagesCollectionName = `contact_messages_${appId}`;
    const contactMessagesCollection = db.collection(contactMessagesCollectionName);

    const updateData = await request.json(); // Expected: { read: true }

    // Validate updateData
    if (typeof updateData.read !== 'boolean') {
      return NextResponse.json({ message: 'Invalid update data. "read" field (boolean) is required.' }, { status: 400 });
    }

    const result = await contactMessagesCollection.updateOne(
      { _id: new ObjectId(id) }, // Query by MongoDB's ObjectId
      { $set: { read: updateData.read, updatedAt: new Date() } } // Update 'read' status and 'updatedAt' timestamp
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Contact message not found.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Contact message updated successfully.' });
  } catch (error: any) {
    console.error(`Failed to update contact message with ID ${id}:`, error);
    return NextResponse.json({ message: 'Failed to update message', error: error.message }, { status: 500 });
  }
}

// Optionally, you could add a GET method here to fetch a single message by ID if needed
/*
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const db = await getDb();
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const contactMessagesCollectionName = `contact_messages_${appId}`;
    const contactMessagesCollection = db.collection(contactMessagesCollectionName);

    const message = await contactMessagesCollection.findOne({ _id: new ObjectId(id) });

    if (!message) {
      return NextResponse.json({ message: 'Message not found' }, { status: 404 });
    }

    return NextResponse.json({ ...message, _id: message._id.toString() });
  } catch (error: any) {
    console.error(`Failed to fetch message with ID ${id}:`, error);
    return NextResponse.json({ message: 'Failed to fetch message', error: error.message }, { status: 500 });
  }
}
*/
