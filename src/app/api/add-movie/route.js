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

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'src/data/movies.json');
    const fileData = await fs.readFile(filePath, 'utf8');
    const moviesByGenre = JSON.parse(fileData);
    // Flatten all movies into a single array
    const allMovies = Object.values(moviesByGenre).flat();
    return NextResponse.json(allMovies, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to read movies.' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const updatedMovie = await request.json();
    if (!updatedMovie || !updatedMovie.id) {
      return NextResponse.json({ message: 'Invalid movie data.' }, { status: 400 });
    }
    const filePath = path.join(process.cwd(), 'src/data/movies.json');
    const fileData = await fs.readFile(filePath, 'utf8');
    const moviesByGenre = JSON.parse(fileData);
    let found = false;
    for (const genreKey of Object.keys(moviesByGenre)) {
      moviesByGenre[genreKey] = moviesByGenre[genreKey].map(movie => {
        if (movie.id === updatedMovie.id) {
          found = true;
          return { ...movie, ...updatedMovie };
        }
        return movie;
      });
    }
    if (!found) {
      return NextResponse.json({ message: 'Movie not found.' }, { status: 404 });
    }
    await fs.writeFile(filePath, JSON.stringify(moviesByGenre, null, 2));
    return NextResponse.json({ message: 'Movie updated successfully!' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update movie.' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ message: 'Movie ID required.' }, { status: 400 });
    }
    const filePath = path.join(process.cwd(), 'src/data/movies.json');
    const fileData = await fs.readFile(filePath, 'utf8');
    const moviesByGenre = JSON.parse(fileData);
    let found = false;
    for (const genreKey of Object.keys(moviesByGenre)) {
      const before = moviesByGenre[genreKey].length;
      moviesByGenre[genreKey] = moviesByGenre[genreKey].filter(movie => movie.id !== id);
      if (moviesByGenre[genreKey].length < before) found = true;
    }
    if (!found) {
      return NextResponse.json({ message: 'Movie not found.' }, { status: 404 });
    }
    await fs.writeFile(filePath, JSON.stringify(moviesByGenre, null, 2));
    return NextResponse.json({ message: 'Movie deleted successfully!' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete movie.' }, { status: 500 });
  }
}
