import React, { useState, useEffect, useContext } from 'react';
import Sidebar from '../components/Sidebar';
import LessonContent from '../components/LessonContent';
import PythonConsole from '../components/PythonConsole';
import LessonQA from '../components/LessonQA';
import ThemeToggle from '../components/ThemeToggle';
import StudentAnnouncements from '../components/StudentAnnouncements';
import StudentMessaging from '../components/StudentMessaging';
import { getCourses } from '../services/mockAPIService';
import { Course, Lesson, Module } from '../types';
import { AuthContext } from '../contexts/AuthContext';
import { SendIcon } from '../components/icons';

const StudentDashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showMessaging, setShowMessaging] = useState(false);
  const { logout, user } = useContext(AuthContext);

  useEffect(() => {
    const fetchCourses = async () => {
      const data = await getCourses();
      setCourses(data);
      // Select first course, module, and lesson by default
      if (data.length > 0) {
        setSelectedCourse(data[0]);
        if (data[0].modules.length > 0) {
          setSelectedModule(data[0].modules[0]);
          if (data[0].modules[0].lessons.length > 0) {
            setSelectedLesson(data[0].modules[0].lessons[0]);
          }
        }
      }
    };
    fetchCourses();
  }, []);

  const handleSelectLesson = (lesson: Lesson, module: Module, course: Course) => {
    setSelectedLesson(lesson);
    setSelectedModule(module);
    setSelectedCourse(course);
  };

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      {/* Theme Toggle - Posición fija */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Componente de Anuncios - Botón flotante */}
      <StudentAnnouncements />

      {/* Botón flotante para enviar mensajes al profesor */}
      <button
        onClick={() => setShowMessaging(true)}
        className="fixed bottom-40 right-6 bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110 z-40"
        title="Enviar mensaje al profesor"
      >
        <SendIcon className="w-6 h-6" />
      </button>

      {/* Modal de Mensajería */}
      {showMessaging && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div
              className="fixed inset-0 bg-black/70"
              onClick={() => setShowMessaging(false)}
            />
            <div className="relative bg-gray-900 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <button
                onClick={() => setShowMessaging(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-2 z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <StudentMessaging />
            </div>
          </div>
        </div>
      )}
      
      <Sidebar
        courses={courses}
        selectedLesson={selectedLesson}
        onSelectLesson={handleSelectLesson}
        onLogout={logout}
        userName={user?.name}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 flex overflow-hidden">
          <div className="w-1/2 flex flex-col border-r border-gray-300 dark:border-gray-700">
            <LessonContent lesson={selectedLesson} module={selectedModule} course={selectedCourse} />
          </div>
          <div className="w-1/2 flex flex-col">
            <div className="h-1/2 border-b border-gray-300 dark:border-gray-700">
              <PythonConsole initialCode={selectedLesson?.codeExample || ''} />
            </div>
            <div className="h-1/2">
              <LessonQA lesson={selectedLesson} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
