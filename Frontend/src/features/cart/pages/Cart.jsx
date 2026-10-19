import React, { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router'
import { useSelector } from 'react-redux'
import { useCart } from '../hook/useCart'
import { useRazorpay } from "react-razorpay";
import { useNavigate } from 'react-router';



const formatPrice = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0)

const normalizeAttributes = (attributes) => {
  if (!attributes) return {}
  if (attributes instanceof Map) return Object.fromEntries(attributes)
  if (Array.isArray(attributes)) return Object.fromEntries(attributes)
  return typeof attributes === 'object' ? attributes : {}
}



const Cart = () => {
  const navigate=useNavigate()
  const cart = useSelector((state) => state.cart)
  const cartItems = useMemo(() => (Array.isArray(cart?.items) ? cart.items : []), [cart?.items])
  const cartCurrency = cart?.currency || 'INR'
  const { handelGetCart, handelRemoveItem,handelIncrementCartItem ,handelDecrementCartItem,handelCreateOrderPayment,handelVerifyCartPayment} = useCart()

  const [isLoading, setIsLoading] = useState(true)
  const [wishlistSaved, setWishlistSaved] = useState({})

  useEffect(() => {
    let isMounted = true
    setIsLoading(true)
    handelGetCart()
      .catch((err) => console.error('Error fetching cart:', err))
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })
    return () => {
      isMounted = false
    }
  }, [])

  const subtotal = Number(cart?.totalPrice) || 0

  const freeShippingThreshold = 999
  const isFreeShipping = subtotal >= freeShippingThreshold || subtotal === 0
  const shippingAmount = isFreeShipping ? 0 : 99
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal)
  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotal / freeShippingThreshold) * 100),
  )

  const grandTotal = subtotal + shippingAmount
  const totalItemCount = cartItems.reduce((acc, i) => acc + (Number(i.quantity) || 1), 0)

  const toggleWishlist = (itemId) => {
    setWishlistSaved((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }))
  }

  const user=useSelector(state=>state.auth.user)

 const { Razorpay } = useRazorpay();

  const handlePayment =async () => {
   
    const order=await handelCreateOrderPayment()
    console.log(order)

    const options= {
      key: "rzp_test_TpUDFMV74PWPw8",
      amount: order.amount, // Amount in paise
      currency: order.currency,
      name: "Snitch",
      description: "Test Transaction",
      order_id: order.id, // Generate order_id on server
      handler:async (response) => {
       const isValid= await handelVerifyCartPayment(response)
       if(isValid){
        const orderedItems = cartItems
        await handelGetCart()
        navigate(`/order-success?order_id=${response.razorpay_order_id}`, {
          state: { orderedItems },
        })
       }
      },
      prefill: {
        name: user.fullname,
        email: user.email,
        contact: user.contact,
      },
      theme: {
        color: "#F37254",
      },
    };
    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
  }
  return (
    <main
      className="min-h-screen bg-[#fafaf9] text-[#171717] selection:bg-[#c7fa4b] selection:text-black flex flex-col"
      style={{ fontFamily: 'Inter, Arial, sans-serif' }}
    >
      {/* Google Web Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 border-b border-[#e9e9e5] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-10">
          {/* Logo & Continue Shopping */}
          <div className="flex items-center gap-6 sm:gap-8">
            <Link
              to="/"
              aria-label="Snitch home"
              className="text-[21px] font-extrabold tracking-[0.16em] sm:text-2xl"
            >
              SNITCH<span className="text-[#a8d929]">.</span>
            </Link>

            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#666] transition hover:text-[#171717] pl-6 border-l border-[#e5e5e0]"
            >
              <span aria-hidden="true">←</span>
              <span>Continue Shopping</span>
            </Link>
          </div>

          {/* Cart Status Badge */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/"
              className="sm:hidden inline-flex items-center text-xs font-semibold uppercase tracking-[0.08em] text-[#666] hover:text-[#171717]"
            >
              ← Shop
            </Link>
            <div className="flex items-center gap-2 rounded-full border border-[#deded8] bg-white px-3.5 py-1.5 text-xs font-semibold shadow-xs">
              <svg
                className="w-4 h-4 text-[#171717]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
              <span>Bag ({totalItemCount})</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Canvas */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10">
        {/* Breadcrumb & Header Title */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <nav className="flex items-center gap-2 text-xs font-medium text-[#777] uppercase tracking-[0.08em] mb-2">
              <Link to="/" className="hover:text-[#171717] transition-colors">
                Home
              </Link>
              <span className="text-[#bbb]">/</span>
              <span className="text-[#171717] font-semibold">Shopping Bag</span>
            </nav>
            <div className="flex items-baseline gap-3">
              <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold tracking-[-0.04em] text-[#171717]">
                Your Bag
              </h1>
              <span className="text-sm sm:text-base font-medium text-[#777]">
                ({totalItemCount} {totalItemCount === 1 ? 'item' : 'items'})
              </span>
            </div>
          </div>

          {/* Reserved cart status indicator */}
          <div className="inline-flex items-center gap-2 self-start sm:self-auto px-3.5 py-1.5 rounded-full bg-white border border-[#e5e5e0] text-xs font-medium text-[#555] shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#a8d929] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7d9d25]" />
            </span>
            <span>Items reserved for checkout</span>
          </div>
        </div>

        {/* Loading State Skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-pulse">
            <div className="lg:col-span-7 xl:col-span-8 space-y-4">
              <div className="h-16 bg-[#ebebe6] rounded-2xl w-full" />
              <div className="h-44 bg-[#ebebe6] rounded-2xl w-full" />
              <div className="h-44 bg-[#ebebe6] rounded-2xl w-full" />
            </div>
            <div className="lg:col-span-5 xl:col-span-4 h-96 bg-[#ebebe6] rounded-2xl" />
          </div>
        ) : cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="rounded-3xl border border-[#e8e8e2] bg-white p-10 sm:p-20 text-center shadow-xs my-6">
            <div className="mx-auto w-20 h-20 rounded-full bg-[#f6f6f2] flex items-center justify-center text-[#777] mb-6">
              <svg
                className="w-10 h-10 stroke-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
                />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171717] mb-2">
              Your bag is empty
            </h2>
            <p className="text-sm text-[#777] max-w-md mx-auto mb-8 leading-relaxed">
              Looks like you haven't added anything to your cart yet. Explore our latest drops and finds to make them yours.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-[#171717] px-8 py-4 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#333] shadow-sm"
            >
              <span>Explore Collection</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        ) : (
          /* Cart Content: 2-Column Responsive Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left Column: Cart Items & Promo Codes */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
              {/* Free Express Shipping Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#e8e8e2] shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-full bg-[#f2f7dc] flex items-center justify-center text-[#6d8f1b]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-[#171717]">
                      {isFreeShipping
                        ? "You've unlocked Free Express Shipping across India!"
                        : `Add ${formatPrice(amountToFreeShipping)} more for Free Express Shipping`}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#6d8f1b]">
                    {freeShippingProgress}%
                  </span>
                </div>
                {/* Progress bar track */}
                <div className="w-full h-2 bg-[#f0f0ea] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#9bc62c] to-[#c7fa4b] rounded-full transition-all duration-500"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Cart Items List */}
              <div className="flex flex-col gap-4">
                {cartItems.map((item, index) => {
                
                  const product = item.product || {}
                  const matchedVariant = Array.isArray(product.variants)
                    ? product.variants.find((variant) => String(variant._id) === String(item.variant))
                    : String(product.variants?._id) === String(item.variant)
                    ? product.variants
                    : null
                  const attributes = normalizeAttributes(matchedVariant?.attributes)
                  const itemImage =
                    matchedVariant?.images?.[0]?.url ||
                    product.images?.[0]?.url ||
                    ''
                  const unitPrice = Number(
                    item.price?.amount ?? matchedVariant?.price?.amount ?? product.price?.amount,
                  ) || 0
                  const currency = item.price?.currency || product.price?.currency || cartCurrency
                  const quantity = Number(item.quantity) || 1
                  const lineTotal = unitPrice * quantity
                  const isSaved = wishlistSaved[item._id]

                  return (
                    <article
                      key={item._id || index}
                      className="p-4 sm:p-6 rounded-2xl bg-white border border-[#e8e8e2] shadow-xs hover:border-[#d6d6ce] transition-all flex flex-col sm:flex-row gap-4 sm:gap-6 items-start"
                    >
                      {/* Product Thumbnail */}
                      <Link
                        to={`/products/${product._id}`}
                        className="relative w-full sm:w-32 aspect-4/5 sm:aspect-square rounded-xl overflow-hidden bg-[#f4f4f0] shrink-0 block group"
                      >
                        {itemImage ? (
                          <img
                            src={itemImage}
                            alt={product.title || 'Product'}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center font-extrabold text-2xl text-[#d4d6cc]">
                            S.
                          </div>
                        )}
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-xs text-[9px] font-mono uppercase text-white font-semibold tracking-wider">
                          Drop
                        </span>
                      </Link>

                      {/* Product Details & Actions */}
                      <div className="flex-1 flex flex-col justify-between w-full h-full min-h-[140px]">
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <Link
                                to={`/products/${product._id}`}
                                className="text-base sm:text-lg font-bold text-[#171717] hover:underline tracking-tight block"
                              >
                                {product.title || 'Untitled product'}
                              </Link>
                              {product.description && (
                                <p className="text-xs text-[#777] line-clamp-1 mt-0.5">
                                  {product.description}
                                </p>
                              )}
                            </div>
                            <span className="text-base sm:text-lg font-bold text-[#171717] shrink-0 font-mono">
                              {formatPrice(lineTotal, currency)}
                            </span>
                          </div>

                          {/* Attribute Chips */}
                          <div className="flex flex-wrap items-center gap-2 mt-2.5">
                            {Object.entries(attributes).length > 0 ? (
                              Object.entries(attributes).map(([attrName, attrVal]) => (
                                <span
                                  key={attrName}
                                  className="px-2.5 py-1 rounded-md bg-[#f4f4ef] text-[11px] font-semibold text-[#444] uppercase tracking-wider"
                                >
                                  <span className="text-[#888] font-medium">{attrName}:</span>{' '}
                                  {attrVal}
                                </span>
                              ))
                            ) : (
                              <span className="px-2.5 py-1 rounded-md bg-[#f4f4ef] text-[11px] font-semibold text-[#444] uppercase tracking-wider">
                                Standard Edition
                              </span>
                            )}
                            <span className="text-[11px] text-[#777] font-mono">
                              @ {formatPrice(unitPrice, currency)} each
                            </span>
                          </div>

                          {/* In-stock status */}
                          <div className="flex items-center gap-1.5 mt-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#7d9d25]" />
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#526d19]">
                              {matchedVariant?.stock
                                ? `In Stock · ${matchedVariant.stock} available`
                                : 'In Stock · Ready to dispatch'}
                            </span>
                          </div>
                        </div>

                        {/* Quantity Stepper & Control Actions */}
                        <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#f0f0ea]">
                          {/* Stepper */}
                          <div className="flex items-center border border-[#d8d8d2] rounded-xl bg-white overflow-hidden shadow-xs">
                            <button
                              type="button"
                              onClick={() => handelDecrementCartItem({productId:product._id,variantId:item.variant})}
                              aria-label="Decrease quantity"
                              className="w-8 h-8 flex items-center justify-center text-[#555] hover:text-black hover:bg-[#f4f4f0] transition-colors active:scale-95"
                            >
                              -
                            </button>
                            <span className="w-9 text-center font-mono text-xs font-bold text-[#171717]">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handelIncrementCartItem({productId:product._id,variantId:item.variant})}
                              aria-label="Increase quantity"
                              className="w-8 h-8 flex items-center justify-center text-[#555] hover:text-black hover:bg-[#f4f4f0] transition-colors active:scale-95"
                            >
                              +
                            </button>
                          </div>

                          {/* Actions: Save to Wishlist & Remove */}
                          <div className="flex items-center gap-3 sm:gap-4 text-xs font-medium">
                            <button
                              type="button"
                              onClick={() => toggleWishlist(item._id)}
                              className={`inline-flex items-center gap-1 transition-colors ${
                                isSaved
                                  ? 'text-[#7d9d25] font-semibold'
                                  : 'text-[#666] hover:text-[#171717]'
                              }`}
                            >
                              <svg
                                className="w-3.5 h-3.5"
                                fill={isSaved ? 'currentColor' : 'none'}
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                                />
                              </svg>
                              <span className="hidden sm:inline">
                                {isSaved ? 'Saved' : 'Wishlist'}
                              </span>
                            </button>

                            <span className="text-[#deded8]">|</span>

                            <button
                              type="button"
                              onClick={() => handelRemoveItem({productId:product._id,variantId:item.variant})}
                              aria-label={`Remove ${product.title || 'item'}`}
                              className="inline-flex items-center gap-1 text-[#888] hover:text-red-600 transition-colors p-1"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                />
                              </svg>
                              <span className="hidden sm:inline">Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>

            </div>

            {/* Right Column: Order Summary (Sticky) */}
            <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-28">
              <div className="rounded-2xl border border-[#e8e8e2] bg-white p-6 sm:p-7 shadow-xs">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#ededed] mb-5">
                  <h2 className="text-lg font-bold tracking-tight text-[#171717]">
                    Order Summary
                  </h2>
                  <span className="px-2.5 py-1 rounded-full bg-[#f4f4ef] text-[11px] font-mono font-semibold text-[#555]">
                    {totalItemCount} {totalItemCount === 1 ? 'Item' : 'Items'}
                  </span>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3.5 text-xs sm:text-sm text-[#666] pb-5 border-b border-[#ededed]">
                  <div className="flex justify-between items-center">
                    <span>Cart Subtotal</span>
                    <span className="font-mono font-semibold text-[#171717]">
                      {formatPrice(subtotal, cartCurrency)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1">
                      Estimated Shipping
                      <span
                        title="Free Express Delivery for orders over ₹999"
                        className="cursor-help text-[#999] hover:text-black"
                      >
                        ⓘ
                      </span>
                    </span>
                    <span
                      className={`font-mono font-semibold ${
                        isFreeShipping ? 'text-[#526d19]' : 'text-[#171717]'
                      }`}
                    >
                      {isFreeShipping ? 'FREE' : formatPrice(shippingAmount)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Tax (GST included)</span>
                    <span className="font-mono text-[#171717]">₹0</span>
                  </div>

                </div>

                {/* Grand Total */}
                <div className="py-5 flex items-baseline justify-between">
                  <div>
                    <span className="text-base font-bold text-[#171717] block">Grand Total</span>
                    <span className="text-[11px] text-[#888] font-mono">
                      Inclusive of all duties &amp; taxes
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#171717] font-mono tracking-tight">
                      {formatPrice(grandTotal, cartCurrency)}
                    </span>
                    <span className="block text-[10px] text-[#888] font-mono uppercase">
                      {cartCurrency}
                    </span>
                  </div>
                </div>

                {/* Primary CTA Checkout Button */}
                <button
                  type="button"
                  onClick={handlePayment}
                  className="w-full rounded-full bg-[#171717] hover:bg-[#333] active:scale-[0.98] py-4 px-6 text-xs sm:text-sm font-bold uppercase tracking-[0.14em] text-white flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <span>Proceed to Checkout</span>
                  <span aria-hidden="true">→</span>
                </button>

                {/* Trust Badges */}
                <div className="mt-6 pt-5 border-t border-[#ededed] space-y-2.5 text-xs text-[#666]">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[#7d9d25]">✓</span>
                    <span>Secure 256-bit encrypted checkout</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[#7d9d25]">↺</span>
                    <span>7-day easy returns &amp; doorstep exchanges</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[#7d9d25]">★</span>
                    <span>100% genuine precision streetwear</span>
                  </div>
                </div>

                {/* Accepted Payment Methods row */}
                <div className="mt-5 pt-4 border-t border-[#ededed] flex items-center justify-between text-[11px] text-[#888] font-mono uppercase">
                  <span>Accepted Rails</span>
                  <span>UPI · Cards · COD</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#ededed] bg-white">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 py-6 text-[10px] font-medium uppercase tracking-[0.12em] text-[#777] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
          <Link to="/" className="font-extrabold tracking-[0.16em] text-[#171717]">
            SNITCH.
          </Link>
          <p>Find your fit. Make it yours.</p>
        </div>
      </footer>
    </main>
  )
}

export default Cart
