import { useEffect, useRef, useState } from 'react'

// Messages relay through /api/message (Vercel function) → Google Apps Script
// → Google Sheet. Direct browser→Apps Script calls die on CORS redirects.
const MESSAGE_ENDPOINT = '/api/message'

const HELP_LINES = [
  'available commands:',
  '  story      the whole arc, fast',
  '  building   what i\'m shipping right now',
  '  message    send me a message (lands in my inbox)',
  '  contact    where to find me',
  '  clear      wipe the screen',
]

const STORY_LINES = [
  '2010 — born in louisville, kentucky. 10.12.10.',
  '2024 — kmea all-state alto sax, second chair.',
  '2025 — first viral video. the algorithm decided i was worth showing to strangers.',
  '2025 — cofounded an app with mau. not a deck, a product people actually opened.',
  '2025 — 7x\'d it. two thousand to fourteen thousand users in two weeks.',
  '2026 — mit critical data researcher. fifteen years old in that room.',
  '2026 — sustainable development national award at lrsef.',
  '2026 — 50k subs, 30m+ views across platforms.',
  '2026 — stanford ases launchpad. got the email, went back to shipping.',
  '2026 — founded axiom. seventeen chapters in the first year.',
  '2026 — slapshift. slap your macbook, apps open. stupid premise, real product.',
  '2026 — this page. the loop closed once. next thing will be smaller and stranger.',
]

const BUILDING_LINES = [
  'axiom — nonprofit chapter system. ai, cs, entrepreneurship, taught by builders.',
  'slapshift — macos extension. accelerometer reads the slap, gestures fire shortcuts.',
  'mit critical data — research on real clinical datasets.',
  'content — 50k subs and counting. the camera is a distribution channel.',
]

const CONTACT_LINES = [
  'email — matthew.parkk0@gmail.com',
  'or type "message" and send one right here.',
]

// Message flow: each step asks a question and stores the answer under `key`.
const MESSAGE_STEPS = [
  { key: 'name', q: "what's your name?" },
  { key: 'building', q: 'what do you do — or what are you building?' },
  { key: 'email', q: "what's your email?" },
  { key: 'message', q: "what's the message you want to send me?" },
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

let lineId = 0
const mkLine = (text, kind = 'out') => ({ id: ++lineId, text, kind })

export default function Terminal() {
  const [lines, setLines] = useState([
    mkLine('matthew.sh booted. type "?" to start.'),
  ])
  const [input, setInput] = useState('')
  const [stepIdx, setStepIdx] = useState(-1) // -1 = idle, otherwise index into MESSAGE_STEPS
  const [draft, setDraft] = useState({})
  const [sending, setSending] = useState(false)
  const inputRef = useRef(null)
  const bodyRef = useRef(null)

  useEffect(() => {
    const el = bodyRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines])

  const print = (texts, kind = 'out') =>
    setLines((prev) => [
      ...prev,
      ...(Array.isArray(texts) ? texts : [texts]).map((t) => mkLine(t, kind)),
    ])

  const sendToSheet = async (data) => {
    setSending(true)
    try {
      const res = await fetch(MESSAGE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error(`status ${res.status}`)
      print(`sent. i will actually read this. thanks, ${data.name} :)`)
    } catch {
      print('hm, that didn\'t go through. email me instead: matthew.parkk0@gmail.com', 'err')
    } finally {
      setSending(false)
    }
  }

  const handleMessageStep = (value) => {
    const step = MESSAGE_STEPS[stepIdx]

    if (value.toLowerCase() === 'cancel') {
      setStepIdx(-1)
      setDraft({})
      print('cancelled. no worries.')
      return
    }
    if (step.key === 'email' && !EMAIL_RE.test(value)) {
      print('that doesn\'t look like an email. try again (or "cancel").', 'err')
      return
    }

    const nextDraft = { ...draft, [step.key]: value }
    setDraft(nextDraft)

    if (stepIdx < MESSAGE_STEPS.length - 1) {
      const next = stepIdx + 1
      setStepIdx(next)
      const prefix = next === 1 ? `hey ${value}. ` : next === 2 ? 'nice. ' : 'got it. '
      print(prefix + MESSAGE_STEPS[next].q)
    } else {
      setStepIdx(-1)
      setDraft({})
      sendToSheet(nextDraft)
    }
  }

  const runCommand = (raw) => {
    const cmd = raw.toLowerCase()
    switch (cmd) {
      case '?':
      case 'help':
        print(HELP_LINES)
        break
      case 'story':
        print(['—— the story so far ——', ...STORY_LINES])
        break
      case 'building':
        print(['—— currently building ——', ...BUILDING_LINES])
        break
      case 'contact':
        print(['—— contact ——', ...CONTACT_LINES])
        break
      case 'message':
        print([
          '—— send me a message ——',
          'four quick questions, then it lands in my inbox.',
          'type "cancel" anytime to back out.',
          MESSAGE_STEPS[0].q,
        ])
        setStepIdx(0)
        setDraft({})
        break
      case 'clear':
        setLines([])
        break
      case '':
        break
      default:
        print(`command not found: ${raw}. type "?" for help.`, 'err')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (sending) return
    const value = input.trim()
    setInput('')
    if (!value) return
    print(`> ${value}`, 'in')
    if (stepIdx >= 0) handleMessageStep(value)
    else runCommand(value)
  }

  const insertCommand = (cmd) => {
    if (sending) return
    print(`> ${cmd}`, 'in')
    if (stepIdx >= 0) handleMessageStep(cmd)
    else runCommand(cmd)
    inputRef.current?.focus()
  }

  const lineColor = (kind) =>
    kind === 'in' ? 'text-paper' : kind === 'err' ? 'text-[var(--primary)]' : 'text-paper/70'

  return (
    <section id="terminal" className="relative gutter pt-[4vh] pb-[14vh]">
      <div className="mb-10 text-center">
        <div className="section-label text-paper/55 mb-3">// THE TERMINAL</div>
        <p className="mx-auto max-w-[560px] font-mono text-[12px] text-paper/65 leading-[1.55]">
          // ask me anything. type "?" to see what it can do. "message" sends straight to me.
        </p>
      </div>

      <div
        className="mx-auto max-w-[920px] border border-paper/25 bg-black/60"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Title bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-paper/15 font-mono text-[11px] tracking-[0.18em] uppercase text-paper/50 select-none">
          <span className="flex items-center gap-2" aria-hidden="true">
            <span className="w-[9px] h-[9px] rounded-full border border-paper/40" />
            <span className="w-[9px] h-[9px] rounded-full border border-paper/40" />
            <span className="w-[9px] h-[9px] rounded-full border border-paper/40" />
          </span>
          <span>matthew.sh — ask anything</span>
          <span>type ? for help</span>
        </div>

        {/* Output */}
        <div
          ref={bodyRef}
          className="h-[380px] overflow-y-auto px-5 py-4 font-mono text-[13px] leading-[1.7]"
          role="log"
          aria-live="polite"
        >
          {lines.map((l) => (
            <div key={l.id} className={`whitespace-pre-wrap ${lineColor(l.kind)} ${l.kind === 'in' ? 'font-bold' : ''}`}>
              {l.text}
            </div>
          ))}
          {sending && <div className="text-paper/50">sending…</div>}

          {/* Prompt */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-1">
            <span className="text-paper/80 font-bold" aria-hidden="true">&gt;</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={sending}
              aria-label="Terminal input"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck="false"
              className="flex-1 bg-transparent outline-none border-none text-paper font-mono text-[13px] caret-[var(--primary)]"
            />
          </form>
        </div>
      </div>

      {/* Quick command chips */}
      <div className="mx-auto max-w-[920px] mt-4 flex flex-wrap items-center gap-2 font-mono text-[11px] tracking-[0.14em] text-paper/55">
        <span>try:</span>
        {['?', 'story', 'building', 'message', 'contact'].map((c) => (
          <button
            key={c}
            type="button"
            data-hover
            onClick={() => insertCommand(c)}
            className="px-3 py-1 border border-paper/25 text-paper/75 hover:text-paper hover:border-paper/60 transition-colors"
          >
            {c}
          </button>
        ))}
      </div>
    </section>
  )
}
