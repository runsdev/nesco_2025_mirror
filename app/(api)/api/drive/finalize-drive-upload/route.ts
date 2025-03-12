// File: /app/api/finalize-drive-upload/route.ts
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

    // Verify the file exists
    const fileCheck = await drive.files.get({
      fileId: fileId,
      fields: 'id,name,size',
    });

    // Set permissions if needed
    if (userEmail && userEmail.endsWith('@gmail.com')) {
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

    return NextResponse.json({
      success: true,
      fileId,
      fileName: fileCheck.data.name,
      fileSize: fileCheck.data.size,
    });
  } catch (error: any) {
    console.error('Error finalizing upload:', error.message);
    return NextResponse.json({ error: 'Failed to finalize upload' }, { status: 500 });
  }
}
