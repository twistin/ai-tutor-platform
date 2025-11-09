import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import LessonEditor, { LessonData, ContentBlock } from './LessonEditor';
import { Course, Module, Lesson } from '../types';
import { getCourses, createCourse, deleteCourse, addModuleToCourse, addLessonToModule } from '../services/mockAPIService';
import {
  BookOpenIcon,
  PencilIcon,
  CopyIcon,
  TrashIcon,
  PlusIcon,
  FolderIcon,
  FileTextIcon,
  ClockIcon
} from './icons';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Componente Sortable para Módulos
const SortableModule: React.FC<{
  module: Module;
  moduleIndex: number;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onAddLesson: () => void;
  lessons: Lesson[];
  onEditLesson: (lesson: Lesson) => void;
  onDuplicateLesson: (lesson: Lesson) => void;
  onDeleteLesson: (lessonId: string) => void;
}> = ({ module, moduleIndex, onEdit, onDuplicate, onDelete, onAddLesson, lessons, onEditLesson, onDuplicateLesson, onDeleteLesson }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: module.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-start gap-3 flex-1">
          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            className="mt-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            title="Arrastrar para reordenar"
          >
            ⋮⋮
          </button>
          <div className="flex-1">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">
              {moduleIndex + 1}. {module.title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{module.description}</p>
            <span className="text-xs text-gray-500 dark:text-gray-500 mt-1 inline-block">
              📅 {module.weekRange}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="px-2 py-1 bg-yellow-600 dark:bg-yellow-500 text-white text-xs rounded hover:bg-yellow-700 dark:hover:bg-yellow-600"
            title="Editar módulo"
          >
            <PencilIcon className="w-3 h-3" strokeWidth={1.5} />
          </button>
          <button
            onClick={onDuplicate}
            className="px-2 py-1 bg-blue-600 dark:bg-blue-500 text-white text-xs rounded hover:bg-blue-700 dark:hover:bg-blue-600"
            title="Duplicar módulo"
          >
            <CopyIcon className="w-3 h-3" strokeWidth={1.5} />
          </button>
          <button
            onClick={onDelete}
            className="px-2 py-1 bg-red-600 dark:bg-red-500 text-white text-xs rounded hover:bg-red-700 dark:hover:bg-red-600"
            title="Eliminar módulo"
          >
            <TrashIcon className="w-3 h-3" strokeWidth={1.5} />
          </button>
          <button
            onClick={onAddLesson}
            className="px-3 py-1 bg-purple-600 dark:bg-purple-500 text-white text-sm rounded-md hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors flex items-center gap-1"
          >
            <PlusIcon className="w-4 h-4" strokeWidth={1.5} />
            Lección
          </button>
        </div>
      </div>
      
      {/* Lecciones */}
      {lessons.length === 0 ? (
        <p className="text-gray-400 dark:text-gray-500 text-sm italic mt-3">
          Sin lecciones aún
        </p>
      ) : (
        <div className="mt-4 space-y-2">
          {lessons.map((lesson, lessonIndex) => (
            <div 
              key={lesson.id} 
              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
            >
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 dark:bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                {lessonIndex + 1}
              </span>
              <span className="text-gray-900 dark:text-white font-medium flex-1">
                {lesson.title}
              </span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEditLesson(lesson)}
                  className="px-2 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700"
                  title="Editar lección"
                >
                  <PencilIcon className="w-3 h-3" strokeWidth={1.5} />
                </button>
                <button
                  onClick={() => onDuplicateLesson(lesson)}
                  className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                  title="Duplicar lección"
                >
                  <CopyIcon className="w-3 h-3" strokeWidth={1.5} />
                </button>
                <button
                  onClick={() => onDeleteLesson(lesson.id)}
                  className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                  title="Eliminar lección"
                >
                  <TrashIcon className="w-3 h-3" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CourseManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<'create' | 'edit'>('create');
  
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    duration: ''
  });

  const [moduleForm, setModuleForm] = useState({
    title: '',
    description: '',
    weekRange: ''
  });

  // Helper para convertir formato antiguo a nuevo
  const convertLessonToEditorFormat = (lesson: Lesson): LessonData => {
    // Si ya tiene el nuevo formato (con bloques)
    if (lesson.content && typeof lesson.content === 'object' && Array.isArray((lesson.content as any).blocks)) {
      return lesson.content as any;
    }

    // Convertir formato antiguo a bloques
    const blocks: ContentBlock[] = [];
    
    // Agregar contenido de texto si existe
    if (lesson.content) {
      blocks.push({
        id: `block-${Date.now()}-1`,
        type: 'text',
        content: lesson.content
      });
    }
    
    // Agregar código si existe
    if (lesson.codeExample) {
      blocks.push({
        id: `block-${Date.now()}-2`,
        type: 'code',
        content: lesson.codeExample,
        language: 'python'
      });
    }

    // Si no hay ningún bloque, agregar uno vacío
    if (blocks.length === 0) {
      blocks.push({
        id: `block-${Date.now()}-1`,
        type: 'text',
        content: ''
      });
    }

    return {
      title: lesson.title,
      content: blocks
    };
  };

  // Helper para convertir formato nuevo a antiguo (backward compatibility)
  const convertEditorFormatToLesson = (editorData: LessonData): Partial<Lesson> => {
    // Extraer texto y código del primer bloque de cada tipo
    const textBlocks = editorData.content.filter(b => b.type === 'text');
    const codeBlocks = editorData.content.filter(b => b.type === 'code');
    
    // Para mantener compatibilidad, guardar también en formato de bloques
    return {
      title: editorData.title,
      content: JSON.stringify({ blocks: editorData.content }), // Nuevo formato
      codeExample: codeBlocks[0]?.content || '' // Backward compatibility
    };
  };

  // Sensors para drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    // Filtrar cursos según búsqueda
    if (searchQuery.trim() === '') {
      setFilteredCourses(courses);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = courses.map(course => {
        const matchesTitle = course.title.toLowerCase().includes(query);
        const matchesDescription = course.description.toLowerCase().includes(query);
        
        const filteredModules = course.modules.filter(module => {
          const moduleMatches = 
            module.title.toLowerCase().includes(query) ||
            module.description.toLowerCase().includes(query);
          
          const lessonMatches = module.lessons.some(lesson =>
            lesson.title.toLowerCase().includes(query) ||
            lesson.content.toLowerCase().includes(query)
          );
          
          return moduleMatches || lessonMatches;
        });

        if (matchesTitle || matchesDescription || filteredModules.length > 0) {
          return {
            ...course,
            modules: filteredModules.length > 0 ? filteredModules : course.modules
          };
        }
        return null;
      }).filter(course => course !== null) as Course[];
      
      setFilteredCourses(filtered);
    }
  }, [searchQuery, courses]);

  const loadCourses = async () => {
    const data = await getCourses();
    setCourses(data);
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCourse({ ...courseForm, modules: [] });
    setIsModalOpen(false);
    setCourseForm({ title: '', description: '', level: 'beginner', duration: '' });
    loadCourses();
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (window.confirm('¿Seguro de eliminar este curso?')) {
      await deleteCourse(courseId);
      loadCourses();
    }
  };

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCourse) {
      if (editMode === 'edit' && selectedModule) {
        // Editar módulo existente
        const updatedCourse = {
          ...selectedCourse,
          modules: selectedCourse.modules.map(m =>
            m.id === selectedModule.id
              ? { ...m, ...moduleForm }
              : m
          )
        };
        await createCourse(updatedCourse);
      } else {
        // Crear nuevo módulo
        await addModuleToCourse(selectedCourse.id, {
          ...moduleForm,
          lessons: []
        });
      }
      setIsModuleModalOpen(false);
      setModuleForm({ title: '', description: '', weekRange: '' });
      setEditMode('create');
      setSelectedModule(null);
      loadCourses();
    }
  };

  const handleSaveLesson = async (lessonData: LessonData) => {
    if (selectedCourse && selectedModule) {
      const lessonPayload = convertEditorFormatToLesson(lessonData);
      
      if (editMode === 'edit' && selectedLesson) {
        // Editar lección existente
        const updatedCourse = {
          ...selectedCourse,
          modules: selectedCourse.modules.map(m =>
            m.id === selectedModule.id
              ? {
                  ...m,
                  lessons: m.lessons.map(l =>
                    l.id === selectedLesson.id
                      ? { ...l, ...lessonPayload }
                      : l
                  )
                }
              : m
          )
        };
        await createCourse(updatedCourse);
      } else {
        // Crear nueva lección - asegurar que tenga todos los campos requeridos
        const newLesson = {
          title: lessonPayload.title!,
          content: lessonPayload.content!,
          codeExample: lessonPayload.codeExample || ''
        };
        await addLessonToModule(selectedCourse.id, selectedModule.id, newLesson);
      }
      setIsLessonModalOpen(false);
      setEditMode('create');
      setSelectedLesson(null);
      loadCourses();
    }
  };

  const toggleCourseExpansion = (courseId: string) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  // Funciones para editar
  const handleEditModule = (course: Course, module: Module) => {
    setSelectedCourse(course);
    setSelectedModule(module);
    setModuleForm({
      title: module.title,
      description: module.description,
      weekRange: module.weekRange
    });
    setEditMode('edit');
    setIsModuleModalOpen(true);
  };

  const handleEditLesson = (course: Course, module: Module, lesson: Lesson) => {
    setSelectedCourse(course);
    setSelectedModule(module);
    setSelectedLesson(lesson);
    setEditMode('edit');
    setIsLessonModalOpen(true);
  };

  // Funciones para duplicar
  const handleDuplicateModule = async (course: Course, module: Module) => {
    const duplicatedModule = {
      ...module,
      id: `module-${Date.now()}`,
      title: `${module.title} (Copia)`,
      lessons: module.lessons.map(l => ({
        ...l,
        id: `lesson-${Date.now()}-${Math.random()}`
      }))
    };
    
    const updatedCourse = {
      ...course,
      modules: [...course.modules, duplicatedModule]
    };
    
    await createCourse(updatedCourse);
    loadCourses();
  };

  const handleDuplicateLesson = async (course: Course, module: Module, lesson: Lesson) => {
    const duplicatedLesson = {
      ...lesson,
      id: `lesson-${Date.now()}`,
      title: `${lesson.title} (Copia)`
    };
    
    const updatedCourse = {
      ...course,
      modules: course.modules.map(m =>
        m.id === module.id
          ? { ...m, lessons: [...m.lessons, duplicatedLesson] }
          : m
      )
    };
    
    await createCourse(updatedCourse);
    loadCourses();
  };

  // Funciones para eliminar
  const handleDeleteModule = async (course: Course, moduleId: string) => {
    if (window.confirm('¿Seguro de eliminar este módulo y todas sus lecciones?')) {
      const updatedCourse = {
        ...course,
        modules: course.modules.filter(m => m.id !== moduleId)
      };
      await createCourse(updatedCourse);
      loadCourses();
    }
  };

  const handleDeleteLesson = async (course: Course, module: Module, lessonId: string) => {
    if (window.confirm('¿Seguro de eliminar esta lección?')) {
      const updatedCourse = {
        ...course,
        modules: course.modules.map(m =>
          m.id === module.id
            ? { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) }
            : m
        )
      };
      await createCourse(updatedCourse);
      loadCourses();
    }
  };

  // Drag & Drop handler
  const handleDragEnd = async (event: DragEndEvent, course: Course) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = course.modules.findIndex(m => m.id === active.id);
      const newIndex = course.modules.findIndex(m => m.id === over.id);

      const reorderedModules = arrayMove(course.modules, oldIndex, newIndex);
      
      const updatedCourse = {
        ...course,
        modules: reorderedModules
      };
      
      await createCourse(updatedCourse);
      loadCourses();
    }
  };

  return (
    <div className="mt-8">
      {/* Header con búsqueda */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BookOpenIcon className="w-7 h-7 text-blue-400" strokeWidth={1.5} />
            Gestión de Cursos
          </h2>
          <button 
            onClick={() => {
              setEditMode('create');
              setCourseForm({ title: '', description: '', level: 'beginner', duration: '' });
              setIsModalOpen(true);
            }} 
            className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-semibold flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" strokeWidth={1.5} />
            Crear Curso
          </button>
        </div>
        
        {/* Barra de búsqueda */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Buscar cursos, módulos o lecciones..."
            className="w-full px-4 py-3 pl-12 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">
            🔍
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {filteredCourses.map((course) => (
          <div key={course.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header del Curso */}
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{course.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      course.level === 'beginner' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                      course.level === 'intermediate' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                      'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                    }`}>
                      {course.level === 'beginner' ? 'Principiante' : 
                       course.level === 'intermediate' ? 'Intermedio' : 'Avanzado'}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">{course.description}</p>
                  <div className="flex gap-6 mt-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <FolderIcon className="w-4 h-4" strokeWidth={1.5} />
                      <strong>{course.modules.length}</strong> módulos
                    </span>
                    <span className="flex items-center gap-1">
                      <FileTextIcon className="w-4 h-4" strokeWidth={1.5} />
                      <strong>{course.modules.reduce((acc, m) => acc + m.lessons.length, 0)}</strong> lecciones
                    </span>
                    <span className="flex items-center gap-1">
                      <ClockIcon className="w-4 h-4" strokeWidth={1.5} />
                      {course.duration}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setSelectedCourse(course);
                      setEditMode('create');
                      setModuleForm({ title: '', description: '', weekRange: '' });
                      setIsModuleModalOpen(true);
                    }}
                    className="px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-md hover:bg-green-700 dark:hover:bg-green-600 transition-colors font-semibold"
                  >
                    + Módulo
                  </button>
                  <button 
                    onClick={() => toggleCourseExpansion(course.id)} 
                    className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-semibold"
                  >
                    {expandedCourse === course.id ? '▼ Ocultar' : '▶ Ver Contenido'}
                  </button>
                  <button 
                    onClick={() => handleDeleteCourse(course.id)} 
                    className="px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-md hover:bg-red-700 dark:hover:bg-red-600 transition-colors font-semibold"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>

            {/* Módulos y Lecciones (expandible con drag & drop) */}
            {expandedCourse === course.id && (
              <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-6">
                {course.modules.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    No hay módulos en este curso. Haz click en "+ Módulo" para agregar uno.
                  </p>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={(event) => handleDragEnd(event, course)}
                  >
                    <SortableContext
                      items={course.modules.map(m => m.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-6">
                        {course.modules.map((module, moduleIndex) => (
                          <SortableModule
                            key={module.id}
                            module={module}
                            moduleIndex={moduleIndex}
                            onEdit={() => handleEditModule(course, module)}
                            onDuplicate={() => handleDuplicateModule(course, module)}
                            onDelete={() => handleDeleteModule(course, module.id)}
                            onAddLesson={() => {
                              setSelectedCourse(course);
                              setSelectedModule(module);
                              setEditMode('create');
                              setIsLessonModalOpen(true);
                            }}
                            lessons={module.lessons}
                            onEditLesson={(lesson) => handleEditLesson(course, module, lesson)}
                            onDuplicateLesson={(lesson) => handleDuplicateLesson(course, module, lesson)}
                            onDeleteLesson={(lessonId) => handleDeleteLesson(course, module, lessonId)}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            )}
          </div>
        ))}

        {filteredCourses.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <BookOpenIcon className="w-16 h-16 mx-auto mb-4 opacity-50" strokeWidth={1.5} />
            <p className="text-xl mb-2">No hay cursos creados</p>
            <p className="text-sm">Crea tu primer curso haciendo click en el botón de arriba</p>
          </div>
        )}
      </div>

      {/* Modal: Crear Curso */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Crear Curso">
        <form onSubmit={handleCreateCourse} className="space-y-4">
          <div>
            <label className="block text-sm mb-2 text-gray-900 dark:text-white">Título</label>
            <input type="text" value={courseForm.title} 
              onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md border border-gray-300 dark:border-gray-600" 
              required />
          </div>
          <div>
            <label className="block text-sm mb-2 text-gray-900 dark:text-white">Descripción</label>
            <textarea value={courseForm.description} 
              onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md border border-gray-300 dark:border-gray-600" 
              rows={3} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2 text-gray-900 dark:text-white">Nivel</label>
              <select value={courseForm.level} 
                onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value as any })}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md border border-gray-300 dark:border-gray-600">
                <option value="beginner">Principiante</option>
                <option value="intermediate">Intermedio</option>
                <option value="advanced">Avanzado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-2 text-gray-900 dark:text-white">Duración</label>
              <input type="text" value={courseForm.duration} 
                onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md border border-gray-300 dark:border-gray-600" 
                required placeholder="8 semanas" />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={() => setIsModalOpen(false)} 
              className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-gray-600">
              Cancelar
            </button>
            <button type="submit" 
              className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600">
              Crear
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Añadir/Editar Módulo */}
      <Modal 
        isOpen={isModuleModalOpen} 
        onClose={() => {
          setIsModuleModalOpen(false);
          setSelectedCourse(null);
          setSelectedModule(null);
          setEditMode('create');
          setModuleForm({ title: '', description: '', weekRange: '' });
        }} 
        title={editMode === 'edit' ? `Editar Módulo - ${selectedCourse?.title || ''}` : `Añadir Módulo - ${selectedCourse?.title || ''}`}
      >
        <form onSubmit={handleAddModule} className="space-y-4">
          <div>
            <label className="block text-sm mb-2 text-gray-900 dark:text-white">Título del Módulo</label>
            <input 
              type="text" 
              value={moduleForm.title} 
              onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md border border-gray-300 dark:border-gray-600" 
              placeholder="Ej: Librosa para Análisis de Audio"
              required 
            />
          </div>
          <div>
            <label className="block text-sm mb-2 text-gray-900 dark:text-white">Descripción</label>
            <textarea 
              value={moduleForm.description} 
              onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md border border-gray-300 dark:border-gray-600" 
              rows={3}
              placeholder="Descripción del módulo..."
              required 
            />
          </div>
          <div>
            <label className="block text-sm mb-2 text-gray-900 dark:text-white">Rango de Semanas</label>
            <input 
              type="text" 
              value={moduleForm.weekRange} 
              onChange={(e) => setModuleForm({ ...moduleForm, weekRange: e.target.value })}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md border border-gray-300 dark:border-gray-600" 
              placeholder="Ej: Semana 8"
              required 
            />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button 
              type="button" 
              onClick={() => {
                setIsModuleModalOpen(false);
                setSelectedCourse(null);
                setSelectedModule(null);
                setEditMode('create');
                setModuleForm({ title: '', description: '', weekRange: '' });
              }}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-gray-600">
              Cancelar
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-md hover:bg-green-700 dark:hover:bg-green-600">
              {editMode === 'edit' ? 'Guardar Cambios' : 'Añadir Módulo'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Nuevo Editor de Lecciones */}
      <LessonEditor
        isOpen={isLessonModalOpen}
        onClose={() => {
          setIsLessonModalOpen(false);
          setSelectedCourse(null);
          setSelectedModule(null);
          setSelectedLesson(null);
          setEditMode('create');
        }}
        onSave={handleSaveLesson}
        initialData={selectedLesson ? convertLessonToEditorFormat(selectedLesson) : undefined}
        mode={editMode}
        moduleTitle={selectedModule?.title}
      />
    </div>
  );
};

export default CourseManagement;
