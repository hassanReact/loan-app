import { connectDB } from '@/lib/db';
import { Support } from '@/models/Support';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string, role: string };
    const { subject, message } = await req.json();

    if (!subject || !message) {
      return NextResponse.json({ message: 'Subject and message are required' }, { status: 400 });
    }

    const ticket = await Support.create({ user: decoded.id, subject, message });

    return NextResponse.json({ message: 'Support request submitted', ticket }, { status: 201 });
  } catch (error) {
    console.error('Support request error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
