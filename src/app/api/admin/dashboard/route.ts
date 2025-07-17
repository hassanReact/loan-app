import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { User, Loan, Support } from "@/models"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    // Get current date for filtering
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    // Get total users
    const totalUsers = await User.countDocuments({ role: "user" })
    const lastMonthUsers = await User.countDocuments({
      role: "user",
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
    })
    const thisMonthUsers = await User.countDocuments({
      role: "user",
      createdAt: { $gte: startOfMonth },
    })
    const userGrowth =
      lastMonthUsers > 0 ? (((thisMonthUsers - lastMonthUsers) / lastMonthUsers) * 100).toFixed(1) : "0"

    // Get active loans (approved but not repaid)
    const activeLoans = await Loan.countDocuments({
      status: { $in: ["approved"] },
    })
    const lastMonthActiveLoans = await Loan.countDocuments({
      status: "approved",
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
    })
    const thisMonthActiveLoans = await Loan.countDocuments({
      status: "approved",
      createdAt: { $gte: startOfMonth },
    })
    const loanGrowth =
      lastMonthActiveLoans > 0
        ? (((thisMonthActiveLoans - lastMonthActiveLoans) / lastMonthActiveLoans) * 100).toFixed(1)
        : "0"

    // Get total disbursed amount
    const disbursedResult = await Loan.aggregate([
      { $match: { status: { $in: ["approved", "repaid"] } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ])
    const totalDisbursed = disbursedResult[0]?.total || 0

    // Get last month disbursed
    const lastMonthDisbursed = await Loan.aggregate([
      {
        $match: {
          status: { $in: ["approved", "repaid"] },
          createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ])
    const lastMonthAmount = lastMonthDisbursed[0]?.total || 0

    // Get this month disbursed
    const thisMonthDisbursed = await Loan.aggregate([
      {
        $match: {
          status: { $in: ["approved", "repaid"] },
          createdAt: { $gte: startOfMonth },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ])
    const thisMonthAmount = thisMonthDisbursed[0]?.total || 0
    const disbursedGrowth =
      lastMonthAmount > 0 ? (((thisMonthAmount - lastMonthAmount) / lastMonthAmount) * 100).toFixed(1) : "0"

    // Calculate approval rate
    const totalApplications = await Loan.countDocuments()
    const approvedApplications = await Loan.countDocuments({ status: { $in: ["approved", "repaid"] } })
    const approvalRate = totalApplications > 0 ? ((approvedApplications / totalApplications) * 100).toFixed(1) : "0"

    // Get recent activity (last 10 activities)
    const recentLoans = await Loan.find().populate("user", "name email").sort({ createdAt: -1 }).limit(5)

    const recentUsers = await User.find({ role: "user" }).sort({ createdAt: -1 }).limit(3)

    const recentSupport = await Support.find().populate("user", "name email").sort({ createdAt: -1 }).limit(2)

    // Format recent activity
    const recentActivity: { type: string; user: any; amount: string | null; time: string; icon: string; color: string }[] = []

    // Add loan activities
    recentLoans.forEach((loan) => {
      if (loan.status === "approved") {
        recentActivity.push({
          type: "loan_approved",
          user: loan.user?.name || "Unknown User",
          amount: `$${loan.amount?.toLocaleString()}`,
          time: getTimeAgo(loan.updatedAt),
          icon: "CheckCircle",
          color: "text-green-600",
        })
      } else if (loan.status === "pending") {
        recentActivity.push({
          type: "loan_pending",
          user: loan.user?.name || "Unknown User",
          amount: `$${loan.amount?.toLocaleString()}`,
          time: getTimeAgo(loan.createdAt),
          icon: "Clock",
          color: "text-yellow-600",
        })
      }
    })

    // Add new user activities
    recentUsers.forEach((user) => {
      recentActivity.push({
        type: "new_user",
        user: user.name || "Unknown User",
        amount: null,
        time: getTimeAgo(user.createdAt),
        icon: "Users",
        color: "text-blue-600",
      })
    })

    // Add support ticket activities
    recentSupport.forEach((ticket) => {
      recentActivity.push({
        type: "support_ticket",
        user: ticket.user?.name || "Unknown User",
        amount: null,
        time: getTimeAgo(ticket.createdAt),
        icon: "AlertTriangle",
        color: "text-red-600",
      })
    })

    // Sort by most recent and limit to 10
    recentActivity.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    const limitedActivity = recentActivity.slice(0, 10)

    const stats = {
      totalUsers: {
        value: totalUsers.toLocaleString(),
        change: `+${userGrowth}%`,
        icon: "Users",
        color: "text-blue-600",
        bgColor: "bg-blue-100 dark:bg-blue-900",
      },
      activeLoans: {
        value: activeLoans.toLocaleString(),
        change: `+${loanGrowth}%`,
        icon: "FileText",
        color: "text-green-600",
        bgColor: "bg-green-100 dark:bg-green-900",
      },
      totalDisbursed: {
        value: `$${(totalDisbursed / 1000000).toFixed(1)}M`,
        change: `+${disbursedGrowth}%`,
        icon: "DollarSign",
        color: "text-purple-600",
        bgColor: "bg-purple-100 dark:bg-purple-900",
      },
      approvalRate: {
        value: `${approvalRate}%`,
        change: "+2%",
        icon: "TrendingUp",
        color: "text-orange-600",
        bgColor: "bg-orange-100 dark:bg-orange-900",
      },
    }

    return NextResponse.json({
      success: true,
      stats,
      recentActivity: limitedActivity,
    })
  } catch (error) {
    console.error("Admin dashboard API error:", error)
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

  if (diffInMinutes < 1) return "just now"
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`
  if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`
  return new Date(date).toLocaleDateString()
}
