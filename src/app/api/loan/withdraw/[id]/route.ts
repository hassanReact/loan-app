import { connectDB } from '@/lib/db';
import { Loan } from '@/models/Loan';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import jwt from "jsonwebtoken"

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string, role: string };
    const { id } = params;

    const loan = await Loan.findOne({ _id: id, user: decoded.id });
    if (!loan) return NextResponse.json({ message: 'Loan not found' }, { status: 404 });

    if (loan.status !== 'pending') {
      return NextResponse.json({ message: 'Only pending loans can be withdrawn' }, { status: 400 });
    }

    loan.status = 'withdrawn';
    await loan.save();

    return NextResponse.json({ message: 'Loan withdrawn successfully', loan }, { status: 200 });
  } catch (error) {
    console.error('Withdraw loan error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
