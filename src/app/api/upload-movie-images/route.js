import { NextResponse } from 'next/server';
import { getServerImageKit } from '../../../../lib/imagekit';
import sharp from 'sharp';

export async function POST(request) {
  try {
    const imagekit = getServerImageKit();
    const formData = await request.formData();
    
    const portraitFile = formData.get('portrait');
    const landscapeFile = formData.get('landscape');
    const genre = formData.get('genre') || 'movies';
    const title = formData.get('title') || 'movie';

    if (!portraitFile && !landscapeFile) {
      return NextResponse.json(
        { success: false, error: 'No image files provided' },
        { status: 400 }
      );
    }

    const results = {};
    
    // Determine the correct folder path
    let folderBase;
    if (genre.toLowerCase() === 'cartoon') {
      folderBase = 'cartoons';
    } else if (genre.toLowerCase() === 'tv-series') {
      folderBase = 'series';
    } else {
      folderBase = `movies/${genre.toLowerCase().replace(/\s+/g, '-')}`;
    }

    // Upload portrait image
    if (portraitFile) {
      const portraitBytes = await portraitFile.arrayBuffer();
      let portraitBuffer = Buffer.from(portraitBytes);
      
      // Check file size (limit 5MB before compression)
      if (portraitBuffer.length > 5 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, error: 'Portrait image too large. Please use images smaller than 5MB.' },
          { status: 413 }
        );
      }
      
      // Compress image to reduce size while preserving format when beneficial
      try {
        const sharpInstance = sharp(portraitBuffer)
          .resize(800, 1200, { fit: 'inside', withoutEnlargement: true });
        
        // Check if original is PNG (might have transparency)
        const metadata = await sharp(portraitBuffer).metadata();
        
        if (metadata.format === 'png' && metadata.channels === 4) {
          // PNG with transparency - keep as PNG
          portraitBuffer = await sharpInstance.png({ quality: 90 }).toBuffer();
        } else if (metadata.format === 'webp') {
          // Keep WebP format for better compression
          portraitBuffer = await sharpInstance.webp({ quality: 85 }).toBuffer();
        } else {
          // Convert to JPEG for other formats (best compression)
          portraitBuffer = await sharpInstance.jpeg({ quality: 85 }).toBuffer();
        }
      } catch (compressionError) {
        console.error('Image compression failed:', compressionError);
        // Continue with original if compression fails
      }
      
      const portraitFileName = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-portrait-${Date.now()}`;
      
      const portraitResponse = await imagekit.upload({
        file: portraitBuffer,
        fileName: portraitFile.name,
        folder: folderBase,
        tags: ['movie', 'portrait', genre.toLowerCase()],
        useUniqueFileName: false,
      });

      results.portrait = {
        url: portraitResponse.url,
        fileId: portraitResponse.fileId,
        fileName: portraitResponse.name
      };
    }

    // Upload landscape image
    if (landscapeFile) {
      const landscapeBytes = await landscapeFile.arrayBuffer();
      let landscapeBuffer = Buffer.from(landscapeBytes);
      
      // Check file size (limit 5MB before compression)
      if (landscapeBuffer.length > 5 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, error: 'Landscape image too large. Please use images smaller than 5MB.' },
          { status: 413 }
        );
      }
      
      // Compress image to reduce size while preserving format when beneficial
      try {
        const sharpInstance = sharp(landscapeBuffer)
          .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true });
        
        // Check if original is PNG (might have transparency)
        const metadata = await sharp(landscapeBuffer).metadata();
        
        if (metadata.format === 'png' && metadata.channels === 4) {
          // PNG with transparency - keep as PNG
          landscapeBuffer = await sharpInstance.png({ quality: 90 }).toBuffer();
        } else if (metadata.format === 'webp') {
          // Keep WebP format for better compression
          landscapeBuffer = await sharpInstance.webp({ quality: 85 }).toBuffer();
        } else {
          // Convert to JPEG for other formats (best compression)
          landscapeBuffer = await sharpInstance.jpeg({ quality: 85 }).toBuffer();
        }
      } catch (compressionError) {
        console.error('Image compression failed:', compressionError);
        // Continue with original if compression fails
      }
      
      const landscapeFileName = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-landscape-${Date.now()}`;
      
      const landscapeResponse = await imagekit.upload({
        file: landscapeBuffer,
        fileName: landscapeFile.name,
        folder: `${folderBase}/landscape`,
        tags: ['movie', 'landscape', genre.toLowerCase()],
        useUniqueFileName: false,
      });

      results.landscape = {
        url: landscapeResponse.url,
        fileId: landscapeResponse.fileId,
        fileName: landscapeResponse.name
      };
    }

    return NextResponse.json({ 
      success: true, 
      images: results
    });

  } catch (error) {
    console.error('ImageKit upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
