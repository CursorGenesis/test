import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { username, password } = await request.json();

        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminUsername || !adminPassword) {
            return NextResponse.json(
                { success: false, error: 'Admin credentials not configured' },
                { status: 500 }
            );
        }

        if (username === adminUsername && password === adminPassword) {
            return NextResponse.json({
                success: true,
                user: {
                    id: 1,
                    name: 'Administrator',
                    username,
                    isAdmin: true,
                    createdAt: new Date().toISOString()
                }
            });
        }

        return NextResponse.json(
            { success: false, error: 'Invalid username or password' },
            { status: 401 }
        );
    } catch {
        return NextResponse.json(
            { success: false, error: 'Server error' },
            { status: 500 }
        );
    }
}
