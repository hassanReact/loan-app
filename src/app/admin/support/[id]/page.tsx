"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import axios from "@/lib/axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Send, User, Mail, Calendar, MessageSquare, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function AdminSupportReplyPage() {
  const { id } = useParams()
  const [ticket, setTicket] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [reply, setReply] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [replyError, setReplyError] = useState("")

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await axios.get(`/api/admin/support/${id}`)
        if (res.data.success) {
          setTicket(res.data.ticket)
        } else {
          setError(res.data.message || "Failed to load ticket")
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load ticket")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchTicket()
    }
  }, [id])

  const handleReply = async () => {
    setReplyError("")
    if (!reply.trim()) {
      setReplyError("Reply message cannot be empty.")
      return
    }

    setSending(true)
    setMessage("")
    setError("")

    try {
      const res = await axios.post(`/api/admin/support/${id}/reply`, { message: reply })
      if (res.data.success) {
        // Fix: Safely handle replies array
        setTicket((prev: any) => ({
          ...prev,
          replies: [...(prev.replies || []), res.data.reply],
        }))
        setReply("")
        setMessage("Reply sent successfully")
      } else {
        setError(res.data.message || "Failed to send reply")
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send reply")
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/support">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tickets
            </Link>
          </Button>
        </div>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
              <Skeleton className="h-24 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error && !ticket) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/support">
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
              <Link href="/admin/support">Back to Tickets</Link>
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
          <Link href="/admin/support">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tickets
          </Link>
        </Button>
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
          {ticket.status === "open" ? "Open Ticket" : "Closed Ticket"}
        </Badge>
      </div>

      {/* Original Ticket */}
      <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-start space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                {ticket.user?.name?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-xl mb-2">{ticket.subject}</CardTitle>
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
                  <span>{new Date(ticket.createdAt).toLocaleString()}</span>
                </span>
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

      {/* Replies */}
      {ticket.replies && Array.isArray(ticket.replies) && ticket.replies.length > 0 && (
        <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Replies ({ticket.replies.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ticket.replies.map((r: any, i: number) => (
                <div key={i} className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      {r.sender?.name || "Admin"} Reply
                    </span>
                    <span className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-gray-800 dark:text-gray-200">{r.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reply Form */}
      <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Send Reply</CardTitle>
          <CardDescription>Respond to the customer's support request</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
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

            <Textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={6}
              placeholder="Type your reply here..."
              className="resize-none"
            />
            {replyError && <p className="text-sm text-red-500 mt-1">{replyError}</p>}

            <Button onClick={handleReply} disabled={!reply.trim() || sending} className="w-full sm:w-auto">
              {sending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Reply...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Reply
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
