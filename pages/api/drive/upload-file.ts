// pages/api/drive/upload-file.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import { getAuth } from '@/utils/google/action';
import { Readable } from 'stream';
import formidable from 'formidable';

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
    const form = new formidable.IncomingForm();
    const { file, folderId, fileName, userEmail } = await new Promise<{
      file: formidable.File;
      folderId: string;
      fileName?: string;
      userEmail?: string;
    }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(err);
          return;
        }
        resolve({
          file: files.file as unknown as formidable.File,
          folderId: fields.folderId as unknown as string,
          fileName: fields.fileName as string | undefined,
          userEmail: fields.userEmail as string | undefined,
        });
      });
    });

    // Create a readable stream from the uploaded file
    const fileStream = new Readable();
    fileStream.push(require('fs').readFileSync(file.filepath));
    fileStream.push(null);

    // Define file metadata
    const fileMetadata = {
      name: fileName || file.originalFilename || 'file',
      parents: [folderId],
    };

    // Define media for the file upload
    const media = {
      mimeType: file.mimetype || 'application/octet-stream',
      body: fileStream,
    };

    // Upload the file to Google Drive
    const driveResponse = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id',
    });

    if (!driveResponse.data.id) {
      throw new Error('Failed to upload file');
    }

    // Grant access if userEmail is provided
    if (userEmail) {
      await drive.permissions.create({
        fileId: driveResponse.data.id,
        requestBody: {
          type: 'user',
          role: 'reader',
          emailAddress: userEmail,
        },
        sendNotificationEmail: false,
      });
    }

    // Return the file ID
    return res.status(200).json({ id: driveResponse.data.id });
  } catch (error: any) {
    console.error('Error uploading file:', error.message, error);
    return res.status(500).json({ error: `Failed to upload file: ${error.message}` });
  }
}
