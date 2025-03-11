// pages/api/drive/upload-file.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import { getAuth } from '@/utils/google/action';
import { Readable } from 'stream';

// Disable the default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const auth = await getAuth();
    const drive = google.drive({ version: 'v3', auth: auth });
    const formData = await new Promise<{
      file: File;
      folderId: string;
      fileName?: string;
      userEmail?: string;
    }>((resolve, reject) => {
      const formData: any = {};
      const chunks: Buffer[] = [];

      req.on('data', (chunk) => {
        chunks.push(chunk);
      });

      req.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const boundary = req.headers['content-type']?.split('boundary=')[1];
        if (!boundary) {
          return reject(new Error('No boundary found in Content-Type header'));
        }

        const parts = buffer.toString().split(`--${boundary}`);
        parts.forEach((part) => {
          if (part.includes('Content-Disposition: form-data;')) {
            const match = part.match(/name="([^"]+)"\s*\r\n\r\n(.+)\r\n/);
            if (match) {
              formData[match[1]] = match[2];
            }
          }
        });

        resolve(formData);
      });

      req.on('error', (err) => {
        reject(err);
      });
    });

    const { file, folderId, fileName, userEmail } = formData;

    // Convert the file to a readable stream
    const fileStream = new Readable();
    fileStream.push(file);
    fileStream.push(null);

    const media = {
      // mimeType: file.type,
      body: fileStream,
    };

    const fileMetadata = {
      name: fileName || file.name,
      parents: [folderId],
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id',
    });

    if (userEmail) {
      await drive.permissions.create({
        fileId: response.data.id!,
        requestBody: {
          role: 'reader',
          type: 'user',
          emailAddress: userEmail,
        },
      });
    }

    return res.status(200).json({ id: response.data.id });
  } catch (error: any) {
    console.error('Error uploading file:', error.message, error);
    return res.status(500).json({ error: `Failed to upload file: ${error.message}` });
  }
}
