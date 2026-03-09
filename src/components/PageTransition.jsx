import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import './PageTransition.css'

const numColumns = 5

const routeNameMap = {
  '/': 'Home',
  '/posts': 'Posts',
  '/projects': 'Projects',
  '/values': 'Values',
  '/about': 'About',
  '/socials': 'Socials',
}

const letterVariants = {
  initial: {
    opacity: 0,
    y: 15,
    rotateZ: -8,
    scale: 0.8,
  },
  animate: (i) => ({
    opacity: 1,
    y: 0,
    rotateZ: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: 0.2 + 0.1 * i,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

const textContainerVariants = {
  initial: { y: 0, opacity: 1 },
  animate: {
    y: '100vh',
    opacity: 1,
    transition: {
      duration: 0.6,
      delay: 1.15,
      ease: [0.76, 0, 0.24, 1],
    },
  },
}

const underlineVariants = {
  initial: { pathLength: 0, opacity: 0 },
  animate: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: {
        duration: 0.8,
        delay: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
      opacity: {
        duration: 0.2,
        delay: 0.5,
      },
    },
  },
}

function TransitionOverlay({ routeName }) {
  const letters = routeName.split('')

  return (
    <>
      {/* Layer 1: Column Wipe */}
      <div className="transition-background">
        {[...Array(numColumns)].map((_, i) => (
          <motion.div
            key={i}
            className="transition-column"
            initial={{ top: 0 }}
            animate={{
              top: '100vh',
              transition: {
                duration: 0.6,
                delay: 1.1 + 0.08 * (numColumns - i),
                ease: [0.76, 0, 0.24, 1],
              },
              transitionEnd: {
                height: 0,
                top: 0,
              },
            }}
          />
        ))}
      </div>

      {/* Layer 2: Signature Text */}
      <motion.div
        className="route-text"
        variants={textContainerVariants}
        initial="initial"
        animate="animate"
      >
        <div className="route-text-inner">
          {letters.map((letter, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={letterVariants}
              initial="initial"
              animate="animate"
              className="route-letter"
            >
              {letter}
            </motion.span>
          ))}
        </div>
        <svg className="route-underline" viewBox="0 0 200 20">
          <motion.path
            d="M5 10 L195 10"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            variants={underlineVariants}
            initial="initial"
            animate="animate"
          />
        </svg>
      </motion.div>
    </>
  )
}

export default function PageTransition({ children }) {
  const location = useLocation()
  const routeName = routeNameMap[location.pathname] || 'Page'

  return (
    <AnimatePresence mode="wait">
      <div key={location.pathname}>
        {/* Transition overlay layers */}
        <TransitionOverlay routeName={routeName} />

        {/* Layer 3: Page Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.7,
              delay: 1.6,
              ease: [0.215, 0.61, 0.355, 1],
            },
          }}
        >
          {children}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
