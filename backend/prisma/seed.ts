import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Limpiar datos existentes (en orden correcto por las foreign keys)
  await prisma.announcement.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.progress.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Datos anteriores eliminados');

  // Crear usuarios de prueba con IDs fijos para coincidir con el mock del frontend
  const student = await prisma.user.create({
    data: {
      id: 1,
      email: 'estudiante@test.com',
      password: 'password123', // En producción esto debe estar hasheado
      role: 'STUDENT',
      name: 'Estudiante Demo'
    }
  });

  const professor = await prisma.user.create({
    data: {
      id: 2,
      email: 'profesor@test.com',
      password: 'password123', // En producción esto debe estar hasheado
      role: 'PROFESSOR',
      name: 'Profesor Demo'
    }
  });

  console.log('👥 Usuarios creados:', { student, professor });

  // Crear módulos
  const module1 = await prisma.module.create({
    data: {
      title: 'Módulo 1: Introducción a Python',
      order: 1,
      published: true
    }
  });

  const module2 = await prisma.module.create({
    data: {
      title: 'Módulo 2: Control de Flujo',
      order: 2,
      published: true
    }
  });

  const module3 = await prisma.module.create({
    data: {
      title: 'Módulo 3: Estructuras de Datos',
      order: 3,
      published: true
    }
  });

  console.log('📦 Módulos creados:', { module1, module2, module3 });

  // Crear lecciones de prueba para cada módulo
  const lessons = await prisma.lesson.createMany({
    data: [
      // Módulo 1: Introducción a Python
      { 
        title: '¿Qué es Python?', 
        moduleId: module1.id, 
        order: 1, 
        content: '# ¿Qué es Python?\n\nPython es un lenguaje de programación de alto nivel, interpretado y de propósito general.',
        published: true
      },
      { 
        title: 'Tu primer programa', 
        moduleId: module1.id, 
        order: 2, 
        content: '# Tu primer programa\n\nAprende a escribir tu primer programa en Python usando `print()`.',
        published: true
      },
      { 
        title: 'Variables y tipos de datos', 
        moduleId: module1.id, 
        order: 3, 
        content: '# Variables y Tipos de Datos\n\nLas variables son contenedores para almacenar valores.',
        published: true
      },
      { 
        title: 'Operaciones básicas', 
        moduleId: module1.id, 
        order: 4, 
        content: '# Operaciones Básicas\n\nAprende a realizar operaciones matemáticas en Python.',
        published: true
      },
      { 
        title: 'Entrada y salida', 
        moduleId: module1.id, 
        order: 5, 
        content: '# Entrada y Salida\n\nUsa `input()` para recibir datos del usuario y `print()` para mostrarlos.',
        published: true
      },
      
      // Módulo 2: Control de Flujo
      { 
        title: 'Condicionales: if, elif, else', 
        moduleId: module2.id, 
        order: 1, 
        content: '# Condicionales\n\nLas estructuras condicionales permiten tomar decisiones en tu código.',
        published: true
      },
      { 
        title: 'Bucle while', 
        moduleId: module2.id, 
        order: 2, 
        content: '# Bucle While\n\nEl bucle `while` repite un bloque de código mientras una condición sea verdadera.',
        published: true
      },
      { 
        title: 'Bucle for', 
        moduleId: module2.id, 
        order: 3, 
        content: '# Bucle For\n\nEl bucle `for` itera sobre una secuencia de elementos.',
        published: true
      },
      { 
        title: 'Control de bucles', 
        moduleId: module2.id, 
        order: 4, 
        content: '# Control de Bucles\n\nUsa `break` para salir de un bucle y `continue` para saltar a la siguiente iteración.',
        published: true
      },
      
      // Módulo 3: Estructuras de Datos
      { 
        title: 'Listas', 
        moduleId: module3.id, 
        order: 1, 
        content: '# Listas\n\nLas listas son colecciones ordenadas y mutables de elementos.',
        published: true
      },
      { 
        title: 'Tuplas', 
        moduleId: module3.id, 
        order: 2, 
        content: '# Tuplas\n\nLas tuplas son colecciones ordenadas e inmutables.',
        published: true
      },
      { 
        title: 'Diccionarios', 
        moduleId: module3.id, 
        order: 3, 
        content: '# Diccionarios\n\nLos diccionarios almacenan pares clave-valor.',
        published: true
      },
      { 
        title: 'Conjuntos', 
        moduleId: module3.id, 
        order: 4, 
        content: '# Conjuntos\n\nLos sets son colecciones no ordenadas de elementos únicos.',
        published: true
      },
      { 
        title: 'Comprensión de listas', 
        moduleId: module3.id, 
        order: 5, 
        content: '# List Comprehension\n\nUna forma elegante de crear listas en Python.',
        published: true
      },
    ]
  });

  console.log('📚 Lecciones creadas:', lessons.count);

  // Obtener las lecciones creadas para usar sus IDs reales
  const allLessons = await prisma.lesson.findMany({
    orderBy: { id: 'asc' }
  });

  // Crear progreso de prueba para el estudiante
  const progress = await prisma.progress.createMany({
    data: [
      { userId: student.id, lessonId: allLessons[0].id, completed: true, lastSubmittedCode: 'print("Hola Mundo")' },
      { userId: student.id, lessonId: allLessons[1].id, completed: true, lastSubmittedCode: 'print("Mi primer programa")' },
      { userId: student.id, lessonId: allLessons[4].id, completed: true, lastSubmittedCode: 'nombre = input("Tu nombre: ")\nprint(f"Hola {nombre}")' },
    ]
  });

  console.log('📊 Progreso creado:', progress.count);

  // Crear logs de actividad de ejemplo
  const activityLogs = await prisma.activityLog.createMany({
    data: [
      // Login del estudiante
      { 
        userId: student.id, 
        eventType: 'LOGIN',
        details: JSON.stringify({ ip: '192.168.1.100', userAgent: 'Chrome/120.0' })
      },
      // Estudiante vio lección 1
      { 
        userId: student.id, 
        eventType: 'LESSON_VIEWED',
        details: JSON.stringify({ lessonId: allLessons[0].id, lessonTitle: allLessons[0].title })
      },
      // Estudiante envió código
      { 
        userId: student.id, 
        eventType: 'CODE_SUBMITTED',
        details: JSON.stringify({ 
          lessonId: allLessons[0].id, 
          code: 'print("Hola Mundo")',
          success: true 
        })
      },
      // Estudiante hizo una pregunta a la IA
      { 
        userId: student.id, 
        eventType: 'AI_QUERY_ASKED',
        details: JSON.stringify({ 
          question: '¿Qué hace la función print?',
          lessonId: allLessons[0].id
        })
      },
      // Estudiante vio lección 2
      { 
        userId: student.id, 
        eventType: 'LESSON_VIEWED',
        details: JSON.stringify({ lessonId: allLessons[1].id, lessonTitle: allLessons[1].title })
      },
      // Login del profesor
      { 
        userId: professor.id, 
        eventType: 'LOGIN',
        details: JSON.stringify({ ip: '192.168.1.101', userAgent: 'Firefox/120.0' })
      },
    ]
  });

  console.log('📋 Logs de actividad creados:', activityLogs.count);

  // Obtener los IDs de progreso creados
  const progressRecords = await prisma.progress.findMany({
    where: { userId: student.id },
    select: { id: true, lessonId: true }
  });

  // Crear feedbacks de ejemplo del profesor al estudiante
  const feedbacks = await prisma.feedback.createMany({
    data: [
      // Feedback positivo en la primera lección completada
      {
        studentId: student.id,
        professorId: professor.id,
        lessonId: progressRecords[0].lessonId,
        progressId: progressRecords[0].id,
        comment: '¡Excelente trabajo! Tu código está bien estructurado y funciona correctamente. Sigue así 👏',
        rating: 5
      },
      // Feedback constructivo en la segunda lección completada
      {
        studentId: student.id,
        professorId: professor.id,
        lessonId: progressRecords[1].lessonId,
        progressId: progressRecords[1].id,
        comment: 'Buen intento. Te recomiendo revisar la sintaxis de las variables. Recuerda que Python es sensible a mayúsculas y minúsculas.',
        rating: 3
      },
      // Feedback motivacional en la tercera lección
      {
        studentId: student.id,
        professorId: professor.id,
        lessonId: progressRecords[2].lessonId,
        progressId: progressRecords[2].id,
        comment: 'Me gusta cómo estás usando input() y f-strings. Estás progresando muy bien en el curso 🚀',
        rating: 4
      }
    ]
  });

  console.log('💬 Feedbacks creados:', feedbacks.count);

  // Crear anuncios de prueba
  const announcements = await prisma.announcement.createMany({
    data: [
      {
        title: 'Bienvenidos al curso de Python',
        message: '¡Hola estudiantes! Bienvenidos al curso de Python para adolescentes. Estoy muy emocionado de comenzar este viaje de aprendizaje con ustedes. 🐍',
        priority: 'high',
        published: true,
        professorId: professor.id
      },
      {
        title: 'Nueva lección disponible',
        message: 'Ya está disponible la lección sobre estructuras de datos. Los espero para trabajar juntos en los ejercicios prácticos.',
        priority: 'normal',
        published: true,
        professorId: professor.id
      },
      {
        title: 'Recordatorio de tareas',
        message: 'No olviden completar los ejercicios de la semana. Tienen hasta el viernes para entregarlos. ¡Ánimo! 💪',
        priority: 'normal',
        published: true,
        professorId: professor.id
      },
      {
        title: 'Borrador: Próximo examen',
        message: 'El examen será la próxima semana. Este es un borrador, aún no lo publiquen.',
        priority: 'low',
        published: false,
        professorId: professor.id
      }
    ]
  });

  console.log('📢 Anuncios creados:', announcements.count);

  console.log('✅ Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
