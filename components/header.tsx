"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/components/cart-provider";
import { Badge } from "@/components/ui/badge";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { PLATFORM_NAME } from "@/lib/constants";

export default function Header() {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { itemCount } = useCart();

  console.log("isLoggedIn jimmy", isAuthenticated, user);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          {/* <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                <div className="mt-4 space-y-2">
                  <Button asChild className="w-full">
                    <Link href="/auth/signin">Sign In</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/auth/signup">Sign Up</Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet> */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">{PLATFORM_NAME}</span>
          </Link>
        </div>

        {/* <div className="flex items-center gap-2">
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {itemCount}
                </Badge>
              )}
              <span className="sr-only">Cart</span>
            </Button>
          </Link>

          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <User className="h-5 w-5" />
              <span className="sr-only">User menu</span>
            </Button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-background border">
                <div className="py-1">
                  {!isAuthenticated && (
                    <Link
                      href="/auth/signin"
                      className="block px-4 py-2 text-sm hover:bg-muted"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                  )}
                  {!isAuthenticated && (
                    <Link
                      href="/auth/signup"
                      className="block px-4 py-2 text-sm hover:bg-muted"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  )}
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-sm hover:bg-muted"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/account"
                    className="block px-4 py-2 text-sm hover:bg-muted"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    My Account
                  </Link>

                  <Link
                    href="/account/orders"
                    className="block px-4 py-2 text-sm hover:bg-muted"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Order History
                  </Link>
                  {isAuthenticated && (
                    <Link
                      href="/auth/signin"
                      className="block px-4 py-2 text-sm hover:bg-muted"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Logout
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div> */}
      </div>
    </header>
  );
}
