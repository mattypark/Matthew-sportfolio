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

  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every second
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

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

        {/* Navigation Section */}
        <section className="mb-20">
          <nav className="space-y-4">
            <a 
              href="/posts" 
              className="block text-2xl md:text-3xl text-gray-600 hover:text-black transition-colors duration-200"
            >
              Posts
            </a>
            <a 
              href="/projects" 
              className="block text-2xl md:text-3xl text-gray-600 hover:text-black transition-colors duration-200"
            >
              Projects
            </a>
          </nav>
        </section>

      </div>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-6 sm:px-8 md:px-12 py-12 mt-20">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>📍 Kentucky</span>
          <span>{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</span>
        </div>
      </footer>
    </div>
  )
}

export default Portfolio

