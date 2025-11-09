import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SendIcon, CheckCircleIcon, ClockIcon } from './icons';

interface Message {
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

const StudentMessaging: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    category: 'general'
  });

  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user]);

  const fetchMessages = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/messages?studentId=${user.id}`);
      const data = await response.json();
      if (data.success) {
        setMessages(data.data);
      }
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject.trim() || !formData.message.trim()) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          studentId: user?.id
        })
      });

      const data = await response.json();

      if (data.success) {
        fetchMessages();
        setFormData({ subject: '', message: '', category: 'general' });
        setShowForm(false);
        alert('✅ Mensaje enviado al profesor');
      } else {
        alert(data.error || 'Error al enviar el mensaje');
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      alert('Error al enviar el mensaje');
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      general: '💬 General',
      lesson: '📚 Sobre lección',
      technical: '⚙️ Técnico',
      other: '📋 Otro'
    };
    return labels[category] || category;
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
            ✓ Cerrado
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">💬 Mis Mensajes al Profesor</h1>
              <p className="text-gray-400">
                Envía tus preguntas, dudas o comentarios y recibe respuestas personalizadas
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium flex items-center gap-2"
            >
              <SendIcon className="w-5 h-5" />
              {showForm ? 'Cancelar' : 'Nuevo Mensaje'}
            </button>
          </div>

          {/* Formulario */}
          {showForm && (
            <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
              <h3 className="text-xl font-bold mb-4">✉️ Enviar mensaje al profesor</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Asunto *</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Ej: Duda sobre bucles for"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Categoría</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="general">💬 General</option>
                    <option value="lesson">📚 Sobre lección</option>
                    <option value="technical">⚙️ Técnico</option>
                    <option value="other">📋 Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Mensaje *</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe tu pregunta o comentario..."
                    rows={6}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium flex items-center gap-2"
                  >
                    <SendIcon className="w-5 h-5" />
                    Enviar Mensaje
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setFormData({ subject: '', message: '', category: 'general' });
                    }}
                    className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Lista de mensajes */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-400">Cargando mensajes...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-12 text-center border border-gray-700">
            <SendIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No tienes mensajes</h3>
            <p className="text-gray-400 mb-6">
              Envía tu primera pregunta o comentario al profesor
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium inline-flex items-center gap-2"
            >
              <SendIcon className="w-5 h-5" />
              Enviar Primer Mensaje
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{msg.subject}</h3>
                      {getStatusBadge(msg.status)}
                      <span className="text-sm text-gray-500">{getCategoryLabel(msg.category)}</span>
                    </div>
                    <p className="text-sm text-gray-400">
                      📅 {formatDate(msg.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-300 whitespace-pre-wrap">{msg.message}</p>
                </div>

                {msg.response && (
                  <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-green-400 font-semibold">👨‍🏫 Respuesta del profesor:</span>
                      {msg.respondedAt && (
                        <span className="text-xs text-gray-500">
                          {formatDate(msg.respondedAt)}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-300 whitespace-pre-wrap">{msg.response}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentMessaging;
