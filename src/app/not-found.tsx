import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, ArrowLeft, Search, HelpCircle, Zap } from "lucide-react"

export default function NotFound() {
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

        {/* 404 Animation */}
        <div className="relative">
          <div className="text-9xl font-bold text-blue-600/20 dark:text-blue-400/20 select-none">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
              404
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Oops! Page Not Found</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            The page you&rsquo;re looking for seems to have taken a loan and disappeared. Don&rsquo;t worry, we&rsquo;ll help you find your way back!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Go Home
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="px-8 py-3 bg-transparent">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        {/* Quick Links */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Looking for something specific?
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/dashboard/loan/apply"
                className="group p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900 dark:text-white">Apply for Loan</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Start your application</p>
                  </div>
                </div>
              </Link>

              <Link
                href="/dashboard/loan/status"
                className="group p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-600 rounded-lg group-hover:scale-110 transition-transform">
                    <Search className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900 dark:text-white">Check Status</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Track your loans</p>
                  </div>
                </div>
              </Link>

              <Link
                href="/dashboard/support"
                className="group p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-600 rounded-lg group-hover:scale-110 transition-transform">
                    <HelpCircle className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900 dark:text-white">Get Support</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Contact our team</p>
                  </div>
                </div>
              </Link>

              <Link
                href="/dashboard/profile"
                className="group p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-600 rounded-lg group-hover:scale-110 transition-transform">
                    <ArrowLeft className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900 dark:text-white">My Profile</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Update account</p>
                  </div>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Still can&rsquo;t find what you&rsquo;re looking for?{" "}
            <Link href="/dashboard/support" className="text-blue-600 hover:underline font-medium">
              Contact our support team
            </Link>
          </p>

        </div>

        {/* Floating Elements for Visual Appeal */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/10 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-500/10 rounded-full animate-ping"></div>
      </div>
    </div>
  )
}
