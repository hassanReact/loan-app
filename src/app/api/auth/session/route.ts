import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { token, userId, role } = await req.json();

    (await cookies()).set('token', token);
    (await cookies()).set('userId', userId);
    (await cookies()).set('role', role);

    return NextResponse.json({ message: 'Session stored' });
}
