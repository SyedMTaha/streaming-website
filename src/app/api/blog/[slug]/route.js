import { NextResponse } from 'next/server'
import blogData from '../../../../data/blogPosts.json'

export async function GET(request, { params }) {
  try {
    console.log('API Route called with params:', params)
    
    if (!params || !params.slug) {
      return NextResponse.json(
        { success: false, error: 'No slug provided' },
        { status: 400 }
      )
    }

    const { slug } = params
    console.log('Looking for post with slug:', slug)
    
    if (!blogData || !blogData.posts) {
      console.error('Blog data not found or invalid')
      return NextResponse.json(
        { success: false, error: 'Blog data not available' },
        { status: 500 }
      )
    }

    // Find the post by slug
    const post = blogData.posts.find(post => post && post.slug === slug)
    console.log('Found post:', post ? 'YES' : 'NO')

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      )
    }

    // Find related posts (same category or tags, excluding current post)
    const relatedPosts = blogData.posts
      .filter(p => {
        if (!p || p.slug === slug) return false // Exclude current post
        
        // Posts in same category
        if (p.category === post.category) return true
        
        // Posts with similar tags
        if (post.tags && p.tags && Array.isArray(post.tags) && Array.isArray(p.tags)) {
          const hasCommonTag = post.tags.some(tag => 
            p.tags.some(pTag => 
              typeof tag === 'string' && typeof pTag === 'string' &&
              pTag.toLowerCase() === tag.toLowerCase()
            )
          )
          if (hasCommonTag) return true
        }
        
        return false
      })
      .sort((a, b) => {
        const dateA = new Date(a.publishDate || 0)
        const dateB = new Date(b.publishDate || 0)
        return dateB - dateA
      })
      .slice(0, 6) // Limit to 6 related posts
      .map(p => ({
        id: p.id || '',
        slug: p.slug || '',
        title: p.title || 'Untitled',
        excerpt: p.excerpt || '',
        author: p.author || { name: 'Unknown' },
        publishDate: p.publishDate || new Date().toISOString(),
        readTime: p.readTime || '0 min',
        category: p.category || 'Uncategorized',
        featuredImage: p.featuredImage || '/placeholder.jpg',
        views: p.views || 0
      }))

    // Increment view count (in a real app, you'd update the database)
    // For now, we'll just return the current view count
    const updatedPost = {
      ...post,
      // views: post.views + 1 // Uncomment this when connected to a database
    }

    console.log('Returning post data successfully')
    return NextResponse.json({
      success: true,
      post: updatedPost,
      relatedPosts
    })
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog post' },
      { status: 500 }
    )
  }
}

export async function PATCH(request, { params }) {
  try {
    const { slug } = params
    const body = await request.json()

    // Find the post by slug
    const postIndex = blogData.posts.findIndex(post => post.slug === slug)

    if (postIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      )
    }

    // Update specific fields (like view count, likes, etc.)
    if (body.incrementViews) {
      blogData.posts[postIndex].views = (blogData.posts[postIndex].views || 0) + 1
    }

    if (body.incrementLikes) {
      blogData.posts[postIndex].likes = (blogData.posts[postIndex].likes || 0) + 1
    }

    if (body.decrementLikes) {
      blogData.posts[postIndex].likes = Math.max(0, (blogData.posts[postIndex].likes || 0) - 1)
    }

    // In a real application, you would save this to a database
    // For now, the changes are only in memory and will reset on server restart

    return NextResponse.json({
      success: true,
      post: blogData.posts[postIndex]
    })
  } catch (error) {
    console.error('Error updating blog post:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update blog post' },
      { status: 500 }
    )
  }
}
