// pages/api/drive/create-folder.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import { getAuth } from '@/utils/google/action';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { folderName, parentFolderId } = req.body;

  if (!folderName) {
    return res.status(400).json({ error: 'Folder name is required' });
  }

  const parentId = parentFolderId || process.env.GOOGLE_FOLDER_ID;

  if (!parentId) {
    return res.status(400).json({ error: 'Parent folder ID is required' });
  }

  try {
    const auth = getAuth();
    const drive = google.drive({ version: 'v3', auth });

    // Create new folder
    const folderMetadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentId],
    };

    const folder = await drive.files.create({
      requestBody: folderMetadata,
      fields: 'id',
    });

    if (!folder.data.id) {
      return res.status(500).json({ error: 'Failed to create folder' });
    }

    return res.status(200).json({ id: folder.data.id });
  } catch (error: any) {
    console.error('Error creating folder:', error.message);
    return res.status(500).json({ error: `Failed to create folder: ${error.message}` });
  }
}
