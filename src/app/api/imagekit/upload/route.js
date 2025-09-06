import { NextResponse } from 'next/server';
import { getServerImageKit } from '../../../../../lib/imagekit';

export async function POST(request) {
  try {
    const imagekit = getServerImageKit();
    const formData = await request.formData();
    
    const file = formData.get('file');
    const fileName = formData.get('fileName') || file.name;
    const folder = formData.get('folder') || '';
    const tags = formData.get('tags') || '';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: fileName,
      folder: folder,
      tags: tags.split(',').filter(tag => tag.trim()),
      useUniqueFileName: true,
    });

    return NextResponse.json({ 
      success: true, 
      file: uploadResponse 
    });
  } catch (error) {
    console.error('ImageKit upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
