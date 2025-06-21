"use client"

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play, Bookmark, ThumbsUp, Share, Star, Lock } from "lucide-react";
import Navbar from '../../../../components/navbarSearch';
import home02 from '../../../../public/assets/images/background/homePage05.jpg';
import moviesData from '../../../../src/data/movies.json';
import { auth } from '../../../../firebase';

// Add disabled genres here
const DISABLED_GENRES = ['adventure', 'animation', 'biographical', 'crime', 'documentary','family', 'historical', 'horror', 'inspiration', 'martial-arts', 'musical', 'news', 'romance', 'sport', 'war']; 

export default function GenrePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const scrollContainerRef = useRef(null);
  const locomotiveScroll = useRef(null);
  const [sortBy, setSortBy] = useState('newest');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const genreSlug = params.slug;
  const movies = moviesData[genreSlug] || [];
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated && scrollContainerRef.current) {
      import('locomotive-scroll').then((locomotiveScrollModule) => {
        locomotiveScroll.current = new locomotiveScrollModule.default({
          el: scrollContainerRef.current,
          smooth: true,
          lerp: 0.08,
        });
      });
      import('locomotive-scroll/dist/locomotive-scroll.css');
    }
    return () => {
      if (locomotiveScroll.current) {
        locomotiveScroll.current.destroy();
        locomotiveScroll.current = null;
      }
    };
  }, [isLoading, isAuthenticated]);

  // Check authentication status
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        // Redirect to login if not authenticated
        const redirectUrl = searchParams.get('redirect') || `/genre/${genreSlug}`;
        router.push(`/auth/login?redirect=${encodeURIComponent(redirectUrl)}`);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [genreSlug, router, searchParams]);

  // Check if the current genre is disabled
  const isGenreDisabled = DISABLED_GENRES.includes(genreSlug);

  // Convert slug to title case and replace hyphens with spaces
  const formatGenreName = (slug) => {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const genreName = formatGenreName(params.slug);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -200,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 200,
        behavior: "smooth",
      });
    }
  };

  const handleMovieClick = (movie) => {
    if (isGenreDisabled) return; // Prevent navigation if genre is disabled
    
    if (genreSlug === 'cartoon') {
      router.push(`/cartoon/${movie.slug}`);
    } else {
      router.push(`/movie/${movie.slug}`);
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#020b1f] via-[#0a2151] to-[#020b1f] text-white flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Don't render the page if not authenticated (will redirect to login)
  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#020b1f] via-[#0a2151] to-[#020b1f] text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div
      ref={scrollContainerRef}
      data-scroll-container
      className="min-h-screen bg-gradient-to-b from-[#020b1f] via-[#0a2151] to-[#020b1f] text-white"
      style={{ background: "linear-gradient(to top, #020E21 0%, #091F4E 50%, #020D23 100%)" }}
    >
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[40vh] sm:h-[55vh] md:h-[65vh] flex items-center justify-center px-2 sm:px-0">
        <div className="absolute inset-0">
          <Image
            src={home02 || "/placeholder.svg"}
            alt="Movie and TV show posters collage"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#132036] to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-2 sm:px-4 text-center">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-8">
            <span className="text-[#ffffff] font-bold text-xl sm:text-2xl md:text-4xl uppercase tracking-wider">
              Genre
            </span>
            <span className="text-[#ffffff] font-bold text-xl sm:text-2xl md:text-4xl">/</span>
            <span className="text-[#ffffff] font-bold text-xl sm:text-2xl md:text-4xl uppercase tracking-wider">
              {genreName}
            </span>
            {isGenreDisabled && (
              <span className="text-red-500 text-xs sm:text-sm ml-2">(Coming Soon)</span>
            )}
          </div>
        </div>
      </section>

      {/* Movies Section */}
      <div className="container mx-auto px-2 sm:px-4 md:px-8 lg:px-4 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <h3 className="text-lg sm:text-xl font-bold">Showing all {genreSlug === 'cartoon' ? 'cartoons' : 'movies'}</h3>
            <span className="text-gray-400 text-sm">({movies.length} {genreSlug === 'cartoon' ? 'cartoons' : 'movies'})</span>
          </div>
          <div className="flex items-center">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-gray-300 text-xs sm:text-sm border border-gray-700 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1D50A3] cursor-pointer hover:border-gray-600 transition-colors"
            >
              <option value="newest" className="bg-[#191C33]">Sort by: Newest</option>
              <option value="oldest" className="bg-[#191C33]">Sort by: Oldest</option>
              <option value="az" className="bg-[#191C33]">Sort by: A-Z</option>
              <option value="za" className="bg-[#191C33]">Sort by: Z-A</option>
            </select>
          </div>
        </div>

        {isGenreDisabled ? (
          <div className="text-center py-12">
            <Lock className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">Coming Soon</h3>
            <p className="text-gray-500">This genre is currently under development. Please check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {movies.map((movie) => (
              <div 
                key={movie.id}
                className="flex-shrink-0 w-40 sm:w-44 md:w-44 lg:w-48 cursor-pointer group mx-auto"
                onClick={() => handleMovieClick(movie)}
              >
                <div className="relative aspect-[9/14] rounded-lg overflow-hidden mb-2">
                  <Image
                    src={movie.image || "/placeholder.svg"}
                    alt={movie.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors">
                      <Play className="h-6 w-6 text-white" />
                    </button>
                  </div>
                  <div className="absolute top-2 right-2">
                    <button className="bg-black/50 hover:bg-black/70 p-1.5 rounded-full transition-colors">
                      <Bookmark className="h-4 w-4 text-white" />
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm font-medium text-white group-hover:text-[#1D50A3] transition-colors line-clamp-2">
                    {movie.title}
                  </p>
                  <div className="flex items-center space-x-2 text-[10px] sm:text-xs text-gray-400">
                    <span>{movie.year}</span>
                    <span>•</span>
                    <span>{movie.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-[10px] sm:text-xs text-gray-400">{movie.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 