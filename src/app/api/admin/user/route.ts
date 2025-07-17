
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(req: Request) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role: string };
    if (decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');
    const role = searchParams.get('role');

    const filter: any = {};

    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
      ];
    }

    if (role) {
      filter.role = role;
    }

    const users = await User.find(filter).sort({ createdAt: -1 });

    return NextResponse.json({ users }, { status: 200 });

  } catch (error) {
    console.error('Admin get users error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
