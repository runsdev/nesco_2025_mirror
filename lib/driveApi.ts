// lib/driveApi.ts
'use client';
/**
 * Client-side functions for interacting with the Google Drive API routes
 */

/**
 * Creates a new folder in Google Drive
 * @param folderName Name of the folder to create
 * @param parentFolderId Optional ID of the parent folder
 * @returns The ID of the created folder
 */
export async function createFolder(folderName: string, parentFolderId?: string): Promise<string> {
  try {
    const response = await fetch('/api/drive/create-folder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ folderName, parentFolderId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create folder');
    }

    const data = await response.json();
    return data.id;
  } catch (error: any) {
    console.error('Error creating folder:', error.message);
    throw new Error(`Failed to create folder: ${error.message}`);
  }
}

/**
 * Uploads a file to Google Drive
 * @param file The file to upload
 * @param folderId ID of the folder where to upload the file
 * @param fileName Optional custom file name
 * @param userEmail Optional user email to grant read access to
 * @returns The ID of the uploaded file
 */
export async function uploadToDrive(
  file: File,
  folderId: string,
  fileName?: string,
  userEmail?: string,
): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folderId', folderId);

    if (fileName) {
      formData.append('fileName', fileName);
    }

    if (userEmail) {
      formData.append('userEmail', userEmail);
    }

    const response = await fetch('/api/drive/upload-file', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload file');
    }

    const data = await response.json();
    return data.id;
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
  try {
    const response = await fetch(`/api/drive/delete-folder?folderId=${folderId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete folder');
    }

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
  try {
    const response = await fetch(`/api/drive/delete-file?fileId=${fileId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete file');
    }

    return true;
  } catch (error: any) {
    console.error('Error deleting file:', error.message);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}
