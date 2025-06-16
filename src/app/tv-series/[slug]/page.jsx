"use client"

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Share2, Play } from 'lucide-react';
import Navbar from '../../../../components/navbarSearch';
import Footer from '../../../../components/footer';
import moviesData from '../../../data/movies.json';
import tvEpisodesData from '../../../data/tvEpisodes.json';

export default function TVSeriesPage() {
  const params = useParams();
  const { slug } = params;
  const [series, setSeries] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [recommendedSeries, setRecommendedSeries] = useState([]);

  useEffect(() => {
    // Find the TV series by slug
    const foundSeries = moviesData['tv-series']?.find(s => s.slug === slug);
    setSeries(foundSeries);

    // Get episodes for this series
    if (foundSeries && tvEpisodesData[slug]) {
      setEpisodes(tvEpisodesData[slug].episodes);
    }

    // Get recommended TV series
    const recommended = moviesData['tv-series']
      ?.filter(s => s.slug !== slug)
      .slice(0, 6);
    setRecommendedSeries(recommended || []);

    // Check if series is in wishlist
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setIsInWishlist(wishlist.some(item => item.id === foundSeries?.id));
  }, [slug]);

  const toggleWishlist = () => {
    if (!series) return;
    
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const newWishlist = isInWishlist
      ? wishlist.filter(item => item.id !== series.id)
      : [...wishlist, { id: series.id, title: series.title, type: 'tv-series' }];
    
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    setIsInWishlist(!isInWishlist);
  };

  if (!series) {
    return (
      <div className="min-h-screen text-white bg-gradient-to-t from-[#020d1f] to-[#012256] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading series...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white bg-gradient-to-t from-[#020d1f] to-[#012256]">
      <Navbar />
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Series Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          {/* Series Poster */}
          <div className="w-full md:w-1/3">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
              <Image
                src={series.image}
                alt={series.title}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Series Info */}
          <div className="w-full md:w-2/3">
            <h1 className="text-4xl font-bold mb-4">{series.title}</h1>
            <p className="text-gray-300 mb-6">{series.description}</p>
            
            <div className="flex flex-wrap gap-4 mb-6">
              {series.genres?.map((genre, index) => (
                <span
                  key={index}
                  className="bg-[#1D50A3] text-white px-3 py-1 rounded-full text-sm"
                >
                  {genre}
                </span>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={toggleWishlist}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  isInWishlist
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-[#1D50A3] hover:bg-blue-900'
                } transition-colors`}
              >
                <Heart className="h-5 w-5" />
                {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1D50A3] hover:bg-blue-900 transition-colors">
                <Share2 className="h-5 w-5" />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Episodes Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Episodes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {episodes.map((episode) => (
              <Link
                key={episode.id}
                href={`/tv-series/${slug}/episode/${episode.slug}`}
                className="group"
              >
                <div className="bg-[#012256] rounded-lg overflow-hidden hover:bg-[#1D50A3] transition-colors">
                  <div className="relative aspect-video">
                    <Image
                      src={episode.thumbnail}
                      alt={episode.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                      <Play className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{episode.title}</h3>
                    <p className="text-sm text-gray-300 mb-2 line-clamp-2">
                      {episode.description}
                    </p>
                    <p className="text-sm text-gray-400">{episode.duration}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recommended TV Series */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Recommended TV Series</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {recommendedSeries.map((item) => (
              <Link
                key={item.id}
                href={`/tv-series/${item.slug}`}
                className="group"
              >
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-sm font-semibold line-clamp-2">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 