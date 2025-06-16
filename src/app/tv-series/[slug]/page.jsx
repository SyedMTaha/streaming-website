"use client"

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Bookmark, ThumbsUp, Share, Star, Check } from 'lucide-react';
import Navbar from '../../../../components/navbarSearch';
import Footer from '../../../../components/footer';
import moviesData from '../../../data/movies.json';
import { auth } from '../../../../firebase';
import { getFirestore, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';

export default function TvSeriesDetailPage() {
  const params = useParams();
  const { slug } = params;
  const [series, setSeries] = useState(null);
  const [recommendedSeries, setRecommendedSeries] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [showShareSuccess, setShowShareSuccess] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);

  useEffect(() => {
    // Find the series by slug from the tv-series genre
    const foundSeries = moviesData['tv-series']?.find(s => s.slug === slug);
    setSeries(foundSeries);

    if (foundSeries) {
      // Get recommended series from the tv-series genre, excluding the current series
      const seriesList = moviesData['tv-series'] || [];
      const filteredSeries = seriesList.filter(s => s.slug !== slug);
      // Shuffle and take 5 series
      const shuffled = [...filteredSeries].sort(() => 0.5 - Math.random()).slice(0, 5);
      setRecommendedSeries(shuffled);
    }

    // Check wishlist status if user is logged in
    if (auth.currentUser) {
      checkWishlistStatus();
    }
  }, [slug]);

  const checkWishlistStatus = async () => {
    if (!series || !auth.currentUser) return;

    const db = getFirestore();
    const wishlistRef = doc(db, 'wishlists', auth.currentUser.uid, 'tv-series', series.id);
    
    try {
      const docSnap = await getDoc(wishlistRef);
      setIsInWishlist(docSnap.exists());
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const toggleWishlist = async () => {
    if (!series || !auth.currentUser) {
      // Redirect to login or show login prompt
      return;
    }

    setWishlistLoading(true);
    const db = getFirestore();
    const wishlistRef = doc(db, 'wishlists', auth.currentUser.uid, 'tv-series', series.id);

    try {
      if (isInWishlist) {
        await deleteDoc(wishlistRef);
        setIsInWishlist(false);
      } else {
        await setDoc(wishlistRef, {
          id: series.id,
          title: series.title,
          thumbnail: series.image,
          year: series.year,
          addedAt: new Date().toISOString()
        });
        setIsInWishlist(true);
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleShare = async () => {
    setShareLoading(true);
    try {
      const shareableUrl = `${window.location.origin}/tv-series/${series.slug}`;
      await navigator.clipboard.writeText(shareableUrl);
      setShowShareSuccess(true);
      setTimeout(() => {
        setShowShareSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Error sharing:', error);
    } finally {
      setShareLoading(false);
    }
  };

  if (!series) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen text-white bg-gradient-to-t from-[#020d1f] to-[#012256]">
      <Navbar />
      <section className="max-w-7xl mx-auto py-8 px-4 flex flex-col lg:flex-row gap-8">
        {/* Left Column: Series Details */}
        <div className="lg:w-1/3 bg-[#012256] rounded-lg p-6 shadow-xl py-4 backdrop-blur-sm flex-shrink-0 h-fit">
          <div className="relative mb-6 rounded-lg overflow-hidden">
            <Image
              src={series.innerImage || series.image}
              alt={`${series.title} thumbnail`}
              width={600}
              height={338}
              className="w-full h-auto object-cover aspect-video"
            />
          </div>
          <h1 className="text-4xl font-bold mb-2">{series.title}</h1>
          <div className="flex items-center space-x-4 mb-4 text-sm">
            <span className="bg-red-600 px-2 py-1 rounded">{series.rating}</span>
            <span>{series.year}</span>
            <span>{series.duration}</span>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <span>{series.score}</span>
            </div>
          </div>
          <p className="text-md text-gray-300 mb-6">{series.description}</p>
          
          <div className="text-sm text-gray-400 mb-6">
            <p className="mb-1"><span className="font-semibold text-white">Genre:</span> TV Series</p>
            <p className="mb-1"><span className="font-semibold text-white">Seasons:</span> {series.seasons || 1}</p>
          </div>

          <div className="flex space-x-4">
            <button 
              onClick={toggleWishlist}
              disabled={wishlistLoading}
              className={`${
                isInWishlist ? 'bg-[#1D50A3]' : 'bg-gray-600/80'
              } text-white px-4 py-3 rounded-lg font-semibold flex items-center space-x-2 hover:bg-blue-900 transition-colors relative overflow-hidden group`}
            >
              <Bookmark className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} />
              <span>{isInWishlist ? 'Added to Wishlist' : 'Add to Wishlist'}</span>
            </button>
            <button 
              onClick={handleShare}
              disabled={shareLoading}
              className="bg-gray-600/80 text-white px-4 py-3 rounded-lg font-semibold flex items-center space-x-2 hover:bg-blue-900 transition-colors relative overflow-hidden group"
            >
              {showShareSuccess ? (
                <>
                  <Check className="h-5 w-5 text-green-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Share className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span>Share</span>
                </>
              )}
              {showShareSuccess && (
                <div className="absolute inset-0 bg-[#1D50A3] animate-pulse" />
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Media Player and Episodes */}
        <div className="lg:w-2/3">
          {/* Media Player */}
          <div className="relative aspect-video rounded-lg overflow-hidden mb-6">
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                <button
                  onClick={() => setIsPlaying(true)}
                  className="bg-[#1D50A3] text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 hover:bg-blue-900 transition-colors"
                >
                  <Play className="h-5 w-5" />
                  <span>Play</span>
                </button>
              </div>
            )}
            {isPlaying && series.videoUrl ? (
              <iframe
                src={series.videoUrl}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            ) : (
              <Image
                src={series.innerImage || series.image}
                alt={`${series.title} thumbnail`}
                fill
                className="object-cover"
              />
            )}
          </div>

          {/* Season and Episode Selection */}
          <div className="bg-[#012256] rounded-lg p-6">
            <div className="flex space-x-4 mb-4">
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(Number(e.target.value))}
                className="bg-transparent text-gray-300 text-sm border border-gray-700 px-3 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1D50A3] cursor-pointer hover:border-gray-600 transition-colors"
              >
                {Array.from({ length: series.seasons || 1 }, (_, i) => (
                  <option key={i + 1} value={i + 1} className="bg-[#191C33]">
                    Season {i + 1}
                  </option>
                ))}
              </select>
              <select
                value={selectedEpisode}
                onChange={(e) => setSelectedEpisode(Number(e.target.value))}
                className="bg-transparent text-gray-300 text-sm border border-gray-700 px-3 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1D50A3] cursor-pointer hover:border-gray-600 transition-colors"
              >
                {Array.from({ length: series.episodesPerSeason || 10 }, (_, i) => (
                  <option key={i + 1} value={i + 1} className="bg-[#191C33]">
                    Episode {i + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>
      
      <Footer/>    
    </div>
  );
} 