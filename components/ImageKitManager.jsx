"use client"

import { useState, useEffect } from 'react';
import { Upload, Trash2, Search, Folder, Image as ImageIcon } from 'lucide-react';
import ImageKitImage from './ImageKitImage';

const ImageKitManager = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');
  const [uploadFolder, setUploadFolder] = useState('');
  const [isClient, setIsClient] = useState(false);

  // Fetch files from ImageKit
  const fetchFiles = async (path = '') => {
    setLoading(true);
    try {
      const response = await fetch(`/api/imagekit/list?path=${path}&limit=100`);
      const data = await response.json();
      
      if (data.success) {
        setFiles(data.files);
      } else {
        console.error('Failed to fetch files:', data.error);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    }
    setLoading(false);
  };

  // Upload file to ImageKit
  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', uploadFolder);
    formData.append('fileName', file.name);

    try {
      const response = await fetch('/api/imagekit/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        alert('File uploaded successfully!');
        fetchFiles(selectedFolder);
        // Reset the input
        event.target.value = '';
      } else {
        alert('Upload failed: ' + data.error);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed: ' + error.message);
    }
    setUploading(false);
  };

  // Delete file from ImageKit
  const handleDelete = async (fileId, fileName) => {
    if (!confirm(`Are you sure you want to delete ${fileName}?`)) return;

    try {
      const response = await fetch(`/api/imagekit/delete?fileId=${fileId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        alert('File deleted successfully!');
        fetchFiles(selectedFolder);
      } else {
        alert('Delete failed: ' + data.error);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Delete failed: ' + error.message);
    }
  };

  // Filter files based on search term
  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.filePath.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Copy URL to clipboard
  const copyUrl = async (filePath) => {
    const url = `https://ik.imagekit.io/epnaccvj6${filePath}`;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
        alert('URL copied to clipboard!');
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('URL copied to clipboard!');
      }
    } catch (err) {
      console.error('Failed to copy URL:', err);
      alert('Failed to copy URL to clipboard');
    }
  };

  useEffect(() => {
    setIsClient(true);
    fetchFiles();
  }, []);

  if (!isClient) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">ImageKit Media Manager</h2>
        
        <div className="flex gap-4 items-center">
          {/* Upload Section */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Upload folder (e.g. assets/images/movies)"
              value={uploadFolder}
              onChange={(e) => setUploadFolder(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm w-64"
            />
            <label className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer flex items-center gap-2">
              <Upload className="w-4 h-4" />
              {uploading ? 'Uploading...' : 'Upload'}
              <input
                type="file"
                onChange={handleUpload}
                className="hidden"
                accept="image/*,video/*"
                disabled={uploading}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <button
          onClick={() => fetchFiles()}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Refresh
        </button>
      </div>

      {/* Files Grid */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading files...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredFiles.map((file) => (
            <div key={file.fileId} className="border border-gray-200 rounded-lg p-3">
              <div className="aspect-square mb-2 relative bg-gray-100 rounded overflow-hidden">
                {file.fileType === 'image' ? (
                  <ImageKitImage
                    path={file.filePath}
                    alt={file.name}
                    fill
                    className="object-cover"
                    transformations={{ width: 200, height: 200, crop: 'maintain_ratio' }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              
              <div className="text-xs space-y-1">
                <p className="font-medium truncate" title={file.name}>
                  {file.name}
                </p>
                <p className="text-gray-500 truncate" title={file.filePath}>
                  {file.filePath}
                </p>
                <p className="text-gray-400">
                  {Math.round(file.size / 1024)} KB
                </p>
              </div>

              <div className="flex gap-1 mt-2">
                <button
                  onClick={() => copyUrl(file.filePath)}
                  className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 flex-1"
                >
                  Copy URL
                </button>
                <button
                  onClick={() => handleDelete(file.fileId, file.name)}
                  className="bg-red-600 text-white p-1 rounded hover:bg-red-700"
                  title="Delete file"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredFiles.length === 0 && !loading && (
        <div className="text-center py-8">
          <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No files found</p>
        </div>
      )}
    </div>
  );
};

export default ImageKitManager;
