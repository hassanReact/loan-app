import { connectDB } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { Loan } from "@/models/Loan"

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
