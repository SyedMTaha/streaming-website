import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

// Function to generate a new ID
function generateNewId(existingIds) {
  if (existingIds.length === 0) {
    return 'c1';
  }
  const maxId = Math.max(...existingIds.map(id => parseInt(id.slice(1))));
  return 'c' + (maxId + 1);
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphen
    .replace(/^-+|-+$/g, '');    // Remove leading/trailing hyphens
}

export async function POST(request) {
  try {
    const incomingData = await request.json();

    // Handle both single episode and multiple episodes
    if (!incomingData || !incomingData.cartoonTitle) {
      return NextResponse.json({ message: 'Invalid data provided. cartoonTitle is required.' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'src/data/cartoonEpisodes.json');
    const fileData = await fs.readFile(filePath, 'utf8');
    const cartoonsBySlug = JSON.parse(fileData);

    // Generate cartoon slug from title
    const cartoonSlug = generateSlug(incomingData.cartoonTitle);
    const episodes = incomingData.episodes || [incomingData.videoUrl];

    // Initialize cartoon if it doesn't exist
    if (!cartoonsBySlug[cartoonSlug]) {
      cartoonsBySlug[cartoonSlug] = {
        episodes: []
      };
    }

    // Ensure episodes array exists
    if (!cartoonsBySlug[cartoonSlug].episodes) {
      cartoonsBySlug[cartoonSlug].episodes = [];
    }

    const existingEpisodes = cartoonsBySlug[cartoonSlug].episodes;
    const addedEpisodes = [];

    // Add each episode
    episodes.forEach((episodeUrl, index) => {
      if (!episodeUrl) return; // Skip empty episodes
      
      const episodeNumber = existingEpisodes.length + index + 1;
      const episodeTitle = `Episode ${episodeNumber}`;
      const episodeSlug = generateSlug(episodeTitle);
      
      // Find the previous and next episode slugs for navigation
      const previousEpisodeSlug = (existingEpisodes.length + index) > 0 ? 
        (existingEpisodes[existingEpisodes.length - 1]?.slug || `episode-${existingEpisodes.length + index}`) : null;
      const nextEpisodeSlug = null; // Will be updated when next episode is added
      
      // Update the previous episode's nextEpisode reference
      if (existingEpisodes.length + index > 0) {
        const prevIndex = existingEpisodes.length + index - 1;
        if (existingEpisodes[prevIndex]) {
          existingEpisodes[prevIndex].nextEpisode = episodeSlug;
        } else if (addedEpisodes[prevIndex - existingEpisodes.length]) {
          addedEpisodes[prevIndex - existingEpisodes.length].nextEpisode = episodeSlug;
        }
      }

      // --- Data Structuring ---
      const structuredEpisode = {
        id: `${cartoonSlug}-ep${episodeNumber}`,
        title: episodeTitle,
        slug: episodeSlug,
        thumbnail: incomingData.portraitImage || `/assets/images/cartoons/${cartoonSlug}.jpg`,
        videoUrl: episodeUrl,
        duration: incomingData.duration || '00:00',
        previousEpisode: previousEpisodeSlug,
        nextEpisode: nextEpisodeSlug
      };
      // -------------------------

      addedEpisodes.push(structuredEpisode);
    });

    // Add all new episodes to the cartoon
    existingEpisodes.push(...addedEpisodes);

    // Get the cartoon ID for image paths
    const moviesFilePath = path.join(process.cwd(), 'src/data/movies.json');
    const moviesFileData = await fs.readFile(moviesFilePath, 'utf8');
    const movies = JSON.parse(moviesFileData);

    const cartoonSection = movies['cartoon'];
    const existingCartoon = cartoonSection.find(movie => movie.slug === cartoonSlug);
    
    let cartoonId;
    if (!existingCartoon) {
      const existingIds = cartoonSection.map(movie => movie.id);
      cartoonId = generateNewId(existingIds);
    } else {
      cartoonId = existingCartoon.id;
    }

    // Update episodes with correct thumbnail paths using cartoon ID
    addedEpisodes.forEach(episode => {
      if (!incomingData.portraitImage) {
        episode.thumbnail = `/assets/images/cartoons/cartoon${cartoonId.slice(1)}.jpg`;
      }
    });

// Save cartoon details to cartoonEpisodes.json
    await fs.writeFile(filePath, JSON.stringify(cartoonsBySlug, null, 2));

    // Add cartoon to movies.json (only if it doesn't exist)
    if (!existingCartoon) {
      const newId = cartoonId;
      const newMovie = {
        id: newId,
        title: incomingData.cartoonTitle,
        image: incomingData.portraitImage || `/assets/images/cartoons/cartoon${newId.slice(1)}.jpg`,
        innerImage: incomingData.landscapeImage || `/assets/images/cartoons/landscape/cartoon${newId.slice(1)}.jpg`,
        slug: cartoonSlug,
        year: incomingData.year || 'Unknown',
        duration: incomingData.duration || '00:00',
        rating: incomingData.rating || 'N/A',
        genre: 'cartoon',
        description: incomingData.description || 'No description available.'
      };
      cartoonSection.push(newMovie);
      await fs.writeFile(moviesFilePath, JSON.stringify(movies, null, 2));
    }

    return NextResponse.json({ 
      message: `${addedEpisodes.length} episode(s) added successfully!`, 
      episodes: addedEpisodes 
    }, { status: 201 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ message: 'Failed to add cartoon episode.' }, { status: 500 });
  }
}

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