import { useEffect, useRef, useState, useMemo } from 'react'
import { Link, useParams } from 'react-router'
import { useSelector } from 'react-redux'
import { useProduct } from '../hook/useProduct'
import { useCart } from '../../cart/hook/useCart'

const formatPrice = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0)

const normalizeAttributes = (attributes) => {
  if (attributes instanceof Map) return Object.fromEntries(attributes)
  if (Array.isArray(attributes)) return Object.fromEntries(attributes)
  return attributes && typeof attributes === 'object' ? attributes : {}
}

const getAttributeValue = (attributes, name) =>
  Object.entries(attributes).find(
    ([attributeName]) => attributeName.trim().toLowerCase() === name.trim().toLowerCase(),
  )?.[1]

const ProductDetail = () => {
  const {handelAddItem}=useCart()
  const cartItems = useSelector((state) => state.cart?.items || [])
  const cartCount = useMemo(() => {
    if (!Array.isArray(cartItems)) return 0
    return cartItems.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0)
  }, [cartItems])
  const { id } = useParams()
  const { handelGetProductDetail } = useProduct()
  const getProductDetail = useRef(handelGetProductDetail)
  const [product, setProduct] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedAttributes, setSelectedAttributes] = useState({})
  const [failedImageUrls, setFailedImageUrls] = useState(() => new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [cartMessage, setCartMessage] = useState('')
  const [cartMessageType, setCartMessageType] = useState('success')

  useEffect(() => {
    if (!cartMessage) return undefined
    const timeoutId = window.setTimeout(() => setCartMessage(''), 3000)
    return () => window.clearTimeout(timeoutId)
  }, [cartMessage])

  useEffect(() => {
    let isMounted = true

    setIsLoading(true)
    setError('')
    setSelectedImage(0)
    setFailedImageUrls(new Set())

    getProductDetail.current(id)
      .then((fetchedProduct) => {
        if (isMounted) {
          if (!fetchedProduct) {
            setError('This product could not be found.')
            return
          }
          setProduct(fetchedProduct)
          // Only set attributes if the product actually has variants with attributes
          const firstVariant = fetchedProduct?.variants?.[0]
          const initialAttrs = {
            ...normalizeAttributes(fetchedProduct?.attributes),
            ...normalizeAttributes(firstVariant?.attributes),
          }
          setSelectedAttributes(initialAttrs)
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

  const variants = Array.isArray(product?.variants) ? product.variants : []
  const productAttributes = normalizeAttributes(product?.attributes)
  const attributeNames = [...new Set([
    ...Object.keys(productAttributes),
    ...variants.flatMap((variant) => Object.keys(normalizeAttributes(variant.attributes))),
  ])]
  const selectedVariant =
    attributeNames.length > 0
      ? variants.find((variant) => {
          const attributes = normalizeAttributes(variant.attributes)
          return Object.entries(selectedAttributes).every(([name, value]) => {
            const variantValue = getAttributeValue(attributes, name) ?? getAttributeValue(productAttributes, name)
            return (
              variantValue !== undefined &&
              String(variantValue).trim().toLowerCase() === String(value).trim().toLowerCase()
            )
          })
        }) || null
      : null

  // Always fall back to product.images if no variant images are available
  const images =
    Array.isArray(selectedVariant?.images) && selectedVariant.images.length > 0
      ? selectedVariant.images
      : Array.isArray(product?.images) && product.images.length > 0
        ? product.images
        : []
  const activeImage = images[selectedImage]?.url

  // Use variant price if valid (non-zero), otherwise fall back to product base price
  const priceAmount = (selectedVariant?.price?.amount || 0) !== 0
    ? selectedVariant.price.amount
    : product?.price?.amount ?? 0
  const priceCurrency = selectedVariant?.price?.currency ?? product?.price?.currency ?? 'INR'
  const displayedPrice = { amount: priceAmount, currency: priceCurrency }

  function selectAttribute(name, value) {
    setSelectedAttributes((current) => {
      const matchingVariants = variants.filter((variant) => {
        const attributes = normalizeAttributes(variant.attributes)
        const variantValue = getAttributeValue(attributes, name)
        return (
          variantValue !== undefined &&
          String(variantValue).trim().toLowerCase() === String(value).trim().toLowerCase()
        )
      })
      const compatibleVariant =
        matchingVariants.find((variant) =>
          Object.entries(current).every(([currentName, currentValue]) => {
            if (currentName.trim().toLowerCase() === name.trim().toLowerCase()) return true
            const variantAttributes = normalizeAttributes(variant.attributes)
            const variantValue =
              getAttributeValue(variantAttributes, currentName) ??
              getAttributeValue(productAttributes, currentName)
            return (
              variantValue !== undefined &&
              String(variantValue).trim().toLowerCase() ===
                String(currentValue).trim().toLowerCase()
            )
          }),
        ) || matchingVariants[0]

      return compatibleVariant
        ? {
            ...productAttributes,
            ...normalizeAttributes(compatibleVariant.attributes),
          }
        : { ...current, [name]: value }
    })
    setSelectedImage(0)
  }

  function handleImageError(url, index) {
    setFailedImageUrls((current) => new Set(current).add(url))
    const nextAvailableIndex = images.findIndex(
      (image, candidateIndex) =>
        candidateIndex !== index && image.url && image.url !== url && !failedImageUrls.has(image.url),
    )
    setSelectedImage((current) =>
      current === index && nextAvailableIndex !== -1 ? nextAvailableIndex : current,
    )
  }

  function getAttributeOptions(name) {
    const availableValues = variants
      .map((variant) => {
        const attributes = normalizeAttributes(variant.attributes)
        return getAttributeValue(attributes, name) ?? getAttributeValue(productAttributes, name)
      })
      .filter((value) => typeof value === 'string' && value.length > 0)
    const fallbackValue = getAttributeValue(productAttributes, name)
    return [...new Set([
      ...availableValues,
      ...(typeof fallbackValue === 'string' && fallbackValue ? [fallbackValue] : []),
    ])]
  }

  function showPreviousImage() {
    setSelectedImage((current) => (current === 0 ? images.length - 1 : current - 1))
  }

  function showNextImage() {
    setSelectedImage((current) => (current === images.length - 1 ? 0 : current + 1))
  }

  async function handleAddToCart() {
    setIsAddingToCart(true)
    setCartMessage('')
    try {
      await handelAddItem({
        product,
        productId: product._id,
        price: selectedVariant?.price || product.price,
        ...(selectedVariant?._id && { variantId: selectedVariant._id }),
      })
      setCartMessageType('success')
      setCartMessage('Added to Cart')
    } catch (requestError) {
      setCartMessageType('error')
      setCartMessage(
        requestError.response?.data?.message || 'Already have in your cart.',
      )
    } finally {
      setIsAddingToCart(false)
    }
  }

  return (
    <main className="min-h-screen bg-white text-[#171717]" style={{ fontFamily: 'Inter, Arial, sans-serif' }}>
      {cartMessage && (
        <div
          role={cartMessageType === 'error' ? 'alert' : 'status'}
          className={`fixed left-1/2 top-5 z-50 -translate-x-1/2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-lg ${
            cartMessageType === 'error' ? 'bg-[#a13c32]' : 'bg-[#171717]'
          }`}
        >
          {cartMessage}
        </div>
      )}
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
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              to="/cart"
              aria-label="Shopping Cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-[#f4f4f0]"
              title="Shopping Cart"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5 text-[#171717]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#171717] px-1 text-[10px] font-bold text-white shadow-xs">
                  {cartCount}
                </span>
              )}
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
                      {failedImageUrls.has(image.url) ? (
                        <span className="flex h-full w-full items-center justify-center bg-[#f5f5f2] text-sm font-extrabold text-[#d4d6cc]">
                          S.
                        </span>
                      ) : (
                        <img
                          src={image.url}
                          alt=""
                          loading="lazy"
                          onError={() => handleImageError(image.url, index)}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
              <div className="relative order-1 mx-auto aspect-4/5 w-full max-w-[500px] overflow-hidden bg-[#f5f5f2] sm:order-2">
                {activeImage && !failedImageUrls.has(activeImage) ? (
                  <img
                    src={activeImage}
                    alt={product.title || 'Product'}
                    onError={() => handleImageError(activeImage, selectedImage)}
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
                {formatPrice(displayedPrice?.amount, displayedPrice?.currency || 'INR')}
              </p>

              <div className="my-6 border-t border-[#ededed] sm:my-8" />

              {(attributeNames.length > 0 || variants.length === 1) && (
                <section aria-label="Choose product options" className="mb-7 space-y-5">
                  {attributeNames.map((name) => {
                    const options = getAttributeOptions(name)
                    const selectedValue = selectedAttributes[name] ?? options[0] ?? ''

                    return (
                      <div key={name}>
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <h2 className="text-xs font-bold uppercase tracking-[0.12em]">{name}</h2>
                          {selectedValue && (
                            <span className="text-xs uppercase text-[#777]">{selectedValue}</span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {options.map((value) => (
                            <button
                              key={value}
                              type="button"
                              onClick={() => selectAttribute(name, value)}
                              aria-pressed={selectedValue === value}
                              className={`min-w-11 border px-4 py-2.5 text-xs font-semibold uppercase transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717] ${
                                selectedValue === value
                                  ? 'border-[#171717] bg-[#171717] text-white'
                                  : 'border-[#d8d8d2] bg-white text-[#171717] hover:border-[#171717]'
                              }`}
                            >
                              {value}
                            </button>
                          ))}
                          {options.length === 0 && (
                            <span className="text-xs text-[#777]">
                              {productAttributes[name] || 'Standard'}
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                  {selectedVariant ? (
                    <p
                      role="status"
                      className={`text-xs font-medium uppercase ${
                        Number(selectedVariant.stock) > 0 ? 'text-[#526d19]' : 'text-[#a13c32]'
                      }`}
                    >
                      {Number(selectedVariant.stock) > 0
                        ? `${Number(selectedVariant.stock)} IN STOCK`
                        : 'This option is currently out of stock.'}
                    </p>
                  ) : variants.length > 0 ? (
                    <p role="status" className="text-xs text-[#777]">
                      Stock is unavailable for this option combination.
                    </p>
                  ) : null}
                </section>
              )}

              <section
                aria-labelledby="product-description-heading"
                className="mt-7 border-t border-[#e8e8e2] pt-6 sm:mt-8 sm:pt-7"
              >
                <h2
                  id="product-description-heading"
                  className="text-xs font-bold uppercase tracking-[0.16em] text-[#7d9d25]"
                >
                  Product description
                </h2>
                <p className="mt-3 whitespace-pre-line border-l-2 border-[#c7fa4b] pl-4 text-base leading-7 text-[#555] sm:text-lg">
                  {product.description || 'No description is available for this product.'}
                </p>
              </section>

              <div className="mt-8 flex flex-col gap-3 sm:mt-10">
                <button
                  type="button"
                  className="min-h-12 w-full rounded-full bg-[#171717] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#373737] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717] disabled:cursor-wait disabled:opacity-60"
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  aria-busy={isAddingToCart}
                >
                  {isAddingToCart ? 'Adding...' : 'Add to cart'}
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
