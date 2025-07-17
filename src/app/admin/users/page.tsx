"use client"

import { useEffect, useState } from "react"
import axios from "@/lib/axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Search, Filter, Mail, Calendar, Shield, User } from "lucide-react"

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [query, setQuery] = useState("")
  const [role, setRole] = useState("all") // Updated default value to 'all'
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (query) params.append("query", query)
      if (role !== "all") params.append("role", role) // Updated condition to exclude 'all' role
      const res = await axios.get(`/api/admin/user?${params.toString()}`)
      setUsers(res.data.users)
    } catch (err) {
      console.error("Error fetching users:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [role])

  const getRoleColor = (role: string) => {
    return role === "admin"
      ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
  }

  const getRoleIcon = (role: string) => {
    return role === "admin" ? <Shield className="h-3 w-3" /> : <User className="h-3 w-3" />
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Users</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage all registered users</p>
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
                  <Skeleton className="h-6 w-16" />
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Users</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage all registered users</p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {users.length} Total Users
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
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem> {/* Updated value prop */}
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchUsers} className="w-full sm:w-auto">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Grid */}
      <div className="grid gap-4">
        {users.map((user: any) => (
          <Card
            key={user._id}
            className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                      <Badge className={`${getRoleColor(user.role)} flex items-center space-x-1`}>
                        {getRoleIcon(user.role)}
                        <span className="capitalize">{user.role}</span>
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center space-x-1">
                        <Mail className="h-4 w-4" />
                        <span>{user.email}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {users.length === 0 && !loading && (
        <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No users found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your search criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
