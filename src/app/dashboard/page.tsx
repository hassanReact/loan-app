"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import axios from "@/lib/axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  CreditCard,
  FileText,
  User,
  HelpCircle,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowRight,
  XCircle,
} from "lucide-react"

const quickActions = [
  {
    title: "Apply for Loan",
    description: "Start a new loan application",
    href: "/dashboard/loan/apply",
    icon: CreditCard,
    color: "bg-blue-500",
    badge: "Popular",
  },
  {
    title: "Loan Status",
    description: "Track your applications",
    href: "/dashboard/loan/status",
    icon: FileText,
    color: "bg-green-500",
  },
  {
    title: "Update Profile",
    description: "Manage your account",
    href: "/dashboard/profile",
    icon: User,
    color: "bg-purple-500",
  },
  {
    title: "Contact Support",
    description: "Get help when you need it",
    href: "/dashboard/support",
    icon: HelpCircle,
    color: "bg-orange-500",
  },
]

const iconMap = {
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
}

export default function DashboardHome() {
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get("/api/user/dashboard")
        setDashboardData(response.data)
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
          <p className="text-blue-100 text-lg">Loading your dashboard...</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                  <Skeleton className="h-12 w-12 rounded-full" />
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
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
          <p className="text-red-200 text-lg">{error}</p>
        </div>
      </div>
    )
  }

  const { user, stats, recentActivity } = dashboardData

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
        <p className="text-blue-100 text-lg">Manage your loans and applications from your personalized dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat: any, index: number) => {
          const IconComponent = iconMap[stat.icon as keyof typeof iconMap]
          return (
            <Card key={index} className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-100 dark:bg-slate-700 ${stat.color}`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl ${action.color} text-white`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  {action.badge && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      {action.badge}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl">{action.title}</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">{action.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button asChild className="w-full group-hover:bg-blue-600 transition-colors">
                  <Link href={action.href} className="flex items-center justify-center">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl">Recent Activity</CardTitle>
          <CardDescription>Your latest loan activities and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity: any, index: number) => {
                const IconComponent = iconMap[activity.icon as keyof typeof iconMap]
                return (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <div className={`p-2 rounded-full bg-gray-100 dark:bg-slate-600 ${activity.color}`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{activity.type}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{activity.description}</p>
                    </div>
                    <span className="text-sm text-gray-500">{activity.time}</span>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No recent activity</p>
                <p className="text-sm text-gray-500">Start by applying for your first loan</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
