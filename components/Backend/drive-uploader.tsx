import { useState, useRef } from 'react';

interface UploadProps {
  folderId: string;
  userEmail?: string;
  onSuccess?: (fileId: string) => void;
  onError?: (error: string) => void;
  chunkSize?: number; // in bytes
}

export default function DriveUploader({
  folderId,
  userEmail,
  onSuccess,
  onError,
  chunkSize = 3 * 1024 * 1024, // Default 3MB chunks (under Vercel's 4MB limit)
}: UploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null); // For resumable uploads
  const abortControllerRef = useRef<AbortController | null>(null);

  const uploadChunk = async (
    file: File,
    start: number,
    fileId: string | null = null,
  ): Promise<{ fileId: string; completed: boolean }> => {
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);

    // Create a FormData object to send the chunk
    const formData = new FormData();
    formData.append('file', chunk, file.name);
    formData.append('folderId', folderId);
    formData.append('fileName', file.name);
    formData.append('fileSize', file.size.toString());

    if (userEmail) {
      formData.append('userEmail', userEmail);
    }

    if (fileId) {
      formData.append('fileId', fileId);
    }

    if (uploadUrl) {
      formData.append('uploadUrl', uploadUrl);
    }

    const headers: HeadersInit = {
      'Content-Range': `bytes ${start}-${end - 1}/${file.size}`,
    };

    // Create a new AbortController for this request
    abortControllerRef.current = new AbortController();

    const response = await fetch('/api/drive/upload-to-drive-signed', {
      method: 'POST',
      headers,
      body: formData,
      signal: abortControllerRef.current.signal,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Upload failed');
    }

    const data = await response.json();
    console.log(data);

    // If this is the first chunk, store the upload URL for resumable uploads
    if (data.uploadUrl && !uploadUrl) {
      setUploadUrl(data.uploadUrl);
    }

    // Check if the upload is complete
    const completed = data.status === 'completed' || end >= file.size;

    return {
      fileId: data.fileId,
      completed,
    };
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setUploadUrl(null); // Reset upload URL for new uploads

    let currentChunk = 0;
    let fileId: string | null = null;

    try {
      // Upload the file in chunks
      while (currentChunk < file.size) {
        const result = await uploadChunk(file, currentChunk, fileId);
        fileId = result.fileId;

        // Update progress
        currentChunk += chunkSize;
        const progressPercent = Math.min(Math.round((currentChunk / file.size) * 100), 100);
        setProgress(progressPercent);

        // If upload is completed, break out of the loop
        if (result.completed || currentChunk >= file.size) {
          break;
        }
      }

      setUploading(false);
      if (onSuccess && fileId) {
        onSuccess(fileId);
      }
    } catch (error: any) {
      setUploading(false);
      if (onError) {
        onError(error.message);
      }
      console.error('Upload error:', error);
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setUploading(false);
      setProgress(0);
      setUploadUrl(null); // Reset upload URL
    }
  };

  return (
    <div className="drive-uploader">
      <input
        type="file"
        onChange={handleFileSelect}
        disabled={uploading}
        className="file-input"
        accept="*" // Allow all file types
      />

      {uploading && (
        <div className="upload-status">
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}>
              {progress}%
            </div>
          </div>
          <button onClick={handleCancel} className="cancel-button">
            Cancel Upload
          </button>
        </div>
      )}

      <style jsx>{`
        .drive-uploader {
          margin: 20px 0;
        }
        .file-input {
          margin-bottom: 10px;
        }
        .upload-status {
          margin-top: 10px;
        }
        .progress-container {
          width: 100%;
          background-color: #f0f0f0;
          border-radius: 4px;
          margin-bottom: 10px;
        }
        .progress-bar {
          height: 20px;
          background-color: #4285f4;
          border-radius: 4px;
          color: white;
          text-align: center;
          line-height: 20px;
          transition: width 0.3s ease;
        }
        .cancel-button {
          padding: 5px 10px;
          background-color: #f44336;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .cancel-button:hover {
          background-color: #d32f2f;
        }
      `}</style>
    </div>
  );
}
