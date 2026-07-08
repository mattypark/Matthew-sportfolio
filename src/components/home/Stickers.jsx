import { motion } from 'framer-motion'

// Draggable sticker chips scattered over a block on the loud half.
// Parent must be position:relative and pass its ref as dragConstraints.

const STICKERS = [
  { label: 'TENNIS', emoji: '🎾', style: { top: '6%', left: '4%' }, rot: -8 },
  { label: 'AI', emoji: '✨', style: { top: '10%', right: '6%' }, rot: 7 },
  { label: 'CODE', emoji: '⌨️', style: { bottom: '20%', left: '6%' }, rot: -5 },
  { label: 'CONTENT', emoji: '🎬', style: { bottom: '8%', right: '10%' }, rot: 9 },
  { label: 'SAAS', emoji: '☁️', style: { top: '44%', left: '1%' }, rot: 4 },
  { label: 'FAITH', emoji: '✝️', style: { top: '38%', right: '2%' }, rot: -7 },
]

export default function StickerField({ constraintsRef }) {
  return (
    <>
      {STICKERS.map((s) => (
        <motion.div
          key={s.label}
          className="sticker"
          style={s.style}
          initial={{ rotate: s.rot, scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          drag
          dragConstraints={constraintsRef}
          dragElastic={0.12}
          dragMomentum={false}
          whileDrag={{ scale: 1.12, rotate: 0, zIndex: 50 }}
          whileHover={{ scale: 1.06 }}
          data-hover
        >
          <span className="text-[15px] leading-none">{s.emoji}</span>
          {s.label}
        </motion.div>
      ))}
    </>
  )
}
