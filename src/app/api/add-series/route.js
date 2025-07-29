import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function POST(request) {
  try {
    const incomingSeries = await request.json();

    if (!incomingSeries || !incomingSeries.title || !incomingSeries.genre) {
      return NextResponse.json({ message: 'Invalid series data provided. Title and genre are required.' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'src/data/tvEpisodes.json');
    const fileData = await fs.readFile(filePath, 'utf8');
    const seriesByGenre = JSON.parse(fileData);

    const genreKey = incomingSeries.genre.toLowerCase().replace(/\s+/g, '-');

    if (!seriesByGenre[genreKey]) {
      seriesByGenre[genreKey] = [];
    }

    const structuredSeries = {
      id: `tv${seriesByGenre[genreKey].length + 1}`,
      title: incomingSeries.title,
      image: `/assets/images/series/${genreKey}/${incomingSeries.portrait}`,
      innerImage: `/assets/images/series/${genreKey}/landscape/${incomingSeries.landscape}`,
      slug: generateSlug(incomingSeries.title),
      year: incomingSeries.year,
      duration: incomingSeries.duration,
      rating: incomingSeries.rating,
      genre: incomingSeries.genre,
      description: incomingSeries.description,
      episodes: incomingSeries.episodes, // This should be an array of episode links
    };

    seriesByGenre[genreKey].push(structuredSeries);

    await fs.writeFile(filePath, JSON.stringify(seriesByGenre, null, 2));

    return NextResponse.json({ message: 'TV Series added successfully!' }, { status: 201 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ message: 'Failed to write to file.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'src/data/tvEpisodes.json');
    const fileData = await fs.readFile(filePath, 'utf8');
    const seriesBySlug = JSON.parse(fileData);
    // Flatten all series into a single array
    const allSeries = Object.values(seriesBySlug).filter(v => Array.isArray(v) ? false : typeof v === 'object').map(v => v);
    return NextResponse.json(allSeries, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to read series.' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const updatedSeries = await request.json();
    if (!updatedSeries || !updatedSeries.id) {
      return NextResponse.json({ message: 'Invalid series data.' }, { status: 400 });
    }
    const filePath = path.join(process.cwd(), 'src/data/tvEpisodes.json');
    const fileData = await fs.readFile(filePath, 'utf8');
    const seriesBySlug = JSON.parse(fileData);
    let found = false;
    for (const slug of Object.keys(seriesBySlug)) {
      if (seriesBySlug[slug].id === updatedSeries.id) {
        seriesBySlug[slug] = { ...seriesBySlug[slug], ...updatedSeries };
        found = true;
        break;
      }
    }
    if (!found) {
      return NextResponse.json({ message: 'Series not found.' }, { status: 404 });
    }
    await fs.writeFile(filePath, JSON.stringify(seriesBySlug, null, 2));
    return NextResponse.json({ message: 'Series updated successfully!' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update series.' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ message: 'Series ID required.' }, { status: 400 });
    }
    const filePath = path.join(process.cwd(), 'src/data/tvEpisodes.json');
    const fileData = await fs.readFile(filePath, 'utf8');
    const seriesBySlug = JSON.parse(fileData);
    let found = false;
    for (const slug of Object.keys(seriesBySlug)) {
      if (seriesBySlug[slug].id === id) {
        delete seriesBySlug[slug];
        found = true;
        break;
      }
    }
    if (!found) {
      return NextResponse.json({ message: 'Series not found.' }, { status: 404 });
    }
    await fs.writeFile(filePath, JSON.stringify(seriesBySlug, null, 2));
    return NextResponse.json({ message: 'Series deleted successfully!' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete series.' }, { status: 500 });
  }
}
