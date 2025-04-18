
import React from 'react';
import { cn } from '@/lib/utils';

type ProgressBarProps = {
  value: number;
  max?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const ProgressBar = ({
  value,
  max = 100,
  showLabel = true,
  size = 'md',
  className
}: ProgressBarProps) => {
  const percent = Math.min(Math.max(0, (value / max) * 100), 100);
  
  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };
  
  return (
    <div className={cn('w-full', className)}>
      <div className="w-full bg-secondary rounded-full overflow-hidden">
        <div
          className={cn(
            'bg-primary transition-all duration-500 ease-out',
            heightClasses[size]
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
      
      {showLabel && (
        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
          <span>{percent.toFixed(0)}% Complete</span>
          <span>{value}/{max}</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
