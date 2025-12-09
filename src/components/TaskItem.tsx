import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Clock, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface TaskItemProps {
  task: {
    _id: string;
    goal: string;
    deadline: string;
    completed: boolean;
  };
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

const TaskItem = ({ task, onToggle, onDelete }: TaskItemProps) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isOverdue, setIsOverdue] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const deadline = new Date(task.deadline).getTime();
      const now = new Date().getTime();
      const difference = deadline - now;

      if (difference < 0) {
        setIsOverdue(true);
        setTimeLeft('Overdue');
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${minutes}m`);
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [task.deadline]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      layout
    >
      <Card className={`p-4 transition-all ${task.completed ? 'bg-card/50' : 'bg-card'}`}>
        <div className="flex items-center gap-4">
          <Checkbox
            checked={task.completed}
            onCheckedChange={(checked) => onToggle(task._id, checked as boolean)}
            className="h-5 w-5"
          />
          
          <div className="flex-1">
            <p className={`font-medium ${task.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
              {task.goal}
            </p>
            <div className="mt-1 flex items-center gap-2 text-sm">
              {task.completed ? (
                <span className="flex items-center gap-1 text-success">
                  <CheckCircle2 className="h-4 w-4" />
                  Completed
                </span>
              ) : (
                <span className={`flex items-center gap-1 ${isOverdue ? 'text-destructive' : 'text-warning'}`}>
                  <Clock className="h-4 w-4" />
                  {timeLeft}
                </span>
              )}
              <span className="text-muted-foreground">
                • {new Date(task.deadline).toLocaleDateString()}
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(task._id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default TaskItem;
