import { NextResponse } from "next/server"
import { Support } from "@/models"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/db"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()

    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string }

    if (decoded.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // The admin's ID from the cookie is now available as decoded.id
    // You can use it here if needed, for example:
    // const adminId = decoded.id;
    // console.log("Admin ID from cookie:", adminId);

    const { id } = await params

    const ticket = await Support.findById(id).populate("user")

    if (!ticket) {
      return NextResponse.json({ message: "Ticket not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Ticket fetched successfully", ticket }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
