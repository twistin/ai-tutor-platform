import React, { useContext, useState } from 'react';
import { Lesson, Module, Course } from '../types';
import CodeBlock from './CodeBlock';
import { ProgressContext } from '../contexts/ProgressContext';

interface LessonContentProps {
  lesson: Lesson | null;
  module?: Module | null;
  course?: Course | null;
}

const LessonContent: React.FC<LessonContentProps> = ({ lesson, module, course }) => {
  const { markLessonAsComplete, isLessonCompleted, isLoading } = useContext(ProgressContext);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCompleteLesson = async () => {
    if (!lesson) return;

    try {
      // Obtener el código del ejemplo o usar un código por defecto
      const code = lesson.codeExample || '';
      
      await markLessonAsComplete(lesson.id, code);
      
      // Mostrar mensaje de éxito
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
    } catch (error) {
      console.error('Error al completar lección:', error);
      alert('Hubo un error al guardar tu progreso. Por favor intenta de nuevo.');
    }
  };

  if (!lesson) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center text-gray-500 dark:text-gray-500 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <div className="text-center">
          <p className="text-xl mb-2">📚 Selecciona una lección para comenzar</p>
          <p className="text-sm text-gray-600 dark:text-gray-600">Elige un módulo y lección desde el menú lateral</p>
        </div>
      </div>
    );
  }

  // Parse markdown-style content
  const formatContent = (content: string) => {
    // Split by code blocks first
    const parts = content.split('```');
    
    return parts.map((part, index) => {
      // Even indices are regular content, odd indices are code blocks
      if (index % 2 === 0) {
        // Regular content - split by lines and format
        return part.split('\n').map((line, lineIndex) => {
          if (line.startsWith('# ')) {
            return <h2 key={lineIndex} className="text-2xl font-bold mt-6 mb-3 text-blue-600 dark:text-blue-400">{line.substring(2)}</h2>;
          } else if (line.startsWith('## ')) {
            return <h3 key={lineIndex} className="text-xl font-semibold mt-4 mb-2 text-blue-500 dark:text-blue-300">{line.substring(3)}</h3>;
          } else if (line.startsWith('**') && line.endsWith('**')) {
            return <p key={lineIndex} className="font-bold text-gray-800 dark:text-gray-200 mt-2">{line.substring(2, line.length - 2)}</p>;
          } else if (line.startsWith('- ')) {
            return <li key={lineIndex} className="ml-6 text-gray-700 dark:text-gray-300">{line.substring(2)}</li>;
          } else if (line.trim() === '') {
            return <br key={lineIndex} />;
          } else if (line.includes('`') && !line.startsWith('```')) {
            // Inline code
            const formatted = line.split('`').map((segment, i) => 
              i % 2 === 0 ? segment : <code key={i} className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm text-blue-600 dark:text-blue-300">{segment}</code>
            );
            return <p key={lineIndex} className="text-gray-700 dark:text-gray-300 my-1">{formatted}</p>;
          } else {
            return <p key={lineIndex} className="text-gray-700 dark:text-gray-300 my-1">{line}</p>;
          }
        });
      } else {
        // Code block
        const lines = part.split('\n');
        const language = lines[0] || 'python';
        const code = lines.slice(1).join('\n');
        return <CodeBlock key={index} code={code} language={language} />;
      }
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-900 overflow-hidden">
      {/* Header with breadcrumbs */}
      <div className="bg-gray-200 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 px-6 py-4 transition-colors duration-300">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {course?.title} {module && `> ${module.title}`}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{lesson.title}</h2>
        {module && (
          <div className="mt-2 text-xs text-gray-500">
            {module.weekRange}
          </div>
        )}
      </div>

      {/* Content area */}
      <div className="flex-1 p-6 overflow-y-auto bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="prose prose-invert max-w-none">
          {formatContent(lesson.content)}
        </div>

        {lesson.codeExample && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-3 text-blue-600 dark:text-blue-400">💻 Ejemplo de código</h3>
            <CodeBlock code={lesson.codeExample} language="python" />
          </div>
        )}

        {/* Botón de Completar Lección */}
        <div className="mt-8 pt-6 border-t border-gray-300 dark:border-gray-700">
          {isLessonCompleted(lesson.id) ? (
            <div className="flex items-center gap-3 text-green-600 dark:text-green-400">
              <span className="text-2xl">✅</span>
              <span className="text-lg font-semibold">¡Lección completada!</span>
            </div>
          ) : (
            <button
              onClick={handleCompleteLesson}
              disabled={isLoading}
              className={`
                px-6 py-3 rounded-lg font-semibold text-white
                transition-all duration-200
                ${isLoading 
                  ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 hover:shadow-lg'
                }
              `}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </span>
              ) : (
                '✓ Marcar como completada'
              )}
            </button>
          )}
          
          {/* Mensaje de éxito temporal */}
          {showSuccess && (
            <div className="mt-4 p-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 rounded-lg">
              <p className="text-green-800 dark:text-green-200 font-medium">
                🎉 ¡Excelente! Tu progreso ha sido guardado.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonContent;
