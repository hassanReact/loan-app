"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import axios from "@/lib/axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ArrowLeft,
  Calendar,
  User,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Paperclip,
  FileText,
  Eye,
  Mail,
} from "lucide-react"
import { DocumentViewerModal } from "@/app/components/Document-Viewer-Model"
import { isAxiosError } from "axios"

interface User {
  _id: string
  name: string
  email: string
}

interface Loan {
  _id: string
  user: User
  amount: number
  reason: string
  documents: string[]
  status: "repaid" | "approved" | "pending" | "rejected"
  withdrawn: boolean
  repaidAmount: number
  createdAt: string
  updatedAt: string
  __v: number
  repaidAt?: string
}

export default function AdminLoanDetailPage() {
  const { id } = useParams()
  const [loan, setLoan] = useState<Loan | null>(null) // Use Loan | null for the state
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDocumentUrl, setSelectedDocumentUrl] = useState<string | null>(null)

  useEffect(() => {
    const fetchLoan = async () => {
      try {
        const res = await axios.get(`/api/admin/loans/${id}`)
        if (res.data.success) {
          console.log(res.data.loan)
          setLoan(res.data.loan)
        } else {
          setError(res.data.message || "Failed to load loan details")
        }
      } catch (err: unknown) {
        // Type 'unknown' is safer than 'any'
        if (isAxiosError(err)) {
          setError(err.response?.data?.message || "Failed to load loan details")
        } else if (err instanceof Error) {
          setError(err.message || "Failed to load loan details")
        } else {
          setError("An unexpected error occurred")
        }
      } finally {
        setLoading(false)
      }
    }
    if (id) {
      fetchLoan()
    }
  }, [id])
  const handleDocumentClick = (url: string) => {
    setSelectedDocumentUrl(url)
    setIsModalOpen(true)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "repaid":
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "repaid":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/loans">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Loans
            </Link>
          </Button>
        </div>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/2 mb-4" />
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error && !loan) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/loans">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Loans
            </Link>
          </Button>
        </div>
        <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Loan Not Found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <Button asChild>
              <Link href="/admin/loans">Back to Loans</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!loan) return null // Ensure loan is not null before rendering details

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/loans">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Loans
          </Link>
        </Button>
        <Badge className={`${getStatusColor(loan.status)} flex items-center space-x-1`}>
          {getStatusIcon(loan.status)}
          <span className="capitalize">{loan.status} Loan</span>
        </Badge>
      </div>

      {/* Loan Details Card */}
      <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Loan Application for £ {loan.amount?.toLocaleString()}
          </CardTitle>
          <CardDescription className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>Applied on {new Date(loan.createdAt).toLocaleDateString()}</span>
            </span>
            {loan.status === "repaid" && loan.repaidAt && (
              <span className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4" />
                <span>Repaid on {new Date(loan.repaidAt).toLocaleDateString()}</span>
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">Applicant</h4>
              <p className="text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>{loan.user?.name || "Unknown User"}</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>{loan.user?.email || "No email"}</span>
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">Loan Purpose</h4>
              <p className="text-gray-600 dark:text-gray-400">{loan.reason}</p>
            </div>
          </div>

          {/* Documents Section */}
          {loan.documents && loan.documents.length > 0 && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <Paperclip className="h-5 w-5 mr-2" />
                Supporting Documents ({loan.documents.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {loan.documents.map((docUrl: string, docIndex: number) => (
                  <Button
                    key={docIndex}
                    variant="outline"
                    className="w-full justify-start text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer bg-transparent"
                    onClick={() => handleDocumentClick(docUrl)}
                  >
                    <FileText className="h-4 w-4 mr-2 shrink-0" />
                    <span className="truncate">Document {docIndex + 1}</span>
                    <Eye className="h-4 w-4 ml-auto shrink-0" />
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {loan.status === "pending" && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-3 justify-end">
              <Button className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve Loan
              </Button>
              <Button variant="destructive">
                <XCircle className="mr-2 h-4 w-4" />
                Reject Loan
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Viewer Modal */}
      <DocumentViewerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        documentUrl={selectedDocumentUrl}
      />
    </div>
  )
}
