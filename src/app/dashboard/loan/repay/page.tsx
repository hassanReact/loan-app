'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { isAxiosError } from 'axios';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, Clock, XCircle, AlertCircle, FileText, Link, Badge, DollarSign, Calendar, Hourglass, Eye } from 'lucide-react';

// TypeScript interface for a Loan object
interface Loan {
  _id: string;
  user: string;
  amount: number;
  reason: string;
  documents: string[];
  status: 'pending' | 'approved' | 'rejected' | 'repaid';
  withdrawn: boolean;
  repaidAmount: number;
  createdAt: string;
  updatedAt: string;
  repaidAt?: string;
  purpose?: string;
  duration?: string;
}

export default function LoanStatusPage() {
  const [loans, setLoans] = useState<Loan[]>([])
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchLoans = async () => {
    setLoading(true)
    try {
      const res = await axios.get("/api/loan/status")
      setLoans(res.data.loans)
    } catch (err: unknown) {
      // Use unknown for error type
      if (isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to fetch loans")
      } else if (err instanceof Error) {
        setError(err.message || "Failed to fetch loans")
      } else {
        setError("An unexpected error occurred while fetching loans")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRepay = async (loanId: string) => {
    setActionLoading(loanId)
    setMessage("")
    setError("")
    try {
      const res = await axios.put(`/api/loan/repay/${loanId}`)
      setMessage(res.data.message)
      fetchLoans() // Refresh list after repayment
    } catch (err: unknown) {
      // Use unknown for error type
      if (isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to repay loan")
      } else if (err instanceof Error) {
        setError(err.message || "Failed to repay loan")
      } else {
        setError("An unexpected error occurred while repaying the loan")
      }
    } finally {
      setActionLoading(null)
    }
  }

  useEffect(() => {
    fetchLoans()
  }, [])

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
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Your Loan Applications</h1>
          <p className="text-gray-600 dark:text-gray-400">Loading your loan history...</p>
        </div>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Your Loan Applications</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track the status of your loan applications and manage repayments
        </p>
      </div>

      {message && (
        <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800 dark:text-green-200">{message}</AlertTitle>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{error}</AlertTitle>
        </Alert>
      )}

      {loans.length === 0 && !loading ? (
        <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No loan applications found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              You haven&apos;t applied for any loans yet. Start your first application!
            </p>
            <Button asChild className="mt-6">
              <Link href="/dashboard/loan/apply">Apply for a New Loan</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {loans.map((loan: Loan) => (
            <Card
              key={loan._id}
              className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                      <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Loan for {loan.purpose || loan.reason}
                        </h3>
                        <Badge className={`${getStatusColor(loan.status)} flex items-center space-x-1`}>
                          {getStatusIcon(loan.status)}
                          <span className="capitalize">{loan.status}</span>
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4" />
                          <span>£ {loan.amount?.toLocaleString()}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Applied on {new Date(loan.createdAt).toLocaleDateString()}</span>
                        </span>
                        {loan.duration && (
                          <span className="flex items-center space-x-1">
                            <Hourglass className="h-4 w-4" />
                            <span>{loan.duration}</span>
                          </span>
                        )}
                      </div>
                      {loan.status === "repaid" && loan.repaidAt && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-1">
                          <CheckCircle className="h-4 w-4 text-blue-600" />
                          <span>Repaid on {new Date(loan.repaidAt).toLocaleDateString()}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {loan.status === "approved" && (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleRepay(loan._id)}
                        disabled={actionLoading === loan._id}
                      >
                        {actionLoading === loan._id ? "Repaying..." : "Repay Loan"}
                      </Button>
                    )}
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/dashboard/loan/status/${loan._id}`} className="cursor-pointer">
                        View Details
                        <Eye className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}