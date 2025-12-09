import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import { 
  BookOpen, 
  Target, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  BarChart3,
  Zap,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';

const Landing = () => {
  const features = [
    {
      icon: Target,
      title: 'Goal-Oriented Learning',
      description: 'Set clear learning objectives and track your progress towards achieving them.',
    },
    {
      icon: Clock,
      title: 'Smart Deadlines',
      description: 'Stay on track with intelligent countdown timers for all your tasks.',
    },
    {
      icon: TrendingUp,
      title: 'Progress Visualization',
      description: 'Beautiful charts show your learning journey at a glance.',
    },
    {
      icon: CheckCircle2,
      title: 'Task Management',
      description: 'Organize unlimited tasks per course with completion tracking.',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Comprehensive insights into your study patterns and achievements.',
    },
    {
      icon: Award,
      title: 'Stay Motivated',
      description: 'Watch your progress grow and celebrate every milestone.',
    },
  ];

  const benefits = [
    'Never miss a study deadline again',
    'Visualize your learning progress',
    'Stay organized across multiple courses',
    'Build consistent study habits',
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2"
          >
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Your Smart Study Companion</span>
          </motion.div>

          <h1 className="mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-6xl lg:text-7xl">
            Master Your Learning Journey
          </h1>
          
          <p className="mb-10 text-xl text-muted-foreground md:text-2xl">
            Track courses, manage tasks, and visualize your progress with our powerful study management platform.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="h-12 px-8 text-lg">
                Get Started Free
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
                Sign In
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Everything You Need to Excel
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful features designed for serious students
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Why Students Choose StudyTracker
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of students who've transformed their study habits
            </p>
          </motion.div>

          <Card className="border-border bg-card/50 backdrop-blur">
            <CardContent className="p-8">
              <div className="grid gap-6 md:grid-cols-2">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-1 flex-shrink-0">
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    </div>
                    <p className="text-lg">{benefit}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto max-w-4xl"
        >
          <Card className="overflow-hidden border-primary/50 bg-gradient-to-br from-card via-card to-primary/5">
            <CardContent className="p-12 text-center">
              <BookOpen className="mx-auto mb-6 h-16 w-16 text-primary" />
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                Ready to Transform Your Studies?
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                Start tracking your learning journey today. It's free and takes less than a minute.
              </p>
              <Link to="/signup">
                <Button size="lg" className="h-12 px-8 text-lg">
                  Create Your Free Account
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 StudyTracker. Built for students, by students.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
