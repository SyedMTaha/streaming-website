import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Function to generate a new ID
function generateNewId(existingIds) {
  if (existingIds.length === 0) {
    return 'tv1';
  }
  const maxId = Math.max(...existingIds.map(id => parseInt(id.slice(2))));
  return 'tv' + (maxId + 1);
}

export async function POST(request) {
  try {
    const incomingSeries = await request.json();

    if (!incomingSeries || !incomingSeries.title || !incomingSeries.genre) {
      return NextResponse.json({ message: 'Invalid series data provided. Title and genre are required.' }, { status: 400 });
    }

    const episodesFilePath = path.join(process.cwd(), 'src/data/tvEpisodes.json');
    const episodesFileData = await fs.readFile(episodesFilePath, 'utf8');
    const seriesBySlug = JSON.parse(episodesFileData);

    const moviesFilePath = path.join(process.cwd(), 'src/data/movies.json');
    const moviesFileData = await fs.readFile(moviesFilePath, 'utf8');
    const movies = JSON.parse(moviesFileData);

    const genreKey = incomingSeries.genre.toLowerCase().replace(/\s+/g, '-');

    // Initialize or get existing series data
    if (!seriesBySlug[incomingSeries.slug]) {
      seriesBySlug[incomingSeries.slug] = {
        id: incomingSeries.slug,
        title: incomingSeries.title,
        slug: incomingSeries.slug,
        description: incomingSeries.description || 'No description available.',
        thumbnail: `/assets/images/series/${genreKey}/${incomingSeries.portrait}`,
        videoUrl: "",
        duration: incomingSeries.duration || '30 min',
        rating: incomingSeries.rating || 'TV-PG',
        episodes: []
      };
    }

    // Process each episode
    const addedEpisodes = [];
    const episodes = incomingSeries.episodes || [];
    episodes.forEach((episodeUrl, index) => {
      if (!episodeUrl) return;

      const episodeNumber = seriesBySlug[incomingSeries.slug].episodes.length + index + 1;
      const episodeTitle = `Episode ${episodeNumber}`;
      const episodeSlug = generateSlug(episodeTitle);

      const previousEpisodeSlug = (seriesBySlug[incomingSeries.slug].episodes.length + index) > 0 ?
        (seriesBySlug[incomingSeries.slug].episodes[seriesBySlug[incomingSeries.slug].episodes.length - 1]?.slug || `episode-${seriesBySlug[incomingSeries.slug].episodes.length + index}`) : null;
      const nextEpisodeSlug = null; // Will be updated when next episode is added

      if (seriesBySlug[incomingSeries.slug].episodes.length + index > 0) {
        const prevIndex = seriesBySlug[incomingSeries.slug].episodes.length + index - 1;
        if (seriesBySlug[incomingSeries.slug].episodes[prevIndex]) {
          seriesBySlug[incomingSeries.slug].episodes[prevIndex].nextEpisode = episodeSlug;
        } else if (addedEpisodes[prevIndex - seriesBySlug[incomingSeries.slug].episodes.length]) {
          addedEpisodes[prevIndex - seriesBySlug[incomingSeries.slug].episodes.length].nextEpisode = episodeSlug;
        }
      }

      const structuredEpisode = {
        id: `${incomingSeries.slug}-${episodeNumber}`,
        title: episodeTitle,
        slug: episodeSlug,
        description: `Episode ${episodeNumber} of ${incomingSeries.title}`,
        thumbnail: `/assets/images/series/${genreKey}/${incomingSeries.portrait}`,
        videoUrl: episodeUrl,
        duration: incomingSeries.episodeDuration || '30:00',
        rating: incomingSeries.rating || 'TV-PG',
        previousEpisode: previousEpisodeSlug,
        nextEpisode: nextEpisodeSlug
      };
      addedEpisodes.push(structuredEpisode);
    });

    // Add all new episodes to the series
    seriesBySlug[incomingSeries.slug].episodes.push(...addedEpisodes);

    // Update series detail in movies.json (only if it doesn't exist)
    const seriesSection = movies['tv-series'];
    const existingSeries = seriesSection.find(series => series.slug === incomingSeries.slug);

    let seriesId;
    if (!existingSeries) {
      const existingIds = seriesSection.map(series => series.id);
      seriesId = generateNewId(existingIds);
      const newSeries = {
        id: seriesId,
        title: incomingSeries.title,
        image: `/assets/images/series/landscape/${incomingSeries.portrait}`,
        slug: incomingSeries.slug,
        year: incomingSeries.year || 'Unknown',
        duration: incomingSeries.duration || '00:00',
        rating: incomingSeries.rating || 'N/A',
        genre: 'tv-series',
        description: incomingSeries.description || 'No description available.'
      };
      seriesSection.push(newSeries);
      await fs.writeFile(moviesFilePath, JSON.stringify(movies, null, 2));
    } else {
      seriesId = existingSeries.id;
    }

    // Update episodes with correct thumbnail paths using series ID
    addedEpisodes.forEach(episode => {
      episode.thumbnail = `/assets/images/series/series${seriesId.slice(2)}.jpg`;
    });

    // Save series details to tvEpisodes.json
    await fs.writeFile(episodesFilePath, JSON.stringify(seriesBySlug, null, 2));

    return NextResponse.json({
      message: `${addedEpisodes.length} episode(s) added successfully!`,
      episodes: addedEpisodes
    }, { status: 201 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ message: 'Failed to add TV series.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const episodesFilePath = path.join(process.cwd(), 'src/data/tvEpisodes.json');
    const fileData = await fs.readFile(episodesFilePath, 'utf8');
    const seriesBySlug = JSON.parse(fileData);
    const allEpisodes = [];
    for (const slug of Object.keys(seriesBySlug)) {
      const series = seriesBySlug[slug];
      if (series.episodes && Array.isArray(series.episodes)) {
        series.episodes.forEach(ep => {
          allEpisodes.push({ ...ep, seriesSlug: slug, seriesTitle: series.title || slug });
        });
      }
    }
    return NextResponse.json(allEpisodes, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to read TV series episodes.' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const updatedEpisode = await request.json();
    if (!updatedEpisode || !updatedEpisode.id) {
      return NextResponse.json({ message: 'Invalid episode data.' }, { status: 400 });
    }
    const episodesFilePath = path.join(process.cwd(), 'src/data/tvEpisodes.json');
    const fileData = await fs.readFile(episodesFilePath, 'utf8');
    const seriesBySlug = JSON.parse(fileData);
    let found = false;
    for (const slug of Object.keys(seriesBySlug)) {
      const series = seriesBySlug[slug];
      if (series.episodes && Array.isArray(series.episodes)) {
        series.episodes = series.episodes.map(ep => {
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
    await fs.writeFile(episodesFilePath, JSON.stringify(seriesBySlug, null, 2));
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
    const episodesFilePath = path.join(process.cwd(), 'src/data/tvEpisodes.json');
    const fileData = await fs.readFile(episodesFilePath, 'utf8');
    const seriesBySlug = JSON.parse(fileData);
    let found = false;
    for (const slug of Object.keys(seriesBySlug)) {
      const series = seriesBySlug[slug];
      if (series.episodes && Array.isArray(series.episodes)) {
        const before = series.episodes.length;
        series.episodes = series.episodes.filter(ep => ep.id !== id);
        if (series.episodes.length < before) found = true;
      }
    }
    if (!found) {
      return NextResponse.json({ message: 'Episode not found.' }, { status: 404 });
    }
    await fs.writeFile(episodesFilePath, JSON.stringify(seriesBySlug, null, 2));
    return NextResponse.json({ message: 'Episode deleted successfully!' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete episode.' }, { status: 500 });
  }
}
