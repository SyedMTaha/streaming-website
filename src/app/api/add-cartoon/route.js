import { NextResponse } from 'next/server';
import { db } from '../../../../firebase';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore';

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// POST - Add new cartoon with episodes
export async function POST(request) {
  try {
    const cartoonData = await request.json();

    if (!cartoonData || !cartoonData.cartoonTitle) {
      return NextResponse.json(
        { success: false, message: 'Cartoon title is required' },
        { status: 400 }
      );
    }

    // Get existing cartoons to determine the next ID number
    const moviesRef = collection(db, 'movies');
    const q = query(moviesRef, where('genre', '==', 'cartoon'));
    const querySnapshot = await getDocs(q);
    
    // Find the highest ID number for cartoons
    let maxNumber = 0;
    
    console.log(`Checking ${querySnapshot.size} existing cartoons...`);
    
    querySnapshot.forEach((doc) => {
      const docId = doc.id;
      const docData = doc.data();
      
      // Check both the stored id field and the document ID
      const idsToCheck = [docData.id, docId].filter(Boolean);
      
      for (const id of idsToCheck) {
        if (id.startsWith('c')) {
          const numberPart = id.substring(1);
          const num = parseInt(numberPart, 10);
          if (!isNaN(num) && num > maxNumber) {
            maxNumber = num;
          }
        }
      }
    });
    
    console.log(`Max cartoon number found: ${maxNumber}, Next ID: c${maxNumber + 1}`);
    
    // Generate the next sequential ID
    const cartoonId = `c${maxNumber + 1}`;
    const slug = generateSlug(cartoonData.cartoonTitle);

    // Process episodes
    const episodes = [];
    const episodeUrls = cartoonData.episodes || [cartoonData.videoUrl];
    
    episodeUrls.forEach((episodeUrl, index) => {
      if (!episodeUrl) return;
      
      const episodeNumber = index + 1;
      const episodeTitle = `Episode ${episodeNumber}`;
      const episodeSlug = `episode-${episodeNumber}`;
      
      const episode = {
        id: `${slug}-ep${episodeNumber}`,
        title: episodeTitle,
        slug: episodeSlug,
        description: cartoonData.description || `${cartoonData.cartoonTitle} - ${episodeTitle}`,
        videoUrl: episodeUrl,
        duration: cartoonData.duration || '00:00',
        thumbnail: cartoonData.imageUrl || '', // Use the main cartoon image as episode thumbnail
        previousEpisode: episodeNumber > 1 ? `episode-${episodeNumber - 1}` : null,
        nextEpisode: episodeNumber < episodeUrls.length ? `episode-${episodeNumber + 1}` : null
      };
      
      episodes.push(episode);
    });

    // Prepare cartoon document
    const cartoonDoc = {
      id: cartoonId,
      title: cartoonData.cartoonTitle,
      description: cartoonData.description || 'No description available.',
      genre: 'cartoon',
      year: cartoonData.year || 'Unknown',
      duration: cartoonData.duration || '00:00',
      rating: cartoonData.rating || 'N/A',
      slug: slug,
      // ImageKit URLs
      image: cartoonData.imageUrl || '', // Portrait image URL from ImageKit
      innerImage: cartoonData.innerImageUrl || '', // Landscape image URL from ImageKit
      // ImageKit file IDs for management
      imageFileId: cartoonData.imageFileId || '',
      innerImageFileId: cartoonData.innerImageFileId || '',
      // Episodes
      episodes: episodes,
      episodeCount: episodes.length,
      // Metadata
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add to Firestore with the cartoonId as the document ID
    const docRef = doc(db, 'movies', cartoonId);
    await setDoc(docRef, cartoonDoc);

    return NextResponse.json({
      success: true,
      message: `Cartoon added successfully with ${episodes.length} episode(s)!`,
      id: cartoonId,
      cartoonId: cartoonId,
      episodes: episodes
    });

  } catch (error) {
    console.error('Error adding cartoon:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to add cartoon', error: error.message },
      { status: 500 }
    );
  }
}

// GET - Fetch all cartoons
export async function GET() {
  try {
    const moviesRef = collection(db, 'movies');
    const q = query(moviesRef, where('genre', '==', 'cartoon'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const cartoons = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Format for compatibility with existing UI
      cartoons.push({
        id: doc.id,
        cartoonTitle: data.title,
        cartoonSlug: data.slug,
        description: data.description,
        thumbnail: data.image,
        episodes: data.episodes || [],
        ...data
      });
    });

    return NextResponse.json(cartoons);

  } catch (error) {
    console.error('Error fetching cartoons:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch cartoons', error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update cartoon
export async function PUT(request) {
  try {
    const updateData = await request.json();
    const { id, cartoonTitle, ...otherData } = updateData;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Cartoon ID is required' },
        { status: 400 }
      );
    }

    // Build update object with only provided fields
    const updates = {};
    
    // Map cartoonTitle to title for consistency
    if (cartoonTitle) {
      updates.title = cartoonTitle;
      updates.slug = generateSlug(cartoonTitle);
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
      const cartoonSlug = updates.slug || generateSlug(cartoonTitle || 'cartoon');
      
      updateData.episodes.forEach((episodeUrl, index) => {
        if (!episodeUrl) return;
        
        const episodeNumber = index + 1;
        const episodeTitle = `Episode ${episodeNumber}`;
        const episodeSlug = `episode-${episodeNumber}`;
        
        const episode = {
          id: `${cartoonSlug}-ep${episodeNumber}`,
          title: episodeTitle,
          slug: episodeSlug,
          description: updates.description || updateData.description || `${cartoonTitle || 'Cartoon'} - ${episodeTitle}`,
          videoUrl: episodeUrl,
          duration: updates.duration || updateData.duration || '00:00',
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
      message: 'Cartoon updated successfully!'
    });

  } catch (error) {
    console.error('Error updating cartoon:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update cartoon', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete cartoon
export async function DELETE(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Cartoon ID is required' },
        { status: 400 }
      );
    }

    const movieRef = doc(db, 'movies', id);
    await deleteDoc(movieRef);

    return NextResponse.json({
      success: true,
      message: 'Cartoon deleted successfully!'
    });

  } catch (error) {
    console.error('Error deleting cartoon:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete cartoon', error: error.message },
      { status: 500 }
    );
  }
}
