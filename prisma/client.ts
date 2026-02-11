import { PrismaClient } from '@prisma/client';

// Declare global type for PrismaClient to avoid multiple instances
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Create a single instance of Prisma Client
// In development, use a global variable to preserve the connection across hot reloads
// In production, create a new instance
const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
