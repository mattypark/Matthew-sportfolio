import React from 'react'

const Posts = () => {
  // You can easily update these posts with your own content
  const posts = [
    {
      title: 'Post Title 1',
      date: 'January 15, 2024',
      description: 'Add your own description here about what this post is about.',
      link: '#'
    },
    {
      title: 'Post Title 2',
      date: 'December 10, 2023',
      description: 'Add your own description here about what this post is about.',
      link: '#'
    },
    {
      title: 'Post Title 3',
      date: 'November 5, 2023',
      description: 'Add your own description here about what this post is about.',
      link: '#'
    },
  ]

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 md:px-12 py-16 md:py-24">
        
        {/* Back Link */}
        <a 
          href="/" 
          className="inline-block mb-12 text-gray-600 hover:text-black transition-colors duration-200"
        >
          ← Back
        </a>

        {/* Page Title */}
        <h1 className="text-5xl md:text-6xl font-bold mb-16">Posts</h1>

        {/* Posts List */}
        <div className="space-y-12">
          {posts.map((post, index) => (
            <a
              key={index}
              href={post.link}
              className="block group"
            >
              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-semibold group-hover:text-mocha-mousse transition-colors duration-200">
                  {post.title}
                </h2>
                <p className="text-sm md:text-base text-gray-500">{post.date}</p>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  {post.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Posts

