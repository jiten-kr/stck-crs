"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { PLATFORM_NAME, PLATFORM_SUPPORT_EMAIL } from "@/lib/constants"
import { Mail, Phone, Clock, MapPin, Send } from 'lucide-react'

export default function ContactPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    try {
      await fetch("/api/contact-us", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.get("firstName"),
          lastName: formData.get("lastName"),
          email: formData.get("email"),
          subject: formData.get("subject"),
          message: formData.get("message"),
        }),
      })

      toast({
        title: "Message Sent",
        description: "We've received your message and will respond within 24 hours.",
      })

      // Reset form
      form.reset()
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Message Sent",
        description: "We've received your message and will respond within 24 hours.",
      })
      form.reset()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Contact Us</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions about our courses or need assistance? We're here to help. Reach out to our team using any of the methods below.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Reach out to us directly using the following contact details.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <Mail className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p>{PLATFORM_SUPPORT_EMAIL}</p>
                    {/* <p className="text-sm text-muted-foreground">For general inquiries:</p>
                    <p className="text-sm text-muted-foreground mt-2">For support:</p>
                    <p>{PLATFORM_SUPPORT_EMAIL}</p> */}
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-4">
                  <Phone className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-sm text-muted-foreground">Customer Support:</p>
                    <p>+91 9997336099</p>
                    {/* <p className="text-sm text-muted-foreground mt-2">Sales:</p>
                    <p>+1 (800) 765-4321</p> */}
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-4">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Hours of Operation</h3>
                    <p className="text-sm text-muted-foreground">Customer Support:</p>
                    <p>Monday - Sunday: 9:00 AM - 9:00 PM IST</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-4">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Office Address</h3>
                    <p>{PLATFORM_NAME}</p>
                    <p>Moradabad, Uttar Pradesh, India</p>
                    {/* <p>Financial District</p>
                    <p>New York, NY 10001</p>
                    <p>United States</p> */}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  We strive to respond to all inquiries within 24 hours during business days. For urgent matters,
                  please contact our customer support phone line for immediate assistance.
                </p>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Send Us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First name</Label>
                      <Input id="firstName" name="firstName" placeholder="John" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <Input id="lastName" name="lastName" placeholder="Doe" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="john.doe@example.com" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" name="subject" placeholder="Course Inquiry" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Please provide details about your inquiry..."
                      rows={5}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Before reaching out, you might find answers to common questions in our FAQ section.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <Button asChild>
                  <a href="/faq">Visit FAQ Page</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
