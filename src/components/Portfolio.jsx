import React, { useState } from 'react'

const Portfolio = () => {
  const [emailCopied, setEmailCopied] = useState(false)

  // Social media links - update with your actual profiles
  const socialLinks = [
    { name: 'YouTube', url: 'https://www.youtube.com/@Mattyparkkk' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/matthew-park-487889350/' },
    { name: 'X/Twitter', url: 'https://x.com/MattyparkW' },
    { name: 'Instagram', url: 'https://www.instagram.com/matty.park/' },
  ]

  // Blog posts - easily add new posts here
  const blogPosts = [
    {
      title: 'My Journey as a Young Entrepreneur',
      date: 'November 2, 2025',
      description: 'How I started my consulting business at 15 and what I learned along the way.',
      link: '/blog/young-entrepreneur'
    },
    {
      title: 'Balancing School and Business',
      date: 'October 15, 2025',
      description: 'Tips and strategies for managing academic life while building a business.',
      link: '/blog/balancing-school-business'
    },
    {
      title: 'Getting Started with Sales',
      date: 'September 28, 2025',
      description: 'My first 4 months in sales and the lessons I learned about communicating value.',
      link: '/blog/getting-started-sales'
    },
  ]

  const handleEmailCopy = () => {
    navigator.clipboard.writeText('mattyparkbusiness@gmail.com') // Update with your actual email
    setEmailCopied(true)
    setTimeout(() => setEmailCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 md:px-12 py-16 md:py-24">
        
        {/* Header Section */}
        <section className="mb-20 md:mb-32">
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold mb-8 leading-none tracking-tight">
            Matthew
            <br />
            Park
          </h1>
          
          <p className="text-xl sm:text-2xl md:text-3xl mb-12 font-light text-gray-800">
            15 y/o entrepreneur and student-athlete
          </p>

          {/* Social Links */}
          <div className="flex flex-wrap gap-4 mb-8">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base md:text-lg text-black hover:text-mocha-mousse transition-colors duration-200 underline underline-offset-4"
              >
                {social.name}
              </a>
            ))}
            <button
              onClick={handleEmailCopy}
              className="text-base md:text-lg text-black hover:text-mocha-mousse transition-colors duration-200 underline underline-offset-4 cursor-pointer"
            >
              {emailCopied ? 'Email copied!' : 'Copy email'}
            </button>
          </div>
        </section>

        {/* About Section */}
        <section className="mb-20 md:mb-32">
          <div className="space-y-6 text-lg md:text-xl leading-relaxed text-gray-700">
            <p>
              I'm interested in changing the world through technology and business. Born on October 12, 2010, I'm currently a student at South Oldham High School.
            </p>
            <p>
              I've been an entrepreneur for 3+ years, building my skills in marketing, sales, and coding. I own a consulting business helping brands scale online.
            </p>
          </div>
        </section>

        {/* Blog Section */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Blog posts</h2>
          
          <div className="space-y-10 md:space-y-12">
            {blogPosts.map((post, index) => (
              <a
                key={index}
                href={post.link}
                className="block group"
              >
                <div className="space-y-2">
                  <h3 className="text-xl md:text-2xl font-semibold group-hover:text-mocha-mousse transition-colors duration-200">
                    {post.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-500">{post.date}</p>
                  {post.description && (
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                      {post.description}
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        </section>

      </div>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-6 sm:px-8 md:px-12 py-12 border-t border-gray-200 mt-20">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Matthew Park. All rights reserved.
        </p>
      </footer>
    </div>
  )
}

export default Portfolio

