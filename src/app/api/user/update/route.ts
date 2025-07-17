import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { cookies } from 'next/headers';
import jwt from "jsonwebtoken";

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string, role: string };
    console.log(decoded);
    const { name, email, currentPassword, newPassword } = await req.json();

    const user = await User.findById(decoded.id);
    // console.log(decoded.userId);
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

    // If changing password, validate current password
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ message: 'Current password is required' }, { status: 400 });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return NextResponse.json({ message: 'Incorrect current password' }, { status: 400 });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    // Update name or email if provided
    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    return NextResponse.json({ message: 'Profile updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
