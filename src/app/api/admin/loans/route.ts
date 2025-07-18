// /api/admin/loans/route.ts
import { connectDB } from '@/lib/db';
import { Loan, User } from '@/models'
import { cookies } from 'next/headers';
import jwt from "jsonwebtoken";
import { NextResponse } from 'next/server';

interface User {
  _id: string
  name: string
  email: string
}

interface LoanType {
  _id: string
  user: User
  amount: number
  reason: string
  documents: string[]
  status: "repaid" | "approved" | "pending" | "rejected"
  withdrawn: boolean
  repaidAmount: number
  createdAt: string
  updatedAt: string
  __v: number
  repaidAt?: string
}


interface LoanFilter {
  status?: string
  // Add other filter properties here as needed in the future
}

export async function GET(req: Request) {
  try {
    await connectDB()

    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role: string }

    if (decoded.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const query = searchParams.get("query")

    const filter: LoanFilter = {}
    if (status) {
      filter.status = status
    }

    // Get all loans first and populate users
    const loans = await Loan.find(filter).populate("user", "name email").sort({ createdAt: -1 })

    // If search query exists, filter based on user name/email
    const filtered = query
      ? loans.filter((loan: LoanType) => {
          // Use LoanType for the loan parameter
          const name = loan.user?.name?.toLowerCase() || ""
          const email = loan.user?.email?.toLowerCase() || ""
          return name.includes(query.toLowerCase()) || email.includes(query.toLowerCase())
        })
      : loans

    return NextResponse.json({ loans: filtered }, { status: 200 })
  } catch (error) {
    console.error("Admin get loans error:", error)
    return NextResponse.json({ message: "Server Error" }, { status: 500 })
  }
}