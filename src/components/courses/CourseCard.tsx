
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Clock, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CourseType } from '@/types/course';

type CourseCardProps = {
  course: CourseType;
  className?: string;
};

const CourseCard = ({ course, className }: CourseCardProps) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/course/${course.id}`);
  };
  
  return (
    <div 
      className={cn(
        "card-res4city cursor-pointer group",
        className
      )}
      onClick={handleClick}
    >
      <div className="aspect-video relative overflow-hidden rounded-xl mb-4">
        <img 
          src={course.thumbnail} 
          alt={course.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        {course.progressPercent !== undefined && (
          <div className="absolute bottom-2 left-2 right-2 bg-background/80 backdrop-blur-sm rounded-lg p-1.5">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${course.progressPercent}%` }}
              />
            </div>
            <p className="text-xs mt-1 text-center font-medium">
              {course.progressPercent}% Complete
            </p>
          </div>
        )}
      </div>
      
      <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors">
        {course.title}
      </h3>
      
      <p className="text-muted-foreground mt-2 text-sm line-clamp-2">
        {course.description}
      </p>
      
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-1" />
          <span>{course.duration}</span>
          <span className="mx-2">•</span>
          <BookOpen className="h-4 w-4 mr-1" />
          <span>{course.lessonCount} lessons</span>
        </div>
        
        <ChevronRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};

export default CourseCard;
