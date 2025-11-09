import React, { useState, useEffect } from 'react';
import { BellIcon } from './icons';

interface Announcement {
  id: number;
  title: string;
  message: string;
  priority: 'high' | 'normal' | 'low';
  published: boolean;
  createdAt: string;
  professor: {
    id: number;
    name: string;
    email: string;
  };
}

const StudentAnnouncements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/announcements');
      const data = await response.json();
      if (data.success) {
        setAnnouncements(data.data);
      }
    } catch (error) {
      console.error('Error al cargar anuncios:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'low':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      default:
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return '🔴 Importante';
      case 'low':
        return '🔵 Info';
      default:
        return '🟡 Normal';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'Ahora mismo';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
    if (diffInHours < 24) return `Hace ${diffInHours}h`;
    if (diffInDays === 1) return 'Ayer';
    if (diffInDays < 7) return `Hace ${diffInDays} días`;
    
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  const unreadCount = announcements.length; // Todos son "nuevos" por ahora

  return (
    <>
      {/* Botón flotante de notificaciones */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110 z-40"
        title="Ver anuncios del profesor"
      >
        <div className="relative">
          <BellIcon className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </div>
      </button>

      {/* Panel lateral de anuncios */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-gray-900 shadow-2xl z-50 overflow-hidden flex flex-col animate-slide-in">
            {/* Header */}
            <div className="bg-gray-800 p-4 border-b border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BellIcon className="w-6 h-6 text-blue-400" />
                <div>
                  <h2 className="text-xl font-bold text-white">Anuncios</h2>
                  <p className="text-xs text-gray-400">
                    {unreadCount} {unreadCount === 1 ? 'anuncio' : 'anuncios'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-gray-400">Cargando anuncios...</div>
                </div>
              ) : announcements.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <BellIcon className="w-16 h-16 text-gray-600 mb-3" />
                  <p className="text-gray-400 text-lg">No hay anuncios</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Los anuncios del profesor aparecerán aquí
                  </p>
                </div>
              ) : (
                announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-white font-bold text-lg flex-1">
                        {announcement.title}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ml-2 ${getPriorityColor(
                          announcement.priority
                        )}`}
                      >
                        {getPriorityLabel(announcement.priority)}
                      </span>
                    </div>

                    <p className="text-gray-300 text-sm whitespace-pre-wrap mb-3">
                      {announcement.message}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        👨‍🏫 {announcement.professor.name}
                      </span>
                      <span className="flex items-center gap-1">
                        🕐 {formatDate(announcement.createdAt)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-800 p-4 border-t border-gray-700">
              <button
                onClick={fetchAnnouncements}
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:bg-gray-600"
              >
                {loading ? '🔄 Actualizando...' : '🔄 Actualizar'}
              </button>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default StudentAnnouncements;
