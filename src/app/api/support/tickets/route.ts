import { connectDB } from "@/lib/db"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { Support } from "@/models/Support"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }

    // Get user's support tickets with admin replies
    const tickets = await Support.find({ user: decoded.id })
      .populate("replies.sender", "name email role")
      .sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      tickets,
    })
  } catch (error) {
    console.error("User support tickets fetch error:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch support tickets" }, { status: 500 })
  }
}
