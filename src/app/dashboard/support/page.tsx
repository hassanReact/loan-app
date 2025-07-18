"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import axios from "@/lib/axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, HelpCircle, Send, CheckCircle, AlertCircle, MessageSquare, Eye } from "lucide-react"
import { isAxiosError } from "axios"

export default function SupportPage() {
  // Removed 'router' as it's not used
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const res = await axios.post("/api/support/create", { subject, message })
      if (res.data) {
        setSuccess("Support request submitted successfully! We&apos;ll get back to you soon.") // Escaped apostrophe
        setSubject("")
        setMessage("")
      } else {
        setError(res.data.message || "Submission failed")
      }
    } catch (err: unknown) {
      // Type 'unknown' is safer than 'any'
      if (isAxiosError(err)) {
        setError(err.response?.data?.message || "Submission failed")
      } else if (err instanceof Error) {
        setError(err.message || "Submission failed")
      } else {
        setError("An unexpected error occurred during submission")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Contact Support</h1>
        <p className="text-gray-600 dark:text-gray-400">Get help with your loan application or account</p>
      </div>
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HelpCircle className="h-5 w-5 text-blue-600" />
              <span>Submit New Request</span>
            </CardTitle>
            <CardDescription>Create a new support ticket for assistance</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Need help? Fill out the form below to get personalized support from our team.
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-green-600" />
              <span>My Support Tickets</span>
            </CardTitle>
            <CardDescription>View and track your existing support requests</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Check the status of your tickets and view responses from our support team.
            </p>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/dashboard/support/tickets">
                <Eye className="mr-2 h-4 w-4" />
                View My Tickets
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HelpCircle className="h-5 w-5 text-blue-600" />
            <span>Submit Support Request</span>
          </CardTitle>
          <CardDescription>Describe your issue and we&apos;ll get back to you as soon as possible</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-200">{success}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
              <Input
                type="text"
                placeholder="Brief description of your issue"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
              <Textarea
                placeholder="Please describe your issue in detail..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={6}
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full" size="lg">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Request
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      {/* FAQ Section */}
      <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>Quick answers to common questions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">How long does loan approval take?</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Most loan applications are processed within 24-48 hours.
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">What documents do I need?</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                You need to upload 5 documents including ID, income proof, and bank statements.
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">How can I track my application?</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Visit the Loan Status page in your dashboard to track your application progress.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
