import { USERS, COURSES } from '../constants';
import { User, Course, Announcement, Module, Lesson } from '../types';
import { MODULE_5, MODULE_6, MODULE_7 } from '../data/coursesData';

// Simulate API delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Agregar módulos restantes al curso principal
const allCourses = [...COURSES];
if (allCourses.length > 0 && allCourses[0].id === 'py-teens') {
  allCourses[0].modules.push(MODULE_5, MODULE_6, MODULE_7);
}

// Storage simulado en localStorage
const STORAGE_KEYS = {
  COURSES: 'app_courses',
  ANNOUNCEMENTS: 'app_announcements',
  PROGRESS: 'app_progress'
};

// Inicializar datos
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.COURSES)) {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(allCourses));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS)) {
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify([]));
  }
};

initializeStorage();

export const mockLogin = async (username: string): Promise<User | null> => {
  await delay(500);
  const user = USERS.find(u => u.name.toLowerCase() === username.toLowerCase());
  if (!user) return null;
  
  // Asignar ID numérico basado en el usuario
  return {
    ...user,
    id: user.role === 'STUDENT' ? 1 : 2, // ID 1 para estudiante, ID 2 para profesor
    email: user.role === 'STUDENT' ? 'estudiante@test.com' : 'profesor@test.com'
  };
};

export const getCourses = async (): Promise<Course[]> => {
  await delay(300);
  const courses = localStorage.getItem(STORAGE_KEYS.COURSES);
  return courses ? JSON.parse(courses) : allCourses;
};

export const getCourseById = async (courseId: string): Promise<Course | null> => {
  await delay(200);
  const courses = await getCourses();
  return courses.find(c => c.id === courseId) || null;
};

export const createCourse = async (course: Omit<Course, 'id' | 'createdAt'>): Promise<Course> => {
  await delay(400);
  const courses = await getCourses();
  const newCourse: Course = {
    ...course,
    id: `course-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  courses.push(newCourse);
  localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  return newCourse;
};

export const updateCourse = async (courseId: string, updates: Partial<Course>): Promise<Course | null> => {
  await delay(400);
  const courses = await getCourses();
  const index = courses.findIndex(c => c.id === courseId);
  if (index === -1) return null;
  
  courses[index] = { ...courses[index], ...updates };
  localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  return courses[index];
};

export const deleteCourse = async (courseId: string): Promise<boolean> => {
  await delay(400);
  const courses = await getCourses();
  const filtered = courses.filter(c => c.id !== courseId);
  if (filtered.length === courses.length) return false;
  
  localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(filtered));
  return true;
};

export const addModuleToCourse = async (courseId: string, module: Omit<Module, 'id'>): Promise<Module | null> => {
  await delay(400);
  const course = await getCourseById(courseId);
  if (!course) return null;
  
  const newModule: Module = {
    ...module,
    id: `module-${Date.now()}`
  };
  
  course.modules.push(newModule);
  await updateCourse(courseId, course);
  return newModule;
};

export const addLessonToModule = async (
  courseId: string,
  moduleId: string,
  lesson: Omit<Lesson, 'id'>
): Promise<Lesson | null> => {
  await delay(400);
  const course = await getCourseById(courseId);
  if (!course) return null;
  
  const module = course.modules.find(m => m.id === moduleId);
  if (!module) return null;
  
  const newLesson: Lesson = {
    ...lesson,
    id: `lesson-${Date.now()}`
  };
  
  module.lessons.push(newLesson);
  await updateCourse(courseId, course);
  return newLesson;
};

// Announcements
export const getAnnouncements = async (): Promise<Announcement[]> => {
  await delay(300);
  const announcements = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
  return announcements ? JSON.parse(announcements) : [];
};

export const createAnnouncement = async (announcement: Omit<Announcement, 'id' | 'date'>): Promise<Announcement> => {
  await delay(400);
  const announcements = await getAnnouncements();
  const newAnnouncement: Announcement = {
    ...announcement,
    id: `announcement-${Date.now()}`,
    date: new Date().toISOString()
  };
  announcements.push(newAnnouncement);
  localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
  return newAnnouncement;
};

export const deleteAnnouncement = async (announcementId: string): Promise<boolean> => {
  await delay(400);
  const announcements = await getAnnouncements();
  const filtered = announcements.filter(a => a.id !== announcementId);
  if (filtered.length === announcements.length) return false;
  
  localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(filtered));
  return true;
};
