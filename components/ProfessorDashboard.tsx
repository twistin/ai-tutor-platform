import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import CourseManagement from './CourseManagement';
import StudentCommunication from './StudentCommunication';
import AnalyticsDashboard from './AnalyticsDashboard';
import ContentLibrary from './ContentLibrary';
import { 
  // Navegación principal
  LayoutDashboardIcon,
  BookOpenIcon, 
  MessageSquareIcon, 
  BarChartIcon,
  FolderIcon,
  
  // Estadísticas
  GraduationCapIcon,
  LibraryIcon,
  MailIcon,
  TrendingUpIcon,
  
  // Acciones rápidas
  FilePlusIcon,
  MegaphoneIcon,
  LineChartIcon,
  
  // Actividad
  UserIcon,
  CheckCircleIcon,
  ClockIcon,
  
  // Configuración
  SettingsIcon,
  LogOutIcon,
} from './icons';

interface DashboardStats {
  totalStudents: number;
  totalLessons: number;
  totalModules: number;
  pendingMessages: number;
  activeStudents: number;
  completionRate: number;
}

const ProfessorDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeView, setActiveView] = useState<'overview' | 'content' | 'communication' | 'analytics' | 'library'>('overview');
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalLessons: 0,
    totalModules: 0,
    pendingMessages: 0,
    activeStudents: 0,
    completionRate: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/dashboard/professor-stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  const menuItems = [
    { 
      id: 'overview' as const, 
      label: 'Panel General', 
      icon: LayoutDashboardIcon, 
      color: 'blue',
      badge: null 
    },
    { 
      id: 'content' as const, 
      label: 'Gestión de Contenido', 
      icon: BookOpenIcon, 
      color: 'purple',
      badge: null 
    },
    { 
      id: 'communication' as const, 
      label: 'Comunicación', 
      icon: MessageSquareIcon, 
      color: 'green',
      badge: stats.pendingMessages > 0 ? stats.pendingMessages : null 
    },
    { 
      id: 'analytics' as const, 
      label: 'Analíticas', 
      icon: BarChartIcon, 
      color: 'orange',
      badge: null 
    },
    { 
      id: 'library' as const, 
      label: 'Biblioteca de Recursos', 
      icon: FolderIcon, 
      color: 'pink',
      badge: null 
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <GraduationCapIcon className="w-7 h-7 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Panel de Profesor</h1>
                <p className="text-sm text-gray-400">Bienvenido, {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                <SettingsIcon className="w-4 h-4" strokeWidth={1.5} />
                Configuración
              </button>
              <button 
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                <LogOutIcon className="w-4 h-4" strokeWidth={1.5} />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Navigation Tabs */}
        <nav className="mb-8 bg-gray-800 rounded-xl p-2 flex gap-2 overflow-x-auto">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`
                  flex items-center gap-2 px-4 py-3 rounded-lg transition-all whitespace-nowrap
                  ${isActive 
                    ? `bg-${item.color}-600 text-white shadow-lg scale-105` 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {item.badge && (
                  <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Content Area */}
        <div className="animate-fadeIn">
          {activeView === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  icon={GraduationCapIcon}
                  title="Estudiantes Activos"
                  value={stats.activeStudents}
                  subtitle={`de ${stats.totalStudents} totales`}
                  color="blue"
                />
                <StatCard
                  icon={LibraryIcon}
                  title="Lecciones Creadas"
                  value={stats.totalLessons}
                  subtitle={`en ${stats.totalModules} módulos`}
                  color="purple"
                />
                <StatCard
                  icon={MailIcon}
                  title="Mensajes Pendientes"
                  value={stats.pendingMessages}
                  subtitle="requieren respuesta"
                  color="green"
                  urgent={stats.pendingMessages > 0}
                />
                <StatCard
                  icon={TrendingUpIcon}
                  title="Tasa de Completitud"
                  value={`${stats.completionRate}%`}
                  subtitle="promedio del curso"
                  color="orange"
                />
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FilePlusIcon className="w-6 h-6" strokeWidth={1.5} />
                  Acciones Rápidas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <QuickActionButton
                    icon={FilePlusIcon}
                    title="Nueva Lección"
                    description="Crear contenido nuevo"
                    onClick={() => setActiveView('content')}
                    color="blue"
                  />
                  <QuickActionButton
                    icon={MegaphoneIcon}
                    title="Enviar Anuncio"
                    description="Comunicar con estudiantes"
                    onClick={() => setActiveView('communication')}
                    color="green"
                  />
                  <QuickActionButton
                    icon={LineChartIcon}
                    title="Ver Analíticas"
                    description="Progreso de estudiantes"
                    onClick={() => setActiveView('analytics')}
                    color="purple"
                  />
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <ClockIcon className="w-6 h-6" strokeWidth={1.5} />
                  Actividad Reciente
                </h2>
                <div className="space-y-3">
                  <ActivityItem
                    icon={UserIcon}
                    text="Juan completó la lección: Variables en Python"
                    time="Hace 5 minutos"
                  />
                  <ActivityItem
                    icon={MessageSquareIcon}
                    text="María envió un mensaje sobre funciones"
                    time="Hace 15 minutos"
                  />
                  <ActivityItem
                    icon={CheckCircleIcon}
                    text="5 estudiantes completaron el Módulo 1"
                    time="Hace 1 hora"
                  />
                </div>
              </div>
            </div>
          )}

          {activeView === 'content' && <CourseManagement />}
          {activeView === 'communication' && <StudentCommunication />}
          {activeView === 'analytics' && <AnalyticsDashboard />}
          {activeView === 'library' && <ContentLibrary />}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

// Componentes auxiliares
interface StatCardProps {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  value: number | string;
  subtitle: string;
  color: string;
  urgent?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, subtitle, color, urgent }) => (
  <div className={`bg-gray-800 rounded-xl p-6 border-2 ${urgent ? 'border-red-500 animate-pulse' : 'border-gray-700'} hover:scale-105 transition-transform`}>
    <div className="flex items-center justify-between mb-4">
      <div className={`w-14 h-14 bg-${color}-500/20 rounded-xl flex items-center justify-center`}>
        <Icon className={`w-8 h-8 text-${color}-400`} strokeWidth={1.5} />
      </div>
      <div className={`w-3 h-3 bg-${color}-500 rounded-full ${urgent ? 'animate-ping' : ''}`}></div>
    </div>
    <h3 className="text-gray-400 text-sm mb-1 font-medium">{title}</h3>
    <p className="text-3xl font-bold mb-1 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">{value}</p>
    <p className="text-gray-500 text-xs">{subtitle}</p>
  </div>
);

interface QuickActionButtonProps {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  description: string;
  onClick: () => void;
  color: string;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ icon: Icon, title, description, onClick, color }) => (
  <button
    onClick={onClick}
    className={`bg-gray-700 hover:bg-${color}-600/20 border-2 border-gray-600 hover:border-${color}-500 rounded-xl p-6 text-left transition-all group hover:scale-105`}
  >
    <div className={`w-12 h-12 bg-${color}-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-${color}-500/30 transition-colors`}>
      <Icon className={`w-6 h-6 text-${color}-400 group-hover:scale-110 transition-transform`} strokeWidth={1.5} />
    </div>
    <h3 className="font-bold mb-2">{title}</h3>
    <p className="text-sm text-gray-400">{description}</p>
  </button>
);

interface ActivityItemProps {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  text: string;
  time: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ icon: Icon, text, time }) => (
  <div className="flex items-start gap-4 p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors group">
    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/30 transition-colors">
      <Icon className="w-5 h-5 text-blue-400" strokeWidth={1.5} />
    </div>
    <div className="flex-1">
      <p className="text-sm font-medium">{text}</p>
      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
        <ClockIcon className="w-3 h-3" strokeWidth={1.5} />
        {time}
      </p>
    </div>
  </div>
);

export default ProfessorDashboard;
