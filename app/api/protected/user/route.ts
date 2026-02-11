import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/prisma/client';
import bcrypt from 'bcryptjs';

// GET - Fetch current user profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        image: true,
        createdAt: true,
        _count: {
          select: {
            ownedProjects: true,
            memberships: true,
            tasks: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { message: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}

// PUT - Update current user profile
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { firstName, lastName, currentPassword, newPassword } = body;

    // Prepare update data
    const updateData: {
      firstName?: string;
      lastName?: string;
      password?: string;
    } = {};

    if (firstName) updateData.firstName = firstName.trim();
    if (lastName) updateData.lastName = lastName.trim();

    // Handle password change
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { message: 'Current password is required to set a new password' },
          { status: 400 }
        );
      }

      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
      });

      if (!user?.password) {
        return NextResponse.json(
          { message: 'Cannot change password for OAuth accounts' },
          { status: 400 }
        );
      }

      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);

      if (!isCurrentPasswordValid) {
        return NextResponse.json(
          { message: 'Current password is incorrect' },
          { status: 400 }
        );
      }

      if (newPassword.length < 8) {
        return NextResponse.json(
          { message: 'New password must be at least 8 characters long' },
          { status: 400 }
        );
      }

      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        image: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { message: 'Failed to update user profile' },
      { status: 500 }
    );
  }
}
