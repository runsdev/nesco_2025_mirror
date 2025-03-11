// pages/api/drive/upload-file.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import { getAuth } from '@/utils/google/action';
import { Readable } from 'stream';
import formidable from 'formidable';
import fs from 'fs';

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
    const form = new formidable.IncomingForm();

    const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>(
      (resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          resolve([fields, files]);
        });
      },
    );

    const folderId = fields.folderId as unknown as string;
    const fileName = fields.fileName as unknown as string;
    const userEmail = fields.userEmail as unknown as string;

    if (!folderId) {
      return res.status(400).json({ error: 'Folder ID is required' });
    }

    if (!files.file) {
      return res.status(400).json({ error: 'File is required' });
    }

    const file = files.file as unknown as formidable.File;
    const filePath = file.filepath;
    const fileBuffer = fs.readFileSync(filePath);
    const name = fileName || file.originalFilename || 'file';

    const auth = await getAuth();
    const drive = google.drive({ version: 'v3', auth });

    // Create readable stream from buffer
    const fileStream = new Readable();
    fileStream.push(fileBuffer);
    fileStream.push(null);

    // Upload file to Google Drive
    const fileMetadata = {
      name,
      parents: [folderId],
    };

    const media = {
      body: fileStream,
    };

    const driveResponse = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id',
    });

    if (!driveResponse.data.id) {
      return res.status(500).json({ error: 'Failed to upload file' });
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

    // Clean up the temp file
    fs.unlinkSync(filePath);

    return res.status(200).json({ id: driveResponse.data.id });
  } catch (error: any) {
    console.error('Error uploading file:', error.message);
    return res.status(500).json({ error: `Failed to upload file: ${error.message}` });
  }
}
