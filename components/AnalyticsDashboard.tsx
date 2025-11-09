import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  UsersIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  BookOpenIcon,
  RefreshIcon,
  AlertTriangleIcon,
  ActivityIcon,
  TargetIcon
} from './icons';

interface StudentProgress {
  id: number;
  name: string;
  email: string;
  completedLessons: number;
  totalLessons: number;
  averageScore: number;
  lastActivity: string;
  status: 'active' | 'inactive' | 'at-risk';
}

interface LessonAnalytics {
  lessonId: number;
  lessonTitle: string;
  completionRate: number;
  averageTime: number;
  studentsCompleted: number;
  totalStudents: number;
}

const AnalyticsDashboard: React.FC = () => {
  const [studentsProgress, setStudentsProgress] = useState<StudentProgress[]>([]);
  const [lessonsAnalytics, setLessonsAnalytics] = useState<LessonAnalytics[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'at-risk'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'progress' | 'lastActivity'>('progress');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Progreso de estudiantes
      const studentsResponse = await fetch('http://localhost:8080/api/analytics/students');
      const studentsData = await studentsResponse.json();
      if (studentsData.success) {
        setStudentsProgress(studentsData.students);
      }

      // Analíticas de lecciones
      const lessonsResponse = await fetch('http://localhost:8080/api/analytics/lessons');
      const lessonsData = await lessonsResponse.json();
      if (lessonsData.success) {
        setLessonsAnalytics(lessonsData.lessons);
      }
    } catch (error) {
      console.error('Error al cargar analíticas:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-500/20 text-green-400 border-green-500/30',
      inactive: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      'at-risk': 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    const labels = {
      active: <span className="flex items-center gap-1"><CheckCircleIcon className="w-3 h-3" strokeWidth={1.5} /> Activo</span>,
      inactive: 'Inactivo',
      'at-risk': <span className="flex items-center gap-1"><AlertTriangleIcon className="w-3 h-3" strokeWidth={1.5} /> En Riesgo</span>
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 75) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Hoy';
    if (diffInDays === 1) return 'Ayer';
    if (diffInDays < 7) return `Hace ${diffInDays} días`;
    return date.toLocaleDateString('es-ES');
  };

  return (
    <div className="space-y-6">
      {/* Header con filtros */}
      <div className="bg-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <ChartBarIcon className="w-7 h-7 text-blue-400" strokeWidth={1.5} />
              Panel de Analíticas
            </h2>
            <p className="text-gray-400">Monitorea el progreso y rendimiento de tus estudiantes</p>
          </div>
          <button
            onClick={fetchAnalytics}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
          >
            <RefreshIcon className="w-5 h-5" strokeWidth={1.5} />
            Actualizar
          </button>
        </div>

        {/* Filtros */}
        <div className="flex gap-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'active' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            Activos
          </button>
          <button
            onClick={() => setFilter('at-risk')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              filter === 'at-risk' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            <AlertTriangleIcon className="w-4 h-4" strokeWidth={1.5} />
            En Riesgo
          </button>
        </div>
      </div>

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <UsersIcon className="w-8 h-8 text-blue-400" />
            <h3 className="text-lg font-bold">Estudiantes</h3>
          </div>
          <p className="text-4xl font-bold mb-2">{studentsProgress.length}</p>
          <p className="text-sm text-gray-400">
            {studentsProgress.filter(s => s.status === 'active').length} activos
          </p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircleIcon className="w-8 h-8 text-green-400" />
            <h3 className="text-lg font-bold">Completitud Promedio</h3>
          </div>
          <p className="text-4xl font-bold mb-2">
            {studentsProgress.length > 0
              ? Math.round(
                  studentsProgress.reduce((acc, s) => 
                    acc + (s.completedLessons / s.totalLessons * 100), 0
                  ) / studentsProgress.length
                )
              : 0}%
          </p>
          <p className="text-sm text-gray-400">del curso completado</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <ClockIcon className="w-8 h-8 text-orange-400" />
            <h3 className="text-lg font-bold">Necesitan Atención</h3>
          </div>
          <p className="text-4xl font-bold mb-2">
            {studentsProgress.filter(s => s.status === 'at-risk').length}
          </p>
          <p className="text-sm text-gray-400">estudiantes en riesgo</p>
        </div>
      </div>

      {/* Tabla de Progreso de Estudiantes */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <UsersIcon className="w-6 h-6 text-blue-400" strokeWidth={1.5} />
          Progreso Individual
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4">Estudiante</th>
                <th className="text-left py-3 px-4">Estado</th>
                <th className="text-left py-3 px-4">Progreso</th>
                <th className="text-left py-3 px-4">Lecciones</th>
                <th className="text-left py-3 px-4">Promedio</th>
                <th className="text-left py-3 px-4">Última Actividad</th>
                <th className="text-left py-3 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {studentsProgress
                .filter(s => filter === 'all' || s.status === filter)
                .map(student => {
                  const progress = Math.round((student.completedLessons / student.totalLessons) * 100);
                  return (
                    <tr key={student.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-xs text-gray-500">{student.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {getStatusBadge(student.status)}
                      </td>
                      <td className="py-4 px-4">
                        <div className="w-full bg-gray-700 rounded-full h-2 mb-1">
                          <div
                            className={`h-2 rounded-full ${getProgressColor(progress)}`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-400">{progress}%</p>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm">
                          {student.completedLessons}/{student.totalLessons}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`font-bold ${
                          student.averageScore >= 80 ? 'text-green-400' :
                          student.averageScore >= 60 ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {student.averageScore}%
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-400">
                        {formatDate(student.lastActivity)}
                      </td>
                      <td className="py-4 px-4">
                        <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm">
                          Ver Detalle
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analíticas por Lección */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <BookOpenIcon className="w-6 h-6 text-green-400" strokeWidth={1.5} />
          Rendimiento por Lección
        </h3>
        
        <div className="space-y-4">
          {lessonsAnalytics.map(lesson => (
            <div key={lesson.lessonId} className="bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold">{lesson.lessonTitle}</h4>
                <span className="text-sm text-gray-400">
                  {lesson.studentsCompleted}/{lesson.totalStudents} completaron
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Tasa de Completitud</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {lesson.completionRate}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Tiempo Promedio</p>
                  <p className="text-2xl font-bold text-green-400">
                    {lesson.averageTime} min
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Dificultad Percibida</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {lesson.completionRate > 80 ? '🟢 Fácil' : 
                     lesson.completionRate > 60 ? '🟡 Media' : '🔴 Difícil'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
