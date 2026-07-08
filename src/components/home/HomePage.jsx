import LeftPanel from './LeftPanel'
import RightPanel from './RightPanel'
import './home.css'

// SPLIT-BRAIN HOME
// Desktop: 50/50 — left ledger pins full-height while the loud half scrolls.
// Mobile: ledger first, then the loud half.

export default function HomePage({ booted }) {
  return (
    <main id="top" className="grid md:grid-cols-2">
      <div className="relative">
        <div className="md:sticky md:top-0 md:h-screen">
          <LeftPanel booted={booted} />
        </div>
      </div>
      <RightPanel />
    </main>
  )
}
