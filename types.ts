// Define shared data structures for the application.
export interface User {
  id: number;
  name: string;
  role: 'STUDENT' | 'PROFESSOR'; // Actualizado para coincidir con el backend
  email?: string;
  progress?: StudentProgress[];
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  codeExample: string;
  exercises?: Exercise[];
  completed?: boolean;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  weekRange: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  modules: Module[];
  createdBy?: string;
  createdAt?: string;
}

export interface Exercise {
  id: string;
  description: string;
  initialCode?: string;
  solution?: string;
  hints?: string[];
}

export interface StudentProgress {
  courseId: string;
  completedLessons: string[];
  score: number;
  lastAccessed: string;
}

export interface Question {
  id: string;
  text: string;
  answer: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  date: string;
  teacherId: string;
  courseId?: string;
}
