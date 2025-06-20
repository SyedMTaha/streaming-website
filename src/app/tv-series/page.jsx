"use client"

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Play, Bookmark } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/navbarSearch';
import Footer from '../../../components/footer';
import moviesData from '../../data/movies.json';

export default function TVSeriesPage() {
  const router = useRouter();
  const scrollContainerRef = useRef(null);
  const series = moviesData['tv-series'] || [];

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -200,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 200,
        behavior: "smooth",
      });
    }
  };

  const handleSeriesClick = (series) => {
    router.push(`/tv-series/${series.slug}`);
  };

  return (
    <div className="min-h-screen text-white" style={{background: "linear-gradient(to bottom, #02122C 0%, #091F4E 50%, #020E21 70%)"}}>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[65vh] flex items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src="/assets/images/background/homePage05.jpg" 
            alt="TV Series Collection"
            fill
            className="object-cover"
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

      {/* TV Series Grid */}
      <div className="container mx-auto px-4 md:px-8 lg:px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-bold">All TV Series</h3>
            <span className="text-gray-400">({series.length} series)</span>
          </div>
        </div>
          

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {series.map((item) => (
            <div 
              key={item.id}
              className="bg-[#012256] rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => handleSeriesClick(item)}
            >
              <div className="relative aspect-video">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  width={400}
                  height={225}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <button className="bg-[#1D50A3] text-white px-4 py-2 rounded-lg font-semibold">
                    Watch Now
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <span>{item.year}</span>
                  <span>•</span>
                  <span>{item.duration}</span>
                </div>
                <div className="flex items-center space-x-1 mt-2">
                  <span className="text-sm text-gray-400">Rating: {item.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
} 