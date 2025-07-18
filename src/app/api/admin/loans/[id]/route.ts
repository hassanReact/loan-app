import { connectDB } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { Loan } from "@/models/Loan"
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const loan = await Loan.findById(id).populate("user", "name email")
    if (!loan) {
      return NextResponse.json({ success: false, message: "Loan not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true, loan })
  } catch (error) {
    console.error("Loan fetch error:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch loan details" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  await connectDB()
  const { id } = params
  const { status } = await request.json()

  const token = request.cookies.get("token")?.value
  if (!token) {
    return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role: string }
    if (decoded.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 })
    }

    const loan = await Loan.findById(id)

    if (!loan) {
      return NextResponse.json({ success: false, message: "Loan not found" }, { status: 404 })
    }

    loan.status = status

    if (status === "repaid") {
      loan.repaidAt = new Date()
    }
    await loan.save()

    return NextResponse.json({ success: true, message: `Loan status updated to ${status}`, loan })
  } catch (error: unknown) {
    console.error("Error updating loan status:", error)
    return NextResponse.json(
      { success: false, message: (error as Error).message || "Failed to update loan status" },
      { status: 500 },
    )
  }
}
