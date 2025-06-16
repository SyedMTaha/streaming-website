"use client"

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play, Bookmark, ThumbsUp, Share, Star, Lock } from "lucide-react";
import Navbar from '../../../../components/navbarSearch';
import home02 from '../../../../public/assets/images/background/homePage05.jpg';
import moviesData from '../../../../src/data/movies.json';

// Add disabled genres here
const DISABLED_GENRES = ['adventure', 'animation', 'biographical', 'crime', 'documentary','family', 'historical', 'horror', 'inspiration', 'martial-arts', 'musical', 'news', 'romance', 'sport', 'war'];

export default function GenrePage() {
  const params = useParams();
  const router = useRouter();
  const scrollContainerRef = useRef(null);
  const [sortBy, setSortBy] = useState('newest');
  const genreSlug = params.slug;
  const movies = moviesData[genreSlug] || [];
  const [loading, setLoading] = useState(false);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#020b1f] via-[#0a2151] to-[#020b1f] text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020b1f] via-[#0a2151] to-[#020b1f] text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[65vh] flex items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src={home02 || "/placeholder.svg"}
            alt="Movie and TV show posters collage"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#132036] to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-4 mb-30">
            <span className="text-[#ffffff] font-bold text-3xl md:text-4xl lg:text-4xl uppercase tracking-wider">
              Genre
            </span>
            <span className="text-[#ffffff] font-bold text-3xl md:text-4xl lg:text-4xl">/</span>
            <span className="text-[#ffffff] font-bold text-3xl md:text-4xl lg:text-4xl uppercase tracking-wider">
              {genreName}
            </span>
            {isGenreDisabled && (
              <span className="text-red-500 text-sm ml-2">(Coming Soon)</span>
            )}
          </div>
        </div>
      </section>

      {/* Movies Section */}
      <div className="container mx-auto px-4 md:px-8 lg:px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-bold">Showing all {genreSlug === 'cartoon' ? 'cartoons' : 'movies'}</h3>
            <span className="text-gray-400">({movies.length} {genreSlug === 'cartoon' ? 'cartoons' : 'movies'})</span>
          </div>
          
          <div className="flex space-x-2 ml-105">
            <button
              onClick={scrollLeft}
              className="bg-gray-700/50 hover:bg-gray-700 text-white p-2 rounded-full transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={scrollRight}
              className="bg-gray-700/50 hover:bg-gray-700 text-white p-2 rounded-full transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-gray-300 text-sm border border-gray-700 px-3 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1D50A3] cursor-pointer hover:border-gray-600 transition-colors"
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
          <div 
            ref={scrollContainerRef} 
            className="flex space-x-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {movies.map((movie) => (
              <div 
                key={movie.id}
                className="flex-shrink-0 w-48 cursor-pointer group"
                onClick={() => handleMovieClick(movie)}
              >
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
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
                  <p className="text-sm font-medium text-white group-hover:text-[#1D50A3] transition-colors">
                    {movie.title}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <span>{movie.year}</span>
                    <span>•</span>
                    <span>{movie.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs text-gray-400">{movie.rating}</span>
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