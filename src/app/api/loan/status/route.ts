import { connectDB } from '@/lib/db';
import { Loan } from '@/models/Loan';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET() {
  try {
    await connectDB();

    const cookieStore = await cookies(); // No await
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      role: string;
    };

    const loans = await Loan.find({ user: decoded.id }).sort({ createdAt: -1 });

    return NextResponse.json({ loans }, { status: 200 });
  } catch (error) {
    console.error('Loan status error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
