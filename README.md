# Capstone Project Manager

A full-stack Next.js application for managing capstone projects. Built as a sample project for students learning modern web development.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS

## Features

- User authentication (email/password + OAuth)
- Project management with team collaboration
- Task tracking with Kanban-style board
- Milestone management
- Role-based access control
- Responsive design

## Getting Started

### Prerequisites

- **Docker Desktop** - That's it! Everything runs in containers.
- Git

### Quick Start (Docker)

1. **Clone the repository**
   ```bash
   git clone https://github.com/saberamini/SampleNextJS.git YourProjectName
   cd YourProjectName
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

3. **Build and run everything with Docker**
   ```bash
   docker compose up --build -d
   ```

4. **Set up the database**
   ```bash
   docker compose exec app npx prisma db push
   docker compose exec app npx prisma db seed
   ```

5. **Open the app**

   Visit [http://localhost:3000](http://localhost:3000)

### Useful Docker Commands

```bash
docker compose logs -f        # View logs
docker compose down           # Stop containers
docker compose up -d          # Start containers
docker compose up --build -d  # Rebuild after code changes
```

### Alternative: Local Development

If you prefer hot-reload for faster development:

```bash
# Start only the database in Docker
docker compose up db -d

# Install dependencies locally (requires Node.js 18+)
npm install

# Set up database
npx prisma migrate dev
npx prisma db seed

# Run with hot-reload
npm run dev
```

### Demo Credentials

After running the seed script, you can use these credentials:

| Email | Password | Role |
|-------|----------|------|
| alice@student.edu | password123 | Student |
| bob@student.edu | password123 | Student |
| carol@student.edu | password123 | Student |
| instructor@college.edu | password123 | Instructor |

## Project Structure

```
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   │   ├── [...nextauth]/ # NextAuth configuration
│   │   │   └── signup/        # User registration
│   │   └── protected/         # Protected API routes
│   │       ├── projects/      # Project CRUD
│   │       ├── tasks/         # Task CRUD
│   │       └── user/          # User profile
│   ├── auth/                   # Auth pages
│   │   ├── signin/
│   │   ├── signup/
│   │   └── error/
│   ├── contexts/              # React Context providers
│   ├── dashboard/             # Protected dashboard pages
│   │   ├── projects/
│   │   ├── tasks/
│   │   └── profile/
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Landing page
│   └── globals.css            # Global styles
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── client.ts              # Prisma client singleton
│   └── seed.ts                # Database seeding
├── middleware.ts              # Route protection
├── tailwind.config.ts
├── next.config.js
└── package.json
```

## Database Schema

### Core Models

- **User**: User accounts with roles (STUDENT, INSTRUCTOR, ADMIN)
- **Project**: Capstone projects with status tracking
- **TeamMember**: Project membership with roles (OWNER, MEMBER, VIEWER)
- **Task**: Individual tasks with status, priority, and assignments
- **Milestone**: Project milestones for tracking progress
- **Comment**: Task comments for collaboration

### Key Relationships

```
User ─┬─ owns ──> Project
      ├─ member ─> TeamMember ──> Project
      ├─ assigned ─> Task
      └─ creates ──> Task, Comment

Project ─┬─ has ──> Task
         ├─ has ──> Milestone
         └─ has ──> TeamMember

Task ─┬─ belongs to ──> Project
      ├─ assigned to ──> User
      ├─ linked to ──> Milestone
      └─ has ──> Comment
```

## API Routes

### Public Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/[...nextauth]` | NextAuth endpoints |

### Protected Routes (requires authentication)

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/protected/projects` | List user's projects |
| POST | `/api/protected/projects` | Create new project |
| GET | `/api/protected/projects/[id]` | Get project details |
| PUT | `/api/protected/projects/[id]` | Update project |
| DELETE | `/api/protected/projects/[id]` | Delete project |
| GET | `/api/protected/tasks` | List tasks |
| POST | `/api/protected/tasks` | Create task |
| GET | `/api/protected/tasks/[id]` | Get task details |
| PUT | `/api/protected/tasks/[id]` | Update task |
| DELETE | `/api/protected/tasks/[id]` | Delete task |
| GET | `/api/protected/user` | Get user profile |
| PUT | `/api/protected/user` | Update user profile |

## Authentication

This project uses NextAuth.js with the following providers:

1. **Credentials** - Email/password authentication
2. **Google OAuth** (optional) - Requires `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
3. **GitHub OAuth** (optional) - Requires `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`

### Session Strategy

Uses JWT tokens with 30-day expiration. Session includes:
- User ID
- Email
- First/Last name
- Role

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database commands
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations
npm run db:seed      # Seed sample data
npm run db:studio    # Open Prisma Studio
```

### Adding New Features

1. **New API Route**: Create file in `app/api/protected/`
2. **New Page**: Create file in `app/dashboard/`
3. **New Database Model**: Update `prisma/schema.prisma` then run `npm run db:generate`

## Deployment

### Docker Compose (Recommended for Development)

```bash
# Run both database and app
docker compose up --build -d

# App is available at http://localhost:3000
```

### Vercel (Production)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables (DATABASE_URL for a hosted PostgreSQL like Supabase or Neon)
4. Deploy

### Docker (Production)

```bash
docker build -t capstone-manager .
docker run -p 3000:3000 -e DATABASE_URL=your-db-url capstone-manager
```

## Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

MIT License - feel free to use this project for learning and educational purposes.
