"use client"

import { useEffect, useState } from "react"
import axios from "@/lib/axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  Settings,
} from "lucide-react"

const iconMap = {
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  Settings,
}

export default function AdminHome() {
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get("/api/admin/dashboard")
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back, Admin</h1>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard data...</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-4 w-20" />
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back, Admin</h1>
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    )
  }

  const { stats, recentActivity } = dashboardData

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back, Admin</h1>
        <p className="text-gray-600 dark:text-gray-400">Here's what's happening with your loan platform today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(stats).map(([key, stat]: [string, any], index) => {
          const IconComponent = iconMap[stat.icon as keyof typeof iconMap]
          return (
            <Card key={index} className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {key === "totalUsers"
                        ? "Total Users"
                        : key === "activeLoans"
                          ? "Active Loans"
                          : key === "totalDisbursed"
                            ? "Total Disbursed"
                            : "Approval Rate"}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    <Badge variant="secondary" className="mt-1 bg-green-100 text-green-700">
                      {stat.change} from last month
                    </Badge>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor} ${stat.color}`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity: any, index: number) => {
                const IconComponent = iconMap[activity.icon as keyof typeof iconMap]
                return (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <div className={`p-2 rounded-full bg-gray-100 dark:bg-slate-600 ${activity.color}`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {activity.user}
                        {activity.type === "loan_approved" && " loan approved"}
                        {activity.type === "new_user" && " joined the platform"}
                        {activity.type === "loan_pending" && " submitted loan application"}
                        {activity.type === "support_ticket" && " created support ticket"}
                      </p>
                      {activity.amount && <p className="text-sm text-gray-600 dark:text-gray-400">{activity.amount}</p>}
                    </div>
                    <span className="text-sm text-gray-500">{activity.time}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-pointer">
                <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="font-medium text-gray-900 dark:text-white">Review Loans</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending review</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors cursor-pointer">
                <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="font-medium text-gray-900 dark:text-white">Manage Users</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stats.totalUsers.value} total</p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors cursor-pointer">
                <HelpCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="font-medium text-gray-900 dark:text-white">Support Tickets</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Open tickets</p>
              </div>
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors cursor-pointer">
                <Settings className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <p className="font-medium text-gray-900 dark:text-white">Settings</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Configure</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
