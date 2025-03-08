// // File: /app/api/upload-to-drive/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { google } from 'googleapis';
// import { Readable } from 'stream';

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
//     const formData = await req.formData();
//     const file = formData.get('file') as File;
//     const folderId = formData.get('folderId') as string;
//     const userEmail = formData.get('userEmail') as string;

//     if (!file) {
//       return NextResponse.json({ error: 'Missing file or folderId' }, { status: 400 });
//     }

//     const drive = google.drive({ version: 'v3', auth });

//     // Baca file sebagai buffer
//     const buffer = await file.arrayBuffer();
//     const fileBuffer = Buffer.from(buffer);

//     // Konversi buffer ke Readable stream
//     const fileStream = new Readable();
//     fileStream.push(fileBuffer);
//     fileStream.push(null);

//     // Upload file ke Google Drive
//     const fileMetadata = {
//       name: file.name,
//       parents: [folderId],
//       // parents: process.env.GOOGLE_FOLDER_ID ? [process.env.GOOGLE_FOLDER_ID] : [],
//     };

//     const media = {
//       mimeType: file.type,
//       body: fileStream,
//     };

//     const driveResponse = await drive.files.create({
//       requestBody: fileMetadata,
//       media: media,
//       fields: 'id',
//     });

//     if (userEmail) {
//       await drive.permissions.create({
//         fileId: driveResponse.data.id!,
//         requestBody: {
//           type: 'user',
//           role: 'reader',
//           emailAddress: userEmail,
//         },
//       });
//     }

//     return NextResponse.json({ fileId: driveResponse.data.id });
//   } catch (error: any) {
//     console.error('Error uploading file:', error.message);
//     return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
//   }
// }

// // Perlu menambahkan konfigurasi Next.js untuk mendukung ukuran file yang lebih besar
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };
