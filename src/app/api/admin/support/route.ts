import { connectDB } from '@/lib/db';
import { Support } from '@/models'; // Required for populate
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET() {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string };

    if (decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const tickets = await Support.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json({ tickets }, { status: 200 });
  } catch (error) {
    console.error('Admin get support tickets error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
