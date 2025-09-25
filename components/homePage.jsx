"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Play, Plus, Calendar } from "lucide-react"
// Import images using public folder paths
const home03 = '/assets/images/background/homePage03.png';
const logo5 = '/assets/images/logo/logo.png';
const TM = '/assets/images/logo/TM-2.png';
const news1 = '/assets/images/home/news1.jpg';
const news2 = '/assets/images/home/news2.jpg';
const news3 = '/assets/images/home/news3.jpg';
const home45 = '/assets/images/home/home45.jpg';
const home48 = '/assets/images/home/home48.png';
const home49 = '/assets/images/home/home49.jpeg';
const series01 = '/assets/images/series/series1.jpg';
const series02 = '/assets/images/series/series2.jpg';
const series03 = '/assets/images/series/series3.jpg';
const series04 = '/assets/images/series/series4.jpg';
const series05 = '/assets/images/series/series5.jpg';
const series06 = '/assets/images/series/series6.jpg';
const HisFriday = '/assets/images/movies/drama/drama6.jpeg';
const Suddenly = '/assets/images/movies/drama/drama4.jpg';
const Stranger = '/assets/images/movies/drama/drama5.jpg';
const Outlaw = '/assets/images/movies/drama/drama11.jpeg';
const Lost = '/assets/images/movies/sci-fi/scifi7.jpeg';
const Last = '/assets/images/movies/sci-fi/scifi4.jpg';
const Pursued = '/assets/images/movies/action/action7.jpg';
const Bad = '/assets/images/movies/action/action3.jpg';
const comedy2 = '/assets/images/movies/comedy/comedy2.jpeg';
const drama1 = '/assets/images/movies/drama/drama1.jpeg';
const drama2 = '/assets/images/movies/drama/drama2.jpeg';
const mystery1 = '/assets/images/movies/mystery/mystery1.jpg';
import { Facebook, Twitter, Youtube, X, Instagram } from "lucide-react"
import Footer from "./footer";
import moviesData from '../src/data/movies.json';

const { upcomingMovies } = moviesData;

export default function DashboardPage() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoadingBlogs, setIsLoadingBlogs] = useState(true);

  // Fetch blog posts for Top News section
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch('/api/blog?limit=3');
        const data = await response.json();
        if (data.success) {
          setBlogPosts(data.posts);
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setIsLoadingBlogs(false);
      }
    };

    fetchBlogPosts();
  }, []);

  const handleScroll = (direction, containerId) => {
    const container = document.getElementById(containerId);
    if (container) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const XIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);


  return (

    // Testing the git repo for cloning work

    <div className="min-h-screen bg-[#020b1f] text-white relative scroll-behaviour: smooth" style={{background: "linear-gradient(to top, #020E21 0%, #091F4E 50%, #020D23 100%)",}}>
      {/* Top-to-bottom Gradient Overlay */}
     
      {/* Hero Section */}
      <section className="relative h-[55vh] sm:h-[40vh] md:h-[50vh] lg:h-[80vh] flex items-center">
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <video
            src="/assets/images/home/homeVideo.mp4"
            autoPlay
            loop
            muted
            playsInline
            poster="/assets/images/home/homePage02.jpg"
            className="w-full h-full object-cover"
          />
          {/* Optionally, you can add a gradient overlay here if you want */}
        </div>

        {/* Social Media Icons */}
        <div className="absolute bottom-2 right-0 z-20 flex flex-row md:flex-row gap-2 md:gap-3 px-2 md:px-0">
          
          {/* TikTok */}
          <a 
            href="https://www.tiktok.com/@inbvtv?_t=ZS-8xAgUZayDgm&_r=1" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-icon-container group"
          >
          <div className="social-icon-container group">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-900 group-hover:bg-white transform skew-x-12 flex items-center justify-center cursor-pointer transition-all duration-300 relative overflow-hidden">
              <svg 
                className="w-5 h-5 text-white group-hover:text-blue-900 transform -skew-x-12 transition-colors duration-300" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </div>
          </div>
          </a>

          {/* Facebook */}
          <a 
            href="https://www.facebook.com/share/1P7zFL7e2z/?mibextid=wwXIfr" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-icon-container group"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-900 group-hover:bg-white transform skew-x-12 flex items-center justify-center cursor-pointer transition-all duration-300 relative overflow-hidden">
              <Facebook className="w-5 h-5 text-white group-hover:text-blue-900 transform -skew-x-12 transition-colors duration-300" />
            </div>
          </a>
          
          {/* Instagram */}
          <a 
            href="https://www.instagram.com/inbv_tv?igsh=MWg2bDgxbzNzaWVkcg==" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-icon-container group"
          >
          <div className="social-icon-container group">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-900 group-hover:bg-white transform skew-x-12 flex items-center justify-center cursor-pointer transition-all duration-300 relative overflow-hidden">
              <Instagram className="w-5 h-5 text-white group-hover:text-blue-900 transform -skew-x-12 transition-colors duration-300" />
            </div>
          </div>
          </a>
          
          {/* X (Twitter) */}
          <a 
            href="https://x.com/inbv_tv?s=21" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-icon-container group"
          >
          <div className="social-icon-container group">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-900 group-hover:bg-white transform skew-x-12 flex items-center justify-center cursor-pointer transition-all duration-300 relative overflow-hidden">
              <XIcon className="w-5 h-5 text-white group-hover:text-blue-900 transform -skew-x-12 transition-colors duration-300" />
            </div>
          </div>
          </a>
          
          {/* YouTube */}
          <a 
            href="https://m.youtube.com/@inbvtv" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-icon-container group"
          >
          <div className="social-icon-container group">
            <div 
              className="-ml-1 w-10 h-10 md:w-12 md:h-12 bg-blue-900 group-hover:bg-white flex items-center justify-center cursor-pointer transition-all duration-300 relative overflow-hidden"
              style={{clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 20% 100%)'}}
            >
              <Youtube className="ml-2 w-5 h-5 text-white group-hover:text-blue-900 transition-colors duration-300" />
            </div>
          </div>
          </a>
        </div>
      </section>

      {/* Streaming Now + Recommended Movies Section */}
      <section className="relative py-8 px-4">
        <div className="relative z-10">
          <ContentSection title="Streaming Now" onScroll={handleScroll}>
            <MovieRow>
              <MovieCard image="/assets/images/movies/sci-fi/scifi17.png"  title="Unknown World"  />
              <MovieCard image={Pursued} title="Pursued" />
              <MovieCard image={home48} title="Stage Coach" />
              <MovieCard image={home49} title="State Secret" />
              <MovieCard image="/assets/images/movies/thriller/thriller8.png" title="The Fatal Hour" />
              <MovieCard image={comedy2} title="His Girl Friday" />
              <MovieCard image="/assets/images/movies/sci-fi/scifi18.png" title="The Amazing Transparent Man" />
              <MovieCard image={drama2} title="Key Largo" />
              <MovieCard image={mystery1} title="Texas Terror" />
            </MovieRow>
          </ContentSection>

          <ContentSection title="Recommended Movies" onScroll={handleScroll}>
            <MovieRow>
            <MovieCard image="/assets/images/movies/sci-fi/scifi10.jpeg"   title="Glass"  />
              <MovieCard image="/assets/images/movies/sci-fi/scifi20.png" title="Cat Women of the Moon" />
              <MovieCard image={Bad} title="Bad and the Beautiful" />
              <MovieCard image={drama1} title="Broken Strings" />
              <MovieCard image="/assets/images/movies/western/western6.jpg" title="The Big Trees" />
              <MovieCard image="/assets/images/movies/thriller/thriller9.png" title="Quicksand" />
              <MovieCard image="/assets/images/movies/adventure/adv8.png" title="The Iron Mask" />
              <MovieCard image="/assets/images/movies/biographical/b4.png" title="Regeneration" />
              <MovieCard image="/assets/images/movies/mystery/mystery4.jpg" title="Rear Window" />
            </MovieRow>
          </ContentSection>
        </div>
      </section>

      {/* Recommended TV Shows + New Release Section */}
      <section className="relative py-8 px-4">
        <div className="relative z-10">
          <ContentSection title="Recommended TV Shows" onScroll={handleScroll}>
            <LargeCard image={ series04} title="The IronSide" />
            <LargeCard image={ series06} title="Andy Griffiths"/>
            <LargeCard image={ series05} title="Mister ED" />
            <LargeCard image={ series03} title="HillStreet Blues" />
            <LargeCard image={ series02} title="Dragnet" />   
            <LargeCard image={ series01} title="The Beverly Hill Billies" />   
          </ContentSection>

          <ContentSection title="New Release" onScroll={handleScroll}>
            <MovieRow>
              {upcomingMovies.map(movie => (
                <MovieCard
                  key={movie.slug}
                  image={movie.image}
                  title={movie.title}
                  href={`/upcoming-movie/${movie.slug}`}
                />
              ))}
            </MovieRow>
          </ContentSection>
        </div>
      </section>

      {/* Cartoon Series + Deal of the Week Section */}
      <section className="relative py-8 px-4">
        <div className="relative z-10">
          {/* Cartoon Series */}
          <section className="py-8 px-2 sm:px-4">
            <div className="container mx-auto">
              <div className="relative rounded-lg overflow-hidden h-56 sm:h-64 md:h-80">
                <Image src={home03} alt="Cartoon Series" fill className="object-cover w-full" priority />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent flex items-center">
                  <div className="px-4 sm:px-8 w-full">
                    <h2 className="text-2xl sm:text-4xl font-bold mb-2">Cartoon Series</h2>
                    <p className="text-gray-300 mb-4 max-w-full sm:max-w-md text-sm sm:text-base">
                      A hilarious and heartwarming cartoon series that follows quirky characters on wild adventures in a world where the unexpected is just part of everyday life.
                    </p>
                    <Link href="/genre/cartoon" className="block w-full sm:w-auto">
                      <button className="w-full sm:w-auto bg-[#1D50A3] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-blue-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 flex items-center justify-center gap-2 text-base sm:text-lg">
                        Watch Now
                        <Play className="h-5 w-5 fill-current" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Deal of the Week */}
          <ContentSection title="Deal of the Week" onScroll={handleScroll}>
            <MovieRow>
              <MovieCard image="/assets/images/movies/action/action9.jpeg"  title="Train"  />
              <MovieCard image="/assets/images/movies/adventure/adv6.jpg" title="Sherlock Holmes Dressed to Kill" />
              <MovieCard image="/assets/images/movies/animation/animation2.webp" title="Kung Fu Panda 2" />
              <MovieCard image="/assets/images/movies/biographical/b1.png" title="Born to Win" />
              <MovieCard image="/assets/images/movies/comedy/comedy10.png" title="My Dear Secretary" />
              <MovieCard image="/assets/images/movies/crime/crime10.jpg" title="The Swap" />
              <MovieCard image="/assets/images/movies/crime/crime4.png"  title="And Then There Were None"  />
              <MovieCard image="/assets/images/movies/documentary/documentary1.jpg" title="The Black Godfather" />
              <MovieCard image="/assets/images/movies/drama/drama17.png" title="Penny Serenade" />
            </MovieRow>
          </ContentSection>
        </div>
      </section>

      {/* TV Series + Banner Section */}
      <section className="relative py-8 px-4">
        <div className="relative z-10">
          {/* TV Series */}
          <section className="py-8 px-2 sm:px-4">
            <div className="container mx-auto">
              <div className="flex flex-row justify-between items-center mb-6 gap-2">
                <h2 className="text-2xl font-bold text-left">TV Series</h2>
                <Link
                  href="/tv-series"
                  className="whitespace-nowrap bg-[#1D50A3]/90 text-white px-3 py-1.5 rounded-md font-medium hover:bg-blue-900/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                  style={{ minWidth: 'auto' }}
                >
                  View All
                </Link>
              </div>
              <RankedTVShowRow
                shows={[
                  { image: series01, title: "The Beverly Hill Billies" },
                  { image: series02, title: "Dragnet" },
                  { image: series03, title: "HillStreet Blues" },
                  { image: series04, title: "The IronSide" },
                  { image: series05, title: "Mister ED" },
                  { image: series06, title: "Andy Griffiths" }
                ]}
                sectionId="tv-series-ranked-row"
                onScroll={handleScroll}
              />
            </div>
          </section>

          {/* Banner */}
          <section className="py-8 px-4">
            <div className="container mx-auto">
              <div className="relative rounded-lg overflow-hidden h-64 md:h-50 bg-gradient-to-r from-blue-900 to-blue-600">
                <div className="absolute inset-0 flex items-center justify-between px-8">
                  <div className="flex items-center justify-center w-full">
                    {/* Show only logo on mobile, logo and text on md+ */}
                    <div className="relative p-2  ">
                      <Image src={TM} alt="INBV Logo" width={130} height={130} className="rounded-full" />
                    </div>
                    <div className="ml-3 hidden md:block">
                      <p className="font-bold text-lg">Providing you Premium Quality Movies & TV Series</p>
                      <p className="font-semibold text-md text-blue-200 mt-1 text-center">Internet Best Videos</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>

      {/* Top News */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Top News</h2>
            <Link href="/blog" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
              View All Blogs
            </Link>
          </div>
          {isLoadingBlogs ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="animate-pulse">
                  <div className="bg-gray-700 h-48 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogPosts.length > 0 ? (
                blogPosts.map((post) => (
                  <BlogNewsCard
                    key={post.id}
                    post={post}
                  />
                ))
              ) : (
                // Fallback to static content if no blog posts
                <>
                  <NewsCard
                    image={news1}
                    title="Movies That Will Make Your Holidays The Best"
                    date="April 26, 2023"
                    category="Entertainment"
                  />
                  <NewsCard
                    image={news2}
                    title="Best Movie To Cheer Your Mood Up In 2023"
                    date="April 26, 2023"
                    category="Entertainment"
                  />
                  <NewsCard
                    image={news3}
                    title="Must Watch Your Fav Web Series With Us"
                    date="April 26, 2023"
                    category="Entertainment"
                  />
                </>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function ContentSection({ title, viewAllLink, children, onScroll }) {
  const sectionId = title.replace(/\s+/g, '-').toLowerCase();
  
  return (
    <section className="py-8 px-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold ">{title}</h2>
          {viewAllLink && (
            <Link href={viewAllLink} className="text-white-400 font-medium hover:text-blue-300 text-sm">
              View All
            </Link>
          )}
        </div>
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => onScroll('left', `${sectionId}-container`)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-6 h-20 flex items-center justify-center rounded-full bg-blue-900 hover:bg-white/60  transition-colors hover:text-black group"
          >
            <svg className="w-6 h-6 text-white group-hover:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => onScroll('right', `${sectionId}-container`)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-6 h-20 flex items-center justify-center rounded-full bg-blue-900 hover:bg-white/60 transition-colors group"
          >
            <svg className="w-6 h-6 text-white group-hover:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="overflow-hidden">
            <div 
              id={`${sectionId}-container`}
              className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide px-8"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function MovieRow({ children }) {
  return children;
}

function MovieCard({ image, title, href }) {
  // Convert title to URL-friendly slug
  const slug = title.toLowerCase().replace(/\s+/g, '-');
  return (
    <Link href={href || `/movie/${slug}`} className="flex-shrink-0 w-40 sm:w-44 md:w-44 lg:w-48 group cursor-pointer mx-auto mr-4">
      <div className="relative aspect-[9/14] rounded-lg overflow-hidden mb-2">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
      </div>
      <h3 className="text-xs sm:text-sm font-medium text-center group-hover:text-blue-400 transition-colors line-clamp-2">{title}</h3>
    </Link>
  )
}

function TVShowCard({ image, title }) {
  // Convert title to URL-friendly slug
  const slug = title.toLowerCase().replace(/\s+/g, '-');
  return (
    <Link href={`/tv-series/${slug}`}> 
    <div className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-lg mb-2">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          width={300}
          height={200}
          className="w-full h-48 object-cover opacity-50 group-hover:opacity-100 transition-all rounded-lg mb-2"
        />
      </div>
      <h3 className="text-sm font-medium group-hover:text-blue-400 transition-colors">{title}</h3>
    </div>
    </Link>
  )
}

function LargeCard({ image, title, description }) {
  // Convert title to URL-friendly slug
  const slug = title.toLowerCase().replace(/\s+/g, '-');
  return (
    <Link href={`/tv-series/${slug}`}> 
    <div className="group cursor-pointer flex-shrink-0 w-60">
      <div className="relative overflow-hidden rounded-lg mb-2">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          width={400}
          height={300}
          className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
      </div>
      <h3 className="text-sm font-medium text-center group-hover:text-blue-400 transition-colors">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed text-center">{description}</p>
    </div>
    </Link>
  )
}

function NewsCard({ image, title, date, category }) {
  return (
    <div className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-lg mb-4">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          width={300}
          height={200}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="flex items-center space-x-2 text-xs text-gray-400 mb-2">
        <Calendar className="h-3 w-3" />
        <span>{date}</span>
        <span>•</span>
        <span>{category}</span>
      </div>
      <h3 className="text-lg font-semibold group-hover:text-blue-400 transition-colors">{title}</h3>
    </div>
  )
}

function BlogNewsCard({ post }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Link href={`/blog/${post.slug}`} className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-lg mb-4">
        <Image
          src={post.featuredImage || "/placeholder.svg"}
          alt={post.title}
          width={300}
          height={200}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="flex items-center space-x-2 text-xs text-gray-400 mb-2">
        <Calendar className="h-3 w-3" />
        <span>{formatDate(post.publishDate)}</span>
        <span>•</span>
        <span>{post.category}</span>
        {post.readTime && (
          <>
            <span>•</span>
            <span>{post.readTime}</span>
          </>
        )}
      </div>
      <h3 className="text-lg font-semibold group-hover:text-blue-400 transition-colors line-clamp-2">{post.title}</h3>
      {post.excerpt && (
        <p className="text-gray-400 text-sm mt-2 line-clamp-2">{post.excerpt}</p>
      )}
    </Link>
  )
}

function RankedTVShowCard({ image, title }) {
  // Convert title to URL-friendly slug
  const slug = title.toLowerCase().replace(/\s+/g, '-');
  return (
    <Link href={`/tv-series/${slug}`} className="flex-shrink-0 w-56 group cursor-pointer">
      <div className="relative overflow-hidden rounded-lg mb-2">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          width={300}
          height={288}
          className="w-full h-72 object-cover rounded-lg"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
      </div>
      <h3 className="text-sm font-medium text-center group-hover:text-blue-400 transition-colors">{title}</h3>
    </Link>
  )
}

function RankedTVShowRow({ shows, sectionId, onScroll }) {
  return (
    <div className="relative">
      {/* Left Arrow */}
      <button
        onClick={() => onScroll('left', sectionId)}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-6 h-20 flex items-center justify-center rounded-full bg-blue-900 hover:bg-white/60 transition-colors group"
      >
        <svg className="w-6 h-6 text-white group-hover:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      {/* Right Arrow */}
      <button
        onClick={() => onScroll('right', sectionId)}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-6 h-20 flex items-center justify-center rounded-full bg-blue-900 hover:bg-white/60 transition-colors group"
      >
        <svg className="w-6 h-6 text-white group-hover:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <div className="overflow-hidden">
        <div
          id={sectionId}
          className="flex space-x-15 overflow-x-auto ml-8 pb-4 scrollbar-hide px-8"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {shows.map((show, idx) => (
            <div key={idx} className="relative w-46 flex-shrink-0">
              {/* Large number on the left, over the image */}
              <span
                className="absolute right-25 top-1/2 -translate-y-1/2 text-[12rem] font-extrabold text-white/30 select-none pointer-events-none z-20 mt-13"
                style={{ WebkitTextStroke: '2.5px #fff', textStroke: '2.5px #fff', lineHeight: 1 }}
              >
                {idx + 1}
              </span>
              <div className="relative z-1">
                <RankedTVShowCard image={show.image} title={show.title} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}