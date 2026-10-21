import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const initialForm = {
  email: '',
  password: '',
}

const Login = () => {
  const navigate = useNavigate()
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
      const user = await handelLogin(form)
      if (user.role === 'buyer') {
        navigate('/')
      } else if (user.role === 'seller') {
        navigate('/seller/dashboard')
      }
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

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap"
        rel="stylesheet"
      />

      <div className="fixed top-5 left-5 z-50">
        <Link
          to="/"
          aria-label="Back to store"
          className="group flex items-center gap-2 rounded-lg border border-[#262626] bg-[#0a0a0a]/90 px-3.5 py-2 text-white shadow-[2px_2px_0px_#000000] backdrop-blur-md transition-all hover:border-[#c6f337] hover:text-[#c6f337]"
        >
          <svg
            className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.2"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          <span
            className="text-[11px] font-bold uppercase tracking-[0.16em]"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Back to Drop
          </span>
        </Link>
      </div>

      <main
        className="flex min-h-screen w-full flex-col overflow-x-hidden bg-black text-white selection:bg-[#c6f337] selection:text-black antialiased lg:flex-row"
        style={{ fontFamily: 'Inter, Arial, sans-serif' }}
      >
        <section className="relative flex min-h-[500px] w-full flex-col justify-between overflow-hidden border-b border-[#262626] p-8 sm:p-12 lg:min-h-screen lg:w-[52%] lg:border-b-0 lg:border-r lg:p-14">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoE6IMsK6aa4nYQCh1Ku5gZ2DZZhlvSEPXGk1eWhDmMRZRVsgbQmi9lwqEoKoPx4JtpYK1qpFNPAuZgcqah-eeIeZX5tlkXt0KzzwdYF_WfuFq-WU1UlGW0QLt0uEQp2-Z42UdCTAq1eN38fAkcIAxMdNvw2v0LZGH1rtoE6AcZejDqgVU5S6e7EnizW3gmChgV0CaRXGplqYzl6vYTdIewvvshGLSh3LwWJlO3QNQcgMsn2yLWu322D6-Ei1Hlk4Szp94eaVNW7NQ"
            alt="Snitch models in luxury contemporary streetwear"
            className="absolute inset-0 h-full w-full object-cover object-center brightness-90 contrast-110 grayscale-[20%] transition-transform duration-1000 ease-out hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/70" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/90" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />

          <div className="relative z-10 flex items-center justify-between pt-12 lg:pt-0">
            <div className="flex items-center gap-2.5">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#c6f337]" />
              <span
                className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#c6f337]"
                style={{ fontFamily: 'Space Grotesk, monospace' }}
              >
                NODE: 01_PARIS // NYC // TOKYO
              </span>
            </div>
            <div className="rounded border border-[#3f3f46] bg-black/60 px-2.5 py-1 backdrop-blur-sm">
              <span
                className="font-mono text-[10px] uppercase tracking-widest text-[#a1a1aa]"
                style={{ fontFamily: 'Space Grotesk, monospace' }}
              >
                SPEC // 2026.V4
              </span>
            </div>
          </div>

          <div className="relative z-10 mt-auto pt-16">
            <div className="mb-4 inline-flex items-center gap-2 border-l-2 border-[#c6f337] pl-3">
              <p
                className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d4d4d8]"
                style={{ fontFamily: 'Space Grotesk, monospace' }}
              >
                EDITION 2026 // MEMBERSHIP ACCESS PROTOCOL
              </p>
            </div>

            <h1
              className="mb-6 text-[clamp(2.8rem,6vw,4.8rem)] font-extrabold uppercase leading-none tracking-tight text-white"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              WELCOME{' '}
              <span className="text-[#f97316] underline decoration-4 decoration-[#c6f337] underline-offset-8">
                BACK
              </span>
            </h1>
            <p className="mb-6 max-w-xl text-sm leading-relaxed text-[#d4d4d8] sm:text-base">
              Sign in and get back to the pieces, drops, and finds you love.
            </p>

            <div className="mb-6 grid grid-cols-3 gap-2 border-y border-[#3f3f46]/80 bg-black/40 py-3 font-mono backdrop-blur-sm">
              <div>
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#71717a]">
                  AUTHORITY
                </span>
                <span className="text-[12px] font-bold uppercase tracking-wider text-white">
                  SNITCH LABS
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#71717a]">
                  LATENCY
                </span>
                <span className="text-[12px] font-bold uppercase tracking-wider text-[#c6f337]">
                  REALTIME PASS
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#71717a]">
                  ACCESS TIER
                </span>
                <span className="text-[12px] font-bold uppercase tracking-wider text-white">
                  MEMBER
                </span>
              </div>
            </div>

            <div className="inline-flex flex-wrap items-center gap-2 rounded-md border border-[#27272a] bg-[#141414]/90 px-4 py-2.5 shadow-[2px_2px_0px_#000000]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c6f337]" />
              <span
                className="text-[10px] font-semibold uppercase tracking-wider text-[#e4e4e7]"
                style={{ fontFamily: 'Space Grotesk, monospace' }}
              >
                EXCLUSIVE DROPS • PRIORITY RESERVATIONS • ARCHIVE VAULT
              </span>
            </div>
          </div>
        </section>

        <section className="flex w-full items-center justify-center bg-black p-6 sm:p-10 lg:w-[48%] lg:p-14">
          <div className="relative my-auto w-full max-w-[500px] rounded-2xl border border-[#262626] bg-[#141414] p-7 shadow-[4px_4px_0px_#0a0a0a] sm:p-10">
            <div className="absolute left-3 top-3 select-none font-mono text-[9px] text-[#52525b]">
              +002
            </div>
            <div className="absolute right-3 top-3 select-none font-mono text-[9px] text-[#52525b]">
              ARCH//AUTH
            </div>

            <div className="mb-7 border-b border-[#262626] pb-6 text-center">
              <div className="mb-1 inline-block">
                <span
                  className="block text-3xl font-extrabold uppercase tracking-[0.18em] text-white sm:text-4xl"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                >
                  SNITCH<span className="text-[#c6f337]">.</span>
                </span>
              </div>
              <p
                className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#a1a1aa]"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                WELCOME TO THE COLLECTIVE
              </p>
            </div>

            <div className="mb-6">
              <div className="mb-2 flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#c6f337]" />
                <span
                  className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#c6f337]"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  MEMBER ACCESS
                </span>
              </div>
              <h2
                className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
              >
                Sign in
              </h2>
              <p className="mt-1.5 text-sm text-[#a1a1aa]">
                Enter your credentials to continue.
              </p>
            </div>

            {error && (
              <div
                aria-live="polite"
                role="alert"
                className="mb-5 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-950/40 p-3.5"
              >
                <span className="text-lg font-bold text-red-400" aria-hidden="true">
                  ✕
                </span>
                <p className="text-xs font-medium text-red-300">{error}</p>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    htmlFor="email"
                    className="text-[11px] font-bold uppercase tracking-wider text-[#a1a1aa]"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    Email address
                  </label>
                  <span className="font-mono text-[10px] text-[#52525b]">
                    MEMBER_ID
                  </span>
                </div>
                <input
                  autoComplete="email"
                  className="w-full rounded-lg border border-[#262626] bg-[#0a0a0a] px-4 py-3 text-sm tracking-wide text-white transition-colors placeholder:text-[#52525b] focus:border-[#c6f337] focus:outline-none"
                  id="email"
                  name="email"
                  onChange={handleChange}
                  placeholder="alex.vance@specimen.com"
                  required
                  type="email"
                  value={form.email}
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-[11px] font-bold uppercase tracking-wider text-[#a1a1aa]"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-[11px] font-semibold text-[#c6f337] transition-colors hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    autoComplete="current-password"
                    className="w-full rounded-lg border border-[#262626] bg-[#0a0a0a] px-4 py-3 pr-12 text-sm tracking-widest text-white transition-colors placeholder:text-[#52525b] focus:border-[#c6f337] focus:outline-none"
                    id="password"
                    name="password"
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                  />
                  <button
                    type="button"
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#71717a] transition-colors hover:text-white focus:outline-none"
                  >
                    {showPassword ? (
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                disabled={isSubmitting}
                type="submit"
                className="group flex w-full items-center justify-center gap-2 rounded-lg border border-white bg-white px-6 py-4 text-xs font-extrabold uppercase tracking-wider text-black shadow-[3px_3px_0px_#c6f337] transition-all duration-150 hover:bg-[#e4e4e7] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
              >
                <span>{isSubmitting ? 'SIGNING IN…' : 'SIGN IN TO YOUR ACCOUNT'}</span>
                {!isSubmitting && (
                  <svg
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                )}
              </button>

              <div className="flex items-center py-2">
                <div className="flex-grow border-t border-[#262626]" />
                <span
                  className="mx-4 flex-shrink text-[10px] font-bold uppercase tracking-[0.2em] text-[#71717a]"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  OR CONTINUE WITH
                </span>
                <div className="flex-grow border-t border-[#262626]" />
              </div>

              <button
                type="button"
                onClick={() => {
                  window.location.href = 'https://snitch-3p82.onrender.com/api/auth/google'
                }}
                className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-[#262626] bg-[#0a0a0a] px-4 py-3 text-xs font-semibold text-white shadow-[2px_2px_0px_#000000] transition-colors duration-150 hover:border-[#3f3f46] hover:bg-[#18181b]"
              >
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" fill="#EA4335" />
                  <path d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z" fill="#4285F4" />
                  <path d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.1-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.5s.7 4.8 1.9 7.2l3.7-2.9z" fill="#FBBC05" />
                  <path d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.3 7.5 23.5 12 23.5z" fill="#34A853" />
                </svg>
                <span
                  className="text-[11px] font-bold uppercase tracking-widest"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  Continue with Google
                </span>
              </button>

              <p className="pt-2 text-center text-[11px] leading-relaxed text-[#71717a]">
                By continuing, you agree to SNITCH&apos;s{' '}
                <a
                  href="#"
                  className="text-white underline underline-offset-2 transition-colors hover:text-[#c6f337]"
                >
                  Terms of Service
                </a>{' '}
                and{' '}
                <a
                  href="#"
                  className="text-white underline underline-offset-2 transition-colors hover:text-[#c6f337]"
                >
                  Privacy Policy
                </a>
                .
              </p>

              <div className="border-t border-[#262626] pt-3 text-center">
                <span
                  className="text-[11px] uppercase tracking-wider text-[#a1a1aa]"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  New to Snitch?
                </span>
                <Link
                  to="/register"
                  className="ml-2 text-[11px] font-bold uppercase tracking-wider text-[#c6f337] underline-offset-4 hover:underline"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  Create an account →
                </Link>
              </div>
            </form>

            <div className="mt-6 flex items-center justify-between border-t border-dashed border-[#27272a] pt-3 font-mono text-[9px] uppercase text-[#52525b]">
              <span>ENC: 4096-BIT RSA SHA256</span>
              <span>DISPATCH LOCATION: AUTOMATED</span>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default Login
