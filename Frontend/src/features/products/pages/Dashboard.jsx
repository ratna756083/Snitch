import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router'
import { useSelector } from 'react-redux'
import { useProduct } from '../hook/useProduct'

const EMPTY_PRODUCTS = []

const Icon = ({ name, className = '' }) => (
  <span className={`material-symbols-outlined ${className}`} aria-hidden="true">
    {name}
  </span>
)

const formatPrice = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0)

const sortOptions = [
  { value: 'newest', label: 'New arrivals' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'price-low', label: 'Price: low to high' },
  { value: 'price-high', label: 'Price: high to low' },
]

const Dashboard = () => {
  const { handelGetSellerproducts } = useProduct()
  const getSellerProducts = useRef(handelGetSellerproducts)
  const sellerProducts = useSelector((state) => state.product.sellerProducts)
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [showSort, setShowSort] = useState(false)
  const [sortBy, setSortBy] = useState('newest')
  const [singleColumn, setSingleColumn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    getSellerProducts.current()
      .catch((requestError) => {
        if (isMounted) {
          setError(
            requestError.response?.data?.message ||
              'We could not load your products. Please try again.',
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

  const products = Array.isArray(sellerProducts) ? sellerProducts : EMPTY_PRODUCTS
  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase()
    const filtered = products.filter((product) =>
      `${product.title || ''} ${product.description || ''}`
        .toLowerCase()
        .includes(query),
    )

    return [...filtered].sort((first, second) => {
      if (sortBy === 'oldest') {
        return new Date(first.createdAt || 0) - new Date(second.createdAt || 0)
      }
      if (sortBy === 'price-low') {
        return (Number(first.price?.amount) || 0) - (Number(second.price?.amount) || 0)
      }
      if (sortBy === 'price-high') {
        return (Number(second.price?.amount) || 0) - (Number(first.price?.amount) || 0)
      }
      return new Date(second.createdAt || 0) - new Date(first.createdAt || 0)
    })
  }, [products, search, sortBy])

  async function handleRetry() {
    setError('')
    setIsLoading(true)
    try {
      await handelGetSellerproducts()
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          'We could not load your products. Please try again.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  const gridClass = singleColumn
    ? 'grid-cols-1 sm:grid-cols-2'
    : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'

  return (
    <main className="min-h-screen bg-white pb-24 text-[#171717] sm:pb-10" style={{ fontFamily: 'Inter, Arial, sans-serif' }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />
      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 350, 'GRAD' 0, 'opsz' 24;
          display: inline-block;
          line-height: 1;
          font-size: 22px;
        }
      `}</style>

      <header className="sticky top-0 z-30 border-b border-[#e9e9e9] bg-white">
        <div className="mx-auto flex h-15.5 max-w-360 items-center justify-between px-4 sm:h-18 sm:px-8">
          <Link
            to="/seller/dashboard"
            aria-label="Snitch seller dashboard"
            className="absolute left-1/2 -translate-x-1/2 text-[22px] font-bold tracking-[0.12em]"
          >
            SNITCH
          </Link>

          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label={showSearch ? 'Close product search' : 'Search products'}
              onClick={() => {
                setShowSearch((visible) => !visible)
                setShowSort(false)
              }}
              className="flex h-10 w-7 items-center justify-center"
            >
              <Icon name={showSearch ? 'close' : 'search'} />
            </button>
            <Link
              to="/seller/create-product"
              aria-label="Add product to your store"
              className="flex h-10 w-7 items-center justify-center"
            >
              <Icon name="add" />
            </Link>
          </div>
        </div>

        {showSearch && (
          <div className="border-t border-[#ededed] px-4 py-3 sm:px-8">
            <label className="mx-auto flex max-w-360 items-center gap-3">
              <Icon name="search" className="text-[#666]" />
              <input
                autoFocus
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search your products"
                className="w-full border-0 bg-transparent py-1 text-sm outline-none placeholder:text-[#888]"
              />
            </label>
          </div>
        )}
      </header>

      <section className="mx-auto max-w-360">
        <div className="flex items-end justify-between gap-4 px-4 pb-3 pt-6 sm:px-8 sm:pt-8">
          <div>
            <h1 className="text-[24px] font-semibold tracking-[-0.04em] sm:text-[30px]">
              PRODUCTS
            </h1>
            <p className="mt-1 text-[11px] text-[#777]">
              {isLoading
                ? 'Loading your listings'
                : `${products.length} ${products.length === 1 ? 'product' : 'products'} in your store`}
            </p>
          </div>
          <Link
            to="/seller/create-product"
            className="mb-0.5 inline-flex items-center gap-1.5 border border-[#171717] px-3 py-2 text-[10px] font-medium uppercase tracking-[0.04em] transition hover:bg-[#171717] hover:text-white sm:px-4 sm:text-[11px]"
          >
            <Icon name="add" className="text-[17px]" />
            Add product
          </Link>
        </div>

        <nav
          aria-label="Product listing status"
          className="scrollbar-none flex h-10.75 items-stretch overflow-x-auto border-y border-[#e9e9e9] px-4 sm:px-8 [&::-webkit-scrollbar]:hidden"
        >
          <span className="relative flex shrink-0 items-center px-1 text-[12px] font-semibold tracking-[0.03em] after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-[#171717]">
            ALL
            <span className="ml-1.5 text-[10px] font-normal text-[#777]">
              {isLoading ? '' : products.length}
            </span>
          </span>
          <span className="ml-6 flex shrink-0 items-center text-[11px] text-[#777]">LISTINGS</span>
        </nav>

        <div className="relative flex h-14.5 items-center justify-between border-b border-[#e9e9e9] px-4 sm:px-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Show products in two columns"
              aria-pressed={!singleColumn}
              onClick={() => setSingleColumn(false)}
              className={`flex h-9 w-7 items-center justify-center ${!singleColumn ? 'text-black' : 'text-[#aaa]'}`}
            >
              <Icon name="grid_view" />
            </button>
            <button
              type="button"
              aria-label="Show products in one column"
              aria-pressed={singleColumn}
              onClick={() => setSingleColumn(true)}
              className={`flex h-9 w-7 items-center justify-center ${singleColumn ? 'text-black' : 'text-[#aaa]'}`}
            >
              <Icon name="view_agenda" />
            </button>
          </div>

          <div className="flex h-full items-center">
            <button
              type="button"
              onClick={() => {
                setShowSort((visible) => !visible)
                setShowSearch(false)
              }}
              aria-expanded={showSort}
              className="flex h-full items-center gap-2 px-3 text-[12px] font-medium uppercase"
            >
              <Icon name="swap_vert" className="text-[#444]" />
              Sort
            </button>
          </div>

          {showSort && (
            <div className="absolute right-4 top-12.5 z-20 min-w-48 border border-[#e5e5e5] bg-white py-1 shadow-lg sm:right-8">
              {sortOptions.map((option) => (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => {
                    setSortBy(option.value)
                    setShowSort(false)
                  }}
                  className={`flex w-full items-center justify-between px-4 py-3 text-left text-xs hover:bg-[#f7f7f7] ${
                    sortBy === option.value ? 'font-semibold' : ''
                  }`}
                >
                  {option.label}
                  {sortBy === option.value && <Icon name="check" className="text-[17px]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="px-1 sm:px-8">
          {error && (
            <div
              role="alert"
              className="mx-3 my-5 flex items-center justify-between border border-[#e5baba] bg-[#fff8f8] px-4 py-3 text-sm sm:mx-0"
            >
              <span>{error}</span>
              <button type="button" onClick={handleRetry} className="ml-4 shrink-0 underline">
                Try again
              </button>
            </div>
          )}

          {isLoading ? (
            <div className={`mx-auto grid max-w-260 ${gridClass} gap-x-4 gap-y-7 bg-white`}>
              {[0, 1, 2, 3].map((item) => (
                <div key={item} className="aspect-4/5 animate-pulse bg-[#f3f3f3]" />
              ))}
            </div>
          ) : visibleProducts.length > 0 ? (
            <div className={`mx-auto grid max-w-260 ${gridClass} gap-x-4 gap-y-7 bg-white`}>
              {visibleProducts.map((product) => (
                <article key={product._id} className="min-w-0 bg-white">
                  <div className="group relative aspect-4/5 overflow-hidden bg-[#f2f2f2]">
                    {product.images?.[0]?.url ? (
                      <img
                        src={product.images[0].url}
                        alt={product.title || 'Product image'}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[#aaa]">
                        <Icon name="image" className="text-[32px]" />
                      </div>
                    )}
                    {product.images?.length > 1 && (
                      <span className="absolute bottom-2 right-2 bg-white/90 px-1.5 py-1 text-[9px] text-[#444]">
                        {product.images.length} photos
                      </span>
                    )}
                  </div>

                  <div className="px-1.5 pb-2 pt-1.5 sm:px-2">
                    <div className="flex min-h-4.5 items-start justify-between gap-2">
                      <h2
                        className="line-clamp-1 text-[10px] font-normal leading-3.75 sm:text-[12px] sm:leading-4.25"
                        title={product.title || 'Untitled product'}
                      >
                        {product.title || 'Untitled product'}
                      </h2>
                    </div>
                    <p className="mt-1 text-[11px] font-semibold sm:text-[12px]">
                      {formatPrice(product.price?.amount, product.price?.currency || 'INR')}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="px-5 py-20 text-center">
              <Icon name={search ? 'search_off' : 'inventory_2'} className="text-[34px] text-[#999]" />
              <h2 className="mt-4 text-sm font-medium">
                {search ? 'No matching products' : 'No products yet'}
              </h2>
              <p className="mt-2 text-xs text-[#777]">
                {search
                  ? 'Try a different search term.'
                  : 'Your product listings will appear here.'}
              </p>
              {!search && (
                <Link
                  to="/seller/create-product"
                  className="mt-5 inline-flex items-center gap-2 border border-[#171717] px-5 py-3 text-[11px] font-medium uppercase tracking-[0.04em] transition hover:bg-[#171717] hover:text-white"
                >
                  <Icon name="add" className="text-[18px]" />
                  Add your first product
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      <nav
        aria-label="Seller navigation"
        className="fixed inset-x-0 bottom-0 z-30 flex h-17 items-center justify-center gap-14 border-t border-[#e9e9e9] bg-white/95 px-4 backdrop-blur sm:hidden"
      >
        <Link
          to="/seller/dashboard"
          aria-current="page"
          className="flex min-w-16 flex-col items-center gap-1 text-[#171717]"
        >
          <Icon name="grid_view" className="text-[21px]" />
          <span className="text-[9px]">Products</span>
        </Link>
        <Link
          to="/seller/create-product"
          className="flex min-w-16 flex-col items-center gap-1 text-[#555]"
        >
          <Icon name="add_box" className="text-[21px]" />
          <span className="text-[9px]">Add product</span>
        </Link>
      </nav>
    </main>
  )
}

export default Dashboard
