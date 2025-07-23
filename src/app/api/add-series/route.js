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
