import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import type { NextRequest } from "next/server"
import { connectDB } from "@/lib/db"
import { Support } from "@/models"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params // Await the params to destructure the id

    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string
      role: string
    }

    if (decoded.role !== "admin") {
      return NextResponse.json({ message: "Only admin can reply" }, { status: 403 })
    }

    const { message } = await req.json()

    if (!message) return NextResponse.json({ message: "Message required" }, { status: 400 })

    const ticket = await Support.findById(id) // Use the destructured id

    if (!ticket) return NextResponse.json({ message: "Support ticket not found" }, { status: 404 })

    ticket.replies.push({
      sender: decoded.id,
      message,
    })

    await ticket.save()

    return NextResponse.json({ message: "Reply added", ticket }, { status: 201 })
  } catch (err) {
    console.error("Reply error:", err)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
