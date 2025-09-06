"use client"

import Image from 'next/image';
import { generateImageKitURL } from '../lib/imagekit';

const ImageKitImage = ({ 
  path, 
  alt = '', 
  width, 
  height, 
  className = '', 
  transformations = {},
  loading = 'lazy',
  priority = false,
  fill = false,
  ...props 
}) => {
  // Default transformations for optimization
  const defaultTransformations = {
    quality: 80,
    format: 'auto',
    ...transformations
  };

  // Add width and height to transformations if provided
  if (width) defaultTransformations.width = width;
  if (height) defaultTransformations.height = height;

  // Generate the optimized ImageKit URL
  const imageUrl = generateImageKitURL(path, defaultTransformations);

  // If using fill, don't specify width/height
  const imageProps = fill ? {
    fill: true,
    sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  } : {
    width: width || 300,
    height: height || 200
  };

  return (
    <Image
      src={imageUrl}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : loading}
      priority={priority}
      {...imageProps}
      {...props}
    />
  );
};

export default ImageKitImage;
