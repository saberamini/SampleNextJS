'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
  assignee: {
    id: string;
    firstName: string;
    lastName: string;
    image: string | null;
  } | null;
  _count: {
    comments: number;
  };
}

interface Milestone {
  id: string;
  name: string;
  description: string | null;
  dueDate: string | null;
  isCompleted: boolean;
  _count: {
    tasks: number;
  };
}

interface TeamMember {
  id: string;
  role: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    image: string | null;
  };
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  startDate: string | null;
  endDate: string | null;
  owner: {
    id: string;
    firstName: string;
    lastName: string;
  };
  members: TeamMember[];
  tasks: Task[];
  milestones: Milestone[];
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [params.id]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/protected/projects/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data);
      } else if (response.status === 404) {
        router.push('/dashboard/projects');
      }
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  if (!project) {
    return null;
  }

  const tasksByStatus = {
    TODO: project.tasks.filter((t) => t.status === 'TODO'),
    IN_PROGRESS: project.tasks.filter((t) => t.status === 'IN_PROGRESS'),
    IN_REVIEW: project.tasks.filter((t) => t.status === 'IN_REVIEW'),
    DONE: project.tasks.filter((t) => t.status === 'DONE'),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link href="/dashboard/projects" className="hover:text-primary-600">
              Projects
            </Link>
            <span>/</span>
            <span>{project.name}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
          {project.description && (
            <p className="mt-2 text-gray-600">{project.description}</p>
          )}
        </div>
        <button
          onClick={() => setShowTaskModal(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Add Task
        </button>
      </div>

      {/* Project info cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Team members */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Team Members</h3>
          <ul className="space-y-3">
            {project.members.map((member) => (
              <li key={member.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-sm font-medium text-primary-700">
                    {member.user.firstName[0]}
                    {member.user.lastName[0]}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {member.user.firstName} {member.user.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{member.user.email}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{member.role}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Milestones */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Milestones</h3>
          {project.milestones.length === 0 ? (
            <p className="text-gray-500 text-sm">No milestones yet</p>
          ) : (
            <ul className="space-y-3">
              {project.milestones.map((milestone) => (
                <li key={milestone.id} className="flex items-start">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                      milestone.isCompleted
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {milestone.isCompleted ? '✓' : '○'}
                  </div>
                  <div className="ml-3">
                    <p
                      className={`text-sm font-medium ${
                        milestone.isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'
                      }`}
                    >
                      {milestone.name}
                    </p>
                    {milestone.dueDate && (
                      <p className="text-xs text-gray-500">
                        Due: {new Date(milestone.dueDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Project stats */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Progress</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Tasks Completed</span>
                <span className="font-medium">
                  {tasksByStatus.DONE.length} / {project.tasks.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{
                    width:
                      project.tasks.length > 0
                        ? `${(tasksByStatus.DONE.length / project.tasks.length) * 100}%`
                        : '0%',
                  }}
                />
              </div>
            </div>
            <div className="pt-2 border-t">
              <p className="text-sm text-gray-600">
                Status:{' '}
                <span className="font-medium text-gray-900">
                  {project.status.replace('_', ' ')}
                </span>
              </p>
              {project.startDate && (
                <p className="text-sm text-gray-600 mt-1">
                  Started: {new Date(project.startDate).toLocaleDateString()}
                </p>
              )}
              {project.endDate && (
                <p className="text-sm text-gray-600 mt-1">
                  Due: {new Date(project.endDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Kanban board */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Tasks</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'] as const).map((status) => (
            <div key={status} className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-3 flex items-center justify-between">
                <span>{status.replace('_', ' ')}</span>
                <span className="text-sm text-gray-500">
                  {tasksByStatus[status].length}
                </span>
              </h4>
              <ul className="space-y-2">
                {tasksByStatus[status].map((task) => (
                  <li
                    key={task.id}
                    className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <p className="font-medium text-gray-900 text-sm">{task.title}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      {task.assignee && (
                        <div
                          className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-xs font-medium text-primary-700"
                          title={`${task.assignee.firstName} ${task.assignee.lastName}`}
                        >
                          {task.assignee.firstName[0]}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
                {tasksByStatus[status].length === 0 && (
                  <li className="text-center text-gray-400 text-sm py-4">
                    No tasks
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Create Task Modal */}
      {showTaskModal && (
        <CreateTaskModal
          projectId={project.id}
          members={project.members}
          milestones={project.milestones}
          onClose={() => setShowTaskModal(false)}
          onCreated={() => {
            setShowTaskModal(false);
            fetchProject();
          }}
        />
      )}
    </div>
  );
}

function CreateTaskModal({
  projectId,
  members,
  milestones,
  onClose,
  onCreated,
}: {
  projectId: string;
  members: TeamMember[];
  milestones: Milestone[];
  onClose: () => void;
  onCreated: () => void;
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    assigneeId: '',
    milestoneId: '',
    dueDate: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/protected/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          projectId,
          assigneeId: formData.assigneeId || null,
          milestoneId: formData.milestoneId || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create task');
      }

      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Task</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Task title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={3}
              placeholder="Task description..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assignee
            </label>
            <select
              value={formData.assigneeId}
              onChange={(e) =>
                setFormData({ ...formData, assigneeId: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Unassigned</option>
              {members.map((member) => (
                <option key={member.user.id} value={member.user.id}>
                  {member.user.firstName} {member.user.lastName}
                </option>
              ))}
            </select>
          </div>

          {milestones.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Milestone
              </label>
              <select
                value={formData.milestoneId}
                onChange={(e) =>
                  setFormData({ ...formData, milestoneId: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">No milestone</option>
                {milestones.map((milestone) => (
                  <option key={milestone.id} value={milestone.id}>
                    {milestone.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
