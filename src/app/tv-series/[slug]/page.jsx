"use client"

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Bookmark, Share, Star, Check } from 'lucide-react';
import Navbar from '../../../../components/navbarSearch';
import Footer from '../../../../components/footer';
import { auth, db } from '../../../../firebase';
import { getFirestore, doc, setDoc, deleteDoc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';

export default function TVSeriesDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { slug } = params;
  const [series, setSeries] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [recommendedSeries, setRecommendedSeries] = useState([]);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [showShareSuccess, setShowShareSuccess] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const scrollRef = useRef(null);
  const locomotiveScroll = useRef(null);

  useEffect(() => {
    if (!isLoading && isAuthenticated && scrollRef.current) {
      import('locomotive-scroll').then((locomotiveScrollModule) => {
        locomotiveScroll.current = new locomotiveScrollModule.default({
          el: scrollRef.current,
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
        if (series) {
          checkWishlistStatus();
        }
      } else {
        setIsAuthenticated(false);
        // Redirect to login if not authenticated
        const redirectUrl = searchParams.get('redirect') || `/tv-series/${slug}`;
        router.push(`/auth/login?redirect=${encodeURIComponent(redirectUrl)}`);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [series, slug, router, searchParams]);

  useEffect(() => {
    const fetchSeriesData = async () => {
      setDataLoading(true);
      try {
        console.log('Fetching series with slug:', slug);
        
        // Find the series by slug from Firebase
        const seriesQuery = query(
          collection(db, 'movies'),
          where('genre', '==', 'tv-series'),
          where('slug', '==', slug)
        );
        const seriesSnapshot = await getDocs(seriesQuery);
        
        console.log('Series query results:', seriesSnapshot.size, 'documents found');
        
        if (!seriesSnapshot.empty) {
          const foundSeries = seriesSnapshot.docs[0].data();
          console.log('Found series:', foundSeries);
          setSeries(foundSeries);

          // Get episodes directly from the series document
          if (foundSeries.episodes && Array.isArray(foundSeries.episodes)) {
            console.log('Found episodes in series document:', foundSeries.episodes.length);
            setEpisodes(foundSeries.episodes);
          } else {
            console.log('No episodes found in series document');
            setEpisodes([]);
          }

          // Get recommended series from Firebase, excluding the current series
          const recommendedQuery = query(
            collection(db, 'movies'),
            where('genre', '==', 'tv-series')
          );
          const recommendedSnapshot = await getDocs(recommendedQuery);
          const allSeries = recommendedSnapshot.docs.map(doc => doc.data());
          const filteredSeries = allSeries.filter(s => s.slug !== slug);
          // Shuffle and take 5 series
          const shuffled = [...filteredSeries].sort(() => 0.5 - Math.random()).slice(0, 5);
          setRecommendedSeries(shuffled);
        } else {
          console.log('No series found in Firebase');
          setSeries(null);
          setEpisodes([]);
          setRecommendedSeries([]);
        }
      } catch (error) {
        console.error('Error fetching series data:', error);
        setSeries(null);
        setEpisodes([]);
        setRecommendedSeries([]);
      } finally {
        setDataLoading(false);
      }
    };

    if (slug) {
      fetchSeriesData();
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
        console.log('Removing from wishlist:', wishlistRef.path);
        await deleteDoc(wishlistRef);
      } else {
        console.log('Adding to wishlist:', wishlistRef.path, series);
        await setDoc(wishlistRef, {
          id: series.id,
          title: series.title,
          thumbnail: series.image,
          year: series.year,
          addedAt: new Date().toISOString()
        });
      }
      await checkWishlistStatus();
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

  // Show loading state while checking authentication or fetching data
  if (isLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-t from-[#020d1f] to-[#012256] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render the page if not authenticated (will redirect to login)
  if (!isAuthenticated) {
    return null;
  }

  if (!series) {
    return (
      <div className="min-h-screen bg-gradient-to-t from-[#020d1f] to-[#012256] flex items-center justify-center">
        <div className="text-white text-xl">Series not found</div>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      data-scroll-container
      className="min-h-screen text-white bg-gradient-to-t from-[#020d1f] to-[#012256]"
    >
      <Navbar />
      <section className="max-w-7xl mx-auto py-8 px-4">
        {/* Series Header */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
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
            </div>

            <div className="flex space-x-4">
              <button 
                onClick={toggleWishlist}
                disabled={isInWishlist || wishlistLoading}
                className={`${
                  isInWishlist ? 'bg-[#1D50A3] cursor-not-allowed' : 'bg-gray-600/80'
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

          {/* Episodes Grid */}
          <div className="lg:w-2/3">
            <h2 className="text-2xl font-bold mb-6">Episodes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {episodes.map((episode) => (
                <Link
                  key={episode.id}
                  href={`/tv-series/${slug}/episode/${episode.slug}`}
                  className="bg-[#012256] rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-300"
                >
                  <div className="relative aspect-video">
                    <Image
                      src={episode.thumbnail || series.image}
                      alt={episode.title}
                      width={400}
                      height={225}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="bg-[#1D50A3] text-white px-4 py-2 rounded-lg font-semibold">
                        Watch Now
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{episode.title}</h3>
                    {/* <p className="text-sm text-gray-400">{episode.description}</p> */}
                    <p className="text-sm text-gray-500 mt-2">{episode.duration}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended Series */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Recommended Series</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedSeries.map((series) => (
              <Link
                key={series.id}
                href={`/tv-series/${series.slug}`}
                className="bg-[#012256] rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-300"
              >
                <div className="relative aspect-video">
                  <Image
                    src={series.image}
                    alt={series.title}
                    width={400}
                    height={225}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">{series.title}</h3>
                  <p className="text-sm text-gray-400">{series.year}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
} 