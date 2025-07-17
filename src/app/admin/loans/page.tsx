"use client"

import { useEffect, useState } from "react"
import axios from "@/lib/axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  FileText,
  Search,
  Filter,
  DollarSign,
  Calendar,
  User,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Eye,
} from "lucide-react"
import Link from "next/link" // Import Link

export default function AdminLoansPage() {
  const [loans, setLoans] = useState([])
  const [status, setStatus] = useState("all")
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(true)

  const fetchLoans = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (status !== "all") params.append("status", status)
      if (query) params.append("query", query)
      const res = await axios.get(`/api/admin/loans?${params.toString()}`)
      setLoans(res.data.loans)
    } catch (err) {
      console.error("Error fetching loans:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLoans()
  }, [status])

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Loan Applications</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage and review all loan applications</p>
          </div>
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Loan Applications</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and review all loan applications</p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {loans.length} Total Applications
        </Badge>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or email..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="repaid">Repaid</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchLoans} className="w-full sm:w-auto">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loans Grid */}
      <div className="grid gap-6">
        {loans.map((loan: any) => (
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
                        {loan.user?.name || "Unknown User"}
                      </h3>
                      <Badge className={`${getStatusColor(loan.status)} flex items-center space-x-1`}>
                        {getStatusIcon(loan.status)}
                        <span className="capitalize">{loan.status}</span>
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{loan.user?.email || "No email"}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4" />
                        <span>£ {loan.amount?.toLocaleString()}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(loan.createdAt).toLocaleDateString()}</span>
                      </span>
                    </div>
                    {loan.reason && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
                        <strong>Purpose:</strong> {loan.reason}
                      </p>
                    )}
                    {/* Documents Section - Removed direct display, now on detail page */}
                  </div>
                </div>
                <div className="flex space-x-2">
                  {loan.status === "pending" && (
                    <>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive">
                        Reject
                      </Button>
                    </>
                  )}
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/admin/loans/${loan._id}`} className="cursor-pointer">
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

      {loans.length === 0 && !loading && (
        <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No loan applications found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your search criteria or check back later.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
