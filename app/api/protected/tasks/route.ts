import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/prisma/client';

// GET - Fetch tasks (optionally filtered by projectId)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    // Build where clause
    const whereClause: {
      projectId?: string;
      project?: { OR: { ownerId?: string; members?: { some: { userId: string } } }[] };
    } = {};

    if (projectId) {
      whereClause.projectId = projectId;
    }

    // Ensure user has access to the project
    whereClause.project = {
      OR: [
        { ownerId: userId },
        { members: { some: { userId } } },
      ],
    };

    const tasks = await prisma.task.findMany({
      where: whereClause,
      include: {
        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            image: true,
          },
        },
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        milestone: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: { comments: true },
        },
      },
      orderBy: [
        { status: 'asc' },
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { message: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

// POST - Create a new task
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { title, description, projectId, assigneeId, priority, dueDate, milestoneId } = body;

    if (!title || !projectId) {
      return NextResponse.json(
        { message: 'Title and project are required' },
        { status: 400 }
      );
    }

    // Verify user has access to the project
    const membership = await prisma.teamMember.findFirst({
      where: {
        projectId,
        userId,
      },
    });

    if (!membership) {
      return NextResponse.json(
        { message: 'You do not have access to this project' },
        { status: 403 }
      );
    }

    // If assignee is specified, verify they are a project member
    if (assigneeId) {
      const assigneeMembership = await prisma.teamMember.findFirst({
        where: { projectId, userId: assigneeId },
      });

      if (!assigneeMembership) {
        return NextResponse.json(
          { message: 'Assignee is not a member of this project' },
          { status: 400 }
        );
      }
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        projectId,
        creatorId: userId,
        assigneeId: assigneeId || null,
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        milestoneId: milestoneId || null,
      },
      include: {
        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            image: true,
          },
        },
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { message: 'Failed to create task' },
      { status: 500 }
    );
  }
}
