// Client-side image compression utility
export const compressImage = (file, maxWidth = 1920, maxHeight = 1080, quality = 0.85) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      // Preserve original format when possible
      let outputType = 'image/jpeg';
      let outputQuality = quality;
      
      // Keep PNG for transparency, WebP for better compression
      if (file.type === 'image/png' || file.type === 'image/webp') {
        outputType = file.type;
        // PNG doesn't use quality parameter, WebP uses different range
        outputQuality = file.type === 'image/webp' ? quality : undefined;
      }
      
      canvas.toBlob(
        (blob) => {
          // Create new File object with compressed data
          const compressedFile = new File([blob], file.name, {
            type: outputType,
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        },
        outputType,
        outputQuality
      );
    };

    img.src = URL.createObjectURL(file);
  });
};

// Validate file size before upload
export const validateFileSize = (file, maxSizeMB = 5) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

// Get readable file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
