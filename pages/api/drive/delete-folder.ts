// pages/api/drive/delete-folder.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import { getAuth } from '@/utils/google/action';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { folderId } = req.query;

  if (!folderId || typeof folderId !== 'string') {
    return res.status(400).json({ error: 'Folder ID is required' });
  }

  try {
    const auth = await getAuth();
    const drive = google.drive({ version: 'v3', auth });

    // First, list all files in the folder
    const fileList = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: 'files(id, name, mimeType)',
    });

    // Delete each file in the folder
    if (fileList.data.files && fileList.data.files.length > 0) {
      for (const file of fileList.data.files) {
        // If the file is a folder, recursively delete it
        if (file.mimeType === 'application/vnd.google-apps.folder') {
          // Make a request to the delete-folder endpoint
          await fetch(`${process.env.VERCEL_URL}/api/drive/delete-folder?folderId=${file.id}`, {
            method: 'DELETE',
          });
        } else {
          await drive.files.delete({ fileId: file.id! });
        }
      }
    }

    // Delete the folder itself
    await drive.files.delete({ fileId: folderId });

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Error deleting folder:', error.message);
    return res.status(500).json({ error: `Failed to delete folder: ${error.message}` });
  }
}
