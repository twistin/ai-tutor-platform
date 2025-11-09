import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BellIcon, PlusIcon, PencilIcon, TrashIcon, EyeIcon, EyeSlashIcon, SendIcon, CheckCircleIcon, ClockIcon } from './icons';

interface Announcement {
  id: number;
  title: string;
  message: string;
  priority: 'high' | 'normal' | 'low';
  published: boolean;
  createdAt: string;
  updatedAt: string;
  professorId: number;
  professor: {
    id: number;
    name: string;
    email: string;
  };
  lessonId?: number | null;
  moduleId?: number | null;
}

interface StudentMessage {
  id: number;
  subject: string;
  message: string;
  category: string;
  status: 'pending' | 'answered' | 'closed';
  createdAt: string;
  response?: string;
  respondedAt?: string;
  student: {
    id: number;
    name: string;
    email: string;
  };
}

interface AnnouncementFormData {
  title: string;
  message: string;
  priority: 'high' | 'normal' | 'low';
  published: boolean;
}

const StudentCommunication: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'announcements' | 'messages'>('announcements');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [studentMessages, setStudentMessages] = useState<StudentMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [respondingTo, setRespondingTo] = useState<number | null>(null);
  const [responseText, setResponseText] = useState('');
  const [formData, setFormData] = useState<AnnouncementFormData>({
    title: '',
    message: '',
    priority: 'normal',
    published: true
  });
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
    fetchStudentMessages();
  }, [showAll]);

  const fetchStudentMessages = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/messages');
      const data = await response.json();
      if (data.success) {
        setStudentMessages(data.data);
      }
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/announcements');
      const data = await response.json();
      
      if (data.success) {
        const filtered = showAll
          ? data.data
          : data.data.filter((ann: Announcement) => ann.published);
        setAnnouncements(filtered);
      }
    } catch (error) {
      console.error('Error al cargar anuncios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingId
        ? `http://localhost:8080/api/announcements/${editingId}`
        : 'http://localhost:8080/api/announcements';
      
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          professorId: user?.id
        })
      });

      const data = await response.json();

      if (data.success) {
        fetchAnnouncements();
        resetForm();
      } else {
        alert(data.error || 'Error al guardar el anuncio');
      }
    } catch (error) {
      console.error('Error al guardar anuncio:', error);
      alert('Error al guardar el anuncio');
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingId(announcement.id);
    setFormData({
      title: announcement.title,
      message: announcement.message,
      priority: announcement.priority,
      published: announcement.published
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este anuncio?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/announcements/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        fetchAnnouncements();
      } else {
        alert(data.error || 'Error al eliminar el anuncio');
      }
    } catch (error) {
      console.error('Error al eliminar anuncio:', error);
      alert('Error al eliminar el anuncio');
    }
  };

  const togglePublished = async (announcement: Announcement) => {
    try {
      const response = await fetch(`http://localhost:8080/api/announcements/${announcement.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          published: !announcement.published
        })
      });

      const data = await response.json();

      if (data.success) {
        fetchAnnouncements();
      }
    } catch (error) {
      console.error('Error al cambiar visibilidad:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      priority: 'normal',
      published: true
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleRespondMessage = async (messageId: number) => {
    if (!responseText.trim()) {
      alert('Por favor escribe una respuesta');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/messages/${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          response: responseText,
          status: 'answered',
          respondedBy: user?.id
        })
      });

      const data = await response.json();

      if (data.success) {
        fetchStudentMessages();
        setRespondingTo(null);
        setResponseText('');
        alert('✅ Respuesta enviada');
      } else {
        alert(data.error || 'Error al enviar respuesta');
      }
    } catch (error) {
      console.error('Error al responder mensaje:', error);
      alert('Error al enviar respuesta');
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    if (!confirm('¿Estás seguro de eliminar este mensaje?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/messages/${messageId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        fetchStudentMessages();
        alert('✅ Mensaje eliminado');
      } else {
        alert(data.error || 'Error al eliminar mensaje');
      }
    } catch (error) {
      console.error('Error al eliminar mensaje:', error);
      alert('Error al eliminar mensaje');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'answered':
        return (
          <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30 flex items-center gap-1">
            <CheckCircleIcon className="w-4 h-4" />
            Respondido
          </span>
        );
      case 'closed':
        return (
          <span className="px-3 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full border border-gray-500/30">
            Cerrado
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full border border-yellow-500/30 flex items-center gap-1">
            <ClockIcon className="w-4 h-4" />
            Pendiente
          </span>
        );
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      general: '💬 General',
      lesson: '📚 Lección',
      technical: '⚙️ Técnico',
      other: '📋 Otro'
    };
    return labels[category] || category;
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
        return '🔴 Alta Prioridad';
      case 'low':
        return '🔵 Baja Prioridad';
      default:
        return '🟡 Normal';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-gray-400">Cargando...</div>
      </div>
    );
  }

  const pendingMessagesCount = studentMessages.filter(m => m.status === 'pending').length;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BellIcon className="w-8 h-8 text-blue-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Comunicación con Estudiantes</h2>
            <p className="text-gray-400 text-sm">Gestiona anuncios y responde mensajes</p>
          </div>
        </div>

        {/* Pestañas */}
        <div className="flex gap-2 bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-4 py-2 rounded-md transition-colors font-medium ${
              activeTab === 'announcements'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📢 Anuncios
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2 rounded-md transition-colors font-medium flex items-center gap-2 ${
              activeTab === 'messages'
                ? 'bg-green-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            💬 Mensajes
            {pendingMessagesCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {pendingMessagesCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Contenido de Anuncios */}
      {activeTab === 'announcements' && (
        <>
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              {user?.role === 'PROFESSOR' && (
                <>
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      showAll
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                  >
                    {showAll ? 'Ver solo publicados' : 'Ver todos'}
                  </button>
                  <button
                    onClick={() => {
                      resetForm();
                      setShowForm(!showForm);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                  >
                    <PlusIcon className="w-5 h-5" />
                    Nuevo Anuncio
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Formulario de Crear/Editar */}
          {showForm && user?.role === 'PROFESSOR' && (
            <div className="mb-6 bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">
                {editingId ? 'Editar Anuncio' : 'Crear Nuevo Anuncio'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Título
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Título del anuncio..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Mensaje
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                    placeholder="Escribe tu mensaje aquí..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Prioridad
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData({ ...formData, priority: e.target.value as any })
                      }
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">🔵 Baja</option>
                      <option value="normal">🟡 Normal</option>
                      <option value="high">🔴 Alta</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Estado
                    </label>
                    <select
                      value={formData.published ? 'published' : 'draft'}
                      onChange={(e) =>
                        setFormData({ ...formData, published: e.target.value === 'published' })
                      }
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="published">✅ Publicado</option>
                      <option value="draft">📝 Borrador</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                  >
                    {editingId ? 'Actualizar' : 'Crear'} Anuncio
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lista de Anuncios */}
          <div className="space-y-4">
            {announcements.length === 0 ? (
              <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
                <BellIcon className="w-16 h-16 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 text-lg">No hay anuncios todavía</p>
                {user?.role === 'PROFESSOR' && (
                  <p className="text-gray-500 text-sm mt-2">
                    Crea el primer anuncio para tus estudiantes
                  </p>
                )}
              </div>
            ) : (
              announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className={`bg-gray-800 rounded-lg p-5 border ${
                    announcement.published ? 'border-gray-700' : 'border-yellow-600/30'
                  } hover:border-gray-600 transition-colors`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{announcement.title}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                            announcement.priority
                          )}`}
                        >
                          {getPriorityLabel(announcement.priority)}
                        </span>
                        {!announcement.published && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">
                            📝 Borrador
                          </span>
                        )}
                      </div>

                      <p className="text-gray-300 whitespace-pre-wrap mb-3">
                        {announcement.message}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>👤 {announcement.professor.name}</span>
                        <span>📅 {formatDate(announcement.createdAt)}</span>
                        {announcement.updatedAt !== announcement.createdAt && (
                          <span className="text-gray-600">
                            (editado: {formatDate(announcement.updatedAt)})
                          </span>
                        )}
                      </div>
                    </div>

                    {user?.role === 'PROFESSOR' && (
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => togglePublished(announcement)}
                          className={`p-2 rounded-lg transition-colors ${
                            announcement.published
                              ? 'bg-green-600/20 hover:bg-green-600/30 text-green-400'
                              : 'bg-gray-700 hover:bg-gray-600 text-gray-400'
                          }`}
                          title={announcement.published ? 'Ocultar' : 'Publicar'}
                        >
                          {announcement.published ? (
                            <EyeIcon className="w-5 h-5" />
                          ) : (
                            <EyeSlashIcon className="w-5 h-5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEdit(announcement)}
                          className="p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(announcement.id)}
                          className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Contenido de Mensajes de Estudiantes */}
      {activeTab === 'messages' && (
        <div className="space-y-4">
          {studentMessages.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-12 text-center border border-gray-700">
              <SendIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No hay mensajes</h3>
              <p className="text-gray-400">
                Los mensajes de los estudiantes aparecerán aquí
              </p>
            </div>
          ) : (
            studentMessages.map((msg) => (
              <div
                key={msg.id}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{msg.subject}</h3>
                      {getStatusBadge(msg.status)}
                      <span className="text-sm text-gray-500">{getCategoryLabel(msg.category)}</span>
                    </div>
                    <p className="text-sm text-gray-400">
                      👤 {msg.student.name} • 📅 {formatDate(msg.createdAt)}
                    </p>
                  </div>
                  {user?.role === 'PROFESSOR' && (
                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="mb-4">
                  <p className="text-gray-300 whitespace-pre-wrap">{msg.message}</p>
                </div>

                {msg.response ? (
                  <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-green-400 font-semibold">👨‍🏫 Tu respuesta:</span>
                      {msg.respondedAt && (
                        <span className="text-xs text-gray-500">
                          {formatDate(msg.respondedAt)}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-300 whitespace-pre-wrap">{msg.response}</p>
                  </div>
                ) : user?.role === 'PROFESSOR' && (
                  <div className="mt-4">
                    {respondingTo === msg.id ? (
                      <div className="space-y-3">
                        <textarea
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                          placeholder="Escribe tu respuesta..."
                          rows={4}
                          className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500 text-white"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleRespondMessage(msg.id)}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors font-medium flex items-center gap-2"
                          >
                            <SendIcon className="w-4 h-4" />
                            Enviar Respuesta
                          </button>
                          <button
                            onClick={() => {
                              setRespondingTo(null);
                              setResponseText('');
                            }}
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors font-medium"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setRespondingTo(msg.id)}
                        className="px-4 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg transition-colors font-medium flex items-center gap-2"
                      >
                        <SendIcon className="w-4 h-4" />
                        Responder
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default StudentCommunication;
