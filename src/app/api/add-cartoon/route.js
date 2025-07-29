import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'src/data/cartoonEpisodes.json');
    const fileData = await fs.readFile(filePath, 'utf8');
    const cartoonsBySlug = JSON.parse(fileData);
    // Flatten all episodes into a single array, with cartoon info
    const allEpisodes = [];
    for (const slug of Object.keys(cartoonsBySlug)) {
      const cartoon = cartoonsBySlug[slug];
      if (cartoon.episodes && Array.isArray(cartoon.episodes)) {
        cartoon.episodes.forEach(ep => {
          allEpisodes.push({ ...ep, cartoonSlug: slug, cartoonTitle: cartoon.title || slug });
        });
      }
    }
    return NextResponse.json(allEpisodes, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to read cartoons.' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const updatedEpisode = await request.json();
    if (!updatedEpisode || !updatedEpisode.id) {
      return NextResponse.json({ message: 'Invalid episode data.' }, { status: 400 });
    }
    const filePath = path.join(process.cwd(), 'src/data/cartoonEpisodes.json');
    const fileData = await fs.readFile(filePath, 'utf8');
    const cartoonsBySlug = JSON.parse(fileData);
    let found = false;
    for (const slug of Object.keys(cartoonsBySlug)) {
      const cartoon = cartoonsBySlug[slug];
      if (cartoon.episodes && Array.isArray(cartoon.episodes)) {
        cartoon.episodes = cartoon.episodes.map(ep => {
          if (ep.id === updatedEpisode.id) {
            found = true;
            return { ...ep, ...updatedEpisode };
          }
          return ep;
        });
      }
    }
    if (!found) {
      return NextResponse.json({ message: 'Episode not found.' }, { status: 404 });
    }
    await fs.writeFile(filePath, JSON.stringify(cartoonsBySlug, null, 2));
    return NextResponse.json({ message: 'Episode updated successfully!' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update episode.' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ message: 'Episode ID required.' }, { status: 400 });
    }
    const filePath = path.join(process.cwd(), 'src/data/cartoonEpisodes.json');
    const fileData = await fs.readFile(filePath, 'utf8');
    const cartoonsBySlug = JSON.parse(fileData);
    let found = false;
    for (const slug of Object.keys(cartoonsBySlug)) {
      const cartoon = cartoonsBySlug[slug];
      if (cartoon.episodes && Array.isArray(cartoon.episodes)) {
        const before = cartoon.episodes.length;
        cartoon.episodes = cartoon.episodes.filter(ep => ep.id !== id);
        if (cartoon.episodes.length < before) found = true;
      }
    }
    if (!found) {
      return NextResponse.json({ message: 'Episode not found.' }, { status: 404 });
    }
    await fs.writeFile(filePath, JSON.stringify(cartoonsBySlug, null, 2));
    return NextResponse.json({ message: 'Episode deleted successfully!' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete episode.' }, { status: 500 });
  }
} 