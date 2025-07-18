'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  FileText,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  CreditCard,
} from 'lucide-react';
import { isAxiosError } from 'axios';
import Link from 'next/link';

// Define loan interface
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
  const [actionLoading, setActionLoading] = useState<string | null>(null) // To track loading state for repay action

  const fetchLoans = async () => {
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
        return <CreditCard className="h-4 w-4 text-blue-600" />
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Loan Applications</h1>
          <p className="text-gray-600 dark:text-gray-400">Track the status of your loan applications</p>
        </div>
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-0 shadow-lg">
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Loan Applications</h1>
        <p className="text-gray-600 dark:text-gray-400">Track the status of your loan applications</p>
      </div>

      {message && (
        <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 dark:text-green-200">{message}</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loans.length === 0 ? (
        <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No loan applications found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You haven&apos;t submitted any loan applications yet.
            </p>
            <Button asChild>
              <Link href="/dashboard/loan/apply">Apply for Your First Loan</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {loans.map((loan) => (
            <Card
              key={loan._id}
              className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-shadow"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span>£ {loan.amount?.toLocaleString()}</span>
                  </CardTitle>
                  <Badge className={`${getStatusColor(loan.status)} flex items-center space-x-1`}>
                    {getStatusIcon(loan.status)}
                    <span className="capitalize">{loan.status}</span>
                  </Badge>
                </div>
                <CardDescription className="flex items-center space-x-4 text-sm mt-1">
                  <span className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(loan.createdAt).toLocaleDateString()}</span>
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Purpose</h4>
                    <p className="text-gray-600 dark:text-gray-400">{loan.purpose || loan.reason}</p>
                  </div>
                  {loan.duration && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">Duration</h4>
                      <p className="text-gray-600 dark:text-gray-400">{loan.duration}</p>
                    </div>
                  )}
                  {loan.status === "approved" && (
                    <div className="pt-4 border-t">
                      <Button
                        onClick={() => handleRepay(loan._id)}
                        className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                        disabled={actionLoading === loan._id}
                      >
                        {actionLoading === loan._id ? (
                          <>
                            <Clock className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Repay Loan
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
