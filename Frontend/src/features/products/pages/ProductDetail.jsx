import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router'
import { useProduct } from '../hook/useProduct'

const formatPrice = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0)

const ProductDetail = () => {
  const { id } = useParams()
  const { handelGetProductDetail } = useProduct()
  const getProductDetail = useRef(handelGetProductDetail)
  const [product, setProduct] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true
    

    setIsLoading(true)
    setError('')
    setSelectedImage(0)

    getProductDetail.current(id)
      .then((fetchedProduct) => {
        if (isMounted) {
          setProduct(fetchedProduct)
          if (!fetchedProduct) setError('This product could not be found.')
        }
      })
      .catch((requestError) => {
        if (isMounted) {
          setProduct(null)
          setError(
            requestError.response?.data?.message ||
              'We could not load this product. Please try again.',
          )
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [id])

  const images = Array.isArray(product?.images) ? product.images : []
  const activeImage = images[selectedImage]?.url

  function showPreviousImage() {
    setSelectedImage((current) => (current === 0 ? images.length - 1 : current - 1))
  }

  function showNextImage() {
    setSelectedImage((current) => (current === images.length - 1 ? 0 : current + 1))
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
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] transition hover:text-[#6d8f1b] sm:text-sm"
          >
            <span aria-hidden="true">←</span>
            <span className="hidden sm:inline">Back to shopping</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-4 pb-16 pt-6 sm:px-6 sm:pb-20 sm:pt-9 lg:px-10">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-xs text-[#777] transition hover:text-[#171717] sm:mb-8"
        >
          <span aria-hidden="true">←</span>
          Continue shopping
        </Link>

        {isLoading ? (
          <div className="grid animate-pulse gap-8 lg:grid-cols-2 lg:gap-14">
            <div className="aspect-[4/5] bg-[#f1f1ed]" />
            <div className="space-y-5 py-3">
              <div className="h-3 w-24 bg-[#f1f1ed]" />
              <div className="h-10 w-3/4 bg-[#f1f1ed]" />
              <div className="h-6 w-32 bg-[#f1f1ed]" />
              <div className="h-24 w-full bg-[#f1f1ed]" />
              <div className="h-12 w-full bg-[#f1f1ed]" />
            </div>
          </div>
        ) : error ? (
          <div role="alert" className="rounded-2xl bg-[#f7f7f4] px-5 py-16 text-center">
            <p className="text-lg font-semibold">{error}</p>
            <Link
              to="/"
              className="mt-6 inline-flex rounded-full bg-[#171717] px-6 py-3 text-xs font-bold uppercase tracking-[0.1em] text-white transition hover:bg-[#373737]"
            >
              Return to products
            </Link>
          </div>
        ) : product ? (
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:gap-12 xl:gap-16">
            <section
              aria-label="Product images"
              className="mx-auto grid w-full max-w-[600px] gap-3 sm:grid-cols-[72px_minmax(0,500px)] sm:justify-center sm:gap-4"
            >
              {images.length > 1 && (
                <div className="order-2 flex gap-3 overflow-x-auto sm:order-1 sm:flex-col">
                  {images.map((image, index) => (
                    <button
                      key={image._id || image.url}
                      type="button"
                      onClick={() => setSelectedImage(index)}
                      aria-label={`View product image ${index + 1}`}
                      aria-pressed={selectedImage === index}
                      className={`h-16 w-14 shrink-0 overflow-hidden border-2 transition sm:h-20 sm:w-full ${
                        selectedImage === index ? 'border-[#171717]' : 'border-transparent hover:border-[#b8b8b0]'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
              <div className="relative order-1 mx-auto aspect-4/5 w-full max-w-[500px] overflow-hidden bg-[#f5f5f2] sm:order-2">
                {activeImage ? (
                  <img
                    src={activeImage}
                    alt={product.title || 'Product'}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-7xl font-extrabold tracking-[-0.1em] text-[#d4d6cc]">
                    S.
                  </div>
                )}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={showPreviousImage}
                      aria-label="Show previous product image"
                      className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#171717] shadow-sm transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717] sm:left-4"
                    >
                      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={showNextImage}
                      aria-label="Show next product image"
                      className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#171717] shadow-sm transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717] sm:right-4"
                    >
                      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </button>
                    <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#171717] shadow-sm sm:bottom-4 sm:right-4">
                      {selectedImage + 1} / {images.length}
                    </span>
                  </>
                )}
              </div>
            </section>

            <section className="mx-auto w-full max-w-[500px] rounded-2xl bg-[#f8f8f5] p-5 sm:p-7 lg:py-9 lg:pl-9 lg:pr-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7d9d25]">
                The collection
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-[-0.05em] sm:text-4xl lg:text-5xl">
                {product.title || 'Untitled product'}
              </h1>
              <p className="mt-4 text-xl font-semibold sm:text-2xl">
                {formatPrice(product.price?.amount, product.price?.currency)}
              </p>

              <div className="my-6 border-t border-[#ededed] sm:my-8" />

              <h2 className="text-xs font-bold uppercase tracking-[0.12em]">Description</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#686868] sm:text-base">
                {product.description || 'No description is available for this product.'}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:mt-10">
                <button
                  type="button"
                  className="min-h-12 w-full rounded-full bg-[#171717] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#373737] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
                >
                  Add to cart
                </button>
                <button
                  type="button"
                  className="min-h-12 w-full rounded-full border border-[#171717] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.12em] transition hover:bg-[#f5f5f2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
                >
                  Buy now
                </button>
              </div>

              <div className="mt-8 space-y-3 border-t border-[#ededed] pt-6 text-xs leading-5 text-[#777]">
                <p className="flex items-center gap-3">
                  <span aria-hidden="true" className="text-base text-[#171717]">↗</span>
                  Unique finds from independent sellers
                </p>
                <p className="flex items-center gap-3">
                  <span aria-hidden="true" className="text-base text-[#171717]">◇</span>
                  {images.length} {images.length === 1 ? 'product image' : 'product images'}
                </p>
              </div>
            </section>
          </div>
        ) : null}
      </div>

      <footer className="border-t border-[#ededed]">
        <div className="mx-auto flex max-w-[1800px] flex-col gap-3 px-4 py-6 text-[10px] font-medium uppercase tracking-[0.12em] text-[#777] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <Link to="/" className="font-extrabold tracking-[0.16em] text-[#171717]">SNITCH.</Link>
          <p>Find your fit. Make it yours.</p>
        </div>
      </footer>
    </main>
  )
}

export default ProductDetail
