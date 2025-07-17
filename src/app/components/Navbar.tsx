"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Zap } from "lucide-react"
import { LogoutButton } from "./Logout"

export default function Navbar() {
  const pathname = usePathname()
  const hideNavbar = pathname === "/login" || pathname === "/register"

  if (hideNavbar) return null

  const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Profile", href: "/dashboard/profile" },
    { name: "Loans", href: "/dashboard/loan/status" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2 text-xl font-bold text-blue-600 cursor-pointer">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span>SwiftLoan</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium cursor-pointer"
            >
              {item.name}
            </Link>
          ))}
          <LogoutButton />
        </nav>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="flex flex-col space-y-4 mt-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-blue-600 transition-colors font-medium py-2 cursor-pointer"
                >
                  {item.name}
                </Link>
              ))}
              <LogoutButton />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
