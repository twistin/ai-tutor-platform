import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpenIcon, AcademicCapIcon } from '../components/icons';
import ThemeToggle from '../components/ThemeToggle';
import { useAuth } from '../contexts/AuthContext';
import { mockLogin } from '../services/mockAPIService';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleQuickLogin = async (username: string) => {
    const user = await mockLogin(username);
    if (user) {
      login(user);
      navigate('/dashboard');
    } else {
      alert('Error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 dark:from-gray-900 dark:via-gray-800 dark:to-black bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      {/* Theme Toggle - Posición fija arriba a la derecha */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-yellow-400 p-4 rounded-full animate-bounce">
              <span className="text-6xl">🐍</span>
            </div>
          </div>
          <h1 className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-pink-500">
            AI Python Tutor
          </h1>
          <p className="text-2xl mb-8 text-gray-300">
            Aprende Python con Inteligencia Artificial
          </p>
          <p className="text-xl max-w-3xl mx-auto text-gray-400">
            Plataforma educativa interactiva diseñada para adolescentes que quieren 
            dominar Python desde cero con la ayuda de IA
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
            <div className="text-4xl mb-4">💡</div>
            <h3 className="text-xl font-bold mb-2">Explicaciones con IA</h3>
            <p className="text-gray-300">
              La IA explica tu código línea por línea, adaptándose a tu nivel
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
            <div className="text-4xl mb-4">🐍</div>
            <h3 className="text-xl font-bold mb-2">Consola Interactiva</h3>
            <p className="text-gray-300">
              Escribe y ejecuta código Python directamente en tu navegador
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-bold mb-2">7 Módulos Completos</h3>
            <p className="text-gray-300">
              30+ lecciones estructuradas en 14 semanas de aprendizaje
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
            <div className="text-4xl mb-4">❓</div>
            <h3 className="text-xl font-bold mb-2">Asistente Virtual 24/7</h3>
            <p className="text-gray-300">
              Haz preguntas sobre las lecciones y recibe respuestas al instante
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-2">Aprendizaje Práctico</h3>
            <p className="text-gray-300">
              Proyectos reales y ejercicios diseñados para adolescentes
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
            <div className="text-4xl mb-4">👨‍🏫</div>
            <h3 className="text-xl font-bold mb-2">Dashboard Profesor</h3>
            <p className="text-gray-300">
              Herramientas para gestionar cursos y seguir el progreso
            </p>
          </div>
        </div>

        {/* Course Content Preview */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">📖 Contenido del Curso</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">1️⃣</span>
                <div>
                  <h4 className="font-bold">Fundamentos de Python</h4>
                  <p className="text-sm text-gray-300">Variables, tipos de datos, operaciones</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">2️⃣</span>
                <div>
                  <h4 className="font-bold">Control de Flujo</h4>
                  <p className="text-sm text-gray-300">Condiciones, bucles, lógica</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">3️⃣</span>
                <div>
                  <h4 className="font-bold">Estructuras de Datos</h4>
                  <p className="text-sm text-gray-300">Listas, tuplas, diccionarios, sets</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">4️⃣</span>
                <div>
                  <h4 className="font-bold">Funciones</h4>
                  <p className="text-sm text-gray-300">Definición, parámetros, scope</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">5️⃣</span>
                <div>
                  <h4 className="font-bold">Programación Orientada a Objetos</h4>
                  <p className="text-sm text-gray-300">Clases, objetos, herencia</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">6️⃣</span>
                <div>
                  <h4 className="font-bold">Archivos y Excepciones</h4>
                  <p className="text-sm text-gray-300">Manejo de archivos, try/except, JSON</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">7️⃣</span>
                <div>
                  <h4 className="font-bold">Proyecto Final</h4>
                  <p className="text-sm text-gray-300">Desarrolla tu propia aplicación</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Access Cards */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">🚀 Prueba la Plataforma</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Student Access */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-white p-4 rounded-full">
                  <BookOpenIcon className="w-12 h-12 text-blue-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-center">👨‍🎓 Acceso Estudiante</h3>
              <p className="text-center mb-6 text-blue-100">
                Explora las lecciones, ejecuta código y aprende con la IA
              </p>
              <div className="bg-white/20 rounded-lg p-4 mb-6">
                <p className="text-sm font-mono mb-1">Usuario:</p>
                <p className="text-xl font-bold mb-3">estudiante</p>
                <p className="text-xs text-blue-100">
                  ✨ Acceso completo a todas las lecciones
                  <br />
                  ✨ Consola Python interactiva
                  <br />
                  ✨ Asistente de IA disponible
                </p>
              </div>
              <button
                onClick={() => handleQuickLogin('estudiante')}
                className="block w-full bg-white text-blue-600 py-3 px-6 rounded-lg font-bold hover:bg-blue-50 transition-colors text-center"
              >
                Comenzar como Estudiante
              </button>
            </div>

            {/* Teacher Access */}
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-white p-4 rounded-full">
                  <AcademicCapIcon className="w-12 h-12 text-purple-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-center">👨‍🏫 Acceso Profesor</h3>
              <p className="text-center mb-6 text-purple-100">
                Gestiona cursos y supervisa el progreso de estudiantes
              </p>
              <div className="bg-white/20 rounded-lg p-4 mb-6">
                <p className="text-sm font-mono mb-1">Usuario:</p>
                <p className="text-xl font-bold mb-3">profesor</p>
                <p className="text-xs text-purple-100">
                  ✨ Dashboard de gestión
                  <br />
                  ✨ Crear y editar cursos
                  <br />
                  ✨ Anuncios y comunicación
                </p>
              </div>
              <button
                onClick={() => handleQuickLogin('profesor')}
                className="block w-full bg-white text-purple-600 py-3 px-6 rounded-lg font-bold hover:bg-purple-50 transition-colors text-center"
              >
                Acceder como Profesor
              </button>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-4">Construido con tecnología moderna</p>
          <div className="flex items-center justify-center space-x-6 text-2xl">
            <span title="React">⚛️</span>
            <span title="TypeScript">📘</span>
            <span title="Tailwind CSS">🎨</span>
            <span title="Google Gemini AI">🤖</span>
            <span title="Vite">⚡</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-400 text-sm">
          <p>© 2025 AI Python Tutor - Plataforma educativa de demostración</p>
          <p className="mt-2">Diseñado para adolescentes de 15 años que quieren aprender Python</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
