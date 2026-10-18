import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router'
import { useProduct } from '../hook/useProduct'

const currencies = ['INR', 'USD', 'EUR', 'GBP', 'JPY']

const formatPrice = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0)

const readAttributes = (attributes) => {
  if (attributes instanceof Map) return Object.fromEntries(attributes)
  if (Array.isArray(attributes)) return Object.fromEntries(attributes)
  return attributes && typeof attributes === 'object' ? attributes : {}
}

const SellerProductDetails = () => {
  const { id } = useParams()
  const { handelGetProductDetail,handelAddProductvariant} = useProduct()
  const getProductDetail = useRef(handelGetProductDetail)
  const imageInputRef = useRef(null)
  const localVariantImageUrls = useRef(new Set())
  const [product, setProduct] = useState(null)
  const [localVariants, setLocalVariants] = useState([])
  const [selectedProductImage, setSelectedProductImage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [attributes, setAttributes] = useState([{ name: '', value: '' }])
  const [variantPrice, setVariantPrice] = useState('')
  const [currency, setCurrency] = useState('INR')
  const [startingStock, setStartingStock] = useState('0')
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setError('')
    setSelectedProductImage(0)

    getProductDetail.current(id)
      .then((result) => {
        if (isMounted) {
          setProduct(result)
          setLocalVariants([])
          if (!result) setError('Product not found.')
        }
      })
      .catch((requestError) => {
        if (isMounted) {
          setError(
            requestError.response?.data?.message ||
              'Unable to load this product. Please try again.',
          )
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [id])

  const variants = Array.isArray(product?.variants) ? product.variants : []
  const displayedVariants = [...variants, ...localVariants]
  const productImages = Array.isArray(product?.images) ? product.images : []
  const selectedImage = productImages[selectedProductImage] || productImages[0]
  const stockTotal = displayedVariants.reduce((total, variant) => total + (Number(variant.stock) || 0), 0)

  useEffect(() => () => {
    localVariantImageUrls.current.forEach((url) => URL.revokeObjectURL(url))
    localVariantImageUrls.current.clear()
  }, [])

  useEffect(() => {
    const previews = imageFiles.map((file) => URL.createObjectURL(file))
    setImagePreviews(previews)

    return () => previews.forEach((preview) => URL.revokeObjectURL(preview))
  }, [imageFiles])

 async function handleAddVariant(event) {
    event.preventDefault()
    const localImages = imageFiles.map((file) => {
      const url = URL.createObjectURL(file)
      localVariantImageUrls.current.add(url)
      return { url }
    })
    const variantData = {
      images: imageFiles,
      stock: Number(startingStock) || 0,
      attributes: Object.fromEntries(
        attributes
          .map(({ name, value }) => [name.trim(), value.trim()])
          .filter(([name, value]) => name && value),
      ),
      price: {
        // If seller leaves price empty, inherit the base product price
        amount: variantPrice !== '' ? Number(variantPrice) : (product?.price?.amount ?? 0),
        currency,
      },
    }
    await handelAddProductvariant(product._id,variantData)
    console.log('Product variant data:', variantData)
    setLocalVariants((current) => [
      ...current,
      {
        ...variantData,
        _id: `local-${Date.now()}-${current.length}`,
        images: localImages,
      },
    ])
    setAttributes([{ name: '', value: '' }])
    setVariantPrice('')
    setCurrency('INR')
    setStartingStock('0')
    setImageFiles([])
    if (imageInputRef.current) imageInputRef.current.value = ''
  }

  function handleImageSelection(event) {
    const selectedFiles = Array.from(event.target.files || [])
    setImageFiles((currentFiles) => {
      const newFiles = selectedFiles.filter(
        (selectedFile) =>
          !currentFiles.some(
            (currentFile) =>
              currentFile.name === selectedFile.name &&
              currentFile.size === selectedFile.size &&
              currentFile.lastModified === selectedFile.lastModified,
          ),
      )
      return [...currentFiles, ...newFiles]
    })
    event.target.value = ''
  }

  function removeSelectedImage(indexToRemove) {
    setImageFiles((currentFiles) =>
      currentFiles.filter((_, index) => index !== indexToRemove),
    )
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-[#171717]" style={{ fontFamily: 'Inter, Arial, sans-serif' }}>
      <header className="sticky top-0 z-30 border-b border-[#e9e9e9] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
          <Link
            to="/seller/dashboard"
            aria-label="Seller dashboard"
            className="text-xl font-extrabold tracking-[0.14em]"
          >
            SNITCH<span className="text-[#9abf27]">.</span>
          </Link>
          <Link
            to="/seller/dashboard"
            className="text-xs font-semibold uppercase tracking-[0.1em] hover:text-[#6d8f1b]"
          >
            ← Products
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-10">
        <div className="mb-7">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#777]">
            Seller studio / product details
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
            Product variants
          </h1>
        </div>

        {loading ? (
          <div className="grid animate-pulse gap-6 lg:grid-cols-[minmax(260px,420px)_minmax(0,1fr)]">
            <div className="aspect-[4/5] bg-white" />
            <div className="min-h-72 bg-white" />
          </div>
        ) : error ? (
          <div role="alert" className="border border-[#e8d2d2] bg-white px-6 py-14 text-center text-sm">
            {error}
          </div>
        ) : product ? (
          <>
            <section className="mb-8 grid overflow-hidden border border-[#e9e9e9] bg-white lg:grid-cols-[minmax(260px,420px)_minmax(0,1fr)]">
              <div className="p-3 sm:p-5 lg:p-6">
                <div className="relative mx-auto aspect-[4/5] w-full max-w-[420px] overflow-hidden bg-[#f0f0ed]">
                  {selectedImage?.url ? (
                    <img
                      src={selectedImage.url}
                      alt={`${product.title || 'Product'} photo ${selectedProductImage + 1}`}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-6xl font-bold tracking-[-0.1em] text-[#bbb]">S.</div>
                  )}
                  {productImages.length > 0 && (
                    <span className="absolute bottom-3 right-3 bg-white/90 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.08em] text-[#444]">
                      {selectedProductImage + 1} / {productImages.length}
                    </span>
                  )}
                </div>
                {productImages.length > 0 && (
                  <div
                    aria-label="All seller-uploaded product photos"
                    className="mx-auto mt-3 flex max-w-[420px] gap-2 overflow-x-auto pb-1"
                  >
                    {productImages.map((image, index) => (
                      <button
                        key={image._id || image.url || index}
                        type="button"
                        onClick={() => setSelectedProductImage(index)}
                        aria-label={`View product photo ${index + 1}`}
                        aria-pressed={selectedProductImage === index}
                        className={`h-16 w-14 shrink-0 overflow-hidden border-2 transition sm:h-[72px] sm:w-16 ${
                          selectedProductImage === index
                            ? 'border-[#171717]'
                            : 'border-transparent hover:border-[#bbb]'
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
              </div>
              <div className="flex min-w-0 flex-col justify-between p-5 sm:p-8 lg:p-10">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#777]">Product overview</p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
                    {product.title || 'Untitled product'}
                  </h2>
                  <p className="mt-4 max-w-2xl whitespace-pre-line text-sm leading-7 text-[#686868]">
                    {product.description || 'No product description provided.'}
                  </p>
                </div>
                <div className="mt-8">
                  <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#eee] pb-6">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#777]">Base price</p>
                      <p className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
                        {formatPrice(product.price?.amount, product.price?.currency)}
                      </p>
                    </div>
                    <span className="bg-[#f3f3f0] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#555]">
                      {product.price?.currency || 'INR'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 divide-x divide-[#eee] pt-5">
                    <div className="pr-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#777]">Variants</p>
                      <p className="mt-1.5 text-xl font-semibold">{displayedVariants.length}</p>
                    </div>
                    <div className="pl-5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#777]">Units in stock</p>
                      <p className="mt-1.5 text-xl font-semibold">{stockTotal}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
              <section className="border border-[#e9e9e9] bg-white">
                <div className="flex items-center justify-between border-b border-[#e9e9e9] px-5 py-4 sm:px-6">
                  <div>
                    <h2 className="font-semibold">Your variants</h2>
                    <p className="mt-1 text-xs text-[#777]">Current options, pricing, and stock.</p>
                  </div>
                  <span className="text-xs text-[#777]">{displayedVariants.length} total</span>
                </div>

                {displayedVariants.length > 0 ? (
                  <div className="divide-y divide-[#ededed]">
                    {displayedVariants.map((variant, index) => {
                      const variantAttributes = readAttributes(variant.attributes)
                      const image = variant.images?.[0]?.url || product.images?.[0]?.url
                      return (
                        <article
                          key={variant._id || index}
                          className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:px-6"
                        >
                          <div className="flex min-w-0 flex-1 items-center gap-4">
                            <div className="h-16 w-14 shrink-0 overflow-hidden bg-[#f2f2ef]">
                              {image && <img src={image} alt="" className="h-full w-full object-cover" />}
                            </div>
                            <div>
                              <div className="flex flex-wrap gap-1.5">
                                {Object.entries(variantAttributes).map(([name, value]) => (
                                  <span key={name} className="bg-[#f3f3f0] px-2 py-1 text-[11px] text-[#444]">
                                    <span className="text-[#777]">{name}:</span> {value}
                                  </span>
                                ))}
                              </div>
                              <p className="mt-2 text-sm font-semibold">
                                {formatPrice(variant.price?.amount, variant.price?.currency)}
                              </p>
                            </div>
                          </div>
                          <label className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#777]">
                            Stock
                            <input
                              type="number"
                              min="0"
                              value={variant.stock ?? 0}
                              readOnly
                              aria-label={`Stock for variant ${index + 1}`}
                              className="h-10 w-24 border border-[#ddd] px-3 text-sm font-medium text-[#171717] outline-none"
                            />
                          </label>
                        </article>
                      )
                    })}
                  </div>
                ) : (
                  <div className="px-6 py-14 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f3f3f0] text-xl">+</div>
                    <h3 className="mt-4 text-sm font-semibold">No variants yet</h3>
                    <p className="mt-1 text-xs text-[#777]">Add product options using the form.</p>
                  </div>
                )}
              </section>

              <section className="border border-[#e9e9e9] bg-white">
                <div className="border-b border-[#e9e9e9] px-5 py-4">
                  <h2 className="font-semibold">Add a variant</h2>
                  <p className="mt-1 text-xs text-[#777]">Enter options, price, and starting stock.</p>
                </div>
                <form onSubmit={handleAddVariant} className="space-y-4 p-5">
                  <fieldset className="space-y-2">
                    <legend className="mb-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#777]">
                      Attributes
                    </legend>
                    {attributes.map((attribute, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          value={attribute.name}
                          onChange={(event) =>
                            setAttributes((current) =>
                              current.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, name: event.target.value } : item,
                              ),
                            )
                          }
                          placeholder="Name (e.g. Size)"
                          aria-label={`Attribute ${index + 1} name`}
                          className="h-10 min-w-0 w-1/2 border border-[#ddd] px-3 text-sm outline-none focus:border-[#171717]"
                        />
                        <input
                          value={attribute.value}
                          onChange={(event) =>
                            setAttributes((current) =>
                              current.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, value: event.target.value } : item,
                              ),
                            )
                          }
                          placeholder="Value (e.g. M)"
                          aria-label={`Attribute ${index + 1} value`}
                          className="h-10 min-w-0 w-1/2 border border-[#ddd] px-3 text-sm outline-none focus:border-[#171717]"
                        />
                        {attributes.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              setAttributes((current) => current.filter((_, itemIndex) => itemIndex !== index))
                            }
                            aria-label={`Remove attribute ${index + 1}`}
                            className="px-1 text-lg text-[#777] hover:text-[#171717]"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setAttributes((current) => [...current, { name: '', value: '' }])}
                      className="pt-1 text-xs font-semibold underline underline-offset-2"
                    >
                      + Add attribute
                    </button>
                  </fieldset>

                  <div className="grid grid-cols-[minmax(0,1fr)_100px] gap-3">
                    <label className="space-y-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#777]">
                      Variant price
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={variantPrice}
                        onChange={(event) => setVariantPrice(event.target.value)}
                        placeholder="0.00"
                        className="h-10 w-full border border-[#ddd] px-3 text-sm text-[#171717] outline-none focus:border-[#171717]"
                      />
                    </label>
                    <label className="space-y-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#777]">
                      Currency
                      <select
                        value={currency}
                        onChange={(event) => setCurrency(event.target.value)}
                        className="h-10 w-full border border-[#ddd] bg-white px-2 text-sm text-[#171717] outline-none focus:border-[#171717]"
                      >
                        {currencies.map((item) => <option key={item}>{item}</option>)}
                      </select>
                    </label>
                  </div>

                  <label className="block space-y-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#777]">
                    Starting stock
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={startingStock}
                      onChange={(event) => setStartingStock(event.target.value)}
                      className="h-10 w-full border border-[#ddd] px-3 text-sm text-[#171717] outline-none focus:border-[#171717]"
                    />
                  </label>

                  <div>
                    <label className="block space-y-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#777]">
                      Variant images <span className="font-normal normal-case tracking-normal">(optional)</span>
                      <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageSelection}
                        className="block w-full border border-[#ddd] px-3 py-2 text-xs font-normal normal-case tracking-normal text-[#171717] file:mr-3 file:border-0 file:bg-[#f3f3f0] file:px-3 file:py-2 file:text-xs file:font-semibold"
                      />
                    </label>
                    {imageFiles.length > 0 && (
                      <div className="mt-3 grid grid-cols-4 gap-2">
                        {imagePreviews.map((preview, index) => (
                          <div key={`${imageFiles[index].name}-${imageFiles[index].lastModified}`} className="min-w-0">
                            <div className="relative">
                              <img
                                src={preview}
                                alt={`Selected variant image ${index + 1}`}
                                className="aspect-square w-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => removeSelectedImage(index)}
                                aria-label={`Remove ${imageFiles[index].name}`}
                                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm shadow"
                              >
                                ×
                              </button>
                            </div>
                            <p className="mt-1 truncate text-[10px] text-[#777]" title={imageFiles[index].name}>
                              {imageFiles[index].name}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="mt-1 text-[10px] text-[#888]">
                      Select one or more image files from your device.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="h-11 w-full bg-[#171717] text-xs font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-[#383838]"
                  >
                    Save variant data
                  </button>
                </form>
              </section>
            </div>
          </>
        ) : null}
      </div>
    </main>
  )
}

export default SellerProductDetails
