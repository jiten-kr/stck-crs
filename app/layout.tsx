import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/components/cart-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import "./globals.css"
import { Providers } from "@/components/providers"
import { PLATFORM_FULL_NAME } from "@/lib/constants"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: PLATFORM_FULL_NAME,
  description: "Discover and purchase high-quality online courses",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <CartProvider>
            <Providers>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </Providers>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
