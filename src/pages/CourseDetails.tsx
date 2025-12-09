/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import TaskItem from '@/components/TaskItem';
import TaskDialog from '@/components/TaskDialog';
import { Plus, ArrowLeft, BookOpen } from 'lucide-react';
import { api } from '@/utils/api';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface Task {
  _id: string;
  goal: string;
  deadline: string;
  completed: boolean;
}

interface Course {
  _id: string;
  title: string;
  description: string;
}

const CourseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ------------------ Step 1: Validate ID ------------------
  useEffect(() => {
    if (!id || id === 'undefined') {
      toast.error("Invalid course ID. Redirecting to dashboard...");
      navigate('/dashboard', { replace: true });
    }
  }, [id]);

  // ------------------ Step 2: Fetch Data ------------------
  const fetchData = async () => {
    if (!id || id === 'undefined') return;

    try {
      const [courseData, tasksData] = await Promise.all([
        api.getCourse(id),
        api.getTasksByCourse(id),
      ]);

      if (!courseData) throw new Error("Course not found");

      setCourse(courseData);
      setTasks(tasksData || []);
    } catch (error: any) {
      console.error(error);
      setCourse(null);
      setTasks([]);
      toast.error(error.message || 'Failed to load course details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // ------------------ Step 3: Task Handlers ------------------
  const handleCreateTask = async (data: { goal: string; deadline: string }) => {
    if (!id) return;

    setIsSubmitting(true);
    try {
      await api.createTask({ ...data, course: id });
      toast.success('Task created successfully!');
      setDialogOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleTask = async (taskId: string, completed: boolean) => {
    try {
      await api.updateTask(taskId, { completed });
      setTasks(tasks.map(task => task._id === taskId ? { ...task, completed } : task));
      toast.success(completed ? 'Task completed!' : 'Task marked as incomplete');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      await api.deleteTask(taskId);
      setTasks(tasks.filter(task => task._id !== taskId));
      toast.success('Task deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete task');
    }
  };

  // ------------------ Step 4: Progress Calculation ------------------
  const completedTasks = tasks.filter(task => task.completed).length;
  const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  // ------------------ Step 5: Loading State ------------------
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="h-8 w-48 animate-pulse rounded bg-card" />
        </div>
      </div>
    );
  }

  // ------------------ Step 6: Course Not Found ------------------
  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-muted-foreground">Course not found</p>
          <Link to="/dashboard">
            <Button className="mt-4">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  // ------------------ Step 7: Render UI ------------------
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          
          {/* Back Button */}
          <Link to="/dashboard">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>

          {/* Course Title */}
          <div className="mb-8">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="mb-2 flex items-center gap-2 text-4xl font-bold">
                  <BookOpen className="h-8 w-8 text-primary" />
                  {course.title}
                </h1>
                <p className="text-lg text-muted-foreground">{course.description}</p>
              </div>
            </div>

            {/* Progress Card */}
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Overall Progress</p>
                    <p className="text-3xl font-bold text-primary">{progress}%</p>
                    <p className="text-sm text-muted-foreground">
                      {completedTasks} of {tasks.length} tasks completed
                    </p>
                  </div>
                  <div className="h-20 w-20">
                    <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="hsl(var(--secondary))"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="hsl(var(--primary))"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${progress * 2.51327} 251.327`}
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tasks Section */}
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Tasks</h2>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </div>

            {tasks.length > 0 ? (
              <div className="space-y-4">
                {tasks.map(task => (
                  <TaskItem
                    key={task._id || Math.random()}
                    task={task}
                    onToggle={handleToggleTask}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>
            ) : (
              <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed border-border">
                <div className="text-center">
                  <p className="mb-4 text-lg text-muted-foreground">
                    No tasks yet. Add your first task to get started!
                  </p>
                  <Button onClick={() => setDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Task
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </main>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleCreateTask}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default CourseDetails;
