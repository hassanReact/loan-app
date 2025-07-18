"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import axios from "@/lib/axios"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { HelpCircle, MessageSquare, Calendar, Plus, CheckCircle, Clock, AlertCircle, Eye } from "lucide-react"

interface Sender {
  _id: string
  name: string
  email: string
  role: string
}

interface Reply {
  _id: string
  sender: Sender
  message: string
  createdAt: string
  updatedAt: string
}

interface Ticket {
  _id: string
  user: string
  subject: string
  message: string
  status: 'open' | 'closed'
  replies: Reply[]
  createdAt: string
  updatedAt: string
}


export default function UserSupportTicketsPage() {
const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axios.get("/api/support/tickets")
        if (res.data.success) {
          console.log(res.data.tickets)
          setTickets(res.data.tickets)
        } else {
          setError(res.data.message || "Failed to load tickets")
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load support tickets")
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [])

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
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Support Tickets</h1>
            <p className="text-gray-600 dark:text-gray-400">View and track your support requests</p>
          </div>
        </div>

        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Support Tickets</h1>
          <p className="text-gray-600 dark:text-gray-400">View and track your support requests</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/support">
            <Plus className="mr-2 h-4 w-4" />
            New Ticket
          </Link>
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {tickets.length === 0 && !loading ? (
        <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <HelpCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No support tickets found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">You haven't submitted any support requests yet.</p>
            <Button asChild>
              <Link href="/dashboard/support">Create Your First Ticket</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {tickets.map((ticket) => (
            <Card
              key={ticket._id}
              className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{ticket.subject}</h3>
                      <Badge className={`${getStatusColor(ticket.status)} flex items-center space-x-1`}>
                        {getStatusIcon(ticket.status)}
                        <span className="capitalize">{ticket.status}</span>
                      </Badge>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{ticket.message}</p>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                      </span>
                      {ticket.replies && ticket.replies.length > 0 && (
                        <span className="flex items-center space-x-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{ticket.replies.length} replies</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <Button asChild variant="outline" size="sm">
                    <Link href={`/dashboard/support/tickets/${ticket._id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
