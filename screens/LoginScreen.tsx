import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { mockLogin } from '../services/mockAPIService';
import { DEMO_CREDENTIALS } from '../constants';
import ThemeToggle from '../components/ThemeToggle';
import { GraduationCapIcon, BookOpenIcon, ArrowLeftIcon, LogInIcon } from '../components/icons';

const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const user = await mockLogin(username);
    if (user) {
      login(user);
      navigate('/dashboard');
    } else {
      setError('Usuario no encontrado. Usa "estudiante" o "profesor".');
    }
    setIsLoading(false);
  };

  const handleQuickLogin = async (username: string) => {
    setUsername(username);
    setIsLoading(true);
    setError('');
    const user = await mockLogin(username);
    if (user) {
      login(user);
      navigate('/dashboard');
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900 dark:via-purple-900 dark:to-indigo-900 transition-colors duration-300">
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-2xl p-8 space-y-6">
        {/* Back to Home Link */}
        <div className="text-center mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
          >
            <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" strokeWidth={1.5} />
            <span>Volver al inicio</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4">
            <div className="flex items-center justify-center space-x-2 hover:opacity-80 transition-opacity">
              <span className="text-4xl">🐍</span>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Python Tutor</h1>
            </div>
          </Link>
          <div className="flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300">
            <LogInIcon className="w-5 h-5" strokeWidth={1.5} />
            <p>Selecciona tu tipo de acceso para comenzar</p>
          </div>
        </div>

        {/* Quick Access Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <button
            onClick={() => handleQuickLogin('estudiante')}
            disabled={isLoading}
            className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 text-left shadow-xl group"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white/20 p-3 rounded-full group-hover:scale-110 transition-transform">
                <BookOpenIcon className="w-8 h-8 text-white" strokeWidth={1.5} />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 text-center">Acceso Estudiante</h3>
            <div className="bg-white/20 rounded-lg p-3 mb-3">
              <p className="text-sm text-blue-100 mb-1">Usuario:</p>
              <p className="text-lg font-mono font-bold text-white">estudiante</p>
            </div>
            <p className="text-sm text-blue-100 text-center">Click para acceso rápido →</p>
          </button>

          <button
            onClick={() => handleQuickLogin('profesor')}
            disabled={isLoading}
            className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 text-left shadow-xl group"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white/20 p-3 rounded-full group-hover:scale-110 transition-transform">
                <GraduationCapIcon className="w-8 h-8 text-white" strokeWidth={1.5} />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 text-center">Acceso Profesor</h3>
            <div className="bg-white/20 rounded-lg p-3 mb-3">
              <p className="text-sm text-purple-100 mb-1">Usuario:</p>
              <p className="text-lg font-mono font-bold text-white">profesor</p>
            </div>
            <p className="text-sm text-purple-100 text-center">Click para acceso rápido →</p>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 border-t border-gray-400 dark:border-gray-600"></div>
          <span className="text-gray-600 dark:text-gray-400 text-sm">o escribe el usuario</span>
          <div className="flex-1 border-t border-gray-400 dark:border-gray-600"></div>
        </div>

        {/* Manual Login Form */}
        <div className="bg-white/90 dark:bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-xl">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Usuario
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="estudiante o profesor"
              />
            </div>
            {error && (
              <div className="bg-red-500/20 border border-red-500 rounded-lg p-3">
                <p className="text-red-700 dark:text-red-200 text-sm">{error}</p>
              </div>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-500 transition-colors"
            >
              {isLoading ? '🔄 Iniciando sesión...' : '🚀 Iniciar Sesión'}
            </button>
          </form>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link 
            to="/" 
            className="text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-200 transition-colors text-sm font-medium"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
