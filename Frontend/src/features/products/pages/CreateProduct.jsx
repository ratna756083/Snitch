import { useState, useRef } from 'react'
import { useNavigate } from 'react-router'
import { useProduct } from '../hook/useProduct'

const CURRENCY_SYMBOLS = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  AED: 'د.إ',
}

const MAX_IMAGES = 7

export default function CreateProduct() {
  const navigate = useNavigate()
  const { handelCreateProduct } = useProduct()

  const [form, setForm] = useState({
    title: '',
    description: '',
    priceAmount: '',
    priceCurrency: 'INR',
  })

  // Array of { file: File, preview: string, id: string, name: string, size: string }
  const [images, setImages] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const fileInputRef = useRef(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errorMessage) setErrorMessage('')
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const handleFiles = (incomingFiles) => {
    const fileList = Array.from(incomingFiles).filter((file) =>
      file.type.startsWith('image/')
    )

    if (fileList.length === 0) return

    const availableSlots = MAX_IMAGES - images.length
    if (availableSlots <= 0) {
      setErrorMessage(`Maximum of ${MAX_IMAGES} images reached.`)
      return
    }

    const filesToAdd = fileList.slice(0, availableSlots)
    if (fileList.length > availableSlots) {
      setErrorMessage(`Only ${availableSlots} more image(s) could be added (max ${MAX_IMAGES}).`)
    } else {
      setErrorMessage('')
    }

    const newImageItems = filesToAdd.map((file) => ({
      file,
      id: `${file.name}-${file.lastModified}-${Math.random()}`,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: formatFileSize(file.size),
    }))

    setImages((prev) => [...prev, ...newImageItems])
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (e.dataTransfer?.files) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleRemoveImage = (idToRemove) => {
    setImages((prev) => {
      const removed = prev.find((img) => img.id === idToRemove)
      if (removed?.preview) URL.revokeObjectURL(removed.preview)
      return prev.filter((img) => img.id !== idToRemove)
    })
    setErrorMessage('')
  }

  const handleSetCover = (index) => {
    if (index === 0) return
    setImages((prev) => {
      const reordered = [...prev]
      const [item] = reordered.splice(index, 1)
      reordered.unshift(item)
      return reordered
    })
  }

  const handleMoveImage = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= images.length) return
    setImages((prev) => {
      const reordered = [...prev]
      const [item] = reordered.splice(fromIndex, 1)
      reordered.splice(toIndex, 0, item)
      return reordered
    })
  }

  const handleSubmit = async (e) => {
    e?.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    if (!form.title.trim()) {
      setErrorMessage('Please provide a product title.')
      return
    }
    if (!form.description.trim()) {
      setErrorMessage('Please provide a product description.')
      return
    }
    if (!form.priceAmount || Number(form.priceAmount) <= 0) {
      setErrorMessage('Please enter a valid price amount greater than 0.')
      return
    }
    if (images.length === 0) {
      setErrorMessage('Please upload at least 1 product image (up to 7).')
      return
    }

    try {
      setIsSubmitting(true)
      const formData = new FormData()
      formData.append('title', form.title.trim())
      formData.append('description', form.description.trim())
      formData.append('priceAmount', Number(form.priceAmount))
      formData.append('priceCurrency', form.priceCurrency)

      images.forEach((item) => {
        formData.append('images', item.file)
      })

      await handelCreateProduct(formData)

      setSuccessMessage('Product created successfully!')
      setTimeout(() => {
        navigate('/')
      }, 1400)
    } catch (err) {
      console.error(err)
      const message =
        err?.response?.data?.errors?.[0]?.msg ||
        err?.response?.data?.message ||
        'Failed to create product. Please try again.'
      setErrorMessage(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const wordCount = form.description.trim()
    ? form.description.trim().split(/\s+/).length
    : 0

  return (
    <>
      <style>{`
        /* Custom scrollbars matching Stitch screen */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #111214;
        }
        ::-webkit-scrollbar-thumb {
          background: #2C2E35;
          border-radius: 9999px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #F59E0B;
        }
        .card-glow-subtle {
          box-shadow: 0 0 0 1px rgba(245, 158, 11, 0.05), 0 4px 20px -2px rgba(0, 0, 0, 0.5);
        }
      `}</style>

      <div className="bg-[#0C0D0E] text-neutral-200 font-sans min-h-screen flex flex-col antialiased selection:bg-[#F59E0B] selection:text-black">
        {/* BEGIN: TopHeader */}
        <header className="sticky top-0 z-40 bg-[#111214]/90 backdrop-blur-md border-b border-[#23252A] px-6 py-3.5 flex items-center justify-between">
          {/* Brand & Breadcrumbs */}
          <div className="flex items-center space-x-4">
            <div
              onClick={() => navigate('/')}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              {/* Logo Icon badge */}
              <div className="w-8 h-8 rounded-lg bg-[#F59E0B] flex items-center justify-center font-extrabold text-[#0C0D0E] text-lg shadow-md shadow-amber-500/20">
                S
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black tracking-wider uppercase text-white leading-none">
                  SNITCH
                </span>
                <span className="text-[9px] font-semibold tracking-widest uppercase text-amber-500/90 leading-tight">
                  SELLER STUDIO
                </span>
              </div>
            </div>

            {/* Breadcrumbs */}
            <nav
              aria-label="Breadcrumb"
              className="hidden sm:flex items-center space-x-2 text-xs text-neutral-400 font-medium pl-2 border-l border-[#2C2E35]"
            >
              <span className="text-neutral-500">/</span>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/') }} className="hover:text-neutral-200 transition-colors">
                Catalog
              </a>
              <span className="text-neutral-500">/</span>
              <span className="text-neutral-100 font-semibold">Create Product</span>
            </nav>
          </div>

          {/* Top Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => {
                setForm({
                  title: '',
                  description: '',
                  priceAmount: '1499.00',
                  priceCurrency: 'INR',
                })
                setImages([])
                setErrorMessage('')
              }}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-neutral-400 hover:text-neutral-100 hover:bg-[#1B1C20] border border-transparent hover:border-[#2C2E35] transition-all duration-150 cursor-pointer"
            >
              Reset
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-[#FBBF24] hover:bg-[#F59E0B] text-[#0C0D0E] text-xs font-bold transition-all duration-150 shadow-sm shadow-amber-500/30 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Publishing...</span>
              ) : (
                <>
                  <span>Publish Product</span>
                  <svg className="w-3.5 h-3.5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </header>

        {/* BEGIN: MainContent */}
        <main className="flex-1 max-w-[1560px] w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-28">
          {/* Title and Status Tag */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold tracking-tight text-white">Create Product</h1>
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-[#FBBF24] border border-amber-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>Draft Listing</span>
              </span>
            </div>

            {/* Error or Success Toast */}
            {errorMessage && (
              <div className="px-3 py-1 rounded-lg text-xs flex items-center space-x-2 bg-red-500/10 border border-red-500/30 text-red-400">
                <span>{errorMessage}</span>
                <button type="button" onClick={() => setErrorMessage('')} className="ml-1 hover:text-white">✕</button>
              </div>
            )}
            {successMessage && (
              <div className="px-3 py-1 rounded-lg text-xs flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold">
                <span>{successMessage}</span>
              </div>
            )}
          </div>

          {/* Main Form Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* BEGIN: LeftColumn (Basic Information + Spaced Pricing Section) */}
            <section aria-label="Product Details and Pricing" className="lg:col-span-6 xl:col-span-6 flex flex-col gap-8">
              {/* BEGIN: BasicInformationCard */}
              <article className="bg-[#111214] border border-[#23252A] rounded-xl p-5 sm:p-6 card-glow-subtle transition-all">
                {/* Card Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#1B1C20] mb-5">
                  <div className="flex items-center space-x-2 text-white font-bold text-sm tracking-wide">
                    <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M3.75 6.75h16.5M3.75 12h10.5m-10.5 5.25h16.5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                    </svg>
                    <h2 className="uppercase text-xs font-extrabold tracking-wider text-neutral-100">
                      Basic Information
                    </h2>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-[#1B1C20] text-neutral-400 border border-[#23252A]">
                    01
                  </span>
                </div>

                {/* Card Content / Fields */}
                <div className="space-y-5">
                  {/* Product Title Field */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center" htmlFor="product-title">
                        Product Title <span className="text-amber-500 ml-1">*</span>
                      </label>
                      <span className="text-[11px] font-mono text-neutral-500">
                        {form.title.length}/100
                      </span>
                    </div>
                    <input
                      className="w-full bg-[#16171A] text-neutral-100 text-sm placeholder-neutral-500 rounded-lg border border-[#2C2E35] focus:border-amber-500 focus:ring-1 focus:ring-amber-500 px-3.5 py-2.5 transition-colors focus:outline-none"
                      id="product-title"
                      maxLength={100}
                      name="title"
                      value={form.title}
                      onChange={handleInputChange}
                      placeholder="e.g. Minimalist Oversized Linen Shirt"
                      type="text"
                    />
                  </div>

                  {/* Description Field */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center" htmlFor="product-description">
                        Description <span className="text-amber-500 ml-1">*</span>
                      </label>
                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] font-mono text-neutral-500">
                          {wordCount} words • {form.description.length} chars
                        </span>
                      </div>
                    </div>

                    {/* Markdown/Rich Text Editor Box */}
                    <div className="border border-[#2C2E35] rounded-lg overflow-hidden focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500 transition-colors bg-[#16171A]">
                      {/* Toolbar */}
                      <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#23252A] bg-[#1B1C20] text-neutral-400 text-xs">
                        <div className="flex items-center space-x-1">
                          <button
                            type="button"
                            onClick={() => setForm((prev) => ({ ...prev, description: prev.description + '**bold**' }))}
                            className="p-1 hover:text-neutral-100 hover:bg-[#23252A] rounded font-bold transition"
                            title="Bold"
                          >
                            B
                          </button>
                          <button
                            type="button"
                            onClick={() => setForm((prev) => ({ ...prev, description: prev.description + '_italic_' }))}
                            className="p-1 hover:text-neutral-100 hover:bg-[#23252A] rounded italic transition"
                            title="Italic"
                          >
                            I
                          </button>
                          <div className="w-px h-3.5 bg-[#2C2E35] mx-1" />
                          <button
                            type="button"
                            onClick={() => setForm((prev) => ({ ...prev, description: prev.description + '\n- ' }))}
                            className="p-1 hover:text-neutral-100 hover:bg-[#23252A] rounded flex items-center space-x-0.5 transition"
                            title="List"
                          >
                            <span className="text-xs font-bold">• List</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setForm((prev) => ({ ...prev, description: prev.description + '\n`code`' }))}
                            className="p-1 hover:text-neutral-100 hover:bg-[#23252A] rounded font-mono text-[11px] transition"
                            title="Code"
                          >
                            &lt;/&gt;
                          </button>
                        </div>
                        <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-500">
                          Markdown supported
                        </span>
                      </div>

                      {/* Textarea Area */}
                      <textarea
                        className="w-full bg-transparent border-0 text-sm text-neutral-200 placeholder-neutral-500 p-3.5 focus:ring-0 focus:outline-none resize-y min-h-[140px]"
                        id="product-description"
                        name="description"
                        value={form.description}
                        onChange={handleInputChange}
                        placeholder="Provide detailed description of fabric composition, fit silhouette, dimensions, wash care, and artisanal craft techniques..."
                        rows={6}
                      />
                    </div>
                  </div>
                </div>
              </article>

              {/* BEGIN: PricingAndCurrencyCard */}
              <article className="bg-[#111214] border border-[#23252A] rounded-xl p-5 sm:p-6 card-glow-subtle transition-all">
                {/* Card Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#1B1C20] mb-5">
                  <div className="flex items-center space-x-2 text-white font-bold text-sm tracking-wide">
                    <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6H2.25m0 0v8.25m0 0h.75a.75.75 0 01.75.75v.75m0 0H18m0 0h.75a.75.75 0 00.75-.75V15m0 0H21m-3 0V6a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6v.75" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                    <h2 className="uppercase text-xs font-extrabold tracking-wider text-neutral-100">
                      Pricing &amp; Currency
                    </h2>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-[#1B1C20] text-neutral-400 border border-[#23252A]">
                    02
                  </span>
                </div>

                {/* Card Content / Fields */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                    {/* Price Amount Input */}
                    <div className="sm:col-span-7">
                      <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2" htmlFor="price-amount">
                        Price Amount <span className="text-amber-500">*</span>
                      </label>
                      <div className="relative rounded-lg overflow-hidden">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400 font-medium text-sm">
                          {CURRENCY_SYMBOLS[form.priceCurrency] || '₹'}
                        </div>
                        <input
                          className="w-full bg-[#16171A] text-neutral-100 text-sm font-medium rounded-lg border border-[#2C2E35] pl-8 pr-3.5 py-2.5 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors focus:outline-none"
                          id="price-amount"
                          name="priceAmount"
                          value={form.priceAmount}
                          onChange={handleInputChange}
                          placeholder="0.00"
                          step="0.01"
                          type="number"
                        />
                      </div>
                    </div>

                    {/* Currency Dropdown Selector */}
                    <div className="sm:col-span-5">
                      <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2" htmlFor="currency-selector">
                        Currency <span className="text-amber-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          className="w-full bg-[#16171A] text-neutral-100 text-sm rounded-lg border border-[#2C2E35] px-3.5 py-2.5 pr-8 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 appearance-none transition-colors cursor-pointer focus:outline-none"
                          id="currency-selector"
                          name="priceCurrency"
                          value={form.priceCurrency}
                          onChange={handleInputChange}
                        >
                          <option value="INR">INR (₹ - Rupee)</option>
                          <option value="USD">USD ($ - US Dollar)</option>
                          <option value="EUR">EUR (€ - Euro)</option>
                          <option value="GBP">GBP (£ - British Pound)</option>
                          <option value="AED">AED (د.إ - UAE Dirham)</option>
                          <option value="JPY">JPY (¥ - Japanese Yen)</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-neutral-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tax Checkbox Option */}
                  <div className="pt-2">
                    <label className="flex items-start space-x-3 cursor-pointer group">
                      <div className="flex items-center h-5">
                        <input
                          id="taxes-included"
                          name="taxes_included"
                          type="checkbox"
                          defaultChecked
                          className="w-4 h-4 rounded bg-[#1B1C20] border-[#3D404A] text-amber-500 focus:ring-amber-500 focus:ring-offset-[#111214] focus:ring-offset-1 cursor-pointer"
                        />
                      </div>
                      <span className="text-xs text-neutral-300 group-hover:text-neutral-200 select-none">
                        Includes taxes &amp; standard duties <span className="text-neutral-400">(marked as "Taxes included" during checkout)</span>
                      </span>
                    </label>
                  </div>
                </div>
              </article>
            </section>

            {/* BEGIN: RightColumn (Media & Gallery) */}
            <section aria-label="Media and Gallery Section" className="lg:col-span-6 xl:col-span-6">
              <article className="bg-[#111214] border border-[#23252A] rounded-xl p-5 sm:p-6 card-glow-subtle h-full flex flex-col justify-between">
                <div>
                  {/* Gallery Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-[#1B1C20] mb-5">
                    <div className="flex items-center space-x-2 text-white font-bold text-sm tracking-wide">
                      <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                      <h2 className="uppercase text-xs font-extrabold tracking-wider text-neutral-100">
                        Media &amp; Gallery
                      </h2>
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-[#1B1C20] text-amber-400 border border-[#23252A]">
                        {images.length} / {MAX_IMAGES}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {images.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setImages([])}
                          className="text-xs text-neutral-400 hover:text-neutral-200 transition-colors font-medium cursor-pointer"
                        >
                          Clear All
                        </button>
                      )}
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-[#1B1C20] text-neutral-400 border border-[#23252A]">
                        03
                      </span>
                    </div>
                  </div>

                  {/* Hidden Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files) handleFiles(e.target.files)
                      e.target.value = ''
                    }}
                    className="hidden"
                    id="imageUploadInput"
                  />

                  {/* Upload Dropzone Area */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => {
                      if (images.length < MAX_IMAGES) {
                        fileInputRef.current?.click()
                      }
                    }}
                    className={`border border-dashed rounded-xl p-5 text-center transition-all duration-200 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer ${
                      isDragging
                        ? 'border-amber-400 bg-amber-500/10'
                        : images.length >= MAX_IMAGES
                        ? 'border-[#2C2E35] bg-[#16171A]/40 opacity-60 cursor-not-allowed'
                        : 'border-[#2C2E35] hover:border-amber-500/50 bg-[#16171A]/60'
                    }`}
                  >
                    <div className="flex items-center space-x-3.5 text-left">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-neutral-200">
                          {images.length >= MAX_IMAGES
                            ? 'Max capacity reached (7/7)'
                            : 'Drag & drop photos here, or browse'}
                        </h3>
                        <p className="text-[11px] text-neutral-400 mt-0.5">
                          PNG, JPG, WEBP • Max 10MB each • 1st image is Cover
                        </p>
                      </div>
                    </div>
                    {images.length < MAX_IMAGES && (
                      <button
                        type="button"
                        className="px-3.5 py-1.5 rounded-lg bg-[#23252A] hover:bg-[#2C2E35] text-neutral-200 text-xs font-semibold border border-[#3D404A] transition whitespace-nowrap cursor-pointer"
                      >
                        Browse Files
                      </button>
                    )}
                  </div>

                  {/* Gallery Grid (7 Slots layout) */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    {/* Render Uploaded Images */}
                    {images.map((item, index) => (
                      <div
                        key={item.id}
                        className={`relative group aspect-square rounded-lg overflow-hidden shadow-md flex flex-col justify-between p-2 transition-all ${
                          index === 0
                            ? 'border-2 border-amber-500/80 bg-[#16171A]'
                            : 'border border-[#2C2E35] bg-[#16171A]'
                        }`}
                      >
                        <img
                          src={item.preview}
                          alt={item.name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />

                        {/* Slot Badge */}
                        <div className="relative z-10 flex justify-between items-start">
                          {index === 0 ? (
                            <span className="bg-[#FBBF24] text-[#0C0D0E] text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-sm">
                              Cover
                            </span>
                          ) : (
                            <div className="w-5 h-5 rounded bg-blue-500/80 text-[10px] flex items-center justify-center text-white font-bold">
                              #{index + 1}
                            </div>
                          )}
                        </div>

                        {/* Hover Overlay Actions */}
                        <div className="absolute inset-0 z-20 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1 backdrop-blur-xs">
                          {index !== 0 && (
                            <button
                              type="button"
                              onClick={() => handleSetCover(index)}
                              className="p-1.5 rounded bg-[#1B1C20] text-amber-400 hover:text-amber-300 border border-amber-500/30"
                              title="Make Cover"
                            >
                              ★
                            </button>
                          )}
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => handleMoveImage(index, index - 1)}
                              className="p-1.5 rounded bg-[#1B1C20] text-white hover:text-amber-400 border border-[#2C2E35]"
                              title="Move Left"
                            >
                              ←
                            </button>
                          )}
                          {index < images.length - 1 && (
                            <button
                              type="button"
                              onClick={() => handleMoveImage(index, index + 1)}
                              className="p-1.5 rounded bg-[#1B1C20] text-white hover:text-amber-400 border border-[#2C2E35]"
                              title="Move Right"
                            >
                              →
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(item.id)}
                            className="p-1.5 rounded bg-[#1B1C20] text-red-400 hover:text-red-300 border border-red-500/30"
                            title="Delete Image"
                          >
                            ✕
                          </button>
                        </div>

                        {/* File size indicator */}
                        <div className="relative z-10 self-end">
                          <span className="text-[9px] font-mono font-medium text-neutral-300 bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm">
                            {item.size}
                          </span>
                        </div>
                      </div>
                    ))}

                    {/* Render Empty Placeholder Slots up to 7 */}
                    {Array.from({ length: MAX_IMAGES - images.length }).map((_, slotIdx) => {
                      const slotNumber = images.length + slotIdx + 1
                      return (
                        <div
                          key={`empty-slot-${slotIdx}`}
                          onClick={() => fileInputRef.current?.click()}
                          className="aspect-square rounded-lg border border-dashed border-[#23252A] hover:border-[#3D404A] hover:border-amber-500/40 bg-[#16171A]/40 flex flex-col items-center justify-center p-3 text-neutral-500 hover:text-neutral-400 cursor-pointer transition group"
                        >
                          <svg className="w-5 h-5 mb-1 stroke-1 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M12 4.5v15m7.5-7.5h-15" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                          </svg>
                          <span className="text-[10px] font-mono uppercase tracking-wider">
                            Slot {slotNumber}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Helper tip footer inside media card */}
                <div className="mt-8 pt-4 border-t border-[#1B1C20] text-[11px] text-neutral-400 flex items-center justify-between">
                  <span className="flex items-center space-x-1.5">
                    <svg className="w-3.5 h-3.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                    <span>High resolution photos boost conversion by 34%</span>
                  </span>
                  <span className="text-neutral-500 font-mono">1080 × 1350 px suggested</span>
                </div>
              </article>
            </section>
          </div>
        </main>

        {/* BEGIN: StickyBottomBar */}
        <aside className="fixed bottom-0 inset-x-0 bg-[#111214]/95 backdrop-blur-md border-t border-[#23252A] px-6 py-3.5 z-40">
          <div className="max-w-[1560px] mx-auto flex items-center justify-between">
            {/* Pipeline Status Indicator */}
            <div className="flex items-center space-x-2 text-xs font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-neutral-300">Pipeline:</span>
              <span className="font-mono text-amber-400 font-bold">
                {images.length} / {MAX_IMAGES} images staged
              </span>
            </div>

            {/* Action CTAs */}
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-neutral-400 hover:text-white hover:bg-[#1B1C20] transition cursor-pointer"
              >
                Discard
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="inline-flex items-center space-x-2 px-5 py-2 rounded-lg bg-[#FBBF24] hover:bg-[#F59E0B] text-[#0C0D0E] text-xs font-extrabold tracking-wide shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Publishing...</span>
                ) : (
                  <>
                    <span>Publish Product</span>
                    <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}
