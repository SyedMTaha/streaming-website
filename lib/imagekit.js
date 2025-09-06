import ImageKit from 'imagekit';

// Client-side configuration (for displaying images)
export const imagekitClient = {
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
};

// Server-side ImageKit instance (for uploads, deletes, etc.)
let serverImageKit = null;

export function getServerImageKit() {
  if (!serverImageKit) {
    serverImageKit = new ImageKit({
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
    });
  }
  return serverImageKit;
}

// Helper function to generate ImageKit URLs with transformations
export function generateImageKitURL(path, transformations = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
  
  if (!baseUrl || !path) {
    return '/placeholder.svg'; // fallback
  }

  // Build transformation string
  const transformArray = [];
  
  if (transformations.width) transformArray.push(`w-${transformations.width}`);
  if (transformations.height) transformArray.push(`h-${transformations.height}`);
  if (transformations.quality) transformArray.push(`q-${transformations.quality}`);
  if (transformations.format) transformArray.push(`f-${transformations.format}`);
  if (transformations.crop) transformArray.push(`c-${transformations.crop}`);
  if (transformations.aspectRatio) transformArray.push(`ar-${transformations.aspectRatio}`);
  
  const transformString = transformArray.length > 0 ? `tr:${transformArray.join(',')}` : '';
  
  // Remove leading slash from path if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  return `${baseUrl}/${transformString}/${cleanPath}`;
}

// Helper function for responsive images
export function getResponsiveImageProps(path, alt = '', sizes = {}) {
  return {
    src: generateImageKitURL(path, { quality: 80, format: 'auto' }),
    srcSet: [
      `${generateImageKitURL(path, { width: 400, quality: 80, format: 'auto' })} 400w`,
      `${generateImageKitURL(path, { width: 800, quality: 80, format: 'auto' })} 800w`,
      `${generateImageKitURL(path, { width: 1200, quality: 80, format: 'auto' })} 1200w`,
      `${generateImageKitURL(path, { width: 1600, quality: 80, format: 'auto' })} 1600w`,
    ].join(', '),
    sizes: sizes.mobile || sizes.tablet || sizes.desktop ? 
      `(max-width: 768px) ${sizes.mobile || '100vw'}, (max-width: 1024px) ${sizes.tablet || '50vw'}, ${sizes.desktop || '33vw'}` :
      '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    alt,
  };
}
