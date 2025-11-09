import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import CourseManagement from './CourseManagement';
import StudentCommunication from './StudentCommunication';
import AnalyticsDashboard from './AnalyticsDashboard';
import ContentLibrary from './ContentLibrary';
import { 
  BookOpenIcon, 
  BellIcon, 
  ChartBarIcon, 
  FolderIcon,
  UsersIcon,
  ClockIcon
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
      icon: ChartBarIcon, 
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
      icon: BellIcon, 
      color: 'green',
      badge: stats.pendingMessages > 0 ? stats.pendingMessages : null 
    },
    { 
      id: 'analytics' as const, 
      label: 'Analíticas', 
      icon: ChartBarIcon, 
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
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-2xl">
                👨‍🏫
              </div>
              <div>
                <h1 className="text-2xl font-bold">Panel de Profesor</h1>
                <p className="text-sm text-gray-400">Bienvenido, {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                ⚙️ Configuración
              </button>
              <button 
                onClick={logout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                🚪 Cerrar Sesión
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
                  icon="👥"
                  title="Estudiantes Activos"
                  value={stats.activeStudents}
                  subtitle={`de ${stats.totalStudents} totales`}
                  color="blue"
                />
                <StatCard
                  icon="📚"
                  title="Lecciones Creadas"
                  value={stats.totalLessons}
                  subtitle={`en ${stats.totalModules} módulos`}
                  color="purple"
                />
                <StatCard
                  icon="💬"
                  title="Mensajes Pendientes"
                  value={stats.pendingMessages}
                  subtitle="requieren respuesta"
                  color="green"
                  urgent={stats.pendingMessages > 0}
                />
                <StatCard
                  icon="📊"
                  title="Tasa de Completitud"
                  value={`${stats.completionRate}%`}
                  subtitle="promedio del curso"
                  color="orange"
                />
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4">🚀 Acciones Rápidas</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <QuickActionButton
                    icon="➕"
                    title="Nueva Lección"
                    description="Crear contenido nuevo"
                    onClick={() => setActiveView('content')}
                    color="blue"
                  />
                  <QuickActionButton
                    icon="📢"
                    title="Enviar Anuncio"
                    description="Comunicar con estudiantes"
                    onClick={() => setActiveView('communication')}
                    color="green"
                  />
                  <QuickActionButton
                    icon="📊"
                    title="Ver Analíticas"
                    description="Progreso de estudiantes"
                    onClick={() => setActiveView('analytics')}
                    color="purple"
                  />
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4">⏰ Actividad Reciente</h2>
                <div className="space-y-3">
                  <ActivityItem
                    icon="👤"
                    text="Juan completó la lección: Variables en Python"
                    time="Hace 5 minutos"
                  />
                  <ActivityItem
                    icon="💬"
                    text="María envió un mensaje sobre funciones"
                    time="Hace 15 minutos"
                  />
                  <ActivityItem
                    icon="✅"
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
  icon: string;
  title: string;
  value: number | string;
  subtitle: string;
  color: string;
  urgent?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, subtitle, color, urgent }) => (
  <div className={`bg-gray-800 rounded-xl p-6 border-2 ${urgent ? 'border-red-500 animate-pulse' : 'border-gray-700'} hover:scale-105 transition-transform`}>
    <div className="flex items-center justify-between mb-4">
      <span className="text-4xl">{icon}</span>
      <div className={`w-12 h-12 bg-${color}-500/20 rounded-lg flex items-center justify-center`}>
        <div className={`w-6 h-6 bg-${color}-500 rounded-full`}></div>
      </div>
    </div>
    <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
    <p className="text-3xl font-bold mb-1">{value}</p>
    <p className="text-gray-500 text-xs">{subtitle}</p>
  </div>
);

interface QuickActionButtonProps {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
  color: string;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ icon, title, description, onClick, color }) => (
  <button
    onClick={onClick}
    className={`bg-gray-700 hover:bg-${color}-600/20 border-2 border-gray-600 hover:border-${color}-500 rounded-xl p-4 text-left transition-all group`}
  >
    <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">{icon}</span>
    <h3 className="font-bold mb-1">{title}</h3>
    <p className="text-sm text-gray-400">{description}</p>
  </button>
);

interface ActivityItemProps {
  icon: string;
  text: string;
  time: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ icon, text, time }) => (
  <div className="flex items-start gap-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
    <span className="text-2xl">{icon}</span>
    <div className="flex-1">
      <p className="text-sm">{text}</p>
      <p className="text-xs text-gray-500 mt-1">{time}</p>
    </div>
  </div>
);

export default ProfessorDashboard;
