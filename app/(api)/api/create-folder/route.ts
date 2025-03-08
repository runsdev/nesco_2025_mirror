// // File: /app/api/create-folder/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { google } from 'googleapis';

// // Konfigurasi autentikasi Google API
// const auth = new google.auth.GoogleAuth({
//   credentials: {
//     type: 'service_account',
//     client_email: process.env.GOOGLE_CLIENT_EMAIL ?? '',
//     private_key: (process.env.GOOGLE_CLIENT_SECRET ?? '').replace(/\\n/g, '\n'),
//     client_id: process.env.GOOGLE_CLIENT_ID,
//   },
//   scopes: ['https://www.googleapis.com/auth/drive'],
// });

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { folderName } = body;
//     const parentFolderId = process.env.GOOGLE_FOLDER_ID;

//     if (!parentFolderId || !folderName) {
//       return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
//     }

//     const drive = google.drive({ version: 'v3', auth });

//     // Buat folder baru
//     const folderMetadata = {
//       name: folderName,
//       mimeType: 'application/vnd.google-apps.folder',
//       parents: [parentFolderId],
//     };

//     const folder = await drive.files.create({
//       requestBody: folderMetadata,
//       fields: 'id',
//     });

//     return NextResponse.json({ folderId: folder.data.id });
//   } catch (error: any) {
//     console.error('Error creating folder:', error.message);
//     return NextResponse.json({ error: 'Failed to create folder' }, { status: 500 });
//   }
// }
