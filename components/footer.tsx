import Link from "next/link"
import { Info, Mail, Phone } from "lucide-react"
import { PLATFORM_NAME, contactDetails } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{PLATFORM_NAME}</h3>
            <p className="text-sm text-muted-foreground">
              Master practical skills with expert guidance you can apply immediately.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{contactDetails.email.support}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{contactDetails.phone.support}</span>
              </div>
            </div>
          </div>
          {/* <div className="space-y-4">
            <h3 className="text-lg font-medium">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/courses" className="text-muted-foreground hover:text-foreground">
                  All Courses
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-muted-foreground hover:text-foreground">
                  Categories
                </Link>
              </li>
            </ul>
          </div> */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact-us" className="text-muted-foreground hover:text-foreground">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground">
                  FAQ
                </Link>
              </li>
              {/* <li>
                <Link href="/help" className="text-muted-foreground hover:text-foreground">
                  Help Center
                </Link>
              </li> */}
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms-of-service" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-muted-foreground hover:text-foreground">
                  Refund & Cancellation
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Educational Disclaimer */}
        <div className="mt-8 rounded-lg bg-muted/30 p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Info className="h-4 w-4 flex-shrink-0" />
            <p>
              We're here to teach, not advise! Our courses are purely educational — always check with a licensed financial advisor before making investment decisions.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {PLATFORM_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

