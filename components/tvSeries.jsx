"use client"
import Image from "next/image"
import Link from "next/link"
import { Play, Bookmark, ThumbsUp, Share, Star, Plus, BookmarkIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { useRef, useState } from "react"
import home02 from '../public/assets/images/background/homePage01.png';
import series01 from './../public/assets/images/series/series01.jpeg';
import series02 from './../public/assets/images/series/series02.jpg';
import series03 from './../public/assets/images/series/series03.jpg';
import series04 from './../public/assets/images/series/series04.jpg';
import series05 from './../public/assets/images/series/series05.jpg';
import series06 from './../public/assets/images/series/series06.jpg';
import comingsoon from '../public/assets/images/background/coming-soon.jpg';

export default function MoviePage({ params }) {
  const scrollContainerRef = useRef(null)
  const [sortBy, setSortBy] = useState('newest')
 
  const handleScroll = (direction, containerId) => {
    const container = document.getElementById(containerId);
    if (container) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };


  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -200,
        behavior: "smooth",
      })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 200,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020b1f] via-[#0a2151] to-[#020b1f] text-white">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center">
        <div className="absolute inset-0">
        <Image
              src={home02 || "/placeholder.svg"}
              alt="Movie and TV show posters collage"
              fill
              className="object-cover"
              priority
            />
          <div className="absolute inset-0 bg-gradient-to-r from-[#132036] to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-4 mb-30">
            <span className="text-[#ffffff] font-bold text-3xl md:text-4xl lg:text-4xl uppercase tracking-wider">
              TV Series
            </span> 
          </div>
        </div>
      </section>


        {/* Streaming Now */}
      <ContentSection title="Streaming Now" viewAllLink="/streaming-now" onScroll={handleScroll}>
        <MovieRow>
          <MovieCard image={series01}  title="Beverly Bill Billies"  />
          <MovieCard image={series02} title="Dragnet 1967" />
          <MovieCard image={series03}  title="Hill Street Blues" />
          <MovieCard image={series04} title="Iron Side" />
          <MovieCard image={series05} title="Mister ED" />
          <MovieCard image={series06} title="The Andy Griffth Show" />
          <MovieCard image={comingsoon} title="Coming Soon"/>
          <MovieCard image={comingsoon} title="Coming Soon"/>
          <MovieCard image={comingsoon} title="Coming Soon"/>
          <MovieCard image={comingsoon} title="Coming Soon"/>
        </MovieRow>
      </ContentSection>

      
    </div>
  )
}

function ContentSection({ title, viewAllLink, children, onScroll }) {
    const sectionId = title.replace(/\s+/g, '-').toLowerCase();
    
    return (
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{title}</h2>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => onScroll('left', `${sectionId}-container`)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => onScroll('right', `${sectionId}-container`)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <Link href={viewAllLink} className="text-white-400 font-medium hover:text-blue-300 text-sm">
                View All
              </Link>
            </div>
          </div>
          <div className="overflow-hidden">
            <div 
              id={`${sectionId}-container`}
              className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {children}
            </div>
          </div>
        </div>
      </section>
    )
  }

  function MovieRow({ children }) {
    return children;
  }

  function MovieCard({ image, title }) {
    // Convert title to URL-friendly slug
    const slug = title.toLowerCase().replace(/\s+/g, '-');
    
    return (
      <Link href={`/tv-series/${slug}`} className="flex-shrink-0 w-40 group cursor-pointer">
        <div className="relative overflow-hidden rounded-lg mb-2">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            width={400}
            height={300}
            className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        </div>
        <h3 className="text-sm font-medium text-center group-hover:text-blue-400 transition-colors">{title}</h3>
      </Link>
    )
  }
