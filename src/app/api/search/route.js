import { NextResponse } from 'next/server';
import { db } from '../../../../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

// Cache for storing movies in memory
let moviesCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('q')?.toLowerCase() || '';
    
    // Return empty if query is too short
    if (searchQuery.length < 2) {
      return NextResponse.json({
        success: true,
        results: []
      });
    }

    // Check if cache is valid
    const now = Date.now();
    if (!moviesCache || !cacheTimestamp || (now - cacheTimestamp) > CACHE_DURATION) {
      // Fetch movies from Firebase and update cache
      const moviesRef = collection(db, 'movies');
      const q = query(moviesRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      moviesCache = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Only store essential fields for search
        moviesCache.push({
          id: doc.id,
          title: data.title,
          slug: data.slug,
          genre: data.genre,
          year: data.year,
          rating: data.rating,
          image: data.image,
          description: data.description?.substring(0, 100), // Limit description length
          // Add content type for better identification
          contentType: data.genre === 'tv-series' ? 'series' : 
                      data.genre === 'cartoon' ? 'cartoon' : 'movie'
        });
      });
      cacheTimestamp = now;
    }

    // Perform search on cached data
    const results = moviesCache.filter(movie => {
      const titleMatch = movie.title?.toLowerCase().includes(searchQuery);
      const genreMatch = movie.genre?.toLowerCase().includes(searchQuery);
      const descMatch = movie.description?.toLowerCase().includes(searchQuery);
      
      return titleMatch || genreMatch || descMatch;
    });

    // Limit results and sort by relevance
    const sortedResults = results.sort((a, b) => {
      // Prioritize title matches
      const aTitle = a.title?.toLowerCase() || '';
      const bTitle = b.title?.toLowerCase() || '';
      
      if (aTitle.startsWith(searchQuery) && !bTitle.startsWith(searchQuery)) return -1;
      if (!aTitle.startsWith(searchQuery) && bTitle.startsWith(searchQuery)) return 1;
      if (aTitle.includes(searchQuery) && !bTitle.includes(searchQuery)) return -1;
      if (!aTitle.includes(searchQuery) && bTitle.includes(searchQuery)) return 1;
      
      return 0;
    }).slice(0, 8);

    return NextResponse.json({
      success: true,
      results: sortedResults,
      cached: true
    });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { success: false, message: 'Search failed', error: error.message },
      { status: 500 }
    );
  }
}
