"use client"

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Bookmark, Share, Star, Check } from 'lucide-react';
import Navbar from '../../../../components/navbarSearch';
import Footer from '../../../../components/footer';
import moviesData from '../../../data/movies.json';
import episodesData from '../../../data/cartoonEpisodes.json';
import { auth } from '../../../../firebase';
import { getFirestore, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';

export default function CartoonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { slug } = params;
  const [cartoon, setCartoon] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [recommendedCartoons, setRecommendedCartoons] = useState([]);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [showShareSuccess, setShowShareSuccess] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const scrollRef = React.useRef(null);
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
        if (cartoon) {
          checkWishlistStatus();
        }
      } else {
        setIsAuthenticated(false);
        // Redirect to login if not authenticated
        const redirectUrl = searchParams.get('redirect') || `/cartoon/${slug}`;
        router.push(`/auth/login?redirect=${encodeURIComponent(redirectUrl)}`);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [cartoon, slug, router, searchParams]);

  useEffect(() => {
    // Find the cartoon by slug from the cartoon genre
    const foundCartoon = moviesData['cartoon']?.find(c => c.slug === slug);
    setCartoon(foundCartoon);

    // Get episodes for this cartoon
    if (foundCartoon) {
      const cartoonEpisodes = episodesData[slug]?.episodes || [];
      setEpisodes(cartoonEpisodes);

      // Get recommended cartoons from the cartoon genre, excluding the current cartoon
      const cartoonMovies = moviesData['cartoon'] || [];
      const filteredCartoons = cartoonMovies.filter(c => c.slug !== slug);
      // Shuffle and take 5 cartoons
      const shuffled = [...filteredCartoons].sort(() => 0.5 - Math.random()).slice(0, 5);
      setRecommendedCartoons(shuffled);
    }
  }, [slug]);

  const checkWishlistStatus = async () => {
    if (!cartoon || !auth.currentUser) return;

    const db = getFirestore();
    const wishlistRef = doc(db, 'wishlists', auth.currentUser.uid, 'cartoons', cartoon.id);
    
    try {
      const docSnap = await getDoc(wishlistRef);
      setIsInWishlist(docSnap.exists());
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const toggleWishlist = async () => {
    if (!cartoon || !auth.currentUser) {
      // Redirect to login or show login prompt
      return;
    }

    setWishlistLoading(true);
    const db = getFirestore();
    const wishlistRef = doc(db, 'wishlists', auth.currentUser.uid, 'cartoons', cartoon.id);

    try {
      if (isInWishlist) {
        await deleteDoc(wishlistRef);
      } else {
        await setDoc(wishlistRef, {
          id: cartoon.id,
          title: cartoon.title,
          thumbnail: cartoon.image,
          year: cartoon.year,
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
      const shareableUrl = `${window.location.origin}/cartoon/${cartoon.slug}`;
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

  if (!cartoon) {
    return (
      <div className="min-h-screen bg-gradient-to-t from-[#020d1f] to-[#012256] flex items-center justify-center">
        <div className="text-white text-xl">Cartoon not found</div>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      data-scroll-container
      className="min-h-screen text-white bg-gradient-to-t from-[#020d1f] to-[#012256]"
      style={{ background: "linear-gradient(to top, #020E21 0%, #091F4E 50%, #020D23 100%)" }}
    >
      <Navbar />
      <section className="max-w-7xl mx-auto py-8 px-4">
        {/* Series Header */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          <div className="lg:w-1/3 bg-[#012256] rounded-lg p-6 shadow-xl py-4 backdrop-blur-sm flex-shrink-0 h-fit">
            <div className="relative mb-6 rounded-lg overflow-hidden">
              <Image
                src={cartoon.innerImage || cartoon.image}
                alt={`${cartoon.title} thumbnail`}
                width={600}
                height={338}
                className="w-full h-auto object-cover aspect-video"
              />
            </div>
            <h1 className="text-4xl font-bold mb-2">{cartoon.title}</h1>
            <div className="flex items-center space-x-4 mb-4 text-sm">
              <span className="bg-red-600 px-2 py-1 rounded">{cartoon.rating}</span>
              <span>{cartoon.year}</span>
              <span>{cartoon.duration}</span>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <span>{cartoon.score}</span>
              </div>
            </div>
            <p className="text-md text-gray-300 mb-6">{cartoon.description}</p>
            
            <div className="text-sm text-gray-400 mb-6">
              <p className="mb-1"><span className="font-semibold text-white">Genre:</span> Cartoon</p>
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

          {/* Episodes Grid */}
          <div className="lg:w-2/3">
            <h2 className="text-2xl font-bold mb-6">Episodes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {episodes.map((episode) => (
                <Link
                  key={episode.id}
                  href={`/cartoon/${slug}/episode/${episode.slug}`}
                  className="bg-[#012256] rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-300"
                >
                  <div className="relative aspect-video">
                    <Image
                      src={episode.thumbnail || cartoon.image}
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
                    <p className="text-sm text-gray-400">{episode.description}</p>
                    <p className="text-sm text-gray-500 mt-2">{episode.duration}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended Cartoons */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Recommended Cartoons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedCartoons.map((cartoon) => (
              <Link
                key={cartoon.id}
                href={`/cartoon/${cartoon.slug}`}
                className="bg-[#012256] rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-300"
              >
                <div className="relative aspect-video">
                  <Image
                    src={cartoon.image}
                    alt={cartoon.title}
                    width={400}
                    height={225}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">{cartoon.title}</h3>
                  <p className="text-sm text-gray-400">{cartoon.year}</p>
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