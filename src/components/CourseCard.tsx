/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

interface CourseCardProps {
  course: {
    _id: string;
    title: string;
    description: string;
    taskCount?: number;
    completedTasks?: number;
  };
  onEdit: (course: any) => void;
  onDelete: (id: string) => void;
}

const CourseCard = ({ course, onEdit, onDelete }: CourseCardProps) => {
  const progress = course.taskCount 
    ? Math.round((course.completedTasks || 0) / course.taskCount * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full overflow-hidden border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2 text-xl">
                <BookOpen className="h-5 w-5 text-primary" />
                {course.title}
              </CardTitle>
              <CardDescription className="mt-2">{course.description}</CardDescription>
            </div>
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onEdit(course)}
                className="h-8 w-8"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onDelete(course._id)}
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {course.taskCount || 0} {course.taskCount === 1 ? 'task' : 'tasks'}
              </span>
              {course.taskCount > 0 && (
                <span className="font-medium text-primary">{progress}% complete</span>
              )}
            </div>
            {course.taskCount > 0 && (
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-primary to-accent"
                />
              </div>
            )}
            <Link to={`/courses/${course._id}`}>
              <Button className="w-full">View Details</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CourseCard;
