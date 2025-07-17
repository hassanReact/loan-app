"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ServerCrash, Home, RefreshCw, Zap } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  console.error('Global error caught:', error);
  return (
    <html>
      <body>
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
                <ServerCrash className="h-16 w-16 text-red-600 dark:text-red-400" />
              </div>
            </div>

            {/* Error Message */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Server Error</h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                Our servers are experiencing some technical difficulties. We&apos;re working hard to fix this issue.
              </p>
            </div>

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

            {/* Status Information */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">What can you do?</h3>

                <div className="space-y-3 text-left">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <p className="text-gray-600 dark:text-gray-400">Wait a few minutes and try refreshing the page</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Check our status page for any ongoing maintenance
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <p className="text-gray-600 dark:text-gray-400">Contact our support team if the issue persists</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Need immediate help?{" "}
                <Link href="/dashboard/support" className="text-blue-600 hover:underline font-medium">
                  Contact Support
                </Link>
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
