import React, { useState, useEffect } from 'react';
import taskService from '../services/task.service';
import type { Task } from '../types';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Loader from '../components/common/Loader';
import Navbar from '../components/layout/Navbar';
import { Plus, CheckCircle, Circle, Calendar } from 'lucide-react';

/**
 * Tasks page for managing user tasks
 */
const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // ✏️ Edit state
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const tasksData = await taskService.getTasks();
      setTasks(tasksData);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------- CREATE ----------------
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTaskTitle.trim()) {
      setError('Task title cannot be empty');
      return;
    }

    setIsCreating(true);
    setError('');

    try {
      await taskService.createTask({ title: newTaskTitle });
      await fetchTasks(); // sync with backend

      setNewTaskTitle('');
      setSuccessMessage('Task created successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create task');
    } finally {
      setIsCreating(false);
    }
  };

  // ---------------- COMPLETE ----------------
  const handleCompleteTask = async (taskId: number) => {
    const oldTasks = [...tasks];

    // ⚡ Optimistic UI
    setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: true } : t));

    try {
      await taskService.completeTask(taskId);
      await fetchTasks(); // re-sync (for completed_date & streak logic)
      setSuccessMessage('Task marked as completed!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      // ❌ Rollback
      setTasks(oldTasks);
      setError(err.response?.data?.detail || 'Failed to complete task');
      setTimeout(() => setError(''), 3000);
    }
  };

  // ---------------- DELETE ----------------
  const handleDeleteTask = async (taskId: number) => {
    const oldTasks = [...tasks];

    // ⚡ Optimistic UI
    setTasks(tasks.filter(t => t.id !== taskId));

    try {
      await taskService.deleteTask(taskId);
      setSuccessMessage('Task deleted!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      // ❌ Rollback
      setTasks(oldTasks);
      setError('Failed to delete task');
      setTimeout(() => setError(''), 3000);
    }
  };

  // ---------------- EDIT ----------------
  const startEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingTitle(task.title);
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditingTitle('');
  };

  const saveEdit = async (taskId: number) => {
    if (!editingTitle.trim()) {
      setError("Title cannot be empty");
      return;
    }

    const oldTasks = [...tasks];

    // ⚡ Optimistic UI
    setTasks(tasks.map(t => t.id === taskId ? { ...t, title: editingTitle } : t));
    setEditingTaskId(null);

    try {
      await taskService.updateTask(taskId, editingTitle);
      setSuccessMessage('Task updated!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      // ❌ Rollback
      setTasks(oldTasks);
      setError('Failed to update task');
      setTimeout(() => setError(''), 3000);
    }
  };

  const pendingTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader size="lg" text="Loading tasks..." />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">My Tasks</h1>
            <p className="text-gray-600 mt-2">Organize and track your study tasks</p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {successMessage}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Create Task Form */}
          <Card className="mb-8">
            <form onSubmit={handleCreateTask} className="flex gap-3">
              <Input
                type="text"
                placeholder="Enter a new task..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" variant="primary" isLoading={isCreating}>
                <Plus className="h-5 w-5 mr-1" />
                Add Task
              </Button>
            </form>
          </Card>

          {/* Pending Tasks */}
          <Card title="Pending Tasks" subtitle={`${pendingTasks.length} tasks to complete`} className="mb-6">
            {pendingTasks.length > 0 ? (
              <div className="space-y-3">
                {pendingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <Circle className="h-5 w-5 text-gray-400" />

                      {editingTaskId === task.id ? (
                        <input
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          className="border px-2 py-1 rounded w-full"
                        />
                      ) : (
                        <span className="text-gray-800 font-medium">{task.title}</span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {editingTaskId === task.id ? (
                        <>
                          <Button size="sm" variant="primary" onClick={() => saveEdit(task.id)}>
                            Save
                          </Button>
                          <Button size="sm" variant="secondary" onClick={cancelEdit}>
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" variant="secondary" onClick={() => startEdit(task)}>
                            Edit
                          </Button>

                          <Button size="sm" variant="success" onClick={() => handleCompleteTask(task.id)}>
                            Complete
                          </Button>

                          <Button size="sm" variant="danger" onClick={() => handleDeleteTask(task.id)}>
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Circle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>No pending tasks. Great job!</p>
              </div>
            )}
          </Card>

          {/* Completed Tasks */}
          <Card title="Completed Tasks" subtitle={`${completedTasks.length} tasks completed`}>
            {completedTasks.length > 0 ? (
              <div className="space-y-3">
                {completedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-4 bg-green-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-gray-600 line-through">{task.title}</span>
                    </div>
                    {task.completed_date && (
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(task.completed_date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>No completed tasks yet. Start completing tasks!</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  );
};

export default Tasks;
