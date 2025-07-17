import { Loader2, Zap } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
      <div className="text-center space-y-8">
        {/* Logo with Animation */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="p-4 bg-blue-600 rounded-xl animate-pulse">
              <Zap className="h-12 w-12 text-white" />
            </div>
            <div className="absolute inset-0 bg-blue-600 rounded-xl animate-ping opacity-20"></div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">SwiftLoan</h2>
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <p className="text-lg text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
          </div>
        </div>

        {/* Loading Bar */}
        <div className="w-64 mx-auto">
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-blue-500/10 rounded-full animate-bounce"></div>
        <div className="absolute bottom-1/4 right-1/4 w-20 h-20 bg-purple-500/10 rounded-full animate-pulse"></div>
      </div>
    </div>
  )
}
