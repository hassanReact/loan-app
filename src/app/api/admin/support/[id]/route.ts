import { connectDB } from '@/lib/db';
import { Support } from '@/models/Support';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import jwt from "jsonwebtoken"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string, role: string };
  
    if (decoded.role !== 'admin') return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { id } = params;
    const ticket = await Support.findById(id, { status: 'closed' }).populate("user");

    if (!ticket) return NextResponse.json({ message: 'Ticket not found' }, { status: 404 });

    return NextResponse.json({ message: 'Ticket closed', ticket }, { status: 200 });
  } catch (error) {
    console.error('Close support ticket error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
