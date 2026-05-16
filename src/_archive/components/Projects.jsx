import React from 'react'

const Projects = () => {
  // You can easily update these projects with your own content
  const projects = [
    {
      title: 'SOHS Calendar',
      date: 'August 2025',
      description: 'This website lets you sync all South Oldham High School events—including activities, sports, and deadlines—directly to your Google Calendar so you never miss anything important',
      link: 'https://sohsevents.vercel.app/'
    },
    {
      title: 'NicheRank',
      date: 'September 2025',
      description: 'This website allows users to discover the top-ranked websites for any niche by analyzing search presence, performance, authority, freshness, and usability using a real-time scoring algorithm',
      link: 'https://website-ranker-h96umzntq-mattyparks-projects.vercel.app/'
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
        <h1 className="text-5xl md:text-6xl font-bold mb-16">Projects</h1>

        {/* Projects List */}
        <div className="space-y-12">
          {projects.map((project, index) => (
            <a
              key={index}
              href={project.link}
              className="block group"
            >
              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-semibold group-hover:text-mocha-mousse transition-colors duration-200">
                  {project.title}
                </h2>
                <p className="text-sm md:text-base text-gray-500">{project.date}</p>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  {project.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Projects

