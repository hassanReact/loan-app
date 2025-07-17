import { connectDB } from "@/lib/db"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { Support } from "@/models/Support"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()

    const { id } = await params

    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }

    // Find ticket that belongs to the user
    const ticket = await Support.findOne({ _id: id, user: decoded.id }).populate(
      "replies.sender",
      "name email role",
    )

    if (!ticket) {
      return NextResponse.json({ success: false, message: "Support ticket not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      ticket,
    })
  } catch (error) {
    console.error("Support ticket fetch error:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch support ticket" }, { status: 500 })
  }
}
