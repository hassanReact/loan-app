import type React from "react"
import Navbar from "./components/Navbar"
import "./globals.css"
import type { Metadata } from "next"
import { ThemeProvider } from "./components/ThemeProvider"

export const metadata: Metadata = {
  title: "SwiftLoan - Fast & Simple Loans",
  description: "Fast and simple loan application system with modern dashboard",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head></head>
      <body className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Navbar />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
