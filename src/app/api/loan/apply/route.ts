import { connectDB } from '@/lib/db';
import { Loan } from '@/models/Loan';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      role: string;
    };

    const body = await req.json();
    const { amount, reason, documents } = body;

    if (!amount || !reason || !documents || documents.length !== 5) {
      return NextResponse.json(
        { message: 'All fields and exactly 5 documents are required' },
        { status: 400 }
      );
    }

    const loan = await Loan.create({
      user: decoded.id,
      amount,
      reason,
      documents,
    });

    return NextResponse.json({ message: 'Loan applied successfully', loan }, { status: 201 });
  } catch (err) {
    console.error('Loan apply error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
