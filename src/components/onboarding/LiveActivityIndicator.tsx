import { useEffect, useState } from 'react';
import { Users, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LiveActivityIndicatorProps {
  className?: string;
  variant?: 'compact' | 'full';
}

// Simulated live activity for social proof
const generateActivity = () => {
  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Chennai', 'Hyderabad', 'Kolkata', 'Ahmedabad'];
  const actions = ['started investing', 'completed profile', 'opened account', 'set up SIP'];
  const names = ['Rahul', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Neha', 'Rohit', 'Anjali'];
  
  return {
    name: names[Math.floor(Math.random() * names.length)],
    city: cities[Math.floor(Math.random() * cities.length)],
    action: actions[Math.floor(Math.random() * actions.length)],
    timeAgo: Math.floor(Math.random() * 5) + 1,
  };
};

export function LiveActivityIndicator({ className, variant = 'compact' }: LiveActivityIndicatorProps) {
  const [activity, setActivity] = useState(generateActivity());
  const [isVisible, setIsVisible] = useState(false);
  const [activeUsers, setActiveUsers] = useState(Math.floor(Math.random() * 30) + 15);

  useEffect(() => {
    // Show indicator after a short delay
    const showTimer = setTimeout(() => setIsVisible(true), 2000);
    
    // Update activity periodically
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setActivity(generateActivity());
        setActiveUsers(prev => prev + Math.floor(Math.random() * 3) - 1);
        setIsVisible(true);
      }, 300);
    }, 8000);

    return () => {
      clearTimeout(showTimer);
      clearInterval(interval);
    };
  }, []);

  if (variant === 'compact') {
    return (
      <div className={cn(
        "flex items-center gap-2 text-xs text-muted-foreground transition-opacity duration-300",
        isVisible ? "opacity-100" : "opacity-0",
        className
      )}>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
        </span>
        <span>{activeUsers} investors online now</span>
      </div>
    );
  }

  return (
    <div className={cn(
      "bg-gradient-to-r from-success/10 to-success/5 border border-success/20 rounded-lg px-4 py-2 transition-all duration-500",
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2",
      className
    )}>
      <div className="flex items-center gap-3">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success"></span>
        </span>
        <div className="flex-1">
          <p className="text-sm text-foreground">
            <strong>{activity.name}</strong> from {activity.city} just {activity.action}
          </p>
          <p className="text-xs text-muted-foreground">{activity.timeAgo} min ago</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-success">
          <Users className="w-3 h-3" />
          <span>{activeUsers} online</span>
        </div>
      </div>
    </div>
  );
}
