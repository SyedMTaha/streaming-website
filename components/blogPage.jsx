"use client"

import Image from "next/image"
import Link from "next/link"
import { Search, Calendar, User, ArrowRight, BookOpen, Film, Star, TrendingUp, Clock, Eye } from "lucide-react"
import logo2 from '../public/assets/images/logo/logo2.png'

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020b1f] via-[#0a2151] to-[#020b1f] text-white">
     
      

      {/* Hero Section - Featured Article Carousel */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <Image
            src="/assets/images/blog/threater1.webp"
            alt="Featured background"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#020b1f]/80 via-[#0a2151]/60 to-transparent"></div>
        <div className="relative z-10 container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
                             <div className="flex items-center space-x-2 text-[#1d50a3] text-sm font-semibold text-[#1D50A3]">
                <Star className="h-4 w-4" />
                <span>FEATURED ARTICLE</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent text-balance">
                The Future of Independent Streaming: How INBV TV is Revolutionizing Content Discovery
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed text-pretty">
                Explore how independent filmmakers and content creators are reshaping the streaming landscape with
                innovative storytelling and authentic voices that challenge traditional media.
              </p>
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Dec 15, 2024</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>INBV Media Group</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>8 min read</span>
                </div>
              </div>
                             <Link
                 href="/blog/future-of-independent-streaming"
                 className="inline-flex items-center space-x-2 bg-[#1D50A3] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#1D50A3]/90 transition-all duration-300 shadow-2xl hover:shadow-[#1D50A3]/25 transform hover:-translate-y-1 group"
               >
                <span>Read Full Article</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="relative group">
                             <div className="absolute -inset-4 bg-gradient-to-r from-[#1d50a3]/20 to-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="relative">
                <Image
                  src="/assets/images/blog/books.jpg"
                  alt="Featured article image"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-2xl transform group-hover:scale-[1.02] transition-all duration-500 object-cover w-full h-[400px]"
                />
                                 <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-[#1d50a3]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-20 px-4 bg-gradient-to-br from-[#020D1E] via-[#0A2043] to-[#020b1f]">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Articles Grid */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Latest Articles
                </h2>
                <div className="flex space-x-2">
                                     <button className="px-4 py-2 bg-[#1d50a3] text-white rounded-lg text-sm font-semibold">
                    All
                  </button>
                  <button className="px-4 py-2 bg-[#ffffff]/20 text-gray-300 rounded-lg text-sm hover:bg-[#ffffff]/30 transition-colors">
                    Reviews
                  </button>
                  <button className="px-4 py-2 bg-[#ffffff]/20 text-gray-300 rounded-lg text-sm hover:bg-[#ffffff]/30 transition-colors">
                    Industry
                  </button>
                  <button className="px-4 py-2 bg-[#ffffff]/20 text-gray-300 rounded-lg text-sm hover:bg-[#ffffff]/30 transition-colors">
                    Tech
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Article Card 1 */}
                <Link href="/blog/best-action-movies-2025">
                  <article className="bg-gradient-to-br from-[#ffffff]/10 to-[#ffffff]/5 rounded-xl overflow-hidden border border-[#e2e8f0]/20 backdrop-blur-sm hover:border-[#1d50a3]/30 transition-all duration-300 group hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#1d50a3]/10 cursor-pointer">
                    <div className="relative overflow-hidden">
                      <Image
                        src="/assets/images/blog/action.jpg"
                        alt="Article image"
                        width={400}
                        height={250}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-[#1d50a3] text-white px-3 py-1 rounded-full text-xs font-semibold">
                          REVIEW
                        </span>
                      </div>
                      {/* INBV Logo Overlay */}
                      <div className="absolute bottom-2 right-2 z-10">
                        <Image
                          src={logo2}
                          alt="INBV Logo"
                          width={32}
                          height={32}
                          className="opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                        />
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-3 group-hover:text-[#1d50a3] transition-colors text-balance">
                        The Ultimate Guide to 2025's Best Action Movies: Blockbusters That Redefined Cinema
                      </h3>
                      <p className="text-gray-300 mb-4 text-sm leading-relaxed text-pretty">
                        Discover the most explosive, thrilling, and critically acclaimed action movies of 2025 that are breaking box office records.
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center space-x-4">
                          <span>Dec 18, 2024</span>
                          <span>•</span>
                          <span>12 min read</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>147</span>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>

                {/* Article Card 2 */}
                <Link href="/blog/psychological-thrillers-streaming">
                  <article className="bg-gradient-to-br from-[#ffffff]/10 to-[#ffffff]/5 rounded-xl overflow-hidden border border-[#e2e8f0]/20 backdrop-blur-sm hover:border-[#1d50a3]/30 transition-all duration-300 group hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#1d50a3]/10 cursor-pointer">
                    <div className="relative overflow-hidden">
                      <Image
                        src="/assets/images/blog/thriller.jpg"
                        alt="Article image"
                        width={400}
                        height={250}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-[#1d50a3] text-white px-3 py-1 rounded-full text-xs font-semibold">
                          INDUSTRY
                        </span>
                      </div>
                      {/* INBV Logo Overlay */}
                      <div className="absolute bottom-2 right-2 z-10">
                        <Image
                          src={logo2}
                          alt="INBV Logo"
                          width={32}
                          height={32}
                          className="opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                        />
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-3 group-hover:text-[#1d50a3] transition-colors text-balance">
                        The Rise of Psychological Thrillers in Streaming
                      </h3>
                      <p className="text-gray-300 mb-4 text-sm leading-relaxed text-pretty">
                        How streaming platforms are becoming the perfect home for mind-bending psychological narratives that keep...
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center space-x-4">
                          <span>Dec 10, 2024</span>
                          <span>•</span>
                          <span>7 min read</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>1.8k</span>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>

                {/* Article Card 3 */}
                <Link href="/blog/ai-powered-content-recommendations">
                  <article className="bg-gradient-to-br from-[#ffffff]/10 to-[#ffffff]/5 rounded-xl overflow-hidden border border-[#e2e8f0]/20 backdrop-blur-sm hover:border-[#1d50a3]/30 transition-all duration-300 group hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#1d50a3]/10 cursor-pointer">
                    <div className="relative overflow-hidden">
                      <Image
                        src="/assets/images/blog/drama.png"
                        alt="Article image"
                        width={400}
                        height={250}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-[#1d50a3] text-white px-3 py-1 rounded-full text-xs font-semibold">TECH</span>
                      </div>
                      {/* INBV Logo Overlay */}
                      <div className="absolute bottom-2 right-2 z-10">
                        <Image
                          src={logo2}
                          alt="INBV Logo"
                          width={32}
                          height={32}
                          className="opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                        />
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-3 group-hover:text-[#1d50a3] transition-colors text-balance">
                        AI-Powered Content Recommendations: The Future is Here
                      </h3>
                      <p className="text-gray-300 mb-4 text-sm leading-relaxed text-pretty">
                        Exploring how machine learning algorithms are revolutionizing how we discover and consume
                        entertainment content.
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center space-x-4">
                          <span>Dec 8, 2024</span>
                          <span>•</span>
                          <span>6 min read</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>3.2k</span>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>

                {/* Article Card 4 */}
                <Link href="/blog/comedy-gold-best-laughs-2024">
                  <article className="bg-gradient-to-br from-[#ffffff]/10 to-[#ffffff]/5 rounded-xl overflow-hidden border border-[#e2e8f0]/20 backdrop-blur-sm hover:border-[#1d50a3]/30 transition-all duration-300 group hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#1d50a3]/10 cursor-pointer">
                    <div className="relative overflow-hidden">
                      <Image
                        src="/assets/images/blog/comedy.png"
                        alt="Article image"
                        width={400}
                        height={250}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-[#1d50a3] text-white px-3 py-1 rounded-full text-xs font-semibold">
                          REVIEW
                        </span>
                      </div>
                      {/* INBV Logo Overlay */}
                      <div className="absolute bottom-2 right-2 z-10">
                        <Image
                          src={logo2}
                          alt="INBV Logo"
                          width={32}
                          height={32}
                          className="opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                        />
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-3 group-hover:text-[#1d50a3] transition-colors text-balance">
                        Comedy Gold: The Best Laughs of the Year
                      </h3>
                      <p className="text-gray-300 mb-4 text-sm leading-relaxed text-pretty">
                        From witty dialogue to physical comedy, we round up the funniest moments that had us rolling on
                        the floor.
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center space-x-4">
                          <span>Dec 5, 2024</span>
                          <span>•</span>
                          <span>4 min read</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>1.5k</span>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              </div>

              {/* Load More Button */}
              {/* <div className="text-center">
                <button className="bg-[#ffffff]/20 text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#ffffff]/30 transition-all duration-300 border border-[#e2e8f0]/20 hover:border-[#1d50a3]/30">
                  Load More Articles
                </button>
              </div> */}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              {/* Categories */}
              <div className="bg-gradient-to-br from-[#ffffff]/10 to-[#ffffff]/5 rounded-xl p-6 border border-[#e2e8f0]/20 backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-[#1d50a3]" />
                  <span>Categories</span>
                </h3>
                <div className="space-y-3">
                  <Link
                    href="/category/reviews"
                    className="flex items-center justify-between text-gray-300 hover:text-[#1d50a3] transition-colors"
                  >
                    <span>Reviews</span>
                                         <span className="text-xs bg-[#1d50a3]/20 text-[#1d50a3] px-2 py-1 rounded-full">04</span>
                  </Link>
                  <Link
                    href="/category/industry"
                    className="flex items-center justify-between text-gray-300 hover:text-[#1d50a3] transition-colors"
                  >
                    <span>Industry News</span>
                                         <span className="text-xs bg-[#1d50a3]/20 text-[#1d50a3] px-2 py-1 rounded-full">03</span>
                  </Link>
                  <Link
                    href="/category/tech"
                    className="flex items-center justify-between text-gray-300 hover:text-[#1d50a3] transition-colors"
                  >
                    <span>Technology</span>
                                         <span className="text-xs bg-[#1d50a3]/20 text-[#1d50a3] px-2 py-1 rounded-full">06</span>
                  </Link>
                  <Link
                    href="/category/interviews"
                                         className="flex items-center justify-between text-gray-300 hover:text-[#1d50a3] transition-colors"
                  >
                    <span>Interviews</span>
                                         <span className="text-xs bg-[#1d50a3]/20 text-[#1d50a3] px-2 py-1 rounded-full">02</span>
                  </Link>
                </div>
              </div>

              {/* Popular Articles */}
                             <div className="bg-gradient-to-br from-[#ffffff]/10 to-[#ffffff]/5 rounded-xl p-6 border border-[#e2e8f0]/20 backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                                     <TrendingUp className="h-5 w-5 text-[#1d50a3]" />
                  <span>Popular This Week</span>
                </h3>
                <div className="space-y-4">
                  <article className="flex space-x-3 group cursor-pointer">
                    <Image
                      src="/assets/images/blog/scifi.png"
                      alt="Popular article"
                      width={60}
                      height={60}
                      className="w-15 h-15 object-cover rounded-lg group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold group-hover:text-[#1d50a3] transition-colors text-balance">
                        Sci-Fi Renaissance: Why Space Operas Are Back
                      </h4>
                      <p className="text-xs text-gray-400 mt-1">Dec 3, 2024</p>
                    </div>
                  </article>
                  <article className="flex space-x-3 group cursor-pointer">
                    <Image
                      src="/assets/images/blog/horror.jpg"
                      alt="Popular article"
                      width={60}
                      height={60}
                      className="w-15 h-15 object-cover rounded-lg group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold group-hover:text-[#1d50a3] transition-colors text-balance">
                        Horror's New Wave: Psychological vs. Supernatural
                      </h4>
                      <p className="text-xs text-gray-400 mt-1">Nov 28, 2024</p>
                    </div>
                  </article>
                </div>
              </div>

              {/* Newsletter Subscription */}
              <div className="bg-gradient-to-br from-[#1d50a3]/10 to-blue-600/10 rounded-xl p-6 border border-[#1d50a3]/20 backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-3">Stay Updated</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Get the latest articles and industry insights delivered to your inbox.
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full bg-[#ffffff]/20 border border-[#e2e8f0]/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1d50a3]/50 focus:border-[#1d50a3]/50"
                  />
                  <button className="w-full bg-[#1d50a3] text-white py-2 rounded-lg font-semibold text-sm hover:bg-[#1d50a3]/90 transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Content Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-[#020D1E] to-[#0A2043] relative">
        <div className="absolute inset-0 opacity-20">
          <Image src="/assets/images/blog/blog05.jpg" alt="Background pattern" fill className="object-cover" />
        </div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Featured Content Series
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Dive deep into our comprehensive series covering the most important topics in streaming and entertainment.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-[#ffffff]/10 to-[#ffffff]/5 rounded-xl p-8 border border-[#e2e8f0]/20 backdrop-blur-sm hover:border-[#1d50a3]/30 transition-all duration-300 group hover:transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-[#1d50a3] to-[#1d50a3]/80 rounded-full w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Film className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 group-hover:text-[#1d50a3] transition-colors">
                The Indie Revolution
              </h3>
              <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                A 5-part series exploring how independent filmmakers are disrupting traditional Hollywood models.
              </p>
              <Link
                href="/series/indie-revolution"
                className="inline-flex items-center space-x-2 text-[#1d50a3] hover:text-[#1d50a3]/80 transition-colors font-semibold text-sm"
              >
                <span>Read Series</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="bg-gradient-to-br from-[#ffffff]/10 to-[#ffffff]/5 rounded-xl p-8 border border-[#e2e8f0]/20 backdrop-blur-sm hover:border-blue-600/30 transition-all duration-300 group hover:transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-[#1d50a3] to-[#1d50a3]/80 rounded-full w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 group-hover:text-[#1d50a3] transition-colors">
                Streaming Wars 2024
              </h3>
              <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                An in-depth analysis of how major platforms are competing for viewer attention and market share.
              </p>
              <Link
                href="/series/streaming-wars"
                className="inline-flex items-center space-x-2 text-[#1d50a3] hover:text-[#1d50a3]/80 transition-colors font-semibold text-sm"
              >
                <span>Read Series</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="bg-gradient-to-br from-[#ffffff]/10 to-[#ffffff]/5 rounded-xl p-8 border border-[#e2e8f0]/20 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300 group hover:transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-[#1d50a3] to-[#1d50a3]/80 rounded-full w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 group-hover:text-[#1d50a3] transition-colors">
                Future of Entertainment
              </h3>
              <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                Exploring emerging technologies like VR, AR, and AI that will shape the next decade of content.
              </p>
              <Link
                href="/series/future-entertainment"
                className="inline-flex items-center space-x-2 text-[#1d50a3] hover:text-[#1d50a3]/80 transition-colors font-semibold text-sm"
              >
                <span>Read Series</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

     
    </div>
  )
}
