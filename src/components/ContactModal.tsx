import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { portfolioData } from '../data/portfolio'
import StarBorder from './react-bits/StarBorder'

interface ContactModalProps {
  open: boolean
  onClose: () => void
  defaultService?: string
}

const SERVICE_OPTIONS = [
  'AI Workflow & Automation',
  'Software & AI Integration',
  'Web & Software Development',
  'Web UI/UX Engineering',
] as const

export default function ContactModal({
  open,
  onClose,
  defaultService = SERVICE_OPTIONS[0],
}: ContactModalProps) {
  const { profile } = portfolioData
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [service, setService] = useState<string>(defaultService)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  if (!open || typeof document === 'undefined') return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) return

    setStatus('sending')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          service,
          message: message.trim(),
        }),
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(
          data?.error ||
            'Could not send message right now. Please verify SMTP environment variables.'
        )
      }

      setStatus('success')
      setName('')
      setEmail('')
      setMessage('')
    } catch (err) {
      setStatus('error')
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Failed to send message via Google SMTP.'
      )
    }
  }

  const resetAndClose = () => {
    setStatus('idle')
    setErrorMessage('')
    onClose()
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
      style={{ zIndex: 9999 }}
      className="fixed inset-0 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Frosted Backdrop */}
      <div
        onClick={resetAndClose}
        className="fixed inset-0 bg-neutral-950/75 backdrop-blur-md transition-opacity"
      />

      {/* Modal Window */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-white/15 bg-slate-950/85 p-6 sm:p-7 backdrop-blur-2xl backdrop-saturate-150 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_28px_80px_rgba(0,0,0,0.92),0_0_50px_rgba(2,25,234,0.35)] text-neutral-100">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div className="border-l-2 border-[#0219EA] pl-3.5 space-y-0.5">
            <h2
              id="contact-modal-title"
              className="text-xl sm:text-2xl font-bold text-white tracking-tight"
            >
              Start a Conversation
            </h2>
            <p className="text-xs text-neutral-400">
              Direct inquiry to Mark Anthony Ebio ({profile.email})
            </p>
          </div>

          <button
            type="button"
            onClick={resetAndClose}
            aria-label="Close modal"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] text-sm text-neutral-300 hover:border-[#0219EA] hover:text-white transition-colors cursor-pointer shrink-0"
          >
            ✕
          </button>
        </div>

        {status === 'success' ? (
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#0219EA]/60 bg-[#0219EA]/25 text-white shadow-[0_0_24px_rgba(2,25,234,0.5)]">
              <svg
                className="w-7 h-7"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-white">
                Message Sent Successfully
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 max-w-sm mx-auto leading-relaxed">
                Thank you for reaching out! Your project details have been
                delivered to <span className="text-[#4f6bff]">{profile.email}</span>.
              </p>
            </div>
            <div className="pt-2">
              <StarBorder
                as="button"
                type="button"
                onClick={resetAndClose}
                color="#0219EA"
                trailColor="#3b55ff"
                backgroundColor="rgba(2, 25, 234, 0.28)"
                textColor="#ffffff"
                borderColor="rgba(2, 25, 234, 0.65)"
                duration={4}
                radius={12}
                glow={0.7}
                hover="lap"
                clickPulse
                className="!px-6 !py-2.5 text-xs font-semibold"
              >
                Close Window
              </StarBorder>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* Service Category Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300">
                Select Service
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SERVICE_OPTIONS.map((option) => {
                  const active = service === option
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setService(option)}
                      className={`text-left px-3 py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                        active
                          ? 'border-[#0219EA] bg-[#0219EA]/25 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_16px_rgba(2,25,234,0.3)]'
                          : 'border-white/10 bg-white/[0.03] text-neutral-300 hover:border-white/25 hover:text-white'
                      }`}
                    >
                      {option}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Name & Email Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label
                  htmlFor="contact-name"
                  className="block text-xs font-mono uppercase tracking-wider text-neutral-300"
                >
                  Your Name *
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 outline-none focus:border-[#0219EA] focus:bg-white/[0.06] transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="contact-email"
                  className="block text-xs font-mono uppercase tracking-wider text-neutral-300"
                >
                  Email Address *
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 outline-none focus:border-[#0219EA] focus:bg-white/[0.06] transition-colors"
                />
              </div>
            </div>

            {/* Project Message */}
            <div className="space-y-1.5">
              <label
                htmlFor="contact-message"
                className="block text-xs font-mono uppercase tracking-wider text-neutral-300"
              >
                Project Details *
              </label>
              <textarea
                id="contact-message"
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell me about the AI workflow, automation pipeline, or web platform you want to build..."
                className="w-full resize-none rounded-xl border border-white/15 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 outline-none focus:border-[#0219EA] focus:bg-white/[0.06] transition-colors"
              />
            </div>

            {status === 'error' && (
              <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-3.5 py-2.5 text-xs text-rose-200 space-y-1">
                <p>{errorMessage}</p>
                <p className="text-neutral-300">
                  Or send directly via email:{' '}
                  <a
                    href={`mailto:${profile.email}?subject=${encodeURIComponent(`[Project Inquiry] ${service}`)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`}
                    className="text-[#4f6bff] underline underline-offset-2 font-semibold"
                  >
                    Open Email Client ↗
                  </a>
                </p>
              </div>
            )}

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={resetAndClose}
                className="rounded-xl border border-white/15 bg-white/[0.03] px-4 py-2.5 text-xs font-medium text-neutral-300 hover:border-white/30 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <StarBorder
                as="button"
                type="submit"
                disabled={status === 'sending'}
                color="#0219EA"
                trailColor="#3b55ff"
                backgroundColor="rgba(2, 25, 234, 0.3)"
                textColor="#ffffff"
                borderColor="rgba(2, 25, 234, 0.7)"
                duration={4}
                radius={12}
                glow={0.75}
                hover="lap"
                clickPulse
                className="!px-6 !py-2.5 text-xs sm:text-sm font-semibold disabled:opacity-60"
              >
                <span className="inline-flex items-center gap-2">
                  <span>
                    {status === 'sending' ? 'Sending...' : 'Send Message'}
                  </span>
                  <span className="text-[#4f6bff]">↗</span>
                </span>
              </StarBorder>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  )
}
