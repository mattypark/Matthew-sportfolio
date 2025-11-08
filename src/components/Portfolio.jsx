import React, { useState } from 'react'

const Portfolio = () => {
  const [emailCopied, setEmailCopied] = useState(false)

  // Social media links - update with your actual profiles
  const socialLinks = [
    { name: 'YouTube', url: 'https://www.youtube.com/@Mattyparkkk' },
    { name: 'Instagram', url: 'https://www.instagram.com/matty.park/' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/matthew-park-487889350/' },
    { name: 'X/Twitter', url: 'https://x.com/MattyparkW' },
    { name: 'GitHub', url: 'https://github.com/mattypark' },
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
        <section className="mb-12 md:mb-16">
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold mb-8 leading-none tracking-tight">
            Matthew
            <br />
            Park
          </h1>
          
          <p className="text-xl sm:text-2xl md:text-3xl mb-8 font-light text-gray-800">
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
        <section className="mb-12 md:mb-16">
          <div className="space-y-6 text-lg md:text-xl leading-relaxed text-gray-700">
            <p>
              I'm interested in changing the old education system and replacing it with modern education. I'm currently a student at South Oldham High School.
            </p>
            <p>
              I've been an entrepreneur for 3+ years, building my skills in marketing, sales, and coding. I own a consulting business helping brands scale online.
            </p>
            <p>
              I love basketball, walking around in my neighborhood at sunset, and creating content.
            </p>
          </div>
        </section>

        {/* Navigation Section */}
        <section className="mb-0">
          <nav className="space-y-4">
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
      <footer className="max-w-4xl mx-auto px-6 sm:px-8 md:px-12 py-3 mt-0">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500">
              <path d="M6 0.75C3.51562 0.75 1.5 2.76562 1.5 5.25C1.5 8.4375 6 11.25 6 11.25C6 11.25 10.5 8.4375 10.5 5.25C10.5 2.76562 8.48438 0.75 6 0.75ZM6 6.75C5.17031 6.75 4.5 6.07969 4.5 5.25C4.5 4.42031 5.17031 3.75 6 3.75C6.82969 3.75 7.5 4.42031 7.5 5.25C7.5 6.07969 6.82969 6.75 6 6.75Z" fill="currentColor"/>
            </svg>
            Kentucky
          </span>
          <span>{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</span>
        </div>
      </footer>
    </div>
  )
}

export default Portfolio

