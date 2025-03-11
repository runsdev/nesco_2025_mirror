// pages/api/drive/delete-file.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import { getAuth } from '@/utils/google/action';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fileId } = req.query;

  if (!fileId || typeof fileId !== 'string') {
    return res.status(400).json({ error: 'File ID is required' });
  }

  try {
    const auth = getAuth();
    const drive = google.drive({ version: 'v3', auth });

    await drive.files.delete({ fileId });
    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Error deleting file:', error.message);
    return res.status(500).json({ error: `Failed to delete file: ${error.message}` });
  }
}
