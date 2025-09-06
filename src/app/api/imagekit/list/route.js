import { NextResponse } from 'next/server';
import { getServerImageKit } from '../../../../../lib/imagekit';

export async function GET(request) {
  try {
    const imagekit = getServerImageKit();
    const { searchParams } = new URL(request.url);
    
    const path = searchParams.get('path') || '';
    const limit = parseInt(searchParams.get('limit')) || 100;
    const skip = parseInt(searchParams.get('skip')) || 0;

    const files = await imagekit.listFiles({
      path,
      limit,
      skip,
    });

    return NextResponse.json({ 
      success: true, 
      files: files,
      total: files.length 
    });
  } catch (error) {
    console.error('ImageKit list files error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
