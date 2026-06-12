"use client"

import { createContext } from "react"

export const CartContext = createContext({ cartCount: 0 })

export function CartProvider({ children }: { children: React.ReactNode }) {
  return (
    <CartContext.Provider value={{ cartCount: 0 }}>
      {children}
    </CartContext.Provider>
  )
}
