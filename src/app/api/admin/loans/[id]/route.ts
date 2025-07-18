import { connectDB } from "@/lib/db"
import { NextResponse } from "next/server"
import { Loan } from "@/models/Loan"
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
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

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()

    const { id } = await params // Await the params to destructure the id

    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role: string }

    if (decoded.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { status } = await request.json()

    if (!status || !["approved", "rejected"].includes(status)) {
      return NextResponse.json({ message: "Invalid status provided" }, { status: 400 })
    }

    const updatedLoan = await Loan.findByIdAndUpdate(id, { status, updatedAt: new Date() }, { new: true }).populate(
      "user",
      "name email",
    )

    if (!updatedLoan) {
      return NextResponse.json({ message: "Loan not found" }, { status: 404 })
    }

    return NextResponse.json(
      { success: true, message: "Loan status updated successfully", loan: updatedLoan },
      { status: 200 },
    )
  } catch (error) {
    console.error("Admin update loan error:", error)
    return NextResponse.json({ message: "Server Error" }, { status: 500 })
  }
}

