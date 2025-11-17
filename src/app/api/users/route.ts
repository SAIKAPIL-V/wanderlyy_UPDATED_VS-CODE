import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByUID, getUserByEmail, updateUser } from '@/lib/mongodb-service';

export async function POST(request: NextRequest) {
  try {
    const { uid, email, name, action } = await request.json();

    if (!uid || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: uid and email' },
        { status: 400 }
      );
    }

    if (action === 'create') {
      // Check if user already exists
      const existingUser = await getUserByUID(uid);
      if (existingUser) {
        return NextResponse.json(
          { message: 'User already exists', user: existingUser },
          { status: 200 }
        );
      }

      // Create new user
      const userId = await createUser({ uid, email, name });
      return NextResponse.json(
        { message: 'User created successfully', userId },
        { status: 201 }
      );
    }

    if (action === 'get') {
      const user = await getUserByUID(uid);
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ user }, { status: 200 });
    }

    if (action === 'update') {
      const success = await updateUser(uid, { name, email });
      if (!success) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { message: 'User updated successfully' },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: 'Invalid action. Use: create, get, or update' },
      { status: 400 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
