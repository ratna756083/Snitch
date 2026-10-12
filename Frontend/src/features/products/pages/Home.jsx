import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router'
import { useSelector } from 'react-redux'
import { useProduct } from '../hook/useProduct'

const EMPTY_PRODUCTS = []

const formatPrice = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0)

const Home = () => {
  const { handelGetAllProducts } = useProduct()
  const getAllProducts = useRef(handelGetAllProducts)
  const products = useSelector((state) => state.product.products)
  const user = useSelector((state) => state.auth.user)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    getAllProducts.current()
      .catch((requestError) => {
        if (isMounted) {
          setError(
            requestError.response?.data?.message ||
              'We could not load the collection. Please try again.',
          )
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const allProducts = Array.isArray(products) ? products : EMPTY_PRODUCTS
  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase()
    const filtered = allProducts.filter((product) =>
      `${product.title || ''} ${product.description || ''}`
        .toLowerCase()
        .includes(query),
    )

    return [...filtered].sort((first, second) => {
      if (sortBy === 'price-low') {
        return (Number(first.price?.amount) || 0) - (Number(second.price?.amount) || 0)
      }
      if (sortBy === 'price-high') {
        return (Number(second.price?.amount) || 0) - (Number(first.price?.amount) || 0)
      }
      return new Date(second.createdAt || 0) - new Date(first.createdAt || 0)
    })
  }, [allProducts, search, sortBy])

  async function handleRetry() {
    setError('')
    setIsLoading(true)
    try {
      await getAllProducts.current()
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          'We could not load the collection. Please try again.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white text-[#171717]" style={{ fontFamily: 'Inter, Arial, sans-serif' }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      <header className="sticky top-0 z-30 border-b border-black/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1800px] items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
          <Link to="/" aria-label="Snitch home" className="text-[21px] font-extrabold tracking-[0.16em] sm:text-2xl">
            SNITCH<span className="text-[#c7fa4b]">.</span>
          </Link>

          <nav aria-label="Main navigation" className="hidden items-center gap-8 text-xs font-semibold uppercase tracking-[0.12em] md:flex">
            <a href="#products" className="transition hover:text-[#6d8f1b]">Shop all</a>
          </nav>

          <div className="flex items-center gap-3 sm:gap-5">
            <a
              href="#products"
              aria-label="Browse products"
              className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-[#f4f4f0]"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
                <circle cx="10.8" cy="10.8" r="6.3" />
                <path d="m15.5 15.5 4.2 4.2" />
              </svg>
            </a>
            {user ? (
              <span
                className="max-w-32 truncate text-xs font-semibold sm:max-w-52 sm:text-sm"
                title={user.fullname || user.email}
              >
                Hi, {user.fullname || user.email}
              </span>
            ) : (
              <Link
                to="/login"
                className="text-xs font-semibold uppercase tracking-[0.12em] transition hover:text-[#6d8f1b]"
              >
                Sign in
              </Link>
            )}
            <Link
              to="/seller/create-product"
              className="rounded-full bg-[#171717] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.1em] text-white transition hover:bg-[#373737] sm:px-5"
            >
              Sell with us
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1800px] px-[21px] pb-10 pt-9 sm:px-[29px] sm:pb-14 sm:pt-14 lg:px-[37px]">
        <div className="flex flex-col items-start">
          <p className="mb-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#6d8f1b] sm:text-xs">
            <span className="h-px w-7 bg-[#9bc62c]" />
            Made for you
          </p>
          <h1 className="max-w-2xl text-[clamp(3.2rem,9vw,7.6rem)] font-extrabold leading-[0.86] tracking-[-0.075em]">
            Wear your
            <br />
            <span className="text-[#a7d631]">own</span> story.
          </h1>
          <p className="mt-6 max-w-md text-sm leading-6 text-[#686868] sm:mt-8 sm:text-base sm:leading-7">
            Find pieces that feel like you. Explore styles from independent sellers, all in one place.
          </p>
          <a
            href="#products"
            className="mt-7 inline-flex items-center gap-3 rounded-full bg-[#171717] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#373737] sm:mt-9"
          >
            Explore the collection
            <span aria-hidden="true">↘</span>
          </a>
          <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.13em] text-[#777]">
            {allProducts.length} {allProducts.length === 1 ? 'piece' : 'pieces'} to discover
          </p>
        </div>
      </section>

      <section id="products" className="scroll-mt-20 border-t border-[#ededed]">
        <div className="mx-auto max-w-[1800px] px-[21px] pb-16 pt-10 sm:px-[29px] sm:pb-24 sm:pt-14 lg:px-[37px]">
          <div className="mb-7 flex flex-col gap-5 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#7d9d25]">The collection</p>
              <h2 className="text-3xl font-bold tracking-[-0.05em] sm:text-4xl">Shop all products</h2>
              <p className="mt-2 text-sm text-[#777]">Good finds. Great fits. Yours to discover.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="relative block sm:w-64">
                <span className="sr-only">Search products</span>
                <svg aria-hidden="true" viewBox="0 0 24 24" className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777]" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="10.8" cy="10.8" r="6.3" />
                  <path d="m15.5 15.5 4.2 4.2" />
                </svg>
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search the collection"
                  className="h-11 w-full rounded-full border border-[#deded9] bg-white pl-10 pr-4 text-sm outline-none transition placeholder:text-[#999] focus:border-[#8eaa3d]"
                />
              </label>
              <label>
                <span className="sr-only">Sort products</span>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="h-11 w-full appearance-none rounded-full border border-[#deded9] bg-white px-4 text-sm outline-none transition focus:border-[#8eaa3d] sm:w-48"
                >
                  <option value="newest">Newest first</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                </select>
              </label>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6" aria-label="Loading products">
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-[4/5] bg-[#f0f0ed]" />
                  <div className="mt-4 h-3 w-2/3 bg-[#f0f0ed]" />
                  <div className="mt-3 h-3 w-1/3 bg-[#f0f0ed]" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl bg-[#f7f7f4] px-5 py-12 text-center">
              <p className="text-base font-semibold">The collection is taking a moment.</p>
              <p className="mt-2 text-sm text-[#777]">{error}</p>
              <button
                type="button"
                onClick={handleRetry}
                className="mt-5 rounded-full bg-[#171717] px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] text-white transition hover:bg-[#373737]"
              >
                Try again
              </button>
            </div>
          ) : visibleProducts.length ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-6">
              {visibleProducts.map((product) => (
                <Link
                  key={product._id}
                  to={`/products/${product._id}`}
                  className="group block min-w-0"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#f1f1ed]">
                    {product.images?.[0]?.url ? (
                      <img
                        src={product.images[0].url}
                        alt={product.title || 'Product'}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-5xl font-extrabold tracking-[-0.1em] text-[#d4d6cc]">
                        S.
                      </div>
                    )}
                    <span className="absolute left-2.5 top-2.5 rounded-full bg-white/90 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] sm:left-3 sm:top-3">
                      New
                    </span>
                    {product.images?.length > 1 && (
                      <span className="absolute bottom-2.5 right-2.5 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-medium text-white sm:bottom-3 sm:right-3">
                        +{product.images.length - 1} photos
                      </span>
                    )}
                  </div>
                  <div className="flex items-start justify-between gap-2 pt-3.5 sm:pt-4">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold sm:text-base">{product.title || 'Untitled product'}</h3>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#777] sm:text-sm">
                        {product.description || 'A new find from the collection.'}
                      </p>
                    </div>
                    <p className="shrink-0 text-xs font-bold sm:text-sm">
                      {formatPrice(product.price?.amount, product.price?.currency)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-[#f7f7f4] px-5 py-14 text-center">
              <p className="text-base font-semibold">
                {allProducts.length ? 'No products match your search.' : 'No products just yet.'}
              </p>
              <p className="mt-2 text-sm text-[#777]">
                {allProducts.length ? 'Try another name or description.' : 'Check back soon for the latest finds.'}
              </p>
            </div>
          )}
        </div>
      </section>

      <footer className="border-t border-[#ededed]">
        <div className="mx-auto flex max-w-[1800px] flex-col gap-3 px-[21px] py-6 text-[10px] font-medium uppercase tracking-[0.12em] text-[#777] sm:flex-row sm:items-center sm:justify-between sm:px-[29px] lg:px-[37px]">
          <Link to="/" className="font-extrabold tracking-[0.16em] text-[#171717]">SNITCH.</Link>
          <p>Find your fit. Make it yours.</p>
        </div>
      </footer>
    </main>
  )
}

export default Home
