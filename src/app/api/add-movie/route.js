import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphen
    .replace(/^-+|-+$/g, '');    // Remove leading/trailing hyphens
}

export async function POST(request) {
  try {
    const incomingMovie = await request.json();

    if (!incomingMovie || !incomingMovie.title || !incomingMovie.genre) {
      return NextResponse.json({ message: 'Invalid movie data provided. Title and genre are required.' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'src/data/movies.json');
    const fileData = await fs.readFile(filePath, 'utf8');
    const moviesByGenre = JSON.parse(fileData);

    const genreKey = incomingMovie.genre.toLowerCase().replace(/\s+/g, '-');

    if (!moviesByGenre[genreKey]) {
      moviesByGenre[genreKey] = [];
    }

    // --- Data Restructuring and Renaming ---
    const imagePath = `/assets/images/movies/${genreKey}/${incomingMovie.portrait}`;
    const innerImagePath = `/assets/images/movies/${genreKey}/landscape/${incomingMovie.landscape}`;

    const structuredMovie = {
      id: `a${moviesByGenre[genreKey].length + 1}`,
      title: incomingMovie.title,
      image: imagePath,
      innerImage: innerImagePath,
      slug: generateSlug(incomingMovie.title),
      year: incomingMovie.year,
      duration: incomingMovie.duration,
      rating: incomingMovie.rating,
      genre: incomingMovie.genre,
      description: incomingMovie.description,
      videoUrl: incomingMovie.link,
    };
    // -----------------------------------------

    moviesByGenre[genreKey].push(structuredMovie);

    await fs.writeFile(filePath, JSON.stringify(moviesByGenre, null, 2));

    return NextResponse.json({ message: 'Movie added successfully with correct structure!' }, { status: 201 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ message: 'Failed to write to file.' }, { status: 500 });
  }
}
