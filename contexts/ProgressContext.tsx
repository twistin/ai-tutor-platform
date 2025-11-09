import React, { createContext, useState, useContext, ReactNode } from 'react';
import { AuthContext } from './AuthContext';

interface ProgressContextType {
  completedLessons: Set<string>;
  markLessonAsComplete: (lessonId: string, code?: string) => Promise<void>;
  isLessonCompleted: (lessonId: string) => boolean;
  isLoading: boolean;
}

export const ProgressContext = createContext<ProgressContextType>({
  completedLessons: new Set(),
  markLessonAsComplete: async () => {},
  isLessonCompleted: () => false,
  isLoading: false,
});

interface ProgressProviderProps {
  children: ReactNode;
}

export const ProgressProvider: React.FC<ProgressProviderProps> = ({ children }) => {
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const markLessonAsComplete = async (lessonId: string, code?: string) => {
    if (!user) {
      console.error('Usuario no autenticado');
      return;
    }

    setIsLoading(true);
    
    try {
      // Convertir lessonId de string a número para el backend
      // Extraer el número del ID (ej: "lesson-1" -> 1)
      const lessonNumber = parseInt(lessonId.split('-').pop() || '0');
      
      const response = await fetch('http://localhost:8080/api/progress/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id, // Usar el ID del usuario autenticado
          lessonId: lessonNumber, // Enviar como número
          lastSubmittedCode: code,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al marcar la lección como completada');
      }

      const data = await response.json();
      console.log('✅ Lección completada:', data);

      // Agregar la lección al set de completadas (mantener como string)
      setCompletedLessons(prev => new Set(prev).add(lessonId));

    } catch (error) {
      console.error('❌ Error al completar lección:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const isLessonCompleted = (lessonId: string): boolean => {
    return completedLessons.has(lessonId);
  };

  return (
    <ProgressContext.Provider
      value={{
        completedLessons,
        markLessonAsComplete,
        isLessonCompleted,
        isLoading,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};
