import { NextResponse } from 'next/server';
import { getServerImageKit } from '../../../../../lib/imagekit';

export async function DELETE(request) {
  try {
    const imagekit = getServerImageKit();
    const { searchParams } = new URL(request.url);
    
    const fileId = searchParams.get('fileId');

    if (!fileId) {
      return NextResponse.json(
        { success: false, error: 'File ID is required' },
        { status: 400 }
      );
    }

    await imagekit.deleteFile(fileId);

    return NextResponse.json({ 
      success: true, 
      message: 'File deleted successfully' 
    });
  } catch (error) {
    console.error('ImageKit delete error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
