import { useState } from 'react';

interface UploadProps {
  folderId: string;
  userEmail?: string;
  onSuccess?: (fileId: string) => void;
  onError?: (error: string) => void;
}

export default function DriveUploader({ folderId, userEmail, onSuccess, onError }: UploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);

    try {
      // Step 1: Get upload URL from our server
      const tokenResponse = await fetch('/api/drive/get-upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          folderId,
          userEmail,
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to get upload token');
      }

      const { uploadUrl, fileId } = await tokenResponse.json();

      // Step 2: Upload directly to Google Drive using the resumable upload URL
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', uploadUrl, true);
      xhr.setRequestHeader('Content-Type', file.type);

      // Track upload progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setProgress(percentComplete);
        }
      };

      // Handle completion
      xhr.onload = async () => {
        if (xhr.status === 200 || xhr.status === 201) {
          // Step 3: Notify our server that upload is complete (to set permissions)
          const completeResponse = await fetch('/api/drive/complete-drive-upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileId, userEmail }),
          });

          if (!completeResponse.ok) {
            throw new Error('Failed to complete upload process');
          }

          setUploading(false);
          if (onSuccess) onSuccess(fileId);
        } else {
          throw new Error(`Upload failed with status: ${xhr.status}`);
        }
      };

      xhr.onerror = () => {
        throw new Error('Network error during upload');
      };

      // Start the upload
      xhr.send(file);
    } catch (error: any) {
      setUploading(false);
      if (onError) onError(error.message);
      console.error('Upload error:', error);
    }
  };

  return (
    <div className="drive-uploader">
      <input type="file" onChange={handleFileSelect} disabled={uploading} className="file-input" />

      {uploading && (
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}>
            {progress}%
          </div>
        </div>
      )}

      <style jsx>{`
        .drive-uploader {
          margin: 20px 0;
        }
        .file-input {
          margin-bottom: 10px;
        }
        .progress-container {
          width: 100%;
          background-color: #f0f0f0;
          border-radius: 4px;
          margin-top: 10px;
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
      `}</style>
    </div>
  );
}
