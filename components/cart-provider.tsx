"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { Course } from "@/lib/types"

type CartItem = {
  course: Course
  quantity: number
}

type CartContextType = {
  items: CartItem[]
  addItem: (course: Course) => void
  removeItem: (courseId: string) => void
  clearCart: () => void
  isInCart: (courseId: string) => boolean
  subtotal: number
  tax: number
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Load cart from localStorage on client side
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        setItems(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(items))
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error)
    }
  }, [items])

  const addItem = (course: Course) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.course.id === course.id)

      if (existingItem) {
        // Course already in cart, don't add again (courses are unique)
        return prevItems
      }

      // Add new course to cart
      return [...prevItems, { course, quantity: 1 }]
    })
  }

  const removeItem = (courseId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.course.id !== courseId))
  }

  const clearCart = () => {
    setItems([])
  }

  const isInCart = (courseId: string) => {
    return items.some((item) => item.course.id === courseId)
  }

  // Calculate cart totals
  const subtotal = items.reduce((total, item) => total + item.course.price * item.quantity, 0)
  const tax = subtotal * 0.1 // 10% tax
  const total = subtotal + tax
  const itemCount = items.length

  const value = {
    items,
    addItem,
    removeItem,
    clearCart,
    isInCart,
    subtotal,
    tax,
    total,
    itemCount,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

