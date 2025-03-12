import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { getAuth } from '@/utils/google/action';

export async function POST(req: NextRequest) {
  try {
    const { fileName, folderId, userEmail } = await req.json();

    if (!fileName || !folderId) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const auth = await getAuth();
    const drive = google.drive({ version: 'v3', auth });

    // Create a resumable upload session
    const fileMetadata = {
      name: fileName,
      parents: [folderId],
    };

    // Get a resumable upload URL from Google Drive
    const response = await drive.files.create(
      {
        requestBody: fileMetadata,
        media: {
          body: '', // Empty body for the initial request
        },
        fields: 'id',
        uploadType: 'resumable', // This is the key part - creates a resumable session
      },
      {
        // This configuration is needed to get the upload URL
        onUploadProgress: () => {},
      },
    );

    // Extract the resumable session URI from the response
    const uploadUrl = response.config.url;

    // Store the file ID for permission setting later
    // Note: We need to use a temporary storage (e.g., Redis) for this in production
    // For simplicity, we're returning it to the client, but in production
    // you might want to generate a unique token that maps to this data on the server
    const fileId = response.data.id;

    return NextResponse.json({
      uploadUrl,
      fileId,
      userEmail,
    });
  } catch (error: any) {
    console.error('Error creating upload session:', error.message);
    return NextResponse.json({ error: 'Failed to create upload session' }, { status: 500 });
  }
}
