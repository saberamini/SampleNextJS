import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-primary-600">
                Capstone Manager
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/signin"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Manage Your Capstone Project
            <span className="text-primary-600"> Effortlessly</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Collaborate with your team, track tasks, and deliver your capstone project on time.
            Built for students, by students.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="bg-primary-600 text-white hover:bg-primary-700 px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              Start Your Project
            </Link>
            <Link
              href="/auth/signin"
              className="bg-white text-primary-600 border-2 border-primary-600 hover:bg-primary-50 px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything You Need
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              title="Project Management"
              description="Create projects, set milestones, and track progress from start to finish."
              icon="📋"
            />
            <FeatureCard
              title="Team Collaboration"
              description="Invite team members, assign tasks, and communicate effectively."
              icon="👥"
            />
            <FeatureCard
              title="Task Tracking"
              description="Break down work into tasks, set priorities, and never miss a deadline."
              icon="✅"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>Sample Next.js Project for Capstone Course</p>
          <p className="text-sm mt-2">Built with Next.js, PostgreSQL, Prisma, and NextAuth.js</p>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
