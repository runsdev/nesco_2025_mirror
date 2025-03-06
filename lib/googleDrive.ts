'use server';

import { google } from 'googleapis';

// authenticates the service account to be used in this context
const auth = new google.auth.GoogleAuth({
  credentials: {
    type: 'service_account',
    client_email: process.env.GOOGLE_CLIENT_EMAIL ?? '',
    private_key: (process.env.GOOGLE_CLIENT_SECRET ?? '').replace(/\\n/g, '\n'),
    client_id: process.env.GOOGLE_CLIENT_ID,
  },
  // the actions you are permissed to perform using this API, in this case
  // all CRUD operations are permissed, check out
  // [ https://developers.google.com/drive/api/guides/api-specific-auth ]
  // for more advice on scopes
  scopes: ['https://www.googleapis.com/auth/drive'],
});

export const getData = async (folderId?: string) => {
  // allows you to use drive API methods e.g. listing files, creating files.
  const drive = google.drive({ version: 'v3', auth });

  try {
    const query = folderId ? `'${folderId}' in parents and trashed = false` : 'trashed = false';

    const res = await drive.files.list({
      q: query,
      fields: 'files(id, name, mimeType, createdTime, modifiedTime)',
      pageSize: 1000,
    });

    const files = res.data.files;

    console.log(files);

    return files;
  } catch (error: any) {
    console.error('Error fetching files:', error.message);
    return null;
  }
};
