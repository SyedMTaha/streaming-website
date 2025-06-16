"use client"

import Image from "next/image"
import Link from "next/link"
import { Play, Plus, Calendar } from "lucide-react"
import home03 from './../public/assets/images/background/homePage03.png';
import comingsoon from './../public/assets/images/background/coming-soon.jpg';
import logo5 from './../public/assets/images/logo/logo.png';
import news1 from './../public/assets/images/home/news1.jpg';
import news2 from './../public/assets/images/home/news2.jpg';
import news3 from './../public/assets/images/home/news3.jpg';
import homePage from './../public/assets/images/home/homePage02.jpg';
import home45 from './../public/assets/images/home/home45.jpg';
import home46 from './../public/assets/images/home/home46.png';
import home47 from './../public/assets/images/home/home47.jpg';
import home48 from './../public/assets/images/home/home48.png';
import home49 from './../public/assets/images/home/home49.jpeg';
import series01 from './../public/assets/images/series/series1.jpeg';
import series02 from './../public/assets/images/series/series2.jpg';
import series03 from './../public/assets/images/series/series3.jpg';
import series04 from './../public/assets/images/series/series4.jpg';
import series05 from './../public/assets/images/series/series5.jpg';
import series06 from './../public/assets/images/series/series6.jpg';
import HisFriday from './../public/assets/images/movies/drama/drama6.jpeg';
import Suddenly from './../public/assets/images/movies/drama/drama4.jpg';
import Stranger from './../public/assets/images/movies/drama/drama5.jpg';
import Outlaw from './../public/assets/images/movies/drama/drama11.jpeg';
import Lost from './../public/assets/images/movies/sci-fi/scifi7.jpeg';
import Last from './../public/assets/images/movies/sci-fi/scifi4.jpg';
import Pursued from '../public/assets/images/movies/action/action7.jpg';
import Bad from '../public/assets/images/movies/action/action3.jpg';
import { Facebook, Twitter, Youtube, X, Instagram } from "lucide-react"

export default function DashboardPage() {

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
    <div className="min-h-screen bg-gradient-to-b from-[#020b1f] via-[#0a2151] to-[#020b1f] text-white">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src={homePage}
            alt="The White House movie"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Social Media Icons */}
        <div className="absolute bottom-2 right-0 z-50 flex gap-2">
          
          {/* TikTok */}
          <a 
            href="https://www.tiktok.com/@inbvtv?_t=ZS-8xAgUZayDgm&_r=1" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-icon-container group"
          >
          <div className="social-icon-container group">
            <div className="w-12 h-12 bg-blue-900 group-hover:bg-white transform skew-x-12 flex items-center justify-center cursor-pointer transition-all duration-300 relative overflow-hidden">
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
            <div className="w-12 h-12 bg-blue-900 group-hover:bg-white transform skew-x-12 flex items-center justify-center cursor-pointer transition-all duration-300 relative overflow-hidden">
              <Facebook className="w-5 h-5 text-white group-hover:text-blue-900 transform -skew-x-12 transition-colors duration-300" />
            </div>
          </a>
          
          {/* Instagram */}
          <a 
            href="https://www.instagram.com/inbvtv?igsh=dGN4Y2ZhMDExZWx5" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-icon-container group"
          >
          <div className="social-icon-container group">
            <div className="w-12 h-12 bg-blue-900 group-hover:bg-white transform skew-x-12 flex items-center justify-center cursor-pointer transition-all duration-300 relative overflow-hidden">
              <Instagram className="w-5 h-5 text-white group-hover:text-blue-900 transform -skew-x-12 transition-colors duration-300" />
            </div>
          </div>
          </a>
          
          {/* X (Twitter) */}
          <div className="social-icon-container group">
            <div className="w-12 h-12 bg-blue-900 group-hover:bg-white transform skew-x-12 flex items-center justify-center cursor-pointer transition-all duration-300 relative overflow-hidden">
              <XIcon className="w-5 h-5 text-white group-hover:text-blue-900 transform -skew-x-12 transition-colors duration-300" />
            </div>
          </div>
          
          {/* YouTube */}
          <div className="social-icon-container group">
            <div 
              className="-ml-1 w-12 h-12 bg-blue-900 group-hover:bg-white flex items-center justify-center cursor-pointer transition-all duration-300 relative overflow-hidden"
              style={{clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 20% 100%)'}}
            >
              <Youtube className="ml-2 w-5 h-5 text-white group-hover:text-blue-900 transition-colors duration-300" />
            </div>
          </div>
        </div>
      </section>

      {/* Streaming Now */}
      <ContentSection title="Streaming Now" onScroll={handleScroll}>
        <MovieRow>
          <MovieCard image={home45}  title="Atomic Submarine"  />
          <MovieCard image={Pursued} title="Pursued" />
          <MovieCard image={home48} title="Stage Coach" />
          <MovieCard image={home49} title="State Secret" />
          <MovieCard image={Bad} title="Bad and the Beautiful" />
        </MovieRow>
      </ContentSection>

      {/* Recommended Movies */}
      <ContentSection title="Recommended Movies" onScroll={handleScroll}>
        <MovieRow>
          <MovieCard image={HisFriday}  title="His Girl Friday"  />
          <MovieCard image={Suddenly} title="Suddenly" />
          <MovieCard image={Stranger} title="The Stranger" />
          <MovieCard image={Outlaw} title="Outlaw" />
          <MovieCard image={Lost} title="The Lost World" />
          <MovieCard image={Last} title="Last Woman on Earth" />

        </MovieRow>
      </ContentSection>


      {/* Recommended TV Shows  */}
      <ContentSection title="Recommended TV Shows" onScroll={handleScroll}>
    
          <LargeCard image={ series04} title="Iron Side" />
          <LargeCard image={ series06} title="The Andy Griffith Show"/>
          <LargeCard image={ series05} title="Mister ED" />
          <LargeCard image={ series03} title="Hill Street Blues" />
          <LargeCard image={ series02} title="Dragnet 1967" />    
       
      </ContentSection>

      {/* New Release */}
      <ContentSection title="New Release"   onScroll={handleScroll}>
        <MovieRow>
          <MovieCard image={comingsoon}  title="His Girl Friday"  />
          <MovieCard image={comingsoon} title="Suddenly" />
          <MovieCard image={comingsoon} title="The Stranger 1946" />
          <MovieCard image={comingsoon} title="The Outlaw 1943" />
          <MovieCard image={comingsoon} title="The Lost World 1925" />
          <MovieCard image={comingsoon} title="Last Woman on Earth 1960" />
        </MovieRow>
      </ContentSection>

      {/* Cartoon Series */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="relative rounded-lg overflow-hidden h-64 md:h-80">
            <Image src={home03} alt="Cartoon Series" fill className="object-cover w-full"  priority/>
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent flex items-center">
              <div className="px-8">
                <h2 className="text-4xl font-bold mb-2">Cartoon Series</h2>
                <p className="text-gray-300 mb-4 max-w-md">
                A hilarious and heartwarming cartoon series that follows quirky characters on wild adventures in a world where the unexpected is just part of everyday life.

                </p>
                <Link href="/genre/cartoon" >
                <button className="  bg-[#1D50A3]  text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-900  transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 flex items-center gap-2 ">
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
          <MovieCard image={HisFriday}  title="His Girl Friday"  />
          <MovieCard image={Suddenly} title="Suddenly" />
          <MovieCard image={Stranger} title="The Stranger 1946" />
          <MovieCard image={Outlaw} title="The Outlaw 1943" />
          <MovieCard image={Lost} title="The Lost World 1925" />
          <MovieCard image={Last} title="Last Woman on Earth 1960" />
          <MovieCard image={HisFriday}  title="His Girl Friday"  />
          <MovieCard image={Suddenly} title="Suddenly" />
          <MovieCard image={Stranger} title="The Stranger 1946" />
        </MovieRow>
      </ContentSection>

      {/* TV Series */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">TV Series</h2>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => handleScroll('left', 'tv-series-grid')}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => handleScroll('right', 'tv-series-grid')}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <Link href="/tv-series" className="text-white-400 font-medium hover:text-blue-300 text-sm">
                View All
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="tv-series-grid">
            <TVShowCard image={series01} title="Beverly Bill Billies" />
            <TVShowCard image={series02} title="Dragnet 1967" />
            <TVShowCard image={series03} title="Hill Street Blues" />
            <TVShowCard image={series04} title="Iron Side" />
            <TVShowCard image={series05} title="Mister ED" />
            <TVShowCard image={series06} title="The Andy Griffth Show" />
            <TVShowCard image={series01} title="Beverly Bill Billies" />
            <TVShowCard image={series02} title="Dragnet 1967" />
          </div>
        </div>
      </section>


      {/* House of the Dragon Banner */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="relative rounded-lg overflow-hidden h-64 md:h-50 bg-gradient-to-r from-blue-900 to-blue-600">
            <div className="absolute inset-0 flex items-center justify-between px-8">
              <div>
                <h2 className="text-5xl font-bold mb-2"></h2>
                <p className="text-xl mb-4"></p>
              </div>
              <div className="hidden md:flex items-center justify-center flex-1">
                <Image src={logo5} alt="House of the Dragon" width={150} height={150} className="rounded-full" />
                <p className="font-bold text-lg ml-3">Providing you Premium Quality Movies & TV Series</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top News */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Top News</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          </div>
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
            {viewAllLink && (
              <Link href={viewAllLink} className="text-white-400 font-medium hover:text-blue-300 text-sm">
                View All
              </Link>
            )}
          </div>
        </div>
        <div className="overflow-hidden">
          <div 
            id={`${sectionId}-container`}
            className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide"
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
    <Link href={`/movie/${slug}`} className="flex-shrink-0 w-70 group cursor-pointer">
      <div className="relative overflow-hidden rounded-lg mb-2">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          width={400}
          height={300}
          className="w-full h-84 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
      </div>
      <h3 className="text-sm font-medium text-center group-hover:text-blue-400 transition-colors">{title}</h3>
    </Link>
  )
}

function TVShowCard({ image, title }) {
  return (
    <div className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-lg mb-2">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          width={300}
          height={200}
          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300 opacity-50 group-hover:opacity-100 transition-all"
        />
      </div>
      <h3 className="text-sm font-medium group-hover:text-blue-400 transition-colors">{title}</h3>
    </div>
  )
}

function LargeCard({ image, title, description }) {
  return (
    <div className="group cursor-pointer flex-shrink-0 w-70">
      <div className="relative overflow-hidden rounded-lg mb-2">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          width={400}
          height={300}
          className="w-full h-84 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
      </div>
      <h3 className="text-sm font-medium text-center group-hover:text-blue-400 transition-colors">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed text-center">{description}</p>
    </div>
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