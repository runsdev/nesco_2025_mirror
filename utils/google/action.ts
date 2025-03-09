'use server';

import { google } from 'googleapis';
import { Readable } from 'stream';

// Configure Google API authentication
const getAuth = () => {
  return new google.auth.GoogleAuth({
    credentials: {
      type: 'service_account',
      client_email: process.env.GOOGLE_CLIENT_EMAIL ?? '',
      private_key: (process.env.GOOGLE_CLIENT_SECRET ?? '').replace(/\\n/g, '\n'),
      client_id: process.env.GOOGLE_CLIENT_ID,
    },
    scopes: ['https://www.googleapis.com/auth/drive'],
  });
};

/**
 * Creates a new folder in Google Drive
 * @param folderName Name of the folder to create
 * @param parentFolderId ID of the parent folder (defaults to env variable)
 * @returns The ID of the created folder
 */
export async function createFolder(folderName: string, parentFolderId?: string): Promise<string> {
  if (!folderName) {
    throw new Error('Folder name is required');
  }

  const parentId = parentFolderId || process.env.GOOGLE_FOLDER_ID;

  if (!parentId) {
    throw new Error('Parent folder ID is required');
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
      throw new Error('Failed to create folder');
    }

    return folder.data.id;
  } catch (error: any) {
    console.error('Error creating folder:', error.message);
    throw new Error(`Failed to create folder: ${error.message}`);
  }
}

/**
 * Uploads a file to Google Drive
 * @param file The file to upload
 * @param folderId ID of the folder where to upload the file
 * @param fileName Optional custom file name (defaults to file's name)
 * @param userEmail Optional user email to grant read access to
 * @returns The ID of the uploaded file
 */
export async function uploadToDrive(
  file: Buffer | Uint8Array | File,
  folderId: string,
  fileName?: string,
  userEmail?: string,
): Promise<string> {
  try {
    const auth = getAuth();
    const drive = google.drive({ version: 'v3', auth });

    let fileBuffer: Buffer;
    let name: string;

    if (file instanceof File) {
      fileBuffer = Buffer.from(await file.arrayBuffer());
      name = fileName || file.name;
    } else {
      fileBuffer = Buffer.from(file);
      name = fileName || 'file';
    }

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

    return driveResponse.data.id;
  } catch (error: any) {
    console.error('Error uploading file:', error.message);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
}

/**
 * Deletes a folder from Google Drive, including all files within it
 * @param folderId ID of the folder to delete
 * @returns True if deletion was successful
 */
export async function deleteFolder(folderId: string): Promise<boolean> {
  if (!folderId) {
    throw new Error('Folder ID is required');
  }

  try {
    const auth = getAuth();
    const drive = google.drive({ version: 'v3', auth });

    // First, list all files in the folder
    const fileList = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: 'files(id, name)',
    });

    // Delete each file in the folder
    if (fileList.data.files && fileList.data.files.length > 0) {
      for (const file of fileList.data.files) {
        // If the file is a folder, recursively delete it
        if (file.mimeType === 'application/vnd.google-apps.folder') {
          await deleteFolder(file.id!);
        } else {
          await drive.files.delete({ fileId: file.id! });
        }
      }
    }

    // Delete the folder itself
    await drive.files.delete({ fileId: folderId });

    return true;
  } catch (error: any) {
    console.error('Error deleting folder:', error.message);
    throw new Error(`Failed to delete folder: ${error.message}`);
  }
}

/**
 * Deletes a file from Google Drive
 * @param fileId ID of the file to delete
 * @returns True if deletion was successful
 */
export async function deleteFile(fileId: string): Promise<boolean> {
  if (!fileId) {
    throw new Error('File ID is required');
  }

  try {
    const auth = getAuth();
    const drive = google.drive({ version: 'v3', auth });

    await drive.files.delete({ fileId });
    return true;
  } catch (error: any) {
    console.error('Error deleting file:', error.message);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}
