"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/components/cart-provider"
import { Trash2, ShoppingCart } from "lucide-react"

export default function CartPage() {
  const router = useRouter()
  const { items, removeItem, subtotal, tax, total, clearCart } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const handleCheckout = () => {
    setIsCheckingOut(true)
    setTimeout(() => {
      router.push("/checkout")
    }, 500)
  }

  if (items.length === 0) {
    return (
      <div className="container px-4 py-12 md:px-6 md:py-24 flex flex-col items-center justify-center text-center">
        <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-3xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">Looks like you haven't added any courses to your cart yet.</p>
        <Button asChild size="lg">
          <Link href="/courses">Browse Courses</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <p className="text-muted-foreground">
            {items.length} {items.length === 1 ? "course" : "courses"} in cart
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.course.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative h-24 w-full sm:w-40 flex-shrink-0">
                      <Image
                        src={item.course.image || "/placeholder.svg"}
                        alt={item.course.title}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between">
                        <h3 className="font-semibold">{item.course.title}</h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item.course.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">By {item.course.instructor.name}</p>
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <span>{item.course.level}</span>
                          <span className="mx-2">•</span>
                          <span>{item.course.duration}</span>
                        </div>
                        <div className="font-semibold">
                          {item.course.discountedPrice ? (
                            <>
                              <span>${item.course.discountedPrice}</span>
                              <span className="text-sm text-muted-foreground line-through ml-2">
                                ${item.course.price}
                              </span>
                            </>
                          ) : (
                            <span>${item.course.price}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={() => clearCart()}>
                Clear Cart
              </Button>
              <Button asChild variant="link">
                <Link href="/courses">Continue Shopping</Link>
              </Button>
            </div>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" size="lg" onClick={handleCheckout} disabled={isCheckingOut}>
                  {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

