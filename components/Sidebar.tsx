import React, { useState } from 'react';
import { Course, Lesson, Module } from '../types';
import { ChevronDownIcon, ChevronRightIcon, BookOpenIcon, AcademicCapIcon } from './icons';

interface SidebarProps {
  courses: Course[];
  selectedLesson: Lesson | null;
  onSelectLesson: (lesson: Lesson, module: Module, course: Course) => void;
  onLogout: () => void;
  userName?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ courses, selectedLesson, onSelectLesson, onLogout, userName }) => {
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set(courses.map(c => c.id)));
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  const toggleCourse = (courseId: string) => {
    const newExpanded = new Set(expandedCourses);
    if (newExpanded.has(courseId)) {
      newExpanded.delete(courseId);
    } else {
      newExpanded.add(courseId);
    }
    setExpandedCourses(newExpanded);
  };

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  return (
    <div className="w-80 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white flex flex-col shadow-2xl transition-colors duration-300">
      <div className="p-6 border-b border-gray-300 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <BookOpenIcon className="w-8 h-8 text-blue-500 dark:text-blue-400" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 bg-clip-text text-transparent">
            AI Python Tutor
          </h1>
        </div>
        {userName && (
          <div className="flex items-center gap-2 mt-3 text-sm text-gray-600 dark:text-gray-400">
            <AcademicCapIcon className="w-4 h-4" />
            <span>{userName}</span>
          </div>
        )}
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4">
        {courses.map((course) => (
          <div key={course.id} className="mb-6">
            <button
              onClick={() => toggleCourse(course.id)}
              className="w-full flex items-center justify-between p-3 bg-gray-200 dark:bg-gray-700/50 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors group"
            >
              <div className="flex items-center gap-2">
                <BookOpenIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="font-semibold text-sm">{course.title}</span>
              </div>
              {expandedCourses.has(course.id) ? (
                <ChevronDownIcon className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
              ) : (
                <ChevronRightIcon className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
              )}
            </button>
            
            {expandedCourses.has(course.id) && (
              <div className="ml-2 mt-2 space-y-2">
                {course.modules.map((module, moduleIndex) => (
                  <div key={module.id} className="border-l-2 border-gray-300 dark:border-gray-700 pl-3">
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="w-full flex items-center justify-between p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700/50 transition-colors text-left"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                            Módulo {moduleIndex + 1}
                          </span>
                          {expandedModules.has(module.id) ? (
                            <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                          ) : (
                            <ChevronRightIcon className="w-4 h-4 text-gray-500" />
                          )}
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-300 mt-1 line-clamp-2">
                          {module.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {module.weekRange}
                        </div>
                      </div>
                    </button>
                    
                    {expandedModules.has(module.id) && (
                      <div className="mt-1 space-y-1">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <button
                            key={lesson.id}
                            onClick={() => onSelectLesson(lesson, module, course)}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all flex items-center gap-2 ${
                              selectedLesson?.id === lesson.id
                                ? 'bg-blue-600 dark:bg-blue-600 text-white font-medium shadow-lg'
                                : 'hover:bg-gray-200 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            <span className="text-xs opacity-60">
                              {moduleIndex + 1}.{lessonIndex + 1}
                            </span>
                            <span className="flex-1">{lesson.title}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-300 dark:border-gray-700">
        <button
          onClick={onLogout}
          className="w-full px-4 py-3 font-semibold bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-lg text-white"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
