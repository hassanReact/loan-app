"use client"

import { useEffect, useState } from "react"
import axios from "@/lib/axios"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { HelpCircle, MessageSquare, Calendar, User, Mail, ArrowRight } from "lucide-react"
import Link from "next/link"
import { ISupport } from "@/types"

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<ISupport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axios.get("/api/admin/support")
        setTickets(res.data.tickets)
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load support tickets")
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Support Tickets</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage customer support requests</p>
          </div>
        </div>

        <div className="grid gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                  <Skeleton className="h-8 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Support Tickets</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage customer support requests</p>
          </div>
        </div>

        <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <HelpCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Tickets</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Support Tickets</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage customer support requests</p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {tickets.length} Total Tickets
        </Badge>
      </div>

      {tickets.length === 0 ? (
        <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <HelpCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No support tickets found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              All caught up! No pending support requests at the moment.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {tickets.map((ticket: ISupport) => (
            <Card
              key={ticket._id}
              className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                        {ticket.user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{ticket.subject}</h3>
                        <Badge
                          variant="outline"
                          className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        >
                          Open
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{ticket.user?.name || "Unknown User"}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Mail className="h-4 w-4" />
                          <span>{ticket.user?.email || "No email"}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-slate-700 p-3 rounded-lg">
                        {ticket.message}
                      </p>
                      {ticket.replies && ticket.replies.length > 0 && (
                        <div className="flex items-center space-x-1 text-sm text-blue-600 dark:text-blue-400">
                          <MessageSquare className="h-4 w-4" />
                          <span>{ticket.replies.length} replies</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button asChild className="shrink-0">
                    <Link href={`/admin/support/${ticket._id}`}>
                      View & Reply
                      <ArrowRight className="ml-2 h-4 w-4" />
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
