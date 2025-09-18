import { NextResponse } from 'next/server'
import blogData from '../../../data/blogPosts.json'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit')) || null
    const featured = searchParams.get('featured') === 'true'
    const tag = searchParams.get('tag')

    let posts = [...blogData.posts]

    // Filter by category
    if (category) {
      posts = posts.filter(post => 
        post.category.toLowerCase() === category.toLowerCase()
      )
    }

    // Filter by featured
    if (featured) {
      posts = posts.filter(post => post.featured === true)
    }

    // Filter by tag
    if (tag) {
      posts = posts.filter(post => 
        post.tags && post.tags.some(postTag => 
          postTag.toLowerCase().includes(tag.toLowerCase())
        )
      )
    }

    // Sort by publish date (newest first)
    posts.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))

    // Apply limit if specified
    if (limit && limit > 0) {
      posts = posts.slice(0, limit)
    }

    // Return simplified post data for listing (without full content)
    const simplifiedPosts = posts.map(post => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      author: post.author,
      publishDate: post.publishDate,
      readTime: post.readTime,
      category: post.category,
      tags: post.tags,
      featuredImage: post.featuredImage,
      views: post.views,
      likes: post.likes,
      featured: post.featured,
      metaDescription: post.metaDescription
    }))

    return NextResponse.json({
      success: true,
      posts: simplifiedPosts,
      totalCount: posts.length,
      categories: blogData.categories,
      popularTags: blogData.popularTags
    })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}
