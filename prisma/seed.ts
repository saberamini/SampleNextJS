import { PrismaClient, Role, ProjectStatus, TaskStatus, TaskPriority, MemberRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create sample users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const instructor = await prisma.user.upsert({
    where: { email: 'instructor@college.edu' },
    update: {},
    create: {
      email: 'instructor@college.edu',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Smith',
      role: Role.INSTRUCTOR,
      isVerified: true,
    },
  });
  console.log('✅ Created instructor:', instructor.email);

  const student1 = await prisma.user.upsert({
    where: { email: 'alice@student.edu' },
    update: {},
    create: {
      email: 'alice@student.edu',
      password: hashedPassword,
      firstName: 'Alice',
      lastName: 'Johnson',
      role: Role.STUDENT,
      isVerified: true,
    },
  });
  console.log('✅ Created student:', student1.email);

  const student2 = await prisma.user.upsert({
    where: { email: 'bob@student.edu' },
    update: {},
    create: {
      email: 'bob@student.edu',
      password: hashedPassword,
      firstName: 'Bob',
      lastName: 'Williams',
      role: Role.STUDENT,
      isVerified: true,
    },
  });
  console.log('✅ Created student:', student2.email);

  const student3 = await prisma.user.upsert({
    where: { email: 'carol@student.edu' },
    update: {},
    create: {
      email: 'carol@student.edu',
      password: hashedPassword,
      firstName: 'Carol',
      lastName: 'Davis',
      role: Role.STUDENT,
      isVerified: true,
    },
  });
  console.log('✅ Created student:', student3.email);

  // Create a sample project
  const project = await prisma.project.upsert({
    where: { id: 'sample-project-1' },
    update: {},
    create: {
      id: 'sample-project-1',
      name: 'E-Commerce Platform',
      description: 'A full-stack e-commerce platform with user authentication, product catalog, shopping cart, and payment processing.',
      status: ProjectStatus.IN_PROGRESS,
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-04-30'),
      ownerId: student1.id,
    },
  });
  console.log('✅ Created project:', project.name);

  // Add team members
  await prisma.teamMember.upsert({
    where: { projectId_userId: { projectId: project.id, userId: student1.id } },
    update: {},
    create: {
      projectId: project.id,
      userId: student1.id,
      role: MemberRole.OWNER,
    },
  });

  await prisma.teamMember.upsert({
    where: { projectId_userId: { projectId: project.id, userId: student2.id } },
    update: {},
    create: {
      projectId: project.id,
      userId: student2.id,
      role: MemberRole.MEMBER,
    },
  });

  await prisma.teamMember.upsert({
    where: { projectId_userId: { projectId: project.id, userId: student3.id } },
    update: {},
    create: {
      projectId: project.id,
      userId: student3.id,
      role: MemberRole.MEMBER,
    },
  });
  console.log('✅ Added team members');

  // Create milestones
  const milestone1 = await prisma.milestone.upsert({
    where: { id: 'milestone-1' },
    update: {},
    create: {
      id: 'milestone-1',
      name: 'Phase 1: Foundation',
      description: 'Set up project infrastructure, authentication, and basic UI components',
      dueDate: new Date('2024-02-15'),
      projectId: project.id,
      isCompleted: true,
    },
  });

  const milestone2 = await prisma.milestone.upsert({
    where: { id: 'milestone-2' },
    update: {},
    create: {
      id: 'milestone-2',
      name: 'Phase 2: Core Features',
      description: 'Implement product catalog, shopping cart, and checkout flow',
      dueDate: new Date('2024-03-15'),
      projectId: project.id,
      isCompleted: false,
    },
  });

  const milestone3 = await prisma.milestone.upsert({
    where: { id: 'milestone-3' },
    update: {},
    create: {
      id: 'milestone-3',
      name: 'Phase 3: Polish & Deploy',
      description: 'Testing, bug fixes, documentation, and deployment',
      dueDate: new Date('2024-04-30'),
      projectId: project.id,
      isCompleted: false,
    },
  });
  console.log('✅ Created milestones');

  // Create sample tasks
  const tasks = [
    {
      id: 'task-1',
      title: 'Set up Next.js project with TypeScript',
      description: 'Initialize the Next.js project with TypeScript configuration and folder structure.',
      status: TaskStatus.DONE,
      priority: TaskPriority.HIGH,
      projectId: project.id,
      assigneeId: student1.id,
      creatorId: student1.id,
      milestoneId: milestone1.id,
    },
    {
      id: 'task-2',
      title: 'Configure PostgreSQL database with Prisma',
      description: 'Set up Prisma ORM and design the database schema for users, products, and orders.',
      status: TaskStatus.DONE,
      priority: TaskPriority.HIGH,
      projectId: project.id,
      assigneeId: student2.id,
      creatorId: student1.id,
      milestoneId: milestone1.id,
    },
    {
      id: 'task-3',
      title: 'Implement user authentication',
      description: 'Set up NextAuth.js with credentials provider and Google OAuth.',
      status: TaskStatus.DONE,
      priority: TaskPriority.HIGH,
      projectId: project.id,
      assigneeId: student1.id,
      creatorId: student1.id,
      milestoneId: milestone1.id,
    },
    {
      id: 'task-4',
      title: 'Build product listing page',
      description: 'Create a responsive product grid with filtering and sorting options.',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      projectId: project.id,
      assigneeId: student2.id,
      creatorId: student1.id,
      milestoneId: milestone2.id,
    },
    {
      id: 'task-5',
      title: 'Implement shopping cart',
      description: 'Build shopping cart functionality with add/remove items and quantity management.',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      projectId: project.id,
      assigneeId: student3.id,
      creatorId: student1.id,
      milestoneId: milestone2.id,
    },
    {
      id: 'task-6',
      title: 'Create checkout flow',
      description: 'Design and implement the multi-step checkout process.',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      projectId: project.id,
      assigneeId: student1.id,
      creatorId: student1.id,
      milestoneId: milestone2.id,
    },
    {
      id: 'task-7',
      title: 'Write unit tests',
      description: 'Create comprehensive unit tests for all components and API routes.',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      projectId: project.id,
      assigneeId: student3.id,
      creatorId: student1.id,
      milestoneId: milestone3.id,
    },
    {
      id: 'task-8',
      title: 'Deploy to production',
      description: 'Set up CI/CD pipeline and deploy the application to Vercel.',
      status: TaskStatus.TODO,
      priority: TaskPriority.LOW,
      projectId: project.id,
      assigneeId: null,
      creatorId: student1.id,
      milestoneId: milestone3.id,
    },
  ];

  for (const task of tasks) {
    await prisma.task.upsert({
      where: { id: task.id },
      update: {},
      create: task,
    });
  }
  console.log('✅ Created tasks');

  // Create sample comments
  await prisma.comment.upsert({
    where: { id: 'comment-1' },
    update: {},
    create: {
      id: 'comment-1',
      content: 'I\'ve completed the initial setup. The project structure follows the Next.js App Router pattern.',
      taskId: 'task-1',
      authorId: student1.id,
    },
  });

  await prisma.comment.upsert({
    where: { id: 'comment-2' },
    update: {},
    create: {
      id: 'comment-2',
      content: 'Database schema looks good! I\'ve added indexes for better query performance.',
      taskId: 'task-2',
      authorId: student2.id,
    },
  });

  await prisma.comment.upsert({
    where: { id: 'comment-3' },
    update: {},
    create: {
      id: 'comment-3',
      content: 'Working on the product grid. Should we use server-side rendering or client-side filtering?',
      taskId: 'task-4',
      authorId: student2.id,
    },
  });

  await prisma.comment.upsert({
    where: { id: 'comment-4' },
    update: {},
    create: {
      id: 'comment-4',
      content: 'Let\'s use server-side rendering for the initial load and client-side for filtering. That gives us the best of both worlds.',
      taskId: 'task-4',
      authorId: student1.id,
    },
  });
  console.log('✅ Created comments');

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
