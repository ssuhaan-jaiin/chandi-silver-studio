'use client'

import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { toast } from 'sonner'
import type { Cart } from '@/types/cart'
import {
  shopifyCartCreate,
  shopifyCartLinesAdd,
  shopifyCartLinesUpdate,
  shopifyCartLinesRemove,
  shopifyGetCart,
} from '@/lib/shopify'

const CART_ID_KEY = 'chandi-cart-id'

interface CartContextType {
  cart: Cart | null
  cartCount: number
  cartTotal: string
  checkoutUrl: string
  isOpen: boolean
  isLoading: boolean
  addToCart: (variantId: string, quantity?: number) => Promise<void>
  removeFromCart: (lineId: string) => Promise<void>
  updateQuantity: (lineId: string, quantity: number) => Promise<void>
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
}

// Keep default CartContext export for backward compat with Navbar's useContext(CartContext)
export const CartContext = createContext<CartContextType>({
  cart: null,
  cartCount: 0,
  cartTotal: '£0.00',
  checkoutUrl: '#',
  isOpen: false,
  isLoading: false,
  addToCart: async () => {},
  removeFromCart: async () => {},
  updateQuantity: async () => {},
  clearCart: () => {},
  openCart: () => {},
  closeCart: () => {},
})

export function useCartContext() {
  return useContext(CartContext)
}

function formatCurrency(amount: string, currencyCode: string): string {
  try {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currencyCode,
    }).format(parseFloat(amount))
  } catch {
    return `£${parseFloat(amount).toFixed(2)}`
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const prevCountRef = useRef(0)

  // Restore cart from localStorage on mount
  useEffect(() => {
    const cartId = localStorage.getItem(CART_ID_KEY)
    if (!cartId) return
    shopifyGetCart(cartId)
      .then((c) => {
        if (c) setCart(c)
        else localStorage.removeItem(CART_ID_KEY)
      })
      .catch(() => localStorage.removeItem(CART_ID_KEY))
  }, [])

  const addToCart = useCallback(async (variantId: string, quantity = 1) => {
    setIsLoading(true)
    try {
      const cartId = localStorage.getItem(CART_ID_KEY)
      let updatedCart: Cart
      if (!cartId) {
        updatedCart = await shopifyCartCreate([{ merchandiseId: variantId, quantity }])
        localStorage.setItem(CART_ID_KEY, updatedCart.id)
      } else {
        updatedCart = await shopifyCartLinesAdd(cartId, [{ merchandiseId: variantId, quantity }])
      }
      setCart(updatedCart)
      toast('Added to bag', {
        description: 'Item added successfully',
        duration: 2500,
        style: {
          background: 'var(--color-bg)',
          border: '1px solid var(--color-gold)',
          color: 'var(--color-text)',
          borderRadius: '0',
        },
        icon: '✦',
      })
      setIsOpen(true)
    } catch {
      toast.error('Something went wrong', {
        description: 'Please try again',
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  const removeFromCart = useCallback(async (lineId: string) => {
    const cartId = localStorage.getItem(CART_ID_KEY)
    if (!cartId) return
    setIsLoading(true)
    try {
      const updatedCart = await shopifyCartLinesRemove(cartId, [lineId])
      setCart(updatedCart)
    } catch {
      toast.error('Could not remove item', { duration: 2500 })
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateQuantity = useCallback(async (lineId: string, quantity: number) => {
    if (quantity === 0) { removeFromCart(lineId); return }
    const cartId = localStorage.getItem(CART_ID_KEY)
    if (!cartId) return
    setIsLoading(true)
    try {
      const updatedCart = await shopifyCartLinesUpdate(cartId, [{ id: lineId, quantity }])
      setCart(updatedCart)
    } catch {
      toast.error('Could not update quantity', { duration: 2500 })
    } finally {
      setIsLoading(false)
    }
  }, [removeFromCart])

  const clearCart = useCallback(() => {
    localStorage.removeItem(CART_ID_KEY)
    setCart(null)
  }, [])

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  const cartCount = cart?.totalQuantity ?? 0
  const cartTotal = cart
    ? formatCurrency(
        cart.cost.subtotalAmount.amount,
        cart.cost.subtotalAmount.currencyCode
      )
    : '£0.00'
  const checkoutUrl = cart?.checkoutUrl ?? '#'

  // Track count changes for badge animation — exposed via context for Navbar to read
  useEffect(() => {
    prevCountRef.current = cartCount
  }, [cartCount])

  return (
    <CartContext.Provider value={{
      cart, cartCount, cartTotal, checkoutUrl,
      isOpen, isLoading,
      addToCart, removeFromCart, updateQuantity,
      clearCart, openCart, closeCart,
    }}>
      {children}
    </CartContext.Provider>
  )
}
