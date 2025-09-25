import { NextResponse } from 'next/server';
import { db } from '../../../../firebase';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore';

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// POST - Add new TV series with episodes
export async function POST(request) {
  console.log('TV Series upload started at:', new Date().toISOString());
  
  try {
    // Add timeout wrapper
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 second timeout
    
    const seriesData = await request.json();
    clearTimeout(timeoutId);

    if (!seriesData || !seriesData.title) {
      return NextResponse.json(
        { success: false, message: 'Series title is required' },
        { status: 400 }
      );
    }

    // Get existing TV series to determine the next ID number
    const moviesRef = collection(db, 'movies');
    const q = query(moviesRef, where('genre', '==', 'tv-series'));
    const querySnapshot = await getDocs(q);
    
    // Find the highest ID number for TV series
    let maxNumber = 0;
    
    console.log(`Checking ${querySnapshot.size} existing TV series...`);
    
    querySnapshot.forEach((doc) => {
      const docId = doc.id;
      const docData = doc.data();
      
      // Check both the stored id field and the document ID
      const idsToCheck = [docData.id, docId].filter(Boolean);
      
      for (const id of idsToCheck) {
        if (id.startsWith('tv')) {
          const numberPart = id.substring(2);
          const num = parseInt(numberPart, 10);
          if (!isNaN(num) && num > maxNumber) {
            maxNumber = num;
          }
        }
      }
    });
    
    console.log(`Max TV series number found: ${maxNumber}, Next ID: tv${maxNumber + 1}`);
    
    // Generate the next sequential ID
    const seriesId = `tv${maxNumber + 1}`;
    const slug = generateSlug(seriesData.title);

    // Process episodes
    const episodes = [];
    const episodeUrls = seriesData.episodes || [];
    
    episodeUrls.forEach((episodeUrl, index) => {
      if (!episodeUrl) return;
      
      const episodeNumber = index + 1;
      const episodeTitle = `Episode ${episodeNumber}`;
      const episodeSlug = `episode-${episodeNumber}`;
      
      const episode = {
        id: `${slug}-ep${episodeNumber}`,
        title: episodeTitle,
        slug: episodeSlug,
        description: seriesData.description || `${seriesData.title} - ${episodeTitle}`,
        videoUrl: episodeUrl,
        duration: seriesData.episodeDuration || seriesData.duration || '30:00',
        thumbnail: seriesData.imageUrl || '', // Use the main series image as episode thumbnail
        previousEpisode: episodeNumber > 1 ? `episode-${episodeNumber - 1}` : null,
        nextEpisode: episodeNumber < episodeUrls.length ? `episode-${episodeNumber + 1}` : null
      };
      
      episodes.push(episode);
    });

    // Prepare series document
    const seriesDoc = {
      id: seriesId,
      title: seriesData.title,
      description: seriesData.description || 'No description available.',
      genre: 'tv-series',
      year: seriesData.year || 'Unknown',
      duration: seriesData.duration || '00:00',
      rating: seriesData.rating || 'N/A',
      slug: slug,
      // ImageKit URLs
      image: seriesData.imageUrl || '', // Portrait image URL from ImageKit
      innerImage: seriesData.innerImageUrl || '', // Landscape image URL from ImageKit
      // ImageKit file IDs for management
      imageFileId: seriesData.imageFileId || '',
      innerImageFileId: seriesData.innerImageFileId || '',
      // Episodes
      episodes: episodes,
      episodeCount: episodes.length,
      // Metadata
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add to Firestore with the seriesId as the document ID
    const docRef = doc(db, 'movies', seriesId);
    await setDoc(docRef, seriesDoc);

    return NextResponse.json({
      success: true,
      message: `TV Series added successfully with ${episodes.length} episode(s)!`,
      id: seriesId,
      seriesId: seriesId,
      episodes: episodes
    });

  } catch (error) {
    console.error('Error adding TV series:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      name: error.name
    });
    
    // Return more specific error information
    const isTimeoutError = error.name === 'AbortError' || error.message.includes('timeout');
    const isNetworkError = error.message.includes('fetch') || error.message.includes('network');
    
    return NextResponse.json(
      { 
        success: false, 
        message: isTimeoutError ? 'Upload timed out - please try with fewer episodes or smaller images' :
                 isNetworkError ? 'Network error - please check your connection and try again' :
                 'Failed to add TV series', 
        error: error.message,
        errorType: error.name
      },
      { status: 500 }
    );
  }
}

// GET - Fetch all TV series
export async function GET() {
  try {
    const moviesRef = collection(db, 'movies');
    const q = query(moviesRef, where('genre', '==', 'tv-series'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const series = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Format for compatibility with existing UI
      series.push({
        id: doc.id,
        seriesTitle: data.title,
        seriesSlug: data.slug,
        description: data.description,
        thumbnail: data.image,
        episodes: data.episodes || [],
        ...data
      });
    });

    return NextResponse.json(series);

  } catch (error) {
    console.error('Error fetching TV series:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch TV series', error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update TV series
export async function PUT(request) {
  try {
    const updateData = await request.json();
    const { id, ...otherData } = updateData;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Series ID is required' },
        { status: 400 }
      );
    }

    // Build update object with only provided fields
    const updates = {};
    
    // Update slug if title changed
    if (updateData.title) {
      updates.title = updateData.title;
      updates.slug = generateSlug(updateData.title);
    }
    
    // Only update fields that are provided
    if (updateData.description !== undefined) updates.description = updateData.description;
    if (updateData.year !== undefined) updates.year = updateData.year;
    if (updateData.duration !== undefined) updates.duration = updateData.duration;
    if (updateData.rating !== undefined) updates.rating = updateData.rating;
    
    // Handle image URLs - only update if new ones are provided
    if (updateData.imageUrl) updates.image = updateData.imageUrl;
    if (updateData.innerImageUrl) updates.innerImage = updateData.innerImageUrl;
    if (updateData.imageFileId) updates.imageFileId = updateData.imageFileId;
    if (updateData.innerImageFileId) updates.innerImageFileId = updateData.innerImageFileId;

    // Process episodes if provided
    if (updateData.episodes && Array.isArray(updateData.episodes)) {
      const episodes = [];
      const seriesSlug = updates.slug || generateSlug(updateData.title || 'series');
      
      updateData.episodes.forEach((episodeUrl, index) => {
        if (!episodeUrl) return;
        
        const episodeNumber = index + 1;
        const episodeTitle = `Episode ${episodeNumber}`;
        const episodeSlug = `episode-${episodeNumber}`;
        
        const episode = {
          id: `${seriesSlug}-ep${episodeNumber}`,
          title: episodeTitle,
          slug: episodeSlug,
          description: updates.description || updateData.description || `${updateData.title || 'Series'} - ${episodeTitle}`,
          videoUrl: episodeUrl,
          duration: updateData.episodeDuration || updates.duration || updateData.duration || '30:00',
          thumbnail: updates.image || updateData.imageUrl || '',
          previousEpisode: episodeNumber > 1 ? `episode-${episodeNumber - 1}` : null,
          nextEpisode: episodeNumber < updateData.episodes.length ? `episode-${episodeNumber + 1}` : null
        };
        
        episodes.push(episode);
      });
      updates.episodes = episodes;
      updates.episodeCount = episodes.length;
    }

    updates.updatedAt = new Date();

    const movieRef = doc(db, 'movies', id);
    await updateDoc(movieRef, updates);

    return NextResponse.json({
      success: true,
      message: 'TV Series updated successfully!'
    });

  } catch (error) {
    console.error('Error updating TV series:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update TV series', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete TV series
export async function DELETE(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Series ID is required' },
        { status: 400 }
      );
    }

    const movieRef = doc(db, 'movies', id);
    await deleteDoc(movieRef);

    return NextResponse.json({
      success: true,
      message: 'TV Series deleted successfully!'
    });

  } catch (error) {
    console.error('Error deleting TV series:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete TV series', error: error.message },
      { status: 500 }
    );
  }
}
