import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { getAuth } from '@/utils/google/action';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb', // Staying under Vercel's 4.5MB limit
    },
  },
};

const fetchWithRetry = async (url: string, options: RequestInit, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok || response.status === 308) {
        return response;
      }
      if (response.status === 503 && i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      throw new Error(`Request failed with status ${response.status}`);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries reached');
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const folderId = formData.get('folderId') as string;
    const userEmail = formData.get('userEmail') as string;
    const fileName = formData.get('fileName') as string;
    const contentRange = req.headers.get('content-range');
    const fileSize = parseInt(formData.get('fileSize') as string, 10);
    var fileId = formData.get('fileId') as string;
    const uploadUrl = formData.get('uploadUrl') as string;

    if (!file || !folderId) {
      return NextResponse.json({ error: 'Missing file or folderId' }, { status: 400 });
    }

    const auth = await getAuth();
    const accessToken = await auth.getAccessToken();

    // Convert the file chunk to a Buffer
    const buffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(buffer);

    // Parse content range if present
    let start = 0;
    let end = fileBuffer.length - 1;
    let total = fileSize;

    if (contentRange) {
      const matches = contentRange.match(/bytes (\d+)-(\d+)\/(\d+)/);
      if (matches) {
        start = parseInt(matches[1], 10);
        end = parseInt(matches[2], 10);
        total = parseInt(matches[3], 10);
      }
    }

    // First chunk upload (or single chunk if small)
    if (!fileId) {
      // Create new file metadata
      const fileMetadata = {
        name: fileName || file.name,
        parents: [folderId],
      };

      // For files under 4MB, upload in one go
      if (fileSize <= 4 * 1024 * 1024) {
        const drive = google.drive({ version: 'v3', auth });

        const media = {
          mimeType: file.type,
          body: fileBuffer,
        };

        const response = await drive.files.create({
          requestBody: fileMetadata,
          media: media,
          fields: 'id',
        });

        fileId = response.data.id!;

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
          fileId,
          status: 'completed',
          message: 'File uploaded successfully',
        });
      } else {
        // For larger files, initiate resumable upload
        const initResponse = await fetchWithRetry(
          'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json; charset=UTF-8',
              'X-Upload-Content-Type': file.type,
              'X-Upload-Content-Length': fileSize.toString(),
            },
            body: JSON.stringify(fileMetadata),
          },
        );

        if (!initResponse.ok) {
          throw new Error('Failed to initiate resumable upload');
        }

        const uploadUrl = initResponse.headers.get('location');

        if (!uploadUrl) {
          throw new Error('Failed to get upload URL');
        }

        // Upload the first chunk
        const chunkResponse = await fetchWithRetry(uploadUrl, {
          method: 'PUT',
          headers: {
            'Content-Length': fileBuffer.length.toString(),
            'Content-Range': `bytes ${start}-${end}/${total}`,
          },
          body: fileBuffer,
        });

        if (chunkResponse.status === 308) {
          // Upload is still in progress
          const rangeHeader = chunkResponse.headers.get('Range');
          const bytesReceived = rangeHeader ? parseInt(rangeHeader.split('-')[1], 10) + 1 : 0;

          return NextResponse.json({
            fileId: null,
            uploadUrl,
            status: 'in_progress',
            bytesReceived,
          });
        } else if (chunkResponse.status === 200 || chunkResponse.status === 201) {
          // Upload is complete
          const fileId = chunkResponse.headers.get('X-Goog-Upload-File-ID');

          // Set permissions if needed
          if (userEmail && userEmail.endsWith('@gmail.com')) {
            const drive = google.drive({ version: 'v3', auth });
            await drive.permissions.create({
              fileId: fileId!,
              requestBody: {
                type: 'user',
                role: 'reader',
                emailAddress: userEmail,
              },
              sendNotificationEmail: false,
            });
          }

          return NextResponse.json({
            fileId,
            status: 'completed',
            message: 'File uploaded successfully',
          });
        } else {
          throw new Error('Failed to upload chunk');
        }
      }
    } else {
      // Resume upload for subsequent chunks
      if (!uploadUrl) {
        return NextResponse.json({ error: 'Missing uploadUrl' }, { status: 400 });
      }

      // Continue the resumable upload
      const chunkResponse = await fetchWithRetry(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Length': fileBuffer.length.toString(),
          'Content-Range': `bytes ${start}-${end}/${total}`,
        },
        body: fileBuffer,
      });

      if (chunkResponse.status === 308) {
        // Upload is still in progress
        const rangeHeader = chunkResponse.headers.get('Range');
        const bytesReceived = rangeHeader ? parseInt(rangeHeader.split('-')[1], 10) + 1 : 0;

        return NextResponse.json({
          fileId,
          uploadUrl,
          status: 'in_progress',
          bytesReceived,
        });
      } else if (chunkResponse.status === 200 || chunkResponse.status === 201) {
        // Upload is complete
        const fileId = chunkResponse.headers.get('X-Goog-Upload-File-ID');

        // Set permissions if needed
        if (userEmail && userEmail.endsWith('@gmail.com')) {
          const drive = google.drive({ version: 'v3', auth });
          await drive.permissions.create({
            fileId: fileId!,
            requestBody: {
              type: 'user',
              role: 'reader',
              emailAddress: userEmail,
            },
            sendNotificationEmail: false,
          });
        }

        return NextResponse.json({
          fileId,
          status: 'completed',
          message: 'File uploaded successfully',
        });
      } else {
        throw new Error('Failed to upload chunk');
      }
    }
  } catch (error: any) {
    console.error('Error uploading file:', error.message);
    return NextResponse.json(
      {
        error: 'Failed to upload file',
        details: error.message,
      },
      { status: 500 },
    );
  }
}
