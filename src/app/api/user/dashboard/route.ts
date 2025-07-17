import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { User, Loan, Support } from "@/models"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    // Get user from token
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const userId = decoded.id

    // Get user details
    const user = await User.findById(userId).select("-password")
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    // Get user's loans
    const userLoans = await Loan.find({ user: userId }).sort({ createdAt: -1 })

    // Calculate stats
    const activeLoans = userLoans.filter((loan) => loan.status === "approved").length
    const pendingApplications = userLoans.filter((loan) => loan.status === "pending").length
    const completedPayments = userLoans.filter((loan) => loan.status === "repaid").length

    const stats = [
      {
        title: "Active Loans",
        value: activeLoans.toString(),
        icon: "TrendingUp",
        color: "text-blue-600",
      },
      {
        title: "Pending Applications",
        value: pendingApplications.toString(),
        icon: "Clock",
        color: "text-yellow-600",
      },
      {
        title: "Completed Payments",
        value: completedPayments.toString(),
        icon: "CheckCircle",
        color: "text-green-600",
      },
    ]

    // Get recent activity (last 5 loan activities)
    const recentActivity = userLoans.slice(0, 5).map((loan) => {
      let activityType = ""
      let description = ""
      let icon = "FileText"
      let color = "text-blue-600"

      switch (loan.status) {
        case "approved":
          activityType = "Loan Application Approved"
          description = `Your loan of $${loan.amount?.toLocaleString()} has been approved`
          icon = "CheckCircle"
          color = "text-green-600"
          break
        case "pending":
          activityType = "Application Submitted"
          description = `Loan application for $${loan.amount?.toLocaleString()} is under review`
          icon = "Clock"
          color = "text-yellow-600"
          break
        case "repaid":
          activityType = "Loan Repaid"
          description = `Successfully repaid loan of $${loan.amount?.toLocaleString()}`
          icon = "CheckCircle"
          color = "text-blue-600"
          break
        case "rejected":
          activityType = "Application Rejected"
          description = `Loan application for $${loan.amount?.toLocaleString()} was not approved`
          icon = "XCircle"
          color = "text-red-600"
          break
        default:
          activityType = "Loan Activity"
          description = `Loan application for $${loan.amount?.toLocaleString()}`
      }

      return {
        type: activityType,
        description,
        time: getTimeAgo(loan.updatedAt || loan.createdAt),
        icon,
        color,
      }
    })

    return NextResponse.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
      },
      stats,
      recentActivity,
    })
  } catch (error) {
    console.error("User dashboard API error:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch dashboard data" }, { status: 500 })
  }
}

// Helper function to calculate time ago
function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffInMs = now.getTime() - new Date(date).getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  const diffInWeeks = Math.floor(diffInDays / 7)

  if (diffInMinutes < 1) return "just now"
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`
  if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`
  if (diffInWeeks < 4) return `${diffInWeeks} week${diffInWeeks > 1 ? "s" : ""} ago`
  return new Date(date).toLocaleDateString()
}