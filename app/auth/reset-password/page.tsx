"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function ResetPasswordPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate password reset request
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
      toast({
        title: "Reset link sent",
        description: "Check your email for a password reset link.",
      })
    }, 1500)
  }

  if (isSubmitted) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
            <CardDescription>We've sent you a password reset link. Please check your email.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              Didn't receive an email? Check your spam folder or try again.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button variant="outline" className="w-full" onClick={() => setIsSubmitted(false)}>
              Try again
            </Button>
            <div className="text-center text-sm">
              <Link href="/auth/signin" className="text-primary underline-offset-4 hover:underline">
                Back to sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Reset password</CardTitle>
          <CardDescription>Enter your email address and we'll send you a link to reset your password</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="name@example.com" required />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending reset link..." : "Send reset link"}
            </Button>
            <div className="text-center text-sm">
              <Link href="/auth/signin" className="text-primary underline-offset-4 hover:underline">
                Back to sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

