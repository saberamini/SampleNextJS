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

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SampleNextJS
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:
   ```env
   # Database
   DATABASE_URL="postgresql://postgres:password@localhost:5432/capstone_db?schema=public"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

   # OAuth (optional)
   GOOGLE_CLIENT_ID=""
   GOOGLE_CLIENT_SECRET=""
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate

   # Push schema to database
   npm run db:push

   # Seed sample data (optional)
   npm run db:seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the app**

   Visit [http://localhost:3000](http://localhost:3000)

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

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Docker

```bash
docker build -t capstone-manager .
docker run -p 3000:3000 capstone-manager
```

## Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

MIT License - feel free to use this project for learning and educational purposes.
