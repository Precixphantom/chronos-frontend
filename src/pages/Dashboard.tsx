/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import CourseCard from '@/components/CourseCard';
import ProgressChart from '@/components/ProgressChart';
import CourseDialog from '@/components/CourseDialog';
import { Plus } from 'lucide-react';
import { api } from '@/utils/api';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface Course {
  _id: string;
  title: string;
  description: string;
  taskCount: number;
  completedTasks: number;
}

const Dashboard = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCourses = async () => {
  try {
    const coursesData = await api.getCourses(); // ⚡ returns array
    const normalizedCourses = coursesData.map((c: any) => ({
      _id: c._id,
      title: c.title || "Untitled", // map backend field
      description: c.description || "",
      taskCount: c.taskCount || 0,
      completedTasks: c.completedTasks || 0,
    }));
    setCourses(normalizedCourses);
  } catch (error: any) {
    toast.error("Failed to load courses");
  } finally {
    setIsLoading(false);
  }
};


  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateCourse = async (data: { title: string; description: string }) => {
    setIsSubmitting(true);
    try {
      await api.createCourse(data);
      toast.success('Course created successfully!');
      setDialogOpen(false);
      fetchCourses();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create course');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCourse = async (data: { title: string; description: string }) => {
    if (!editingCourse) return;
    
    setIsSubmitting(true);
    try {
      await api.updateCourse(editingCourse._id, data);
      toast.success('Course updated successfully!');
      setDialogOpen(false);
      setEditingCourse(null);
      fetchCourses();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update course');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course? All tasks will be deleted.')) {
      return;
    }

    try {
      await api.deleteCourse(id);
      toast.success('Course deleted successfully');
      fetchCourses();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete course');
    }
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditingCourse(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="mb-2 text-4xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Track your learning progress and manage your courses</p>
        </motion.div>

        {/* Progress Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <ProgressChart courses={courses} />
        </motion.div>

        {/* Courses Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">My Courses</h2>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Course
            </Button>
          </div>

          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 animate-pulse rounded-lg bg-card" />
              ))}
            </div>
          ) : courses.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  onEdit={handleEditCourse}
                  onDelete={handleDeleteCourse}
                />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[300px] items-center justify-center rounded-lg border border-dashed border-border">
              <div className="text-center">
                <p className="mb-4 text-lg text-muted-foreground">
                  No courses yet. Create your first course to get started!
                </p>
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Course
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </main>

      <CourseDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        onSubmit={editingCourse ? handleUpdateCourse : handleCreateCourse}
        course={editingCourse}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default Dashboard;
