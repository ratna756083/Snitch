import React, { useState } from 'react'
import { Link, useLocation } from 'react-router'
import { useSelector } from 'react-redux'

const normalizeAttributes = (attributes) => {
  if (!attributes) return {}
  if (attributes instanceof Map) return Object.fromEntries(attributes)
  if (Array.isArray(attributes)) return Object.fromEntries(attributes)
  return typeof attributes === 'object' ? attributes : {}
}

const OrderSuccess = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  const rawOrderId = queryParams.get('order_id')
  const orderId = rawOrderId || 'SNTC-RZP-98421094'

  const user = useSelector((state) => state.auth?.user)
  const cartItems = useSelector((state) => state.cart?.items)
  const orderedItems = location.state?.orderedItems

  const [copied, setCopied] = useState(false)
  const [showTrackingModal, setShowTrackingModal] = useState(false)

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  const handlePrintInvoice = () => {
    window.print()
  }

  // Format delivery date (current date + 4 days)
  const [formattedDeliveryDate] = useState(() => {
    const deliveryDate = new Date()
    deliveryDate.setDate(deliveryDate.getDate() + 4)
    return deliveryDate.toLocaleDateString('en-IN', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    })
  })

  // Sample or actual purchased items fallback
  const items = (Array.isArray(orderedItems) ? orderedItems : cartItems)
    .filter(Boolean)
    .map((item, index) => {
        const prod = item?.product && typeof item.product === 'object' ? item.product : {}
        
        let matchedVariant = null
        if (item?.variant && typeof item.variant === 'object' && item.variant._id) {
          matchedVariant = item.variant
        } else if (Array.isArray(prod.variants)) {
          matchedVariant = prod.variants.find((v) => String(v?._id) === String(item?.variant))
        } else if (prod.variants && typeof prod.variants === 'object') {
          if (String(prod.variants._id) === String(item?.variant)) {
            matchedVariant = prod.variants
          } else {
            const variantsList = Object.values(prod.variants)
            matchedVariant = Array.isArray(variantsList)
              ? variantsList.find((v) => String(v?._id) === String(item?.variant))
              : null
          }
        }

        const rawAttrs = matchedVariant?.attributes || item?.attributes || prod.attributes
        const attributes = normalizeAttributes(rawAttrs)
        const attrEntries = Object.entries(attributes)
        const sizeVal = attrEntries.find(([k]) => k.toLowerCase() === 'size')?.[1] || 'L'
        const colorVal = attrEntries.find(([k]) => k.toLowerCase() === 'color')?.[1] || 'Standard'

        const unitPrice =
          Number(item?.price?.amount) > 0
            ? Number(item.price.amount)
            : Number(matchedVariant?.price?.amount) > 0
            ? Number(matchedVariant.price.amount)
            : Number(prod?.price?.amount) || 1999

        const qty = Number(item?.quantity) || 1

        return {
          id: item?._id || index,
          title: prod?.title || 'Heavyweight Streetwear Tee',
          color: colorVal,
          size: sizeVal,
          qty: qty,
          price: unitPrice * qty,
          image:
            matchedVariant?.images?.[0]?.url ||
            prod?.images?.[0]?.url ||
            'https://ik.imagekit.io/6gtjafdkv/snitch/-original-imahpyegmh4dvjdk_tYe-qCNul.jpeg',
          tag: 'DROP VERIFIED',
        }
      })

  const displayItems = items.length > 0
    ? items
    : [
        {
          id: 1,
          title: 'Heavyweight Oversized Boxy Tee',
          color: 'Washed Vintage Black',
          size: 'L',
          qty: 1,
          price: 1999,
          image: 'https://ik.imagekit.io/6gtjafdkv/snitch/-original-imahpyegmh4dvjdk_tYe-qCNul.jpeg',
          tag: '320 GSM FRENCH TERRY',
        },
        {
          id: 2,
          title: 'Acid Washed Wide-Leg Cargo Pants',
          color: 'Slate Olive',
          size: '32',
          qty: 1,
          price: 3499,
          image: 'https://ik.imagekit.io/6gtjafdkv/snitch/pexels-alex-ning-523843601-34919189_HhI5ZLiyU.jpg',
          tag: 'RIPSTOP COTTON',
        },
        {
          id: 3,
          title: 'Heavy Gauge Chain Silver Necklace',
          color: 'Antiqued Silver',
          size: 'ONE SIZE',
          qty: 1,
          price: 1299,
          image: 'https://ik.imagekit.io/6gtjafdkv/snitch/ChatGPT_Image_Nov_16__2025__10_45_32_PM_dlr9qsV2w.png',
          tag: '925 SOLID SILVER',
        },
      ]

  const subtotal = displayItems.reduce((sum, item) => sum + item.price, 0)
  const discount = subtotal > 3000 ? 500 : 0
  const totalPaid = Math.max(0, subtotal - discount)
  const gstAmount = Math.round((totalPaid * 18) / 118)

  return (
    <main
      className="min-h-screen bg-[#fafaf9] text-[#171717] antialiased selection:bg-[#c6f337] selection:text-black flex flex-col"
      style={{ fontFamily: 'Inter, Arial, sans-serif' }}
    >
      {/* Web Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&family=Space+Grotesk:wght@500;700&display=swap"
        rel="stylesheet"
      />

      <style>{`
        .barcode-pattern {
          background: repeating-linear-gradient(
            90deg,
            #171717 0,
            #171717 2px,
            transparent 2px,
            transparent 4px,
            #171717 4px,
            #171717 7px,
            transparent 7px,
            transparent 9px,
            #171717 9px,
            #171717 10px,
            transparent 10px,
            transparent 13px
          );
        }
      `}</style>

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e5e5e0] shadow-xs">
        <div className="flex justify-between items-center w-full px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto h-16 sm:h-20">
          {/* Logo & Navigation */}
          <div className="flex items-center space-x-6 sm:space-x-8">
            <Link
              to="/"
              aria-label="Snitch home"
              className="text-[21px] font-extrabold tracking-[0.16em] sm:text-2xl text-[#171717] flex items-center"
            >
              SNITCH<span className="text-[#a8d929]">.</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-6 text-xs uppercase tracking-[0.1em] font-semibold text-[#666]">
              <Link to="/" className="hover:text-[#171717] transition-colors">
                Shop
              </Link>
              <Link to="/" className="hover:text-[#171717] transition-colors">
                Drops
              </Link>
              <Link to="/cart" className="hover:text-[#171717] transition-colors">
                Bag
              </Link>
              <span className="text-[#171717] border-b-2 border-[#a8d929] pb-0.5 font-bold">
                Order Status
              </span>
            </nav>
          </div>

          {/* Action Links */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <Link
              to="/"
              className="inline-flex items-center text-xs font-semibold uppercase tracking-[0.1em] text-[#666] hover:text-[#171717] gap-1 transition-colors"
            >
              <span>Continue Shopping</span>
              <span aria-hidden="true">→</span>
            </Link>
            <div className="h-4 w-px bg-[#e5e5e0] hidden sm:block" />
            <div className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-[#f4f4f0] border border-[#deded8] text-[#333]">
              {user?.fullname ? `Hi, ${user.fullname.split(' ')[0]}` : 'Customer verified'}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
        {/* Hero Section: Confirmation Badge & High-Impact Status */}
        <section className="mb-10 text-center flex flex-col items-center">
          {/* Animated Neon Lime Badge */}
          <div className="relative mb-5 flex items-center justify-center">
            <div className="absolute w-16 h-16 rounded-full bg-[#c6f337]/40 animate-ping" />
            <div className="relative w-14 h-14 rounded-full bg-[#c6f337] flex items-center justify-center border-2 border-[#171717] shadow-[2px_2px_0px_#171717]">
              <svg className="w-7 h-7 text-[#171717] stroke-[2.8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
          </div>

          {/* Drop Verification Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white border border-[#deded8] rounded-full mb-3 shadow-[1px_1px_0px_#171717]">
            <span className="w-2 h-2 rounded-full bg-[#a8d929] border border-[#171717] animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#171717]">
              Drop Reserved &amp; Packed
            </span>
            <span className="text-[#bbb]">|</span>
            <span className="text-[10px] font-mono text-[#666]">SPEC-2026/FW</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.04em] text-[#171717] mb-3">
            Order Confirmed!
          </h1>
          <p className="text-sm sm:text-base text-[#666] max-w-lg mx-auto leading-relaxed">
            Thank you for your purchase. We have received your order and our central logistics terminal is preparing your drop.
          </p>

          {/* Architectural Order Reference Strip */}
          <div className="mt-8 w-full max-w-4xl bg-white border border-[#deded8] rounded-2xl p-5 sm:p-6 shadow-[2px_2px_0px_#171717] text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-[#e8e8e2]">
              {/* Order ID */}
              <div className="pt-2 sm:pt-0 sm:px-3 first:pl-0">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#777] block mb-1">
                  ORDER ID
                </span>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs sm:text-sm font-mono font-bold text-[#171717] truncate">
                    {orderId}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyOrderId}
                    className="p-1 rounded text-[#777] hover:text-[#171717] hover:bg-[#f4f4ef] transition-colors shrink-0"
                    title="Copy Order ID"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                </div>
                {copied ? (
                  <span className="text-[10px] font-mono text-[#526d19] font-bold block mt-1 animate-pulse">
                    COPIED TO CLIPBOARD ✓
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-[#888] block mt-0.5">
                    Click icon to copy
                  </span>
                )}
              </div>

              {/* Estimated Delivery */}
              <div className="pt-3 sm:pt-0 sm:px-3">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#777] block mb-1">
                  ESTIMATED DELIVERY
                </span>
                <span className="text-xs sm:text-sm font-semibold text-[#171717] block leading-tight">
                  Arriving by {formattedDeliveryDate}
                </span>
                <span className="text-[10px] font-mono text-[#777] block mt-1">
                  3–5 BUSINESS DAYS (AIR)
                </span>
              </div>

              {/* Payment Status */}
              <div className="pt-3 sm:pt-0 sm:px-3">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#777] block mb-1">
                  PAYMENT STATUS
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#7d9d25]" />
                  <span className="text-xs sm:text-sm font-semibold text-[#171717]">
                    Paid via Razorpay
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#777] block mt-1">
                  Verified &amp; Authenticated
                </span>
              </div>

              {/* Confirmation Notification */}
              <div className="pt-3 sm:pt-0 sm:pl-3 last:pr-0">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#777] block mb-1">
                  DISPATCH NOTICE
                </span>
                <span className="text-xs sm:text-sm text-[#171717] block truncate font-mono">
                  {user?.email || 'customer@snitch.co.in'}
                </span>
                <span className="text-[10px] font-mono text-[#526d19] font-semibold block mt-1">
                  TRACKING DISPATCHED
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Two-Column Grid: Left (Manifest & Address) & Right (Timeline & Actions) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (7 Cols): Items Manifest & Shipping Destination */}
          <div className="lg:col-span-7 space-y-6">
            {/* Card: Item Manifest */}
            <div className="bg-white border border-[#deded8] rounded-2xl p-5 sm:p-7 shadow-[2px_2px_0px_#171717]">
              <div className="flex items-center justify-between pb-4 border-b border-[#e8e8e2]">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#171717]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  <h2 className="text-base sm:text-lg font-bold text-[#171717]">
                    Your Items ({items.length})
                  </h2>
                </div>
                <span className="px-2.5 py-0.5 bg-[#f4f4ef] border border-[#deded8] text-[10px] font-mono font-bold text-[#333] rounded">
                  RELEASE: 2026-D04
                </span>
              </div>

              <div className="divide-y divide-[#ededed]">
                {displayItems.map((item, index) => (
                  <div key={item.id || index} className="py-4.5 flex gap-4 items-center">
                    <div className="w-20 h-24 sm:w-22 sm:h-26 bg-[#f4f4ef] border border-[#deded8] rounded-xl overflow-hidden shrink-0 relative group">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-1 left-1 bg-[#171717] text-white text-[9px] font-mono px-1 py-0.5 rounded">
                        0{index + 1}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h3 className="text-sm sm:text-base font-bold text-[#171717] truncate">
                            {item.title}
                          </h3>
                          <p className="text-xs text-[#777] mt-0.5">{item.color}</p>
                        </div>
                        <span className="text-sm sm:text-base font-mono font-bold text-[#171717] whitespace-nowrap">
                          ₹{item.price.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-2.5">
                        <span className="px-2 py-0.5 bg-[#f4f4ef] border border-[#deded8] text-[10px] font-mono font-semibold text-[#555] rounded">
                          SIZE: {item.size}
                        </span>
                        <span className="px-2 py-0.5 bg-[#f4f4ef] border border-[#deded8] text-[10px] font-mono font-semibold text-[#555] rounded">
                          QTY: 0{item.qty}
                        </span>
                        <span className="px-2 py-0.5 bg-[#f2f7dc] border border-[#d2e88a] text-[10px] font-mono font-bold text-[#526d19] rounded">
                          {item.tag}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Barcode Specimen Strip */}
              <div className="mt-4 pt-4 border-t border-dashed border-[#deded8] flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#fbfbfa] p-3 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-28 sm:w-32 h-6 barcode-pattern border border-[#171717]/20" />
                  <span className="text-[11px] font-mono font-bold text-[#171717] tracking-widest">
                    *{orderId.slice(-10)}*
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#666] uppercase">
                  <span>✓ Tamper-Proof Packaging Guarantee</span>
                </div>
              </div>
            </div>

            {/* Card: Shipping Destination */}
            <div className="bg-white border border-[#deded8] rounded-2xl p-5 sm:p-7 shadow-[2px_2px_0px_#171717]">
              <div className="flex items-center justify-between pb-4 border-b border-[#e8e8e2]">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#171717]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <h2 className="text-base sm:text-lg font-bold text-[#171717]">
                    Delivery Destination
                  </h2>
                </div>
                <span className="text-[10px] font-mono uppercase font-bold text-[#526d19] bg-[#f2f7dc] px-2.5 py-0.5 rounded border border-[#d2e88a]">
                  Insured Air Cargo
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#777] block mb-1">
                    RECIPIENT
                  </span>
                  <p className="text-sm font-bold text-[#171717]">
                    {user?.fullname || 'Alex Vance'}
                  </p>
                  <p className="text-xs text-[#777] font-mono mt-0.5">
                    {user?.contact || '+91 98765 43210'}
                  </p>
                  <p className="text-xs text-[#444] mt-2.5 leading-relaxed">
                    Penthouse 4B, The Skyline Lofts,<br />
                    Indiranagar 100ft Road,<br />
                    Bengaluru, Karnataka — 560038
                  </p>
                </div>

                <div className="space-y-3 bg-[#f8f8f5] p-4 rounded-xl border border-[#e8e8e2]">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#777] block">
                      COURIER DISPATCH
                    </span>
                    <span className="text-xs font-semibold text-[#171717]">
                      Snitch Express Air Delivery • Insured
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#777] block">
                      LOGISTICS TERMINAL
                    </span>
                    <span className="text-xs font-mono text-[#555]">BLR-AIR-CARGO-HUB-04</span>
                  </div>
                  <div className="pt-2 border-t border-[#deded8] flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#777]">AIRWAY BILL (AWB)</span>
                    <span className="text-xs font-mono font-bold text-[#171717]">
                      AWB-{orderId.slice(-8)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (5 Cols): Timeline, Financials & Actions */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            {/* Live Order Journey Stepper */}
            <div className="bg-white border border-[#deded8] rounded-2xl p-5 sm:p-6 shadow-[2px_2px_0px_#171717]">
              <div className="flex items-center justify-between pb-3 border-b border-[#e8e8e2] mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#171717] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#7d9d25] animate-ping" />
                  Live Dispatch Terminal
                </span>
                <span className="text-[11px] font-mono text-[#777]">OCTOBER 2026</span>
              </div>

              {/* Stepper Track */}
              <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#e0e0da]">
                {/* Step 1: Completed */}
                <div className="relative">
                  <div className="absolute -left-6 top-0.5 w-[22px] h-[22px] rounded-full bg-[#c6f337] border-2 border-[#171717] flex items-center justify-center">
                    <svg className="w-3 h-3 text-[#171717] stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <div className="pl-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs sm:text-sm font-bold text-[#171717]">Order Placed</h4>
                      <span className="text-[10px] font-mono text-[#777]">JUST NOW</span>
                    </div>
                    <p className="text-xs text-[#777]">Payment secured &amp; order authenticated.</p>
                  </div>
                </div>

                {/* Step 2: In-Progress */}
                <div className="relative">
                  <div className="absolute -left-6 top-0.5 w-[22px] h-[22px] rounded-full bg-[#171717] border-2 border-[#c6f337] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#c6f337] animate-pulse" />
                  </div>
                  <div className="pl-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs sm:text-sm font-bold text-[#171717] flex items-center gap-1.5">
                        <span>Quality Check</span>
                        <span className="px-1.5 py-0.5 bg-[#c6f337] text-[#171717] text-[9px] font-mono font-bold rounded">
                          ACTIVE
                        </span>
                      </h4>
                      <span className="text-[10px] font-mono text-[#7d9d25] font-semibold">IN PROGRESS</span>
                    </div>
                    <p className="text-xs text-[#777]">Garment inspection &amp; security packaging.</p>
                  </div>
                </div>

                {/* Step 3: Pending */}
                <div className="relative opacity-60">
                  <div className="absolute -left-6 top-0.5 w-[22px] h-[22px] rounded-full bg-[#f4f4ef] border border-[#ccc] flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#999]" />
                  </div>
                  <div className="pl-2">
                    <h4 className="text-xs sm:text-sm font-semibold text-[#171717]">Shipped with Air Cargo</h4>
                    <p className="text-xs text-[#777]">Pickup at Central Runway Dock.</p>
                  </div>
                </div>

                {/* Step 4: Final Target */}
                <div className="relative opacity-40">
                  <div className="absolute -left-6 top-0.5 w-[22px] h-[22px] rounded-full bg-[#f4f4ef] border border-[#ccc] flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#999]" />
                  </div>
                  <div className="pl-2">
                    <h4 className="text-xs sm:text-sm font-semibold text-[#171717]">Delivered</h4>
                    <p className="text-xs text-[#777]">Doorstep handover.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Breakdown Card */}
            <div className="bg-white border border-[#deded8] rounded-2xl p-5 sm:p-6 shadow-[2px_2px_0px_#171717]">
              <div className="flex items-center justify-between pb-3 border-b border-[#e8e8e2] mb-4">
                <h3 className="text-base font-bold text-[#171717]">Price Breakdown</h3>
                <span className="text-[10px] font-mono uppercase text-[#777]">INR (₹)</span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between items-center text-[#444]">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-mono font-medium text-[#171717]">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between items-center text-[#171717]">
                    <div className="flex items-center gap-1.5">
                      <span>Promo Savings</span>
                      <span className="px-1.5 py-0.5 bg-[#f2f7dc] text-[#526d19] text-[9px] font-mono font-bold rounded">
                        OFFER APPLIED
                      </span>
                    </div>
                    <span className="font-mono text-[#526d19] font-bold">
                      -₹{discount.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center text-[#444]">
                  <div className="flex items-center gap-1.5">
                    <span>Express Air Delivery</span>
                    <span className="text-[10px] font-mono text-[#888] line-through">₹199</span>
                  </div>
                  <span className="font-mono font-bold text-[#526d19]">FREE</span>
                </div>

                <div className="flex justify-between items-center text-[#777] text-xs pt-1">
                  <span>Taxes &amp; Duties (GST 18%)</span>
                  <span className="font-mono">Included (₹{gstAmount})</span>
                </div>

                {/* Perforation line */}
                <div className="py-1 border-b border-dashed border-[#deded8]" />

                {/* Total Paid */}
                <div className="flex justify-between items-baseline pt-2">
                  <div>
                    <span className="text-base font-bold text-[#171717] block">Total Paid</span>
                    <span className="text-[10px] font-mono text-[#888] uppercase">
                      All Charges Settled
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#171717] font-mono">
                      ₹{totalPaid.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Razorpay Badge */}
              <div className="mt-5 p-3 bg-[#f8f8f5] border border-[#deded8] rounded-xl flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-[#526d19]">🛡</span>
                  <span className="text-[#171717] font-bold">Razorpay Secure Verified</span>
                </div>
                <span className="text-[#777] text-[10px]">TXN-{orderId.slice(-6)}</span>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  onClick={() => setShowTrackingModal(true)}
                  className="w-full bg-[#171717] hover:bg-[#333] text-white font-bold py-3.5 px-4 rounded-xl border border-[#171717] transition-all flex items-center justify-center gap-2 shadow-[2px_2px_0px_#171717] active:scale-[0.98] text-xs sm:text-sm uppercase tracking-wider"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Track Order Live</span>
                </button>

                <Link
                  to="/"
                  className="w-full bg-white hover:bg-[#f4f4ef] text-[#171717] font-bold py-3 px-4 rounded-xl border border-[#deded8] transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm uppercase tracking-wider"
                >
                  <span>Continue Shopping</span>
                  <span aria-hidden="true">→</span>
                </Link>

                <button
                  type="button"
                  onClick={handlePrintInvoice}
                  className="w-full text-center text-xs text-[#777] hover:text-[#171717] font-medium py-1 transition-colors flex items-center justify-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Download Tax Invoice (PDF)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3-Pillar Streetwear Service Guarantee Banner */}
        <section className="mt-14 pt-10 border-t border-[#e8e8e2] grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-white border border-[#deded8] shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-[#f2f7dc] text-[#526d19] flex items-center justify-center font-bold text-sm mb-3">
              💬
            </div>
            <h4 className="text-sm font-bold text-[#171717] mb-1">24/7 Priority Support</h4>
            <p className="text-xs text-[#777] leading-relaxed">
              Direct WhatsApp concierge assistance available for all delivery queries.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#deded8] shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-[#f2f7dc] text-[#526d19] flex items-center justify-center font-bold text-sm mb-3">
              ↺
            </div>
            <h4 className="text-sm font-bold text-[#171717] mb-1">7-Day Easy Returns</h4>
            <p className="text-xs text-[#777] leading-relaxed">
              Doorstep exchanges and hassle-free returns with immediate pickup.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#deded8] shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-[#f2f7dc] text-[#526d19] flex items-center justify-center font-bold text-sm mb-3">
              ★
            </div>
            <h4 className="text-sm font-bold text-[#171717] mb-1">100% Authentic Drops</h4>
            <p className="text-xs text-[#777] leading-relaxed">
              Every drop is numbered and authenticated with tamper-proof seal.
            </p>
          </div>
        </section>
      </div>

      {/* Tracking Modal */}
      {showTrackingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#deded8]">
            <div className="flex items-center justify-between pb-4 border-b border-[#e8e8e2] mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#7d9d25] animate-ping" />
                <h3 className="text-base font-bold text-[#171717]">Air Cargo Tracking</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowTrackingModal(false)}
                className="text-[#888] hover:text-[#171717] text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#f8f8f5] rounded-xl font-mono">
                <p className="text-[#777]">AIRWAY BILL (AWB)</p>
                <p className="font-bold text-sm text-[#171717]">AWB-{orderId.slice(-8)}</p>
                <p className="text-[11px] text-[#526d19] mt-1">Status: Handed over to Central Sorting Dock</p>
              </div>
              <p className="text-[#666] leading-relaxed">
                Live GPS parcel tracking link has been dispatched to <strong>{user?.email || 'your email'}</strong> and SMS updates are active.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowTrackingModal(false)}
              className="mt-5 w-full bg-[#171717] text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Minimal Footer */}
      <footer className="mt-auto border-t border-[#ededed] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-[10px] font-medium uppercase tracking-[0.12em] text-[#777] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
          <Link to="/" className="font-extrabold tracking-[0.16em] text-[#171717]">
            SNITCH.
          </Link>
          <p>Find your fit. Make it yours.</p>
        </div>
      </footer>
    </main>
  )
}

export default OrderSuccess
