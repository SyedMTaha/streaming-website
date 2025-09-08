"use client"

import React, { useEffect, useState, useRef } from "react"
import Link from "next/link"
import Image from 'next/image'
import { ChevronDown, Globe, Menu, X, User, LogOut, Heart, UserCircle, Search, Loader2 } from "lucide-react";
import logo from './../public/assets/images/logo/logo.png';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({ 
  subsets: ['latin'],
  display: 'swap',
});

export default function Navbar() {
  const [isGenreOpen, setIsGenreOpen] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [moviesCache, setMoviesCache] = useState(null)
  const [cacheTimestamp, setCacheTimestamp] = useState(null)
  const dropdownRef = React.useRef(null)
  const userDropdownRef = React.useRef(null)
  const searchRef = React.useRef(null)
  const searchDebounceRef = React.useRef(null)
  const timeoutRef = React.useRef(null)
  const router = useRouter()
  
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

  const genres = [
    { name: "Action", href: "/genre/action" },
    { name: "Adventure", href: "/genre/adventure" },
    { name: "Animation", href: "/genre/animation" },
    { name: "Biographical", href: "/genre/biographical" },
    { name: "Cartoon", href: "/genre/cartoon" },
    { name: "Comedy", href: "/genre/comedy" },
    { name: "Crime", href: "/genre/crime" },
    { name: "Documentary", href: "/genre/documentary" },
    { name: "Drama", href: "/genre/drama" },
    { name: "Family", href: "/genre/family" },
    { name: "Historical", href: "/genre/historical" },
    { name: "Independent", href: "/genre/independent" },
    { name: "Inspiration", href: "/genre/inspiration" },
    { name: "Martial Arts", href: "/genre/martial-arts" },
    { name: "Musical", href: "/genre/musical" },
    { name: "Mystery", href: "/genre/mystery" },
    { name: "News", href: "/genre/news" },
    { name: "Romance", href: "/genre/romance" },
    { name: "Sci-Fi", href: "/genre/sci-fi" },
    { name: "Sport", href: "/genre/sport" },
    { name: "Thriller", href: "/genre/thriller" },
    { name: "Tv-Series", href: "/tv-series" },
    { name: "War", href: "/genre/war" },
    { name: "Western", href: "/genre/western" },
  ]

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  // Preload movies cache on component mount
  useEffect(() => {
    const preloadMovies = async () => {
      try {
        const response = await fetch('/api/search?q=a');
        const data = await response.json();
        // This will trigger the server to cache movies
      } catch (error) {
        console.error('Error preloading movies:', error);
      }
    };
    preloadMovies();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsGenreOpen(false)
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserMenuOpen(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Handle mouse enter with delay
  function handleMouseEnter() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsGenreOpen(true)
  }

  // Handle mouse leave with delay
  function handleMouseLeave() {
    timeoutRef.current = setTimeout(() => {
      setIsGenreOpen(false)
    }, 150)
  }

  // Toggle dropdown for mobile/click
  function toggleGenreDropdown() {
    setIsGenreOpen(!isGenreOpen)
  }

  // Close mobile menu when link is clicked
  function closeMobileMenu() {
    setIsMobileMenuOpen(false)
    setIsGenreOpen(false)
    setMobileSearchOpen(false)
  }

  // Optimized search functionality with caching
  const searchMovies = async (query) => {
    if (!query || query.length < 2) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    setShowSearchResults(true)

    // Check if we have cached data and it's still valid
    const now = Date.now();
    if (moviesCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
      // Search in cached data (instant results)
      const filtered = moviesCache.filter(movie => 
        movie.title?.toLowerCase().includes(query.toLowerCase()) ||
        movie.description?.toLowerCase().includes(query.toLowerCase()) ||
        movie.genre?.toLowerCase().includes(query.toLowerCase())
      );
      
      // Sort by relevance
      const sorted = filtered.sort((a, b) => {
        const aTitle = a.title?.toLowerCase() || '';
        const bTitle = b.title?.toLowerCase() || '';
        const searchLower = query.toLowerCase();
        
        if (aTitle.startsWith(searchLower) && !bTitle.startsWith(searchLower)) return -1;
        if (!aTitle.startsWith(searchLower) && bTitle.startsWith(searchLower)) return 1;
        
        return 0;
      });
      
      setSearchResults(sorted.slice(0, 8));
    } else {
      // Fetch from optimized search API
      setIsSearching(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        if (data.success) {
          setSearchResults(data.results || []);
          
          // If this is the first search, cache all movies for future searches
          if (!moviesCache) {
            const allMoviesResponse = await fetch('/api/movies');
            const allMoviesData = await allMoviesResponse.json();
            if (allMoviesData.success && allMoviesData.movies) {
              setMoviesCache(allMoviesData.movies);
              setCacheTimestamp(Date.now());
            }
          }
        }
      } catch (error) {
        console.error('Error searching movies:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }
  }

  // Handle search input with debouncing
  const handleSearchInput = (e) => {
    const query = e.target.value
    setSearchQuery(query)

    // Clear previous timeout
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current)
    }

    // Set new timeout for debounced search (reduced to 50ms for ultra-fast response)
    searchDebounceRef.current = setTimeout(() => {
      searchMovies(query)
    }, 50)
  }

  // Handle content selection based on type
  const handleMovieSelect = (movie) => {
    setSearchQuery('')
    setSearchResults([])
    setShowSearchResults(false)
    setMobileSearchOpen(false)
    
    // Determine the correct route based on genre/type
    let route = '/movie/'; // default route
    
    if (movie.genre) {
      const genre = movie.genre.toLowerCase();
      
      if (genre === 'tv-series' || genre === 'tv series') {
        route = '/tv-series/';
      } else if (genre === 'cartoon' || genre === 'cartoons') {
        route = '/cartoon/';
      }
    }
    
    router.push(`${route}${movie.slug}`)
  }

  return (
    <nav className={`${montserrat.className} bg-gradient-to-b from-[#00112C] to-[#012256] py-4 w-full`}>
      <div className="px-4 sm:px-8 lg:px-8 max-w-full">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4 sm:space-x-8">
          {/* <Link href="/" className="flex items-center"> */}
         <div className="relative flex items-center justify-center h-8 w-18">
         <Image src={logo || "/placeholder.svg"} alt="INBV Logo" width={80} height={32} priority />
       </div>
        {/* </Link> */}

        {/* Remove Home from desktop navigation */}
        {/* <NavItem href="/home" label="Home" /> */}
       {/* Desktop Navigation */}
       <div className="hidden md:flex space-x-6">
              
       <NavItem href="/home" label="Home" />
              {/* Genre Dropdown */}
              <div
                className="relative"
                ref={dropdownRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={toggleGenreDropdown}
                  className="flex items-center space-x-1 text-white hover:text-blue-400 transition-colors duration-200 py-2"
                >
                  <span>Genre</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${isGenreOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isGenreOpen && (
                  <div className="absolute top-full left-0 mt-1 w-106 bg-[#1a1a3a] border border-blue-900/30 rounded-lg shadow-xl py-2 z-50 w-[90vh]">
                    <div className="grid grid-cols-4 gap-1 p-2">
                      {genres.map((genre) => (
                        <Link
                          key={genre.name}
                          href={genre.href}
                          className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-blue-600/20 rounded transition-colors duration-150"
                          onClick={() => setIsGenreOpen(false)}
                        >
                          {genre.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

          <NavItem href="/live" label="Live TV" />
          <NavItem href="/blog" label="Blog" />
          <NavItem href="/about" label="About Us" />
          <NavItem href="https://inbvnews.com/" label="News" />
          <NavItem href="https://inbvstv.com/" label="Shop" />
        </div>
        </div>


        
          {/* Search Bar - Hidden on mobile, shown on desktop */}
          <div className="hidden lg:flex flex-1 justify-end mx-6 xl:mx-8" >
            <div className="relative" ref={searchRef}>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchInput}
                onFocus={() => searchQuery && setShowSearchResults(true)}
                placeholder="Search Movies & Shows ..."
                className="bg-gradient-to-b from-[#00112C] to-[#012256] border border-white rounded-2xl pl-10 pr-4 py-1.5 text-sm placeholder-gray-400 focus:outline-none shadow-xl transition-all duration-200 focus:border-blue-400"
                style={{ width: "280px", color: "#A2ABC0" }}
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                {isSearching ? (
                  <Loader2 className="w-4 h-4 text-gray-300 animate-spin" />
                ) : (
                  <Search className="w-4 h-4 text-gray-300" />
                )}
              </div>
              
              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full mt-2 w-[400px] bg-[#1a1a3a] border border-blue-900/30 rounded-lg shadow-xl z-50 max-h-[500px] overflow-y-auto">
                  <div className="p-2">
                    {searchResults.map((movie) => (
                      <button
                        key={movie.id}
                        onClick={() => handleMovieSelect(movie)}
                        className="w-full flex items-start space-x-3 p-2 hover:bg-blue-600/20 rounded transition-colors duration-150 text-left"
                      >
                        {movie.image && (
                          <div className="flex-shrink-0 w-12 h-16 relative overflow-hidden rounded">
                            <Image
                              src={movie.image}
                              alt={movie.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-white truncate">{movie.title}</h4>
                          <p className="text-xs text-gray-400 mt-1">
                            <span className="inline-flex items-center">
                              {movie.genre === 'tv-series' && (
                                <span className="text-blue-400 mr-1">📺</span>
                              )}
                              {movie.genre === 'cartoon' && (
                                <span className="text-green-400 mr-1">🎨</span>
                              )}
                              {!['tv-series', 'cartoon'].includes(movie.genre) && (
                                <span className="text-purple-400 mr-1">🎬</span>
                              )}
                              {movie.genre?.replace(/-/g, ' ').charAt(0).toUpperCase() + movie.genre?.replace(/-/g, ' ').slice(1)} • {movie.year}
                            </span>
                          </p>
                          {movie.rating && (
                            <div className="flex items-center mt-1">
                              <span className="text-xs text-yellow-500">★</span>
                              <span className="text-xs text-gray-400 ml-1">{movie.rating}</span>
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* No Results Message */}
              {showSearchResults && searchQuery && searchResults.length === 0 && !isSearching && (
                <div className="absolute top-full mt-2 w-[400px] bg-[#1a1a3a] border border-blue-900/30 rounded-lg shadow-xl z-50 p-4">
                  <p className="text-gray-400 text-sm text-center">No movies found for "{searchQuery}"</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4 " >
            {/* Mobile search button */}
            <button 
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="lg:hidden text-white p-2 hover:text-blue-400 transition-colors"
            >
              {mobileSearchOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </button>

            

            <div className="hidden sm:flex items-center relative" ref={userDropdownRef}>
              {currentUser ? (
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors p-2 rounded-lg"
                >
                  <UserCircle className="h-7 w-7" />
                  {/* <span className="hidden sm:inline">{currentUser.displayName || 'User'}</span> */}
                </button>
              ) : (
                <Link href="/">
                  <button className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors p-2 rounded-lg">
                    <UserCircle className="h-5 w-5" />
                    <span className="hidden sm:inline">Sign In</span>
                  </button>
                </Link>
              )}

              {/* User Dropdown Menu */}
              {isUserMenuOpen && currentUser && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a3a] rounded-lg shadow-lg py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-700">
                    <p className="text-sm text-white font-medium truncate">
                      {currentUser.displayName || 'User'}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {currentUser.email}
                    </p>
                  </div>
                  <Link
                    href="/wishlist"
                    className="w-full flex items-center px-4 py-2 text-sm text-white hover:bg-blue-600/20 transition-colors"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    My Wishlist
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-sm text-white hover:bg-blue-600/20 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-blue-400 transition-colors md:hidden"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

         {/* Mobile Search Bar */}
         {mobileSearchOpen && (
          <div className="lg:hidden fixed inset-x-0 top-16 bg-[#1a1a3a]/95 border-t border-blue-900/30 z-50 p-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchInput}
                placeholder="Search Movies & Shows ..."
                className="w-full bg-gradient-to-b from-[#00112C] to-[#012256] border border-white rounded-2xl pl-10 pr-4 py-2 text-sm placeholder-gray-400 focus:outline-none shadow-xl"
                style={{ color: "#A2ABC0" }}
                autoFocus
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                {isSearching ? (
                  <Loader2 className="w-4 h-4 text-gray-300 animate-spin" />
                ) : (
                  <Search className="w-4 h-4 text-gray-300" />
                )}
              </div>
            </div>
            
            {/* Mobile Search Results */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="mt-4 max-h-[60vh] overflow-y-auto">
                {searchResults.map((movie) => (
                  <button
                    key={movie.id}
                    onClick={() => handleMovieSelect(movie)}
                    className="w-full flex items-start space-x-3 p-2 hover:bg-blue-600/20 rounded transition-colors duration-150 text-left"
                  >
                    {movie.image && (
                      <div className="flex-shrink-0 w-12 h-16 relative overflow-hidden rounded">
                        <Image
                          src={movie.image}
                          alt={movie.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-white truncate">{movie.title}</h4>
                      <p className="text-xs text-gray-400 mt-1">
                        <span className="inline-flex items-center">
                          {movie.genre === 'tv-series' && (
                            <span className="text-blue-400 mr-1">📺</span>
                          )}
                          {movie.genre === 'cartoon' && (
                            <span className="text-green-400 mr-1">🎨</span>
                          )}
                          {!['tv-series', 'cartoon'].includes(movie.genre) && (
                            <span className="text-purple-400 mr-1">🎬</span>
                          )}
                          {movie.genre?.replace(/-/g, ' ').charAt(0).toUpperCase() + movie.genre?.replace(/-/g, ' ').slice(1)} • {movie.year}
                        </span>
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            {/* No Results Message */}
            {showSearchResults && searchQuery && searchResults.length === 0 && !isSearching && (
              <div className="mt-4 p-4">
                <p className="text-gray-400 text-sm text-center">No movies found for "{searchQuery}"</p>
              </div>
            )}
          </div>
         )}

         {/* Mobile Navigation */}
         {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-16 bg-[#1a1a3a]/95 border-t border-blue-900/30 z-50 max-h-[80vh] overflow-y-auto">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <MobileNavItem href="/home" label="Home" onClick={closeMobileMenu} />

              {/* Mobile Genre Dropdown */}
              <div className="w-full">
                <button
                  onClick={toggleGenreDropdown}
                  className="flex items-center justify-between w-full px-3 py-2 text-white hover:text-blue-400 hover:bg-blue-600/10 rounded transition-colors duration-200"
                >
                  <span>Genre</span>
                  <ChevronDown
                    className={"h-4 w-4 transition-transform duration-200 " + (isGenreOpen ? "rotate-180" : "")}
                  />
                </button>

                {isGenreOpen && (
                  <div className="bg-[#1a1a3a] border border-blue-900/30 rounded-lg shadow-xl py-2 mx-2 mt-1 ">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2">
                    {genres.map((genre) => (
                      <button
                        key={genre.name}
                        className="block w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-blue-600/20 rounded transition-colors duration-150"
                        onClick={() => {
                          closeMobileMenu();
                          router.push(genre.href);
                        }}
                      >
                        {genre.name}
                      </button>
                    ))}
                    </div>
                  </div>
                )}
              </div>

              <MobileNavItem href="/live" label="Live TV" onClick={closeMobileMenu} />
              <MobileNavItem href="/blog" label="Blog" onClick={closeMobileMenu} />
              <MobileNavItem href="/about" label="About Us" onClick={closeMobileMenu} />
              <MobileNavItem href="https://inbvnews.com/" label="News" onClick={closeMobileMenu} />
              <MobileNavItem href="https://inbvstv.com/" label="Shop" onClick={closeMobileMenu} />

              <div className="pt-2 border-t border-navy-700">
              <button className="text-white flex items-center hover:bg-white/10 p-2 rounded transition-colors">
                <Globe className="h-4 w-4 mr-1" />
                EN
                <ChevronDown className="h-4 w-4 ml-1" />
              </button>
            </div>
            
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}



function NavItem({ href, label }) {
  const isExternal = href.startsWith('http');
  return (
    <Link
      href={href}
      className="text-white hover:text-blue-400 transition-colors duration-200 py-2"
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {label}
    </Link>
  );
}

function MobileNavItem({ href, label, onClick }) {
  const isExternal = href.startsWith('http');
  return (
    <Link
      href={href}
      className="block px-3 py-2 text-white hover:text-blue-400 hover:bg-blue-600/10 rounded transition-colors duration-200"
      onClick={onClick}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {label}
    </Link>
  );
}
