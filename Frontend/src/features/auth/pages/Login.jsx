import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router'

const initialForm = {
  email: '',
  password: '',
}

/* ── Icon wrapper ──────────────────────────────────────────────── */
const Icon = ({ name, className = 'text-[20px]' }) => (
  <span
    className={`material-symbols-outlined leading-none align-middle ${className}`}
  >
    {name}
  </span>
)

/* ─────────────────────────────────────────────────────────────────── */
/*  Login page                                                         */
/* ─────────────────────────────────────────────────────────────────── */
const Login = () => {
    const navigate=useNavigate()
  const { handelLogin } = useAuth()
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      await handelLogin(form)
      navigate("/")
    } catch (requestError) {
      const validationError = requestError.response?.data?.errors?.[0]?.msg
      setError(
        validationError ||
          requestError.response?.data?.message ||
          'Invalid email or password. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  /* ── shared input class ─────────────────────────────────────── */
  const inputCls =
    'w-full bg-[#171714] text-[#fafaf9] placeholder-[#57534e] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-[14px] leading-[22px] focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all'

  return (
    <>
      {/* Google fonts + Material Symbols */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24;
          display: inline-block; vertical-align: middle; line-height: 1;
        }
        .material-symbols-fill {
          font-variation-settings: 'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 24;
        }
        .bg-grid-tactical {
          background-image: radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px);
          background-size: 24px 24px;
        }
        body { background-color: #10100e; }
      `}</style>

      <main
        className="min-h-screen w-full flex flex-col lg:flex-row relative overflow-x-hidden"
        style={{ backgroundColor: '#10100e', fontFamily: 'Inter, sans-serif', color: '#e5e2de' }}
      >
        {/* Ambient amber blobs */}
        <div
          className="pointer-events-none fixed -top-40 -left-40 w-96 h-96 rounded-full blur-[120px] -z-10"
          style={{ backgroundColor: 'rgba(251,191,36,0.10)' }}
        />
        <div
          className="pointer-events-none fixed -bottom-40 -right-40 w-96 h-96 rounded-full blur-[140px] -z-10"
          style={{ backgroundColor: 'rgba(251,191,36,0.05)' }}
        />

        {/* ══════════════════════════════════════════════════════════ */}
        {/* LEFT PANEL — desktop only                                  */}
        {/* ══════════════════════════════════════════════════════════ */}
        <section
          className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 xl:p-16 relative overflow-hidden"
          style={{ backgroundColor: '#131311', borderRight: '1px solid rgba(255,255,255,0.07)' }}
        >
          {/* Dot grid */}
          <div className="absolute inset-0 bg-grid-tactical opacity-70 pointer-events-none" />
          {/* Radial glow */}
          <div
            className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full blur-[100px] pointer-events-none"
            style={{ backgroundColor: 'rgba(251,191,36,0.15)' }}
          />
          <div
            className="absolute bottom-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none"
            style={{ backgroundColor: 'rgba(42,42,40,0.40)' }}
          />

          {/* Top logo */}
          <div className="relative z-10 flex items-center gap-3.5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor: '#fbbf24',
                boxShadow: '0 8px 24px rgba(251,191,36,0.20)',
                outline: '1px solid rgba(251,191,36,0.40)',
              }}
            >
              <span
                className="font-extrabold tracking-tighter"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 18, color: '#10100e' }}
              >
                S
              </span>
            </div>
            <div className="flex flex-col">
              <span
                className="font-bold leading-none tracking-tight"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 20, color: '#ffe1a7' }}
              >
                SNITCH
              </span>
              <span
                className="mt-0.5 tracking-widest uppercase"
                style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#9c8f79' }}
              >
                VERIFIED PROTOCOL
              </span>
            </div>
          </div>

          {/* Center content */}
          <div className="relative z-10 my-auto py-12 max-w-lg">
            {/* Eyebrow */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6"
              style={{ backgroundColor: 'rgba(251,191,36,0.10)', border: '1px solid rgba(251,191,36,0.25)' }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: '#fbbf24' }}
              />
              <span
                className="uppercase tracking-widest"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 11, fontWeight: 700, color: '#fbbf24' }}
              >
                Secure Login
              </span>
            </div>

            <h1
              className="font-bold tracking-tight mb-4 leading-tight"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 32, color: '#e5e2de' }}
            >
              Welcome back to Snitch
            </h1>
            <p className="mb-10 leading-relaxed" style={{ fontSize: 16, color: '#9c8f79' }}>
              Sign in to your account and pick up right where you left off.
            </p>

            {/* Trust bullets */}
            <div className="space-y-4">
              {[
                {
                  icon: 'lock',
                  title: 'Bank-grade encryption',
                  desc: '256-bit SSL encryption secures every session and transaction.',
                },
                {
                  icon: 'history',
                  title: 'Full activity history',
                  desc: 'Access all your bids, purchases, and listings in one place.',
                },
                {
                  icon: 'support_agent',
                  title: '24/7 seller support',
                  desc: 'Dedicated trust agents available around the clock for every dispute.',
                },
              ].map(({ icon, title, desc }) => (
                <div
                  key={icon}
                  className="flex items-start gap-4 p-4 rounded-xl backdrop-blur-md transition-colors"
                  style={{ backgroundColor: 'rgba(14,14,12,0.80)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: '#20201d', border: '1px solid rgba(251,191,36,0.30)', color: '#fbbf24' }}
                  >
                    <Icon name={icon} className="material-symbols-fill text-[20px]" />
                  </div>
                  <div>
                    <p
                      className="font-semibold leading-tight mb-1"
                      style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 15, color: '#e5e2de' }}
                    >
                      {title}
                    </p>
                    <p style={{ fontSize: 13, color: '#9c8f79', lineHeight: '18px' }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div
            className="relative z-10 pt-6 flex items-center justify-between"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
          >
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'rgba(156,143,121,0.80)' }}>
              © 2025 Snitch Protocol · Bank-grade 256-bit encryption
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping" />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#9c8f79' }}>
                NETWORK ACTIVE
              </span>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* RIGHT PANEL — form                                         */}
        {/* ══════════════════════════════════════════════════════════ */}
        <section className="w-full lg:w-[55%] flex flex-col justify-center items-center px-4 py-8 sm:px-8 md:px-12 lg:px-16 xl:px-20 relative">
          <div className="w-full max-w-md mx-auto flex flex-col my-auto">

            {/* Mobile / tablet header */}
            <header
              className="flex lg:hidden items-center justify-between mb-8 pb-4"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: '#fbbf24', boxShadow: '0 4px 12px rgba(251,191,36,0.20)' }}
                >
                  <span
                    className="font-extrabold"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 16, color: '#10100e' }}
                  >
                    S
                  </span>
                </div>
                <div className="flex flex-col">
                  <span
                    className="font-bold tracking-tight"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 18, color: '#ffe1a7' }}
                  >
                    SNITCH
                  </span>
                  <span
                    className="uppercase"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 10, fontWeight: 700, color: '#9c8f79', letterSpacing: '0.08em' }}
                  >
                    MARKETPLACE
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="lock" className="text-[18px]" style={{ color: '#9c8f79' }} />
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#9c8f79' }}>
                  ENCRYPTED SSL
                </span>
              </div>
            </header>

            {/* Form heading */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="px-2.5 py-0.5 rounded-full tracking-wider uppercase"
                  style={{
                    backgroundColor: 'rgba(251,191,36,0.10)',
                    border: '1px solid rgba(251,191,36,0.20)',
                    color: '#fbbf24',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  Sign in
                </span>
                <span style={{ color: '#9c8f79', fontSize: 12 }}>•</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#9c8f79' }}>
                  Secure Session
                </span>
              </div>
              <h1
                className="font-bold tracking-tight"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 'clamp(24px,4vw,32px)', color: '#e5e2de' }}
              >
                Welcome back
              </h1>
              <p className="mt-1.5" style={{ fontSize: 14, color: '#9c8f79' }}>
                Enter your credentials to access your account.
              </p>
            </div>

            {/* Error banner */}
            {error && (
              <div
                aria-live="polite"
                role="alert"
                className="mb-5 p-3.5 rounded-xl flex items-center gap-3"
                style={{ backgroundColor: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.20)' }}
              >
                <Icon name="error" className="text-[20px] text-red-400" />
                <p style={{ fontSize: 13, color: '#fca5a5' }}>{error}</p>
              </div>
            )}

            {/* ── Login form ─────────────────────────────────────── */}
            <form className="space-y-5" onSubmit={handleSubmit}>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-1.5 uppercase tracking-widest"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 11, fontWeight: 700, color: '#9c8f79' }}
                >
                  Email address
                </label>
                <div className="relative">
                  <div
                    className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"
                    style={{ color: '#9c8f79' }}
                  >
                    <Icon name="mail" className="text-[19px]" />
                  </div>
                  <input
                    autoComplete="email"
                    className={inputCls}
                    id="email"
                    name="email"
                    onChange={handleChange}
                    placeholder="alex@example.com"
                    required
                    type="email"
                    value={form.email}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password"
                    className="uppercase tracking-widest"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 11, fontWeight: 700, color: '#9c8f79' }}
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    className="transition-colors hover:underline"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 12, fontWeight: 600, color: '#fbbf24' }}
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <div
                    className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"
                    style={{ color: '#9c8f79' }}
                  >
                    <Icon name="lock" className="text-[19px]" />
                  </div>
                  <input
                    autoComplete="current-password"
                    className={`${inputCls} pr-11`}
                    id="password"
                    name="password"
                    onChange={handleChange}
                    placeholder="Your password"
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                  />
                  <button
                    type="button"
                    aria-label="Toggle password visibility"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center transition-colors focus:outline-none"
                    style={{ color: '#9c8f79' }}
                  >
                    <Icon
                      name={showPassword ? 'visibility_off' : 'visibility'}
                      className="text-[20px]"
                    />
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <div className="pt-1">
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full font-bold py-3.5 px-5 rounded-xl flex items-center justify-center gap-2 group transition-all active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                  style={{
                    backgroundColor: '#fbbf24',
                    color: '#10100e',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontSize: 15,
                    boxShadow: '0 8px 24px rgba(251,191,36,0.15)',
                  }}
                  onMouseEnter={(e) => { if (!isSubmitting) e.currentTarget.style.backgroundColor = '#fcd34d' }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fbbf24' }}
                >
                  {isSubmitting ? (
                    'Signing in…'
                  ) : (
                    <>
                      Sign in to Snitch
                      <Icon name="arrow_forward" className="text-[20px] group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="relative my-6 flex items-center justify-center">
              <div className="w-full" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }} />
              <span
                className="absolute px-3 uppercase tracking-widest"
                style={{ backgroundColor: '#10100e', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 10, fontWeight: 700, color: '#9c8f79', letterSpacing: '0.08em' }}
              >
                Or continue with
              </span>
            </div>

            {/* Google OAuth */}
            <button  onClick={()=>{
              window.location.href="/api/auth/google"
            }}
              type="button"
              className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl transition-all active:scale-[0.98]"
              style={{ backgroundColor: '#171714', border: '1px solid rgba(255,255,255,0.10)', color: '#e5e2de' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)'; e.currentTarget.style.backgroundColor = '#1c1c18' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'; e.currentTarget.style.backgroundColor = '#171714' }}
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" fill="#EA4335" />
                <path d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z" fill="#4285F4" />
                <path d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2s.7 5.5 1.9 7.9l3.7-2.9c0-.7-.2-1.4 0-2.4z" fill="#FBBC05" />
                <path d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.3 7.5 23.5 12 23.5z" fill="#34A853" />
              </svg>
              <span
                className="font-semibold"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 13 }}
              >
                Continue with Google
              </span>
            </button>

            {/* Sign up link */}
            <div className="text-center mt-6">
              <p style={{ fontSize: 14, color: '#9c8f79' }}>
                Don&apos;t have an account?{' '}
                <a
                  href="/register"
                  className="font-semibold transition-colors hover:underline"
                  style={{ color: '#fbbf24', marginLeft: 4 }}
                >
                  Create one
                </a>
              </p>
            </div>

            {/* Legal */}
            <p
              className="text-center mt-6 leading-relaxed"
              style={{ fontSize: 13, color: 'rgba(156,143,121,0.80)' }}
            >
              By signing in, you agree to Snitch&apos;s{' '}
              <a
                href="#"
                className="underline underline-offset-2 transition-colors hover:text-amber-400"
                style={{ color: '#e5e2de' }}
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href="#"
                className="underline underline-offset-2 transition-colors hover:text-amber-400"
                style={{ color: '#e5e2de' }}
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </section>
      </main>
    </>
  )
}

export default Login

