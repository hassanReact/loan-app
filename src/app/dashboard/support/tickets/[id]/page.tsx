"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import axios from "@/lib/axios"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ArrowLeft,
  Calendar,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Shield
} from "lucide-react"

// ✅ Updated interfaces — no other code changed
interface Sender {
  _id: string
  name: string
  email: string
  role: "admin" | "support" | string
}

interface SupportReply {
  _id?: string
  sender?: Sender
  message: string
  createdAt: string
  updatedAt?: string
}

interface SupportTicket {
  _id: string
  user?: string
  subject: string
  message: string
  status: "open" | "closed"
  createdAt: string
  updatedAt?: string
  replies?: SupportReply[]
}

export default function UserSupportTicketDetailPage() {
  const { id } = useParams()
  const [ticket, setTicket] = useState<SupportTicket | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await axios.get(`/api/support/tickets/${id}`)
        if (res.data.success) {
          setTicket(res.data.ticket)
        } else {
          setError(res.data.message || "Failed to load ticket")
        }
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } }
        setError(error.response?.data?.message || "Failed to load ticket")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchTicket()
    }
  }, [id])

  const getStatusColor = (status: string) => {
    return status === "open"
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }

  const getStatusIcon = (status: string) => {
    return status === "open" ? (
      <Clock className="h-4 w-4 text-green-600" />
    ) : (
      <CheckCircle className="h-4 w-4 text-gray-600" />
    )
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/support/tickets">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tickets
            </Link>
          </Button>
        </div>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-24 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/support/tickets">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tickets
            </Link>
          </Button>
        </div>

        <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Ticket Not Found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <Button asChild>
              <Link href="/dashboard/support/tickets">Back to Tickets</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!ticket) return null

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/support/tickets">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tickets
          </Link>
        </Button>
        <Badge className={`${getStatusColor(ticket.status)} flex items-center space-x-1`}>
          {getStatusIcon(ticket.status)}
          <span className="capitalize">{ticket.status} Ticket</span>
        </Badge>
      </div>

      {/* Original Ticket */}
      <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-start space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-xl mb-2">{ticket.subject}</CardTitle>
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Created {new Date(ticket.createdAt).toLocaleDateString()}</span>
                </span>
                {ticket.replies && ticket.replies.length > 0 && (
                  <span className="flex items-center space-x-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{ticket.replies.length} replies</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{ticket.message}</p>
          </div>
        </CardContent>
      </Card>

      {/* Admin Replies */}
      {ticket.replies && Array.isArray(ticket.replies) && ticket.replies.length > 0 && (
        <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Support Responses ({ticket.replies.length})</span>
            </CardTitle>
            <CardDescription>Replies from our support team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ticket.replies.map((reply, index) => (
                <div
                  key={index}
                  className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                          <Shield className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                          {reply.sender?.name || "Support Team"}
                        </span>
                        <span className="text-xs text-blue-600 dark:text-blue-400 ml-2">
                          {reply.sender?.role === "admin" ? "Admin" : "Support"}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(reply.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{reply.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Information */}
      <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Ticket Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">Status</h4>
              <Badge className={getStatusColor(ticket.status)}>
                {getStatusIcon(ticket.status)}
                <span className="ml-1 capitalize">{ticket.status}</span>
              </Badge>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">Last Updated</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {new Date(ticket.updatedAt || ticket.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {ticket.status === "open" && (
            <Alert className="mt-4 border-blue-200 bg-blue-50 dark:bg-blue-900/20">
              <Clock className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                Your ticket is currently open and being reviewed by our support team. You&apos;ll receive a response soon.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
