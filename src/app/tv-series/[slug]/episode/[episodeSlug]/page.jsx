"use client"

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Play, ArrowLeft } from 'lucide-react';
import Navbar from '../../../../../../components/navbarSearch';
import Footer from '../../../../../../components/footer';
import moviesData from '../../../../../data/movies.json';
import episodesData from '../../../../../data/tvEpisodes.json';
import { auth } from '../../../../../../firebase';

export default function EpisodePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { slug, episodeSlug } = params;
  const [series, setSeries] = useState(null);
  const [episode, setEpisode] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        // Redirect to login if not authenticated
        const redirectUrl = searchParams.get('redirect') || `/tv-series/${slug}/episode/${episodeSlug}`;
        router.push(`/auth/login?redirect=${encodeURIComponent(redirectUrl)}`);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [slug, episodeSlug, router, searchParams]);

  useEffect(() => {
    // Find the series by slug
    const foundSeries = moviesData['tv-series']?.find(s => s.slug === slug);
    setSeries(foundSeries);

    // Get episode data from episodes.json
    if (foundSeries && episodesData[slug]) {
      const foundEpisode = episodesData[slug].episodes.find(ep => ep.slug === episodeSlug);
      setEpisode(foundEpisode);
    }
  }, [slug, episodeSlug]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-t from-[#020d1f] to-[#012256] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Don't render the page if not authenticated (will redirect to login)
  if (!isAuthenticated) {
    return null;
  }

  if (!series || !episode) {
    return (
      <div className="min-h-screen text-white bg-gradient-to-t from-[#020d1f] to-[#012256] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading episode...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white bg-gradient-to-t from-[#020d1f] to-[#012256]">
      <Navbar />
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Back Button */}
        <Link 
          href={`/tv-series/${slug}`}
          className="inline-flex items-center text-gray-300 hover:text-white mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Series
        </Link>

        {/* Episode Title */}
        <h1 className="text-3xl font-bold mb-4">
          {series.title} - {episode.title}
        </h1>

        {/* Video Player Section */}
        <div className="relative aspect-video rounded-lg overflow-hidden bg-black mb-8">
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
              <button
                onClick={() => setIsPlaying(true)}
                className="bg-[#1D50A3] text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 hover:bg-blue-900 transition-colors"
              >
                <Play className="h-5 w-5" />
                <span>Play Episode</span>
              </button>
            </div>
          )}
          {isPlaying && episode.videoUrl ? (
            <iframe
              src={episode.videoUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          ) : (
            <Image
              src={episode.thumbnail || series.image}
              alt={episode.title}
              width={1920}
              height={1080}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Episode Description */}
        <div className="bg-[#012256] rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Episode Description</h2>
          <p className="text-gray-300">{episode.description}</p>
          <div className="mt-4 text-sm text-gray-400">
            <p>Duration: {episode.duration}</p>
          </div>
        </div>

        {/* Episode Navigation */}
        <div className="flex justify-between items-center">
          {episode.previousEpisode && (
            <Link
              href={`/tv-series/${slug}/episode/${episode.previousEpisode}`}
              className="bg-[#1D50A3] text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors"
            >
              Previous Episode
            </Link>
          )}
          {episode.nextEpisode && (
            <Link
              href={`/tv-series/${slug}/episode/${episode.nextEpisode}`}
              className="bg-[#1D50A3] text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors"
            >
              Next Episode
            </Link>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
} 