"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Tv, Download, Dribbble, Smile, Plus, Menu, X } from "lucide-react"
import Footer from "../../components/footer";
import home01 from '../../public/assets/images/background/homePage05.jpg';

import logo from './../../public/assets/images/logo/logo.png';
import home45 from '../../public/assets/images/home/home45.jpg';
import home46 from '../../public/assets/images/home/home46.png';
import home47 from '../../public/assets/images/home/home47.jpg';
import home48 from '../../public/assets/images/home/home48.png';
import home49 from '../../public/assets/images/home/home49.jpeg';

const faqData = [
  {
    question: "What is INBV? ",
    answer: "The acronym stands for Internet Best Videos. We are an innovative media company whose mission is to present the world's best content providers and creators."
  },
  {
    question: "Do I Need to Pay to Watch on INBV TV?",
    answer: "No, INBV TV is currently 100% free. You can stream all available content without a subscription or payment."
  },
  {
    question: "What Kind of Movies and Shows Are Available?",
    answer: "INBV TV offers a variety of genres including action, drama, comedy, kids’ cartoons, and a unique collection of classic movies from the mid-90s."
  },
  {
    question: "Is INBV TV Available on Mobile Devices?",
    answer: "Yes, INBV TV works on most modern web browsers across desktops, tablets, and smartphones. A mobile app is in the works!"
  },
  {
    question: "Are New Titles Added Regularly?",
    answer: "Yes, we regularly update our library with both modern content and timeless classics. Keep checking back or subscribe to our newsletter for updates."
  }
];

// Netflix-style Movie Card Component
const NetflixStyleMovieCard = ({ image, title, href, number }) => {
  return (
    <div className="relative group cursor-pointer">
      <Link href={href} className="block">
        <div className="relative overflow-hidden rounded-lg aspect-[2/3] bg-gray-800">
          <Image 
            src={image} 
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={number <= 3}
          />
          
          {/* Netflix-style Number with blue stroke */}
          <div className="absolute bottom-0 left-0 p-2">
            <div className="relative">
              <span 
                className="text-7xl md:text-8xl font-black text-white"
                style={{
                  textShadow: `
                    -3px -3px 0 #091E49,
                    3px -3px 0 #091E49,
                    -3px 3px 0 #091E49,
                    3px 3px 0 #091E49,
                    0 0 8px rgba(29, 80, 163, 0.5)
                  `
                }}
              >
                {number}
              </span>
            </div>
          </div>
        </div>
        
        <h3 className="mt-2 text-sm font-medium text-white group-hover:text-red-400 transition-colors">
          {title}
        </h3>
      </Link>
    </div>
  );
};

// Navbar Component
function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="absolute top-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent"></div>
      <nav className="relative py-4 w-full">
        <div className="container mx-auto px-4 sm:px-8 lg:px-16">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4 sm:space-x-8">
              <Link href="/" className="flex items-center">
                <div className="relative flex items-center justify-center h-10 w-24">
                  <Image src={logo || "/placeholder.svg"} alt="INBV Logo" width={100} height={40} priority />
                </div>
              </Link>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-0">
              <Link href="/auth/login">
                <button className="bg-[#1D50A3] text-white hover:bg-blue-300 font-semibold px-4 py-2.5 rounded-lg flex items-center text-md shadow-md hover:bg-blue-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                  <span className="hidden sm:inline">Watch Now</span>
                  <span className="sm:hidden">Watch</span>
                </button>
              </Link>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:text-blue-400 transition-colors md:hidden"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute inset-x-0 top-16 bg-[#1a1a3a]/95 border-t border-blue-900/30 z-50 max-h-[80vh] overflow-y-auto">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link href="/" className="block px-3 py-2 text-white hover:text-blue-400 hover:bg-blue-600/10 rounded transition-colors duration-200">
                  Home
                </Link>
                <Link href="/live-tv" className="block px-3 py-2 text-white hover:text-blue-400 hover:bg-blue-600/10 rounded transition-colors duration-200">
                  Live TV
                </Link>
                <Link href="/blog" className="block px-3 py-2 text-white hover:text-blue-400 hover:bg-blue-600/10 rounded transition-colors duration-200">
                  Blog
                </Link>
                <Link href="/about" className="block px-3 py-2 text-white hover:text-blue-400 hover:bg-blue-600/10 rounded transition-colors duration-200">
                  About Us
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
    <div className="w-full overflow-x-hidden bg-[#091E49]">
      <Navbar />
      <div className="min-h-screen text-white w-full">
        {/* Hero Section */}
        <section className="relative py-20 px-4 text-center min-h-[100vh] flex items-center w-full">
          {/* Background Image Container */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={home01 || "/placeholder.svg"}
              alt="Movie and TV show posters collage"
              fill
              className="object-cover"
              priority
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#132036] to-transparent z-10" />
          </div>
          
          <div className="relative z-20 container mx-auto max-w-full">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              The Home of Endless
              <br />
              Shows and Movies
            </h1>
            <p className="text-sm sm:text-md md:text-md text-gray-300 mb-8">More shows. More fun. More you.</p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center items-center max-w-md mx-auto w-full">
              <input
                type="email"
                placeholder="Email address"
                className="w-full px-4 py-3 rounded-sm bg-white/70 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Link href="/auth/login" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto whitespace-nowrap bg-[#1D50A3]/90 text-white px-8 py-3 rounded-sm font-medium hover:bg-blue-900/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Watch Free Movies Section */}
        <section className="py-16 px-4 w-full">
        <div className="container mx-auto">
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-12">Watch Free Movies</h2>
          </div>
          
          {/* Movie Cards Container with Side Arrows */}
          <div className="relative w-full">
            {/* Left Arrow */}
            <button
              onClick={() => {
                const container = document.getElementById("movie-scroll-container")
                if (container) {
                  container.scrollBy({ left: -300, behavior: "smooth" })
                }
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 hover:bg-black/70 transition-colors backdrop-blur-sm"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Right Arrow */}
            <button
              onClick={() => {
                const container = document.getElementById("movie-scroll-container")
                if (container) {
                  container.scrollBy({ left: 300, behavior: "smooth" })
                }
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 hover:bg-black/70 transition-colors backdrop-blur-sm"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Movies Container */}
            <div className="w-full overflow-hidden px-12">
              <div
                id="movie-scroll-container"
                className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {/* Movie Cards with Numbers */}
                <div className="flex-shrink-0 w-40 sm:w-48 md:w-72">
                  <NetflixStyleMovieCard image={home45} title="Atomic Submarine" href="/movie/atomic-submarine" number="1" />
                </div>
                <div className="flex-shrink-0 w-40 sm:w-48 md:w-72">
                  <NetflixStyleMovieCard image={home46} title="Pursued" href="/movie/pursued" number="2" />
                </div>
                <div className="flex-shrink-0 w-40 sm:w-48 md:w-72">
                  <NetflixStyleMovieCard image={home47} title="Bad and the Beautiful" href="/movie/bad-and-the-beautiful" number="3" />
                </div>
                <div className="flex-shrink-0 w-40 sm:w-48 md:w-72">
                  <NetflixStyleMovieCard image={home48} title="Stage Coach" href="/movie/stage-coach" number="4" />
                </div>
                <div className="flex-shrink-0 w-40 sm:w-48 md:w-72">
                  <NetflixStyleMovieCard image={home49} title="State Secret" href="/movie/state-secret" number="5" />
                </div>
                <div className="flex-shrink-0 w-40 sm:w-48 md:w-72">
                  <NetflixStyleMovieCard image={home45} title="Atomic Submarine" href="/movie/atomic-submarine" number="6" />
                </div>
                <div className="flex-shrink-0 w-40 sm:w-48 md:w-72">
                  <NetflixStyleMovieCard image={home46} title="Pursued" href="/movie/pursued" number="7" />
                </div>
                <div className="flex-shrink-0 w-40 sm:w-48 md:w-72">
                  <NetflixStyleMovieCard image={home47} title="Bad and the Beautiful" href="/movie/bad-and-the-beautiful" number="8" />
                </div>
                <div className="flex-shrink-0 w-40 sm:w-48 md:w-72">
                  <NetflixStyleMovieCard image={home48} title="Stage Coach" href="/movie/stage-coach" number="9" />
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* Why Join Us Section */}
        <section className="py-16 px-4  w-full">
          <div className="container mx-auto">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-12">Why Join Us</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <FeatureCard
                icon={<Tv className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" />}
                title="Enjoy on your TV"
                description="Watch on Smart TVs, Playstation, Xbox, Apple TV, Roku Players and more."
              />
              <FeatureCard
                icon={<Download className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" />}
                title="Download Shows"
                description="Save your favorites easily and always have something to watch."
              />
              <FeatureCard
                icon={<Dribbble className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" />}
                title="Watch everywhere"
                description="Stream unlimited movies and TV shows on your phone, tablet, laptop and TV."
              />
              <FeatureCard
                icon={<Smile className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" />}
                title="Create profiles"
                description="Send kids on adventures with their favorite characters in a space made just for them."
              />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4  w-full">
          <div className="container mx-auto max-w-8xl">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
            {faqData.map((faq, index) => (
             <FAQItem key={index} question={faq.question} answer={faq.answer} />
             ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
    </>
  );
};

function MovieCard({ image, title, href }) {
  return (
    <Link href={href} className="group">
      <div className="relative overflow-hidden rounded-lg mb-2 aspect-[2/3]">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <h3 className="text-sm font-medium text-center group-hover:text-blue-400 transition-colors">{title}</h3>
    </Link>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-gradient-to-t from-[#5073AE] to-[#1D50A3] rounded-lg p-8 hover:from-[#5073AE] hover:to-[#092960] transition-colors relative min-h-[250px]">
    <div className="text-left">
      <h3 className="text-lg font-semibold mb-2.5">{title}</h3>
      <p className="text-blue-100 text-sm leading-relaxed ">{description}</p>
    </div>
    <div className="absolute bottom-4 right-4 text-white opacity-90">{icon}</div>
  </div>
)
}

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = React.useState(false)
  

  return (
    <div className="bg-[#2D2D2D] rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-[#1e1d1d] transition-colors"
      >
        <span className="text-lg font-medium">{question}</span>
        <Plus className={`h-6 w-6 transition-transform ${isOpen ? "rotate-45" : ""}`} />
      </button>
      {isOpen && (
        <div className="px-6 pb-6">
          <p className="text-gray-300">{answer}</p>
        </div>
      )}
    </div>
  )
}

