import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const initialForm = {
  fullname: '',
  contact: '',
  email: '',
  password: '',
  isSeller: false,
}

/* ── Password strength helper ────────────────────────────────────── */
function getPasswordStrength(password) {
  let score = 0
  if (password.length >= 6) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return score
}

const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong']
const strengthColor = [
  'bg-white/10',
  'bg-red-500',
  'bg-amber-500',
  'bg-[#c6f337]',
  'bg-emerald-400',
]

const Register = () => {
  const navigate = useNavigate()
  const { handleRegister } = useAuth()
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const passwordStrength = getPasswordStrength(form.password)

  function handleChange(event) {
    const { name, value, checked, type } = event.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsRegistered(false)
    setIsSubmitting(true)
    try {
      const user = await handleRegister(form)
      if (user?.role === 'buyer') {
        navigate('/')
      } else if (user?.role === 'seller') {
        navigate('/seller/dashboard')
      } else {
        navigate('/')
      }
      setIsRegistered(true)
      setForm(initialForm)
    } catch (requestError) {
      const validationError = requestError.response?.data?.errors?.[0]?.msg
      setError(
        validationError ||
          requestError.response?.data?.message ||
          'We could not create your account. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Google fonts: Plus Jakarta Sans, Inter, Space Grotesk */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap"
        rel="stylesheet"
      />

      <style>{`
        .snitch-dark-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .snitch-dark-scroll::-webkit-scrollbar-track {
          background: #000000;
        }
        .snitch-dark-scroll::-webkit-scrollbar-thumb {
          background: #27272a;
        }
      `}</style>

      {/* Floating Minimal Back Button */}
      <div className="fixed top-5 left-5 z-50">
        <Link
          to="/"
          aria-label="Back to store"
          className="flex items-center gap-2 bg-[#0a0a0a]/90 backdrop-blur-md border border-[#262626] px-3.5 py-2 rounded-lg text-white hover:border-[#c6f337] hover:text-[#c6f337] transition-all shadow-[2px_2px_0px_#000000] group"
        >
          <svg
            className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          <span
            className="text-[11px] font-bold tracking-[0.16em] uppercase"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Back to Drop
          </span>
        </Link>
      </div>

      {/* Main Dual-Column Canvas */}
      <main
        className="w-full min-h-screen flex flex-col lg:flex-row bg-[#000000] text-white selection:bg-[#c6f337] selection:text-black overflow-x-hidden antialiased"
        style={{ fontFamily: 'Inter, Arial, sans-serif' }}
      >
        {/* ══════════════════════════════════════════════════════════ */}
        {/* LEFT SECTION: Editorial Showcase (52%)                    */}
        {/* ══════════════════════════════════════════════════════════ */}
        <section className="relative w-full lg:w-[52%] min-h-[500px] lg:min-h-screen flex flex-col justify-between p-8 sm:p-12 lg:p-14 overflow-hidden border-b lg:border-b-0 lg:border-r border-[#262626]">
          {/* Editorial Background Image */}
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoE6IMsK6aa4nYQCh1Ku5gZ2DZZhlvSEPXGk1eWhDmMRZRVsgbQmi9lwqEoKoPx4JtpYK1qpFNPAuZgcqah-eeIeZX5tlkXt0KzzwdYF_WfuFq-WU1UlGW0QLt0uEQp2-Z42UdCTAq1eN38fAkcIAxMdNvw2v0LZGH1rtoE6AcZejDqgVU5S6e7EnizW3gmChgV0CaRXGplqYzl6vYTdIewvvshGLSh3LwWJlO3QNQcgMsn2yLWu322D6-Ei1Hlk4Szp94eaVNW7NQ"
            alt="Snitch models in luxury contemporary streetwear"
            className="absolute inset-0 w-full h-full object-cover object-center filter grayscale-[20%] contrast-110 brightness-90 transform scale-100 transition-transform duration-1000 ease-out hover:scale-105"
          />

          {/* Architectural Dark Vignettes & Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/60 to-[#000000]/70 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#000000]/80 via-transparent to-[#000000]/90 pointer-events-none" />

          {/* Precision Grid Line Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

          {/* Top Header Spec Bar */}
          <div className="relative z-10 flex items-center justify-between pt-12 lg:pt-0">
            <div className="flex items-center space-x-2.5">
              <span className="inline-block w-2 h-2 rounded-full bg-[#c6f337] animate-pulse" />
              <span
                className="text-[11px] font-bold text-[#c6f337] tracking-[0.2em] uppercase"
                style={{ fontFamily: 'Space Grotesk, monospace' }}
              >
                NODE: 01_PARIS // NYC // TOKYO
              </span>
            </div>
            <div className="border border-[#3f3f46] px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded">
              <span
                className="text-[10px] text-[#a1a1aa] tracking-widest uppercase font-mono"
                style={{ fontFamily: 'Space Grotesk, monospace' }}
              >
                SPEC // 2026.V4
              </span>
            </div>
          </div>

          {/* Center & Bottom Editorial Typography Lockup */}
          <div className="relative z-10 mt-auto pt-16">
            <div className="mb-4 inline-flex items-center gap-2 border-l-2 border-[#c6f337] pl-3">
              <p
                className="text-[11px] font-semibold text-[#d4d4d8] tracking-[0.2em] uppercase"
                style={{ fontFamily: 'Space Grotesk, monospace' }}
              >
                EDITION 2026 // MEMBERSHIP ACCESS PROTOCOL
              </p>
            </div>

            {/* Main Editorial Hero Tagline: WEAR WHAT'S NEXT */}
            <h1
              className="text-[clamp(2.8rem,6vw,4.8rem)] font-extrabold uppercase tracking-tight text-white leading-none mb-6"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              WEAR WHAT&apos;S{' '}
              <span className="text-[#f97316] italic underline decoration-4 decoration-[#c6f337] underline-offset-8">
                NEXT
              </span>
            </h1>

            {/* High-Spec Metadata Strip */}
            <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#3f3f46]/80 backdrop-blur-sm bg-black/40 mb-6 font-mono">
              <div>
                <span className="block text-[10px] text-[#71717a] uppercase tracking-wider font-semibold">
                  AUTHORITY
                </span>
                <span className="text-[12px] text-white uppercase font-bold tracking-wider">
                  SNITCH LABS
                </span>
              </div>
              <div>
                <span className="block text-[10px] text-[#71717a] uppercase tracking-wider font-semibold">
                  LATENCY
                </span>
                <span className="text-[12px] text-[#c6f337] uppercase font-bold tracking-wider">
                  REALTIME PASS
                </span>
              </div>
              <div>
                <span className="block text-[10px] text-[#71717a] uppercase tracking-wider font-semibold">
                  RELEASE TIER
                </span>
                <span className="text-[12px] text-white uppercase font-bold tracking-wider">
                  TIER 0 / ARCHIVE
                </span>
              </div>
            </div>

            {/* Bottom Pill Badge */}
            <div className="inline-flex flex-wrap items-center gap-2 bg-[#141414]/90 border border-[#27272a] px-4 py-2.5 rounded-md shadow-[2px_2px_0px_#000000]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c6f337]" />
              <span
                className="text-[10px] text-[#e4e4e7] tracking-wider uppercase font-semibold"
                style={{ fontFamily: 'Space Grotesk, monospace' }}
              >
                EXCLUSIVE DROPS • PRIORITY RESERVATIONS • ARCHIVE VAULT
              </span>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* RIGHT SECTION: Registration Form Card Terminal (48%)      */}
        {/* ══════════════════════════════════════════════════════════ */}
        <section className="w-full lg:w-[48%] flex items-center justify-center p-6 sm:p-10 lg:p-14 bg-[#000000] snitch-dark-scroll">
          <div className="w-full max-w-[500px] bg-[#141414] border border-[#262626] rounded-2xl p-7 sm:p-10 shadow-[4px_4px_0px_#0a0a0a] relative">
            {/* Subtle Technical Corner Annotations */}
            <div className="absolute top-3 left-3 text-[9px] font-mono text-[#52525b] select-none">
              +001
            </div>
            <div className="absolute top-3 right-3 text-[9px] font-mono text-[#52525b] select-none">
              ARCH//REG
            </div>

            {/* Terminal Header: SNITCH Brand Identity */}
            <div className="text-center pb-6 border-b border-[#262626] mb-7">
              <div className="inline-block mb-1">
                <span
                  className="text-3xl sm:text-4xl font-extrabold tracking-[0.18em] text-white uppercase block"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                >
                  SNITCH<span className="text-[#c6f337]">.</span>
                </span>
              </div>
              <p
                className="text-[11px] text-[#a1a1aa] tracking-[0.25em] uppercase font-bold"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                JOIN THE COLLECTIVE
              </p>
            </div>

            {/* Success Notification */}
            {isRegistered && (
              <div
                aria-live="polite"
                role="status"
                className="mb-5 p-3.5 rounded-xl bg-[#c6f337]/10 border border-[#c6f337]/30 flex items-center gap-3"
              >
                <span className="text-[#c6f337] text-lg font-bold">✓</span>
                <p className="text-xs text-[#c6f337] font-medium">
                  Your account has been created successfully. Redirecting…
                </p>
              </div>
            )}

            {/* Error Notification */}
            {error && (
              <div
                aria-live="polite"
                role="alert"
                className="mb-5 p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 flex items-center gap-3"
              >
                <span className="text-red-400 text-lg font-bold">✕</span>
                <p className="text-xs text-red-300 font-medium">{error}</p>
              </div>
            )}

            {/* Registration Form */}
            <form className="space-y-4.5" onSubmit={handleSubmit}>
              {/* Field 1: Full Name */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label
                    htmlFor="fullname"
                    className="text-[11px] font-bold text-[#a1a1aa] uppercase tracking-wider"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    Full Name
                  </label>
                  <span className="text-[10px] font-mono text-[#52525b]">SPEC.NAME_01</span>
                </div>
                <div className="relative">
                  <input
                    id="fullname"
                    name="fullname"
                    type="text"
                    required
                    autoComplete="name"
                    value={form.fullname}
                    onChange={handleChange}
                    placeholder="ALEXANDER VANCE"
                    className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg text-white text-sm px-4 py-3 focus:outline-none focus:border-white focus:ring-0 placeholder-[#444] transition-colors uppercase tracking-wider"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#52525b] pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Field 2: Contact Number with Country Selector */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label
                    htmlFor="contact"
                    className="text-[11px] font-bold text-[#a1a1aa] uppercase tracking-wider"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    Contact Number
                  </label>
                  <span className="text-[10px] font-mono text-[#52525b]">10-DIGIT MOBILE</span>
                </div>
                <div className="flex rounded-lg overflow-hidden border border-[#262626] focus-within:border-white transition-colors">
                  {/* +91 Country Badge */}
                  <div className="inline-flex items-center gap-1.5 bg-[#1b1b1e] border-r border-[#262626] px-3.5 py-3 text-white select-none shrink-0">
                    <span className="w-2 h-2 rounded-full bg-[#c6f337]" />
                    <span
                      className="text-xs font-bold text-white tracking-wider"
                      style={{ fontFamily: 'Space Grotesk, monospace' }}
                    >
                      +91
                    </span>
                  </div>
                  <input
                    id="contact"
                    name="contact"
                    type="tel"
                    required
                    inputMode="numeric"
                    maxLength={10}
                    pattern="[0-9]{10}"
                    autoComplete="tel"
                    value={form.contact}
                    onChange={handleChange}
                    placeholder="98765 43210"
                    className="w-full bg-[#0a0a0a] border-0 text-white text-sm px-4 py-3 focus:outline-none focus:ring-0 placeholder-[#444] font-mono tracking-wider"
                  />
                </div>
              </div>

              {/* Field 3: Email Address */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label
                    htmlFor="email"
                    className="text-[11px] font-bold text-[#a1a1aa] uppercase tracking-wider"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    Email Address
                  </label>
                  <span className="text-[10px] font-mono text-[#52525b]">MANIFEST_RECIPIENT</span>
                </div>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="alex.vance@specimen.com"
                    className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg text-white text-sm px-4 py-3 focus:outline-none focus:border-white focus:ring-0 placeholder-[#444] transition-colors tracking-wide"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#52525b] pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Field 4: Password with Visibility Toggle & Gauge */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label
                    htmlFor="password"
                    className="text-[11px] font-bold text-[#a1a1aa] uppercase tracking-wider"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    Password
                  </label>
                  {form.password && (
                    <span
                      className="text-[10px] font-mono text-[#c6f337] font-bold uppercase tracking-wider"
                    >
                      {strengthLabel[passwordStrength]}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg text-white text-sm px-4 py-3 pr-11 focus:outline-none focus:border-white focus:ring-0 placeholder-[#444] transition-colors tracking-widest"
                  />
                  <button
                    type="button"
                    aria-label="Toggle password visibility"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717a] hover:text-white transition-colors p-1 focus:outline-none"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Password Strength 4-Bar Meter */}
                {form.password && (
                  <div className="mt-2.5">
                    <div className="grid grid-cols-4 gap-1.5 h-1">
                      {[1, 2, 3, 4].map((bar) => (
                        <div
                          key={bar}
                          className={`h-full rounded-full transition-all duration-300 ${
                            bar <= passwordStrength
                              ? strengthColor[passwordStrength]
                              : 'bg-white/10'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Merchant / Seller Switch Toggle */}
              <div className="pt-2">
                <label
                  htmlFor="isSeller"
                  className={`flex items-center justify-between p-3.5 bg-[#0a0a0a] border rounded-lg cursor-pointer transition-colors ${
                    form.isSeller ? 'border-[#c6f337]' : 'border-[#262626] hover:border-[#383838]'
                  }`}
                >
                  <div className="flex flex-col pr-3">
                    <span
                      className="text-[11px] font-bold text-white uppercase tracking-wide"
                      style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                      REGISTER AS VERIFIED SELLER / ATELIER
                    </span>
                    <span className="text-[10px] text-[#71717a] mt-0.5 leading-snug">
                      Allows drops, inventory management, and studio portal access
                    </span>
                  </div>

                  <div className="relative shrink-0 w-11 h-6">
                    <input
                      id="isSeller"
                      name="isSeller"
                      type="checkbox"
                      checked={form.isSeller}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#27272a] rounded-full peer peer-checked:bg-[#c6f337] transition-colors relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-transform peer-checked:after:translate-x-5 peer-checked:after:bg-[#141414]" />
                  </div>
                </label>
              </div>

              {/* Primary High-Contrast White Registration CTA Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white text-black font-extrabold uppercase tracking-wider py-4 px-6 rounded-lg border border-white hover:bg-[#e4e4e7] active:scale-[0.99] transition-all duration-150 flex items-center justify-center gap-2 group cursor-pointer shadow-[3px_3px_0px_#c6f337] disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                >
                  <span>{isSubmitting ? 'CREATING ACCOUNT…' : 'CREATE ACCOUNT'}</span>
                  {!isSubmitting && (
                    <svg
                      className="w-4 h-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Minimal Divider */}
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-[#262626]" />
                <span
                  className="flex-shrink mx-4 text-[10px] text-[#71717a] tracking-[0.2em] uppercase font-bold"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  OR CONTINUE WITH
                </span>
                <div className="flex-grow border-t border-[#262626]" />
              </div>

              {/* Google OAuth Action */}
              <button
                type="button"
                onClick={() => {
                  window.location.href = '/api/auth/google'
                }}
                className="w-full bg-[#0a0a0a] hover:bg-[#18181b] border border-[#262626] hover:border-[#3f3f46] text-white py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition-colors duration-150 cursor-pointer shadow-[2px_2px_0px_#000000] text-xs font-semibold"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" fill="#EA4335" />
                  <path d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z" fill="#4285F4" />
                  <path d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.1-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.5s.7 4.8 1.9 7.2l3.7-2.9z" fill="#FBBC05" />
                  <path d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.3 7.5 23.5 12 23.5z" fill="#34A853" />
                </svg>
                <span
                  className="text-[11px] font-bold tracking-widest uppercase"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  Continue with Google
                </span>
              </button>

              {/* Legal & Compliance Text */}
              <p className="text-[11px] text-[#71717a] text-center leading-relaxed pt-2">
                By continuing, you agree to SNITCH&apos;s{' '}
                <a
                  href="#"
                  className="text-white underline underline-offset-2 hover:text-[#c6f337] transition-colors"
                >
                  Terms of Service
                </a>{' '}
                and{' '}
                <a
                  href="#"
                  className="text-white underline underline-offset-2 hover:text-[#c6f337] transition-colors"
                >
                  Privacy Policy
                </a>
                .
              </p>

              {/* Sign In Link */}
              <div className="text-center pt-3 border-t border-[#262626]">
                <span
                  className="text-[11px] text-[#a1a1aa] uppercase tracking-wider"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  Already a member?
                </span>
                <Link
                  to="/login"
                  className="text-[11px] text-[#c6f337] font-bold hover:underline underline-offset-4 ml-2 uppercase tracking-wider"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  Sign in →
                </Link>
              </div>
            </form>

            {/* Technical Security Perforation Detail */}
            <div className="mt-6 pt-3 border-t border-dashed border-[#27272a] flex justify-between items-center text-[#52525b] text-[9px] font-mono uppercase">
              <span>ENC: 4096-BIT RSA SHA256</span>
              <span>DISPATCH LOCATION: AUTOMATED</span>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default Register
