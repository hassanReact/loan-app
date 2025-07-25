import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/db"
import { Loan } from "@/models"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string }

    const { id } = await params // Await the params to destructure the id

    const loan = await Loan.findOne({ _id: id, user: decoded.id })
    if (!loan) return NextResponse.json({ message: "Loan not found" }, { status: 404 })

    if (loan.status !== "approved") {
      return NextResponse.json({ message: "Only approved loans can be marked as repaid" }, { status: 400 })
    }

    loan.status = "repaid"
    loan.repaidAt = new Date()
    await loan.save()

    return NextResponse.json({ message: "Loan repaid successfully", loan }, { status: 200 })
  } catch (error) {
    console.error("Repay loan error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
