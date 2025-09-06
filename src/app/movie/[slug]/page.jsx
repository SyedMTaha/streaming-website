"use client"

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Bookmark, ThumbsUp, Share, Star, Check, User } from 'lucide-react';
import Navbar from '../../../../components/navbarSearch';
import Footer from '../../../../components/footer';
import FooterLand from '../../../../components/footerLanding';
import LandingNavbar from '../../../../components/navbarLanding';
import { auth, db } from '../../../../firebase';
import { getFirestore, doc, setDoc, deleteDoc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import logo from '../../../../public/assets/images/logo/logo.png';

// Define the slugs of the 9 free-to-watch movies from the landing page
const freeMovieSlugs = [
  'atomic-submarine',
  'pursued',
  'bad-and-the-beautiful',
  'stage-coach',
  'state-secret',
  'check-and-double-check',
  'his-girl-friday',
  'the-lost-world',
  'the-outlaw'
];

// Simplified navbar for free movies
const FreeMovieNavbar = () => (
  <div className="absolute top-0 left-0 right-0 z-50">
    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent"></div>
    <nav className="relative py-4 w-full">
      <div className="container mx-auto px-4 sm:px-8 lg:px-16">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <div className="relative flex items-center justify-center h-10 w-24">
              <Image src={logo || "/placeholder.svg"} alt="INBV Logo" width={100} height={40} priority />
            </div>
          </Link>
          <Link href="/auth/login" className="text-white hover:text-blue-300 transition-colors">
            <User className="h-7 w-7" />
          </Link>
        </div>
      </div>
    </nav>
  </div>
);

export default function MovieDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { slug } = params;
  const isFreeMovie = freeMovieSlugs.includes(slug);
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // This determines if the simplified "free" layout should be shown.
  // It's true only if the movie is free AND the user is not logged in.
  const shouldShowFreeLayout = isFreeMovie && !isAuthenticated;

  const [movie, setMovie] = useState(null);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [showShareSuccess, setShowShareSuccess] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const scrollRef = useRef(null);
  const locomotiveScroll = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
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
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        // Only redirect if the movie is NOT free
        if (!isFreeMovie) {
          const redirectUrl = searchParams.get('redirect') || `/movie/${slug}`;
          router.push(`/auth/login?redirect=${encodeURIComponent(redirectUrl)}`);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [slug, isFreeMovie, router, searchParams]);

  useEffect(() => {
    // Fetch movie from Firebase
    const fetchMovie = async () => {
      try {
        console.log('Fetching movie with slug:', slug);
        
        // Query Firebase for the movie with this slug
        const moviesQuery = query(
          collection(db, 'movies'),
          where('slug', '==', slug)
        );
        const moviesSnapshot = await getDocs(moviesQuery);
        
        console.log('Query results:', moviesSnapshot.size, 'movies found');
        
        if (!moviesSnapshot.empty) {
          const foundMovie = moviesSnapshot.docs[0].data();
          setMovie(foundMovie);
          
          // Get recommended movies from the same genre
          if (foundMovie.genre) {
            const genreQuery = query(
              collection(db, 'movies'),
              where('genre', '==', foundMovie.genre)
            );
            const genreSnapshot = await getDocs(genreQuery);
            
            const genreMovies = genreSnapshot.docs.map(doc => doc.data());
            const filteredMovies = genreMovies.filter(m => m.slug !== slug);
            // Shuffle and take 5 movies
            const shuffled = [...filteredMovies].sort(() => 0.5 - Math.random()).slice(0, 5);
            setRecommendedMovies(shuffled);
          }
        } else {
          console.log('Movie not found in Firebase');
          setMovie(null);
        }
      } catch (error) {
        console.error('Error fetching movie from Firebase:', error);
        setMovie(null);
      }
    };
    
    fetchMovie();
  }, [slug, isAuthenticated]);

  useEffect(() => {
    // This effect runs whenever the 'movie' object changes.
    // It tells Locomotive Scroll to update its dimensions after the content has rendered.
    if (movie) {
      if (locomotiveScroll.current) {
        // A small timeout ensures the DOM has fully updated before recalculating.
        setTimeout(() => {
          locomotiveScroll.current.update();
        }, 500);
      }
      
      // Check wishlist status after movie is loaded
      if (isAuthenticated) {
        checkWishlistStatus();
      }
    }
  }, [movie, isAuthenticated]);

  const checkWishlistStatus = async () => {
    if (!movie || !auth.currentUser) return;

    const db = getFirestore();
    const wishlistRef = doc(db, 'wishlists', auth.currentUser.uid, 'movies', movie.id);
    
    try {
      const docSnap = await getDoc(wishlistRef);
      setIsInWishlist(docSnap.exists());
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const toggleWishlist = async () => {
    // This button is not rendered on the free layout, so no extra check is needed here.
    if (!movie || !auth.currentUser) {
      return;
    }

    setWishlistLoading(true);
    const db = getFirestore();
    const wishlistRef = doc(db, 'wishlists', auth.currentUser.uid, 'movies', movie.id);

    try {
      if (isInWishlist) {
        await deleteDoc(wishlistRef);
      } else {
        await setDoc(wishlistRef, {
          id: movie.id,
          title: movie.title,
          thumbnail: movie.image,
          year: movie.year,
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
      const shareableUrl = `${window.location.origin}/movie/${movie.slug}`;
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

  // Don't render the page if it's still loading or if auth status is not determined yet.
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-t from-[#020d1f] to-[#012256] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gradient-to-t from-[#020d1f] to-[#012256] flex items-center justify-center">
        <div className="text-white text-xl">Movie not found</div>
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
      {shouldShowFreeLayout ? <LandingNavbar /> : <Navbar />}

      {/* Main Content */}
      <section className="max-w-7xl mx-auto py-8 px-4 flex flex-col lg:flex-row gap-8 pt-24">
        {/* Left Column: Movie Details */}
        <div className="lg:w-1/3 bg-[#012256] rounded-lg p-6 shadow-xl py-4 backdrop-blur-sm flex-shrink-0 h-fit">
          <div className="relative mb-6 rounded-lg overflow-hidden">
            <Image
              src={movie.innerImage || movie.image}
              alt={`${movie.title} thumbnail`}
              width={600}
              height={338}
              className="w-full h-auto object-cover aspect-video"
            />
          </div>
          <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
          <div className="flex items-center space-x-4 mb-4 text-sm">
            <span className="bg-red-600 px-2 py-1 rounded">{movie.rating}</span>
            <span>{movie.year}</span>
            <span>{movie.duration}</span>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <span>{movie.score}</span>
            </div>
          </div>
          <p className="text-md text-gray-300 mb-6">{movie.description}</p>
          
          <div className="text-sm text-gray-400 mb-6">
            <p className="mb-1"><span className="font-semibold text-white">Genre:</span> {movie.genre}</p>
          </div>

          {!shouldShowFreeLayout && (
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
          )}
        </div>

        {/* Right Column: Video Player or Thumbnail */}
        <div className="lg:w-2/3 relative aspect-video rounded-lg overflow-hidden">
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
          {isPlaying && movie.videoUrl ? (
            <iframe
              src={movie.videoUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          ) : (
            <Image
              src={movie.innerImage || movie.image}
              alt={`${movie.title} thumbnail`}
              fill
              className="object-cover"
            />
          )}
        </div>
      </section>
      
      

      {shouldShowFreeLayout ? <FooterLand /> : <Footer />}
    </div>
  );
} 