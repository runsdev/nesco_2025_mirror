import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { getAuth } from '@/utils/google/action';

export async function POST(req: NextRequest) {
  try {
    const { fileId, userEmail } = await req.json();

    if (!fileId) {
      return NextResponse.json({ error: 'Missing fileId' }, { status: 400 });
    }

    const auth = await getAuth();
    const drive = google.drive({ version: 'v3', auth });

    // Set permissions if needed
    if (userEmail) {
      await drive.permissions.create({
        fileId: fileId,
        requestBody: {
          type: 'user',
          role: 'reader',
          emailAddress: userEmail,
        },
        sendNotificationEmail: false,
      });
    }

    return NextResponse.json({ success: true, fileId });
  } catch (error: any) {
    console.error('Error completing upload:', error.message);
    return NextResponse.json({ error: 'Failed to complete upload' }, { status: 500 });
  }
}
