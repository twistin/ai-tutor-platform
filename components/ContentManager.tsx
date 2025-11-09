import React, { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';

interface Lesson {
  id: number;
  title: string;
  content: string | null;
  published: boolean;
  order: number;
  moduleId: number;
  createdAt: string;
  updatedAt: string;
}

interface Module {
  id: number;
  title: string;
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  lessons: Lesson[];
}

interface CourseStructure {
  success: boolean;
  data: Module[];
  total: number;
}

export default function ContentManager() {
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [editorContent, setEditorContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Cargar la estructura del curso al montar el componente
  useEffect(() => {
    fetchCourseStructure();
  }, []);

  // Actualizar el editor cuando se selecciona una lección
  useEffect(() => {
    if (selectedLesson) {
      setSelectedLessonId(selectedLesson.id);
      setEditorContent(selectedLesson.content || '');
      setSaveMessage(null);
    }
  }, [selectedLesson]);

  const fetchCourseStructure = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8080/api/course/structure');
      const result: CourseStructure = await response.json();
      
      if (result.success) {
        setModules(result.data);
      } else {
        setError('Error al cargar la estructura del curso');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
      console.error('Error fetching course structure:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!selectedLessonId) {
      setSaveMessage('No hay lección seleccionada');
      return;
    }

    try {
      setIsSaving(true);
      setSaveMessage(null);

      const response = await fetch(`http://localhost:8080/api/lessons/${selectedLessonId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editorContent,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSaveMessage('✓ Cambios guardados correctamente');
        // Actualizar el contenido en el estado local
        setModules(prevModules =>
          prevModules.map(module => ({
            ...module,
            lessons: module.lessons.map(lesson =>
              lesson.id === selectedLessonId
                ? { ...lesson, content: editorContent }
                : lesson
            ),
          }))
        );
        // Actualizar selectedLesson
        if (selectedLesson) {
          setSelectedLesson({ ...selectedLesson, content: editorContent });
        }
        
        // Limpiar mensaje después de 3 segundos
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        setSaveMessage('✗ Error al guardar los cambios');
      }
    } catch (err) {
      setSaveMessage('✗ Error de conexión al guardar');
      console.error('Error saving changes:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          📚 Gestor de Contenidos
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Administra los módulos y lecciones del curso
        </p>
      </div>

      {/* Layout de 2 Paneles */}
      <div className="flex flex-1 overflow-hidden">
        {/* Panel Izquierdo: Navegador de Estructura */}
        <div className="w-1/3 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                📖 Estructura del Curso
              </h3>
              <button
                onClick={fetchCourseStructure}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                title="Recargar estructura"
              >
                🔄
              </button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
                {error}
              </div>
            ) : (
              <div className="space-y-4">
                {modules.map((module) => (
                  <div
                    key={module.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                  >
                    {/* Cabecera del Módulo */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {module.title}
                        </h4>
                        <span className={`text-xs px-2 py-1 rounded ${
                          module.published
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {module.published ? '✓ Publicado' : '○ Borrador'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {module.lessons.length} lección{module.lessons.length !== 1 ? 'es' : ''}
                      </p>
                    </div>

                    {/* Lista de Lecciones */}
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {module.lessons.map((lesson) => (
                        <button
                          key={lesson.id}
                          onClick={() => setSelectedLesson(lesson)}
                          className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                            selectedLesson?.id === lesson.id
                              ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600'
                              : ''
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {lesson.order}. {lesson.title}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {lesson.content ? `${lesson.content.length} caracteres` : 'Sin contenido'}
                              </p>
                            </div>
                            <span className={`text-xs ${
                              lesson.published
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-gray-400 dark:text-gray-500'
                            }`}>
                              {lesson.published ? '✓' : '○'}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {modules.length === 0 && (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    No hay módulos disponibles
                  </div>
                )}
              </div>
            )}

            {/* Botón para crear nuevo módulo */}
            <div className="px-6 pb-6">
              <button
                onClick={() => {
                  // TODO: Implementar creación de módulo
                  console.log('Crear nuevo módulo');
                }}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <span className="text-xl">+</span>
                Nuevo Módulo
              </button>
            </div>
          </div>
        </div>

        {/* Panel Derecho: Editor de Lección */}
        <div className="w-2/3 bg-white dark:bg-gray-800 overflow-y-auto">
          <div className="p-6 h-full flex flex-col">
            {selectedLesson ? (
              <>
                {/* Header del Editor */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    ✏️ Editor de Lección
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Editando: <span className="font-semibold">{selectedLesson.title}</span>
                  </p>
                </div>

                {/* Editor de Markdown */}
                <div className="flex-1 mb-4" data-color-mode="light">
                  <MDEditor
                    value={editorContent}
                    onChange={(val) => setEditorContent(val || '')}
                    height={500}
                    preview="edit"
                  />
                </div>

                {/* Botones y Mensajes */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleSaveChanges}
                    disabled={isSaving}
                    className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                      isSaving
                        ? 'bg-gray-400 cursor-not-allowed text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isSaving ? '⏳ Guardando...' : '💾 Guardar Cambios'}
                  </button>

                  {saveMessage && (
                    <span className={`text-sm font-medium ${
                      saveMessage.startsWith('✓')
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {saveMessage}
                    </span>
                  )}
                </div>

                {/* Información de la Lección */}
                <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <p>ID: {selectedLesson.id} | Orden: {selectedLesson.order} | Estado: {selectedLesson.published ? '✓ Publicado' : '○ Borrador'}</p>
                  <p>Última actualización: {new Date(selectedLesson.updatedAt).toLocaleString('es-ES')}</p>
                  <p>Caracteres: {editorContent.length}</p>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Selecciona una lección
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Elige una lección del panel izquierdo para comenzar a editar
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
