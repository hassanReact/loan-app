"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "@/lib/axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, FileText, AlertCircle } from "lucide-react"
import { FileUploader } from "@/app/components/File-Uploader"


export default function ApplyLoanPage() {
  const router = useRouter()
  const [amount, setAmount] = useState("")
  const [reason, setReason] = useState("")
  const [documents, setDocuments] = useState<string[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [amountError, setAmountError] = useState("")
  const [reasonError, setReasonError] = useState("")

  const handleFilesUploaded = (urls: string[]) => {
    setDocuments((prev) => [...prev, ...urls])
    setError("") // Clear any previous file upload errors
  }

  const validateForm = () => {
    let isValid = true
    setAmountError("")
    setReasonError("")
    setError("") // Clear general error

    const parsedAmount = Number.parseFloat(amount)

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setAmountError("Please enter a valid loan amount.")
      isValid = false
    } else if (parsedAmount < 1000) {
      // Example min loan amount
      setAmountError("Minimum loan amount is $1,000.")
      isValid = false
    } else if (parsedAmount > 50000) {
      // Example max loan amount
      setAmountError("Maximum loan amount is $50,000.")
      isValid = false
    }

    if (!reason.trim()) {
      setReasonError("Please provide a reason for the loan.")
      isValid = false
    }

    if (documents.length !== 5) {
      setError("Please upload exactly 5 documents.")
      isValid = false
    }

    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!validateForm()) {
      setLoading(false)
      return
    }

    try {
      await axios.post("/api/loan/apply", {
        amount: Number.parseFloat(amount),
        reason,
        documents,
      })
      router.push("/dashboard/loan/status")
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to apply")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Apply for Loan</h1>
        <p className="text-gray-600 dark:text-gray-400">Fill out the form below to start your loan application</p>
      </div>

      <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <span>Loan Application Form</span>
          </CardTitle>
          <CardDescription>Please provide accurate information for faster processing</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Loan Amount (USD)</label>
              <Input
                type="number"
                placeholder="Enter loan amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="text-lg"
              />
              {amountError && <p className="text-sm text-red-500 mt-1">{amountError}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Purpose of Loan</label>
              <Textarea
                placeholder="Describe why you need this loan"
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
              {reasonError && <p className="text-sm text-red-500 mt-1">{reasonError}</p>}
            </div>

            {/* Replace the old upload section with the new FileUploader */}
            <FileUploader
              onFilesUploaded={handleFilesUploaded}
              maxFiles={5}
              currentFilesCount={documents.length}
              disabled={loading}
            />

            <Button type="submit" className="w-full" disabled={loading || documents.length !== 5} size="lg">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting Application...
                </>
              ) : (
                "Submit Loan Application"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
