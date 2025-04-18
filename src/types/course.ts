
export type LessonType = {
  id: string;
  title: string;
  isCompleted: boolean;
  duration: string;
  videoUrl?: string;
  pdfUrl?: string;
};

export type ModuleType = {
  title: string;
  isCompleted: boolean;
  lessons: LessonType[];
};

export type CourseType = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  lessonCount: number;
  progressPercent: number;
  syllabus?: ModuleType[];
};
