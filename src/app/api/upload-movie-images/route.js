import { NextResponse } from 'next/server';
import { getServerImageKit } from '../../../../lib/imagekit';

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
      const portraitBuffer = Buffer.from(portraitBytes);
      
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
      const landscapeBuffer = Buffer.from(landscapeBytes);
      
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
