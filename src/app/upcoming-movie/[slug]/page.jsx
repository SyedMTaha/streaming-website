"use client"
import Image from "next/image"
import Link from "next/link"
import { Play, Bookmark, ThumbsUp, Share, Star, Plus, BookmarkIcon, ChevronLeft , ChevronRight   } from "lucide-react"
import { useRef } from "react"
import comingsoonGif from '../../../../public/assets/images/movies/coming-soon.gif';
import NavbarTwo from "../../../../components/navbarSearch";
import Footer from "../../../../components/footer";

export default function MoviePage({ params }) {
  const scrollContainerRef = useRef(null)
  // This would normally come from an API based on the slug
  const movie = {
    title: "",
    year: "",
    duration: "",
    rating: "",
    score: "",
    views: "",
    reviews: "",
    genres: [],
    cast: [""],
    crew: [""],
    poster: "/placeholder.svg?height=400&width=300",
    backdrop: "/placeholder.svg?height=800&width=1400",
  }

  const recommendedMovies = [
    { title: "Love In The Night Sky", image: "/assets/images/home/home13.png" },
    { title: "Spacex", image: "/assets/images/home/home14.png" },
    { title: "Spider Man Memo", image: "/assets/images/home/home15.png" },
    { title: "City Hunter", image: "/assets/images/home/home16.png" },
    { title: "The Sleeping Angel", image: "/assets/images/home/home17.png"},
    { title: "The Past", image: "/assets/images/home/home18.png" },
    { title: "Best Friend", image:"/assets/images/home/home19.png" },
    { title: "Love In The Night Sky", image: "/assets/images/home/home13.png" },
    { title: "Spacex", image: "/assets/images/home/home14.png" },
  ]

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
    <>
      <NavbarTwo/>
      <div className="min-h-screen bg-gradient-to-b from-[#020b1f] via-[#0a2151] to-[#020b1f] text-white">
        {/* Hero Section */}
        <section className="relative h-[90vh] flex items-center">
          <div className="absolute inset-0">
            {/* Background GIF */}
            <Image 
              src={comingsoonGif} 
              alt={movie.title} 
              fill 
              className="object-cover"
              priority
              unoptimized // This is important for GIFs to animate
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#132036] to-transparent" />
          </div>

          <div className="relative z-20 container mx-auto px-4">
            <div className="max-w-2xl">
              <div className="text-[#1D50A3] font-semibold text-sm mb-2 uppercase tracking-wider flex flex-wrap gap-2">
                <p></p>
                {movie.genres.slice(0, 2).map((genre) => (
                  <span key={genre}>{genre}</span>
                ))}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{movie.title}</h1>
              <div className="flex items-center space-x-4 mb-4 text-sm">
                <div className="flex items-center">
                  
                </div>
                <span>{movie.year}</span>
                <span>{movie.duration}</span>
                
              </div>
              
            </div>
          </div>
        </section>
        <Footer/>
      </div>
    </>
  )
}

