"use client"

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Eye, 
  Heart, 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin,
  ChevronUp,
  User,
  Tag
} from 'lucide-react'
import NavbarTwo from "../../../../components/navbarSearch"
import Footer from "../../../../components/footer"
import logo from '../../../../public/assets/images/logo/logo2.png'

export default function BlogPost() {
  const params = useParams()
  const router = useRouter()
  const [post, setPost] = useState(null)
  const [relatedPosts, setRelatedPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [readingProgress, setReadingProgress] = useState(0)
  const [liked, setLiked] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  
  const contentRef = useRef(null)
  const scrollRef = useRef(null)
  const shareMenuRef = useRef(null)

  // Locomotive Scroll disabled for blog post pages to allow sticky sidebar
  // The smooth scroll effect conflicts with position: sticky
  // useEffect(() => {
  //   let scroll
  //   import("locomotive-scroll").then((LocomotiveScroll) => {
  //     scroll = new LocomotiveScroll.default({
  //       el: scrollRef.current,
  //       smooth: true,
  //       lerp: 0.04,
  //     })
  //   })
  //   import("locomotive-scroll/dist/locomotive-scroll.css")
  //   return () => {
  //     if (scroll) scroll.destroy()
  //   }
  // }, [post])

  // Fetch blog post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/blog/${params.slug}`)
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        
        const data = await response.json()
        
        if (data.success && data.post) {
          setPost(data.post)
          setRelatedPosts(data.relatedPosts || [])
          setError(null)
        } else {
          setError(data.error || 'Post not found')
        }
      } catch (err) {
        setError('Failed to load post')
        console.error('Error fetching post:', err)
      } finally {
        setLoading(false)
      }
    }

    if (params?.slug) {
      fetchPost()
    } else {
      setError('No post slug provided')
      setLoading(false)
    }
  }, [params?.slug])

  // Reading progress tracking
  useEffect(() => {
    const updateReadingProgress = () => {
      if (!contentRef.current) return
      
      const element = contentRef.current
      const totalHeight = element.scrollHeight - element.clientHeight
      const windowScrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
      
      if (totalHeight > 0) {
        const progress = Math.min(100, (windowScrollTop / totalHeight) * 100)
        setReadingProgress(progress)
        setShowScrollTop(progress > 20)
      }
    }

    window.addEventListener('scroll', updateReadingProgress)
    return () => window.removeEventListener('scroll', updateReadingProgress)
  }, [])

  // Click outside to close share menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
        setShowShareMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLike = () => {
    setLiked(!liked)
    // Here you would typically update the like count in your database
  }

  const handleShare = (platform) => {
    const url = window.location.href
    const title = post?.title || 'Check out this article'
    
    let shareUrl = ''
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        break
      case 'copy':
        navigator.clipboard.writeText(url)
        alert('Link copied to clipboard!')
        return
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400')
    }
    setShowShareMenu(false)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const formatContent = (content) => {
    if (!content || typeof content !== 'string') return ''
    
    try {
      // Convert markdown-style headers to HTML
      let formatted = content
        .replace(/^# (.*$)/gm, '<h1 class="text-4xl font-bold mb-6 mt-8 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">$1</h1>')
        .replace(/^## (.*$)/gm, '<h2 class="text-3xl font-bold mb-4 mt-8 text-white">$1</h2>')
        .replace(/^### (.*$)/gm, '<h3 class="text-2xl font-semibold mb-3 mt-6 text-gray-200">$1</h3>')
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
        .replace(/^\- (.*$)/gm, '<li class="mb-2 text-gray-300">$1</li>')
        .replace(/\n\n/g, '</p><p class="mb-4 text-gray-300 leading-relaxed">')
      
      return `<div class="prose prose-lg max-w-none"><p class="mb-4 text-gray-300 leading-relaxed">${formatted}</p></div>`
    } catch (error) {
      console.error('Error formatting content:', error)
      return '<p class="text-gray-300">Error formatting content</p>'
    }
  }

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(to top, #020E21 0%, #091F4E 50%, #020D23 100%)" }}
      >
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1d50a3] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading article...</p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(to top, #020E21 0%, #091F4E 50%, #020D23 100%)" }}
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Article Not Found</h1>
          <p className="text-gray-300 mb-8">The article you're looking for doesn't exist.</p>
          <Link 
            href="/blog"
            className="inline-flex items-center space-x-2 bg-[#1d50a3] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1d50a3]/90 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Blog</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen scroll-smooth"
      style={{ background: "linear-gradient(to top, #020E21 0%, #091F4E 50%, #020D23 100%)" }}
    >
      <NavbarTwo />
      
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-800 z-50">
        <div 
          className="h-full bg-gradient-to-r from-[#1d50a3] to-blue-400 transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        ></div>
      </div>

      {/* Article Header */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#020b1f]/90 via-[#0a2151]/80 to-transparent"></div>
        
        <div className="relative z-10 container mx-auto max-w-4xl">
          {/* Back Button */}
          <Link 
            href="/blog"
            className="inline-flex items-center space-x-2 text-gray-300 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Blog</span>
          </Link>

          {/* Category Badge */}
          <div className="mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#1d50a3] text-white">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-gray-300 leading-relaxed mb-8 max-w-3xl">
            {post.excerpt}
          </p>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-8">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>INBV Media Group</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{post.publishDate ? new Date(post.publishDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }) : 'Unknown Date'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>{post.readTime || 'Unknown'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>{(post.views || 0).toLocaleString()} views</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                liked 
                  ? 'bg-red-600 text-white' 
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
              <span>{liked ? post.likes + 1 : post.likes}</span>
            </button>
            
            <div className="relative" ref={shareMenuRef}>
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  showShareMenu 
                    ? 'bg-[#1d50a3] text-white shadow-lg' 
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </button>
              
              {showShareMenu && (
                <div className="absolute bottom-full mb-3 left-0 bg-gradient-to-br from-[#2a2a5a] to-[#1a1a3a] border border-[#1d50a3]/30 rounded-xl shadow-2xl overflow-visible z-[9999] min-w-[180px] backdrop-blur-sm">
                  {/* Share Header */}
                  <div className="px-4 py-3 border-b border-white/10">
                    <h4 className="text-white font-semibold text-sm">Share Article</h4>
                  </div>
                  
                  {/* Share Options */}
                  <div className="py-2">
                    <button
                      onClick={() => handleShare('facebook')}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-[#1d50a3]/20 hover:text-white transition-all duration-200 group"
                    >
                      <div className="w-8 h-8 bg-[#1877F2] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Facebook className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium">Facebook</span>
                    </button>
                    
                    <button
                      onClick={() => handleShare('twitter')}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-[#1d50a3]/20 hover:text-white transition-all duration-200 group"
                    >
                      <div className="w-8 h-8 bg-[#1DA1F2] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Twitter className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium">Twitter</span>
                    </button>
                    
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-[#1d50a3]/20 hover:text-white transition-all duration-200 group"
                    >
                      <div className="w-8 h-8 bg-[#0A66C2] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Linkedin className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium">LinkedIn</span>
                    </button>
                    
                    {/* Separator */}
                    <div className="my-2 mx-4 border-t border-white/10"></div>
                    
                    <button
                      onClick={() => handleShare('copy')}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-[#1d50a3]/20 hover:text-white transition-all duration-200 group"
                    >
                      <div className="w-8 h-8 bg-[#6B7280] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Share2 className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium">Copy Link</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Main Content */}
            <article className="lg:col-span-3" ref={contentRef}>
              <div className="prose prose-lg prose-invert max-w-none">
                <div 
                  className="article-content text-lg leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
                />
              </div>

              {/* Tags */}
              <div className="mt-12 pt-8 border-t border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Tag className="h-5 w-5 mr-2 text-[#1d50a3]" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#1d50a3]/20 text-[#1d50a3] border border-[#1d50a3]/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Author Bio */}
              <div className="mt-12 p-6 bg-gradient-to-br from-white/10 to-white/5 rounded-xl border border-white/20">
                <div className="flex items-start space-x-4">
                
                    <Image 
                      src={logo}
                      alt="INBV Logo"
                      width={70}
                      height={70}
                      className="object-contain"
                    />
                  
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-white mb-2">INBV Media Group</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">Your trusted source for streaming and entertainment news, reviews, and insights.</p>
                  </div>
                </div>
              </div>
            </article>

            {/* Sidebar - Fixed Position */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                {/* Quick Navigation - Sticky */}
                <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-6 border border-white/20">
                  <h3 className="text-lg font-semibold text-white mb-4">Quick Navigation</h3>
                  <nav className="space-y-3">
                    <button 
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }}
                      className="w-full text-left flex items-center space-x-2 text-sm text-gray-300 hover:text-[#1d50a3] transition-all duration-200 cursor-pointer group hover:bg-white/5 rounded-lg p-2 -m-2"
                    >
                      <ChevronUp className="h-4 w-4 group-hover:-translate-y-1 transition-transform" />
                      <span>Back to Top</span>
                    </button>
                    <Link 
                      href="/blog"
                      className="flex items-center space-x-2 text-sm text-gray-300 hover:text-[#1d50a3] transition-all duration-200 group hover:bg-white/5 rounded-lg p-2 -m-2"
                    >
                      <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                      <span>All Articles</span>
                    </Link>
                  </nav>
                </div>

                {/* Related Articles */}
                {relatedPosts.length > 0 && (
                  <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-6 border border-white/20 overflow-hidden">
                    <h3 className="text-lg font-semibold text-white mb-4">Related Articles</h3>
                    <div className="space-y-4">
                      {relatedPosts.slice(0, 2).map((relatedPost) => (
                        <Link
                          key={relatedPost.slug}
                          href={`/blog/${relatedPost.slug}`}
                          className="block group"
                        >
                          <div className="flex gap-3">
                            <div className="w-14 h-14 relative rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={relatedPost.featuredImage}
                                alt={relatedPost.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-white group-hover:text-[#1d50a3] transition-colors mb-1 line-clamp-2 break-words">
                                {relatedPost.title}
                              </h4>
                              <p className="text-xs text-gray-400 truncate">
                                {relatedPost.readTime} • {relatedPost.category}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-[#1d50a3] text-white rounded-full shadow-lg hover:bg-[#1d50a3]/90 transition-all duration-300 flex items-center justify-center z-50"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}

      <Footer />
    </div>
  )
}
