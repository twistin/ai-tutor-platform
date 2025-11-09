import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpenIcon, GraduationCapIcon, LogInIcon, ArrowRightIcon } from '../components/icons';
import ThemeToggle from '../components/ThemeToggle';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

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

        {/* Call to Action Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4 text-center">🚀 Comienza tu Aventura en Python</h2>
          <p className="text-xl text-gray-300 text-center mb-8">
            Selecciona tu tipo de acceso para ingresar a la plataforma
          </p>
          
          {/* CTA Buttons */}
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
            <button
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 rounded-xl text-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              <div className="flex items-center justify-center gap-3 mb-2">
                <BookOpenIcon className="w-8 h-8" strokeWidth={1.5} />
                <span>Soy Estudiante</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm font-normal opacity-90">
                <span>Comenzar a aprender</span>
                <ArrowRightIcon className="w-4 h-4" strokeWidth={1.5} />
              </div>
            </button>

            <button
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 rounded-xl text-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              <div className="flex items-center justify-center gap-3 mb-2">
                <GraduationCapIcon className="w-8 h-8" strokeWidth={1.5} />
                <span>Soy Profesor</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm font-normal opacity-90">
                <span>Acceder al panel</span>
                <ArrowRightIcon className="w-4 h-4" strokeWidth={1.5} />
              </div>
            </button>
          </div>

          <p className="text-center text-gray-400 text-sm flex items-center justify-center gap-2">
            <LogInIcon className="w-4 h-4" strokeWidth={1.5} />
            <span>Click en cualquier botón para iniciar sesión</span>
          </p>
        </div>

        {/* Demo Credentials Info */}
        <div className="bg-blue-500/10 backdrop-blur-lg rounded-xl p-8 max-w-2xl mx-auto border border-blue-500/20 mb-16">
          <h3 className="text-xl font-bold mb-6 text-center flex items-center justify-center gap-2">
            <span>🔑</span>
            <span>Credenciales de Demo</span>
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-blue-400 font-semibold mb-3 flex items-center gap-2">
                <BookOpenIcon className="w-5 h-5" strokeWidth={1.5} />
                Estudiante:
              </p>
              <p className="font-mono text-gray-300">
                usuario: <span className="text-white font-bold">estudiante</span>
              </p>
              <div className="mt-3 space-y-1 text-xs text-gray-400">
                <p>✨ Acceso a 30+ lecciones</p>
                <p>✨ Consola Python interactiva</p>
                <p>✨ Asistente de IA 24/7</p>
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-purple-400 font-semibold mb-3 flex items-center gap-2">
                <GraduationCapIcon className="w-5 h-5" strokeWidth={1.5} />
                Profesor:
              </p>
              <p className="font-mono text-gray-300">
                usuario: <span className="text-white font-bold">profesor</span>
              </p>
              <div className="mt-3 space-y-1 text-xs text-gray-400">
                <p>✨ Dashboard de gestión</p>
                <p>✨ Crear y editar cursos</p>
                <p>✨ Análisis de progreso</p>
              </div>
            </div>
          </div>
          <p className="text-center text-gray-400 mt-6 text-xs">
            * Aplicación en modo demo - No se requiere contraseña
          </p>
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
