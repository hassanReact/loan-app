"use client"

import type React from "react"

import { useState } from "react"
import axios from "@/lib/axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Loader2, User, Mail, Lock, CheckCircle, AlertCircle } from "lucide-react"

export default function ProfilePage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [nameError, setNameError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [currentPasswordError, setCurrentPasswordError] = useState("")
  const [newPasswordError, setNewPasswordError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validateForm = () => {
    let isValid = true
    setNameError("")
    setEmailError("")
    setCurrentPasswordError("")
    setNewPasswordError("")

    if (form.name && form.name.trim().length < 2) {
      setNameError("Name must be at least 2 characters.")
      isValid = false
    }

    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      setEmailError("Invalid email format.")
      isValid = false
    }

    if (form.newPassword) {
      if (!form.currentPassword) {
        setCurrentPasswordError("Current password is required to set a new password.")
        isValid = false
      }
      if (form.newPassword.length < 8) {
        setNewPasswordError("New password must be at least 8 characters.")
        isValid = false
      }
    }

    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    setError("")

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const res = await axios.put("/api/user/update", form)
      setMessage(res.data.message)
      setForm({ ...form, currentPassword: "", newPassword: "" })
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Profile Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your account information and security</p>
      </div>

      <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 text-blue-600" />
            <span>Update Profile</span>
          </CardTitle>
          <CardDescription>Update your personal information and change your password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Personal Information</h3>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    className="pl-10"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>
                {nameError && <p className="text-sm text-red-500 mt-1">{nameError}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
                {emailError && <p className="text-sm text-red-500 mt-1">{emailError}</p>}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Change Password</h3>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="password"
                    name="currentPassword"
                    placeholder="Enter current password"
                    className="pl-10"
                    value={form.currentPassword}
                    onChange={handleChange}
                  />
                </div>
                {currentPasswordError && <p className="text-sm text-red-500 mt-1">{currentPasswordError}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="password"
                    name="newPassword"
                    placeholder="Enter new password"
                    className="pl-10"
                    value={form.newPassword}
                    onChange={handleChange}
                  />
                </div>
                {newPasswordError && <p className="text-sm text-red-500 mt-1">{newPasswordError}</p>}
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full" size="lg">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Profile...
                </>
              ) : (
                "Update Profile"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
