import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface ProgressChartProps {
  courses: Array<{
    title: string;
    taskCount: number;
    completedTasks: number;
  }>;
}

const ProgressChart = ({ courses }: ProgressChartProps) => {
  const data = courses.map(course => ({
    name: course.title.length > 15 ? course.title.substring(0, 15) + '...' : course.title,
    completed: course.completedTasks || 0,
    total: course.taskCount || 0,
    progress: course.taskCount > 0 ? Math.round((course.completedTasks || 0) / course.taskCount * 100) : 0,
  }));

  const totalTasks = courses.reduce((sum, course) => sum + (course.taskCount || 0), 0);
  const completedTasks = courses.reduce((sum, course) => sum + (course.completedTasks || 0), 0);
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Study Progress
            </CardTitle>
            <CardDescription>Your overall course completion</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">{overallProgress}%</div>
            <div className="text-sm text-muted-foreground">
              {completedTasks}/{totalTasks} tasks
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Bar dataKey="completed" radius={[8, 8, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.progress === 100 ? 'hsl(var(--success))' : 'hsl(var(--primary))'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            No courses yet. Create your first course to see progress!
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProgressChart;
