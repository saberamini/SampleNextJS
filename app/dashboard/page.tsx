'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Project {
  id: string;
  name: string;
  status: string;
  _count: {
    tasks: number;
  };
}

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  project: {
    id: string;
    name: string;
  };
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, tasksRes] = await Promise.all([
          fetch('/api/protected/projects'),
          fetch('/api/protected/tasks'),
        ]);

        if (projectsRes.ok) {
          const projectsData = await projectsRes.json();
          setProjects(projectsData);
        }

        if (tasksRes.ok) {
          const tasksData = await tasksRes.json();
          setTasks(tasksData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const myTasks = tasks.filter((task) => task.status !== 'DONE');
  const completedTasks = tasks.filter((task) => task.status === 'DONE');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TODO':
        return 'bg-gray-100 text-gray-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'IN_REVIEW':
        return 'bg-yellow-100 text-yellow-800';
      case 'DONE':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW':
        return 'text-gray-500';
      case 'MEDIUM':
        return 'text-blue-500';
      case 'HIGH':
        return 'text-orange-500';
      case 'URGENT':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {session?.user.firstName}!
        </h1>
        <p className="mt-1 text-gray-600">
          Here&apos;s an overview of your projects and tasks.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Projects" value={projects.length} icon="📁" color="blue" />
        <StatCard title="Active Tasks" value={myTasks.length} icon="📋" color="yellow" />
        <StatCard title="Completed" value={completedTasks.length} icon="✅" color="green" />
        <StatCard
          title="Total Tasks"
          value={tasks.length}
          icon="📊"
          color="purple"
        />
      </div>

      {/* Recent projects and tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Projects */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Your Projects</h2>
            <Link
              href="/dashboard/projects"
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              View all
            </Link>
          </div>
          {projects.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No projects yet</p>
              <Link
                href="/dashboard/projects/new"
                className="mt-2 inline-block text-primary-600 hover:text-primary-700"
              >
                Create your first project
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {projects.slice(0, 5).map((project) => (
                <li key={project.id}>
                  <Link
                    href={`/dashboard/projects/${project.id}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{project.name}</p>
                      <p className="text-sm text-gray-500">
                        {project._count.tasks} tasks
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                        project.status
                      )}`}
                    >
                      {project.status.replace('_', ' ')}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Tasks */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Active Tasks</h2>
            <Link
              href="/dashboard/tasks"
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              View all
            </Link>
          </div>
          {myTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No active tasks</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {myTasks.slice(0, 5).map((task) => (
                <li key={task.id}>
                  <Link
                    href={`/dashboard/tasks/${task.id}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {task.title}
                      </p>
                      <p className="text-sm text-gray-500">{task.project.name}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <span className={`text-sm ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                          task.status
                        )}`}
                      >
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: string;
  color: 'blue' | 'yellow' | 'green' | 'purple';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
