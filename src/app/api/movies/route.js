import { NextResponse } from 'next/server';
import { db } from '../../../../firebase';
import { collection, addDoc, getDocs, doc, setDoc, updateDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore';

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getGenreIdPrefix(genre) {
  const genreMapping = {
    'action': 'a',
    'adventure': 'adv',
    'animation': 'an',
    'biographical': 'b',
    'cartoon': 'c',
    'comedy': 'com',
    'crime': 'cr',
    'documentary': 'd',
    'drama': 'dr',
    'family': 'f',
    'historical': 'h',
    'horror': 'hor',
    'inspiration': 'i',
    'martial-arts': 'ma',
    'musical': 'm',
    'mystery': 'my',
    'news': 'n',
    'romance': 'r',
    'sci-fi': 'sf',
    'sport': 's',
    'thriller': 't',
    'war': 'w',
    'western': 'we',
    'tv-series': 'tv'
  };
  
  const genreKey = genre.toLowerCase().replace(/\s+/g, '-');
  return genreMapping[genreKey] || 'mov';
}

// POST - Add new movie
export async function POST(request) {
  try {
    const movieData = await request.json();

    if (!movieData || !movieData.title || !movieData.genre) {
      return NextResponse.json(
        { success: false, message: 'Title and genre are required' },
        { status: 400 }
      );
    }

    // Normalize genre to lowercase for consistency
    const normalizedGenre = movieData.genre.toLowerCase().replace(/\s+/g, '-');
    
    // Get existing movies of the same genre to determine the next ID number
    const moviesRef = collection(db, 'movies');
    const q = query(moviesRef, where('genre', '==', normalizedGenre));
    const querySnapshot = await getDocs(q);
    
    // Find the highest ID number for this genre
    const genrePrefix = getGenreIdPrefix(normalizedGenre);
    let maxNumber = 0;
    
    console.log(`Checking ${querySnapshot.size} existing ${normalizedGenre} movies...`);
    
    querySnapshot.forEach((doc) => {
      const docData = doc.data();
      // Also check the document ID itself
      const docId = doc.id;
      
      // Check both the stored id field and the document ID
      const idsToCheck = [docData.id, docId].filter(Boolean);
      
      for (const id of idsToCheck) {
        if (id.startsWith(genrePrefix)) {
          const numberPart = id.substring(genrePrefix.length);
          const num = parseInt(numberPart, 10);
          if (!isNaN(num) && num > maxNumber) {
            maxNumber = num;
          }
        }
      }
    });
    
    console.log(`Genre: ${normalizedGenre}, Prefix: ${genrePrefix}, Max number found: ${maxNumber}, Next ID: ${genrePrefix}${maxNumber + 1}`);
    
    // Generate the next sequential ID
    const movieId = `${genrePrefix}${maxNumber + 1}`;
    const slug = generateSlug(movieData.title);

    // Prepare movie document
    const movieDoc = {
      id: movieId,
      title: movieData.title,
      description: movieData.description || '',
      genre: normalizedGenre,
      year: movieData.year || '',
      duration: movieData.duration || '',
      rating: movieData.rating || '',
      videoUrl: movieData.link || '',
      slug: slug,
      // ImageKit URLs
      image: movieData.imageUrl || '', // Portrait image URL from ImageKit
      innerImage: movieData.innerImageUrl || '', // Landscape image URL from ImageKit
      // ImageKit file IDs for management
      imageFileId: movieData.imageFileId || '',
      innerImageFileId: movieData.innerImageFileId || '',
      // Metadata
      createdAt: new Date(),
      updatedAt: new Date(),
      // For TV Series
      episodes: movieData.episodes || [],
      episodeCount: movieData.episodeCount || 0
    };

    // Add to Firestore with the movieId as the document ID
    const docRef = doc(db, 'movies', movieId);
    await setDoc(docRef, movieDoc);

    return NextResponse.json({
      success: true,
      message: 'Movie added successfully',
      id: movieId,
      movieId: movieId
    });

  } catch (error) {
    console.error('Error adding movie:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to add movie', error: error.message },
      { status: 500 }
    );
  }
}

// GET - Fetch all movies
export async function GET() {
  try {
    const moviesRef = collection(db, 'movies');
    const q = query(moviesRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const movies = [];
    querySnapshot.forEach((doc) => {
      movies.push({ id: doc.id, ...doc.data() });
    });

    return NextResponse.json({
      success: true,
      movies: movies
    });

  } catch (error) {
    console.error('Error fetching movies:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch movies', error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update movie
export async function PUT(request) {
  try {
    const { id, ...updateData } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Movie ID is required' },
        { status: 400 }
      );
    }

    // Update slug if title changed
    if (updateData.title) {
      updateData.slug = generateSlug(updateData.title);
    }

    updateData.updatedAt = new Date();

    const movieRef = doc(db, 'movies', id);
    await updateDoc(movieRef, updateData);

    return NextResponse.json({
      success: true,
      message: 'Movie updated successfully'
    });

  } catch (error) {
    console.error('Error updating movie:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update movie', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete movie
export async function DELETE(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Movie ID is required' },
        { status: 400 }
      );
    }

    const movieRef = doc(db, 'movies', id);
    await deleteDoc(movieRef);

    return NextResponse.json({
      success: true,
      message: 'Movie deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting movie:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete movie', error: error.message },
      { status: 500 }
    );
  }
}
