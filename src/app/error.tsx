"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, Home, RefreshCw, Zap } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center space-x-2 text-2xl font-bold text-blue-600">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <span>SwiftLoan</span>
          </Link>
        </div>

        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="p-6 bg-red-100 dark:bg-red-900/20 rounded-full">
            <AlertTriangle className="h-16 w-16 text-red-600 dark:text-red-400" />
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Something went wrong!</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            We encountered an unexpected error. Don&apos;t worry, our team has been notified and we&apos;re working on a fix.
          </p>

        </div>

        {/* Error Details (Development only) */}
        {process.env.NODE_ENV === "development" && (
          <Card className="border-red-200 bg-red-50 dark:bg-red-900/20 text-left">
            <CardContent className="p-4">
              <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">Error Details:</h3>
              <pre className="text-sm text-red-700 dark:text-red-300 overflow-auto">{error.message}</pre>
              {error.digest && <p className="text-xs text-red-600 dark:text-red-400 mt-2">Error ID: {error.digest}</p>}
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button onClick={reset} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
            <RefreshCw className="mr-2 h-5 w-5" />
            Try Again
          </Button>

          <Button asChild variant="outline" size="lg" className="px-8 py-3 bg-transparent">
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Go Home
            </Link>
          </Button>
        </div>

        {/* Help Section */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Need immediate assistance?</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-4">
                <Button asChild variant="outline">
                  <Link href="/dashboard/support">Contact Support</Link>
                </Button>

                <Button asChild variant="ghost">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                If this error persists, please contact our support team with the error details above.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-red-500/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-500/10 rounded-full animate-bounce"></div>
      </div>
    </div>
  )
}
