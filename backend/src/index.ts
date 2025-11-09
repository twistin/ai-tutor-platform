import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Cargar variables de entorno
dotenv.config();

// Inicializar Prisma Client
const prisma = new PrismaClient();

// Inicializar Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY || '');

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 8080;

// Configurar CORS para permitir frontend en producción
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL || '', // URL de Vercel
].filter(Boolean);

// Middlewares
app.use(cors({
  origin: function(origin, callback) {
    // Permitir requests sin origin (como mobile apps o curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());

// Ruta de prueba
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: '🐍 Hola Mundo desde el Backend de AI Python Tutor!',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// 🚨 ENDPOINT TEMPORAL - Inicializar usuarios y datos (eliminar después de usar)
app.post('/api/init-users', async (req: Request, res: Response) => {
  try {
    console.log('🔧 Inicializando usuarios y datos iniciales...');

    // Crear usuarios
    const student = await prisma.user.create({
      data: {
        id: 1,
        email: 'estudiante@test.com',
        password: 'password123', // En producción real, usar hash
        role: 'STUDENT',
        name: 'Estudiante Demo',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });

    const professor = await prisma.user.create({
      data: {
        id: 2,
        email: 'profesor@test.com',
        password: 'password123', // En producción real, usar hash
        role: 'PROFESSOR',
        name: 'Profesor Demo',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });

    // Crear módulo inicial
    const module1 = await prisma.module.create({
      data: {
        title: 'Introducción a Python',
        order: 1,
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });

    // Crear lecciones
    await prisma.lesson.create({
      data: {
        moduleId: module1.id,
        title: 'Variables y Tipos de Datos',
        content: '# Variables en Python\n\nUna variable es un espacio en memoria donde guardamos información...',
        order: 1,
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });

    await prisma.lesson.create({
      data: {
        moduleId: module1.id,
        title: 'Operadores Básicos',
        content: '# Operadores en Python\n\nLos operadores nos permiten realizar operaciones con variables...',
        order: 2,
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });

    await prisma.lesson.create({
      data: {
        moduleId: module1.id,
        title: 'Estructuras de Control',
        content: '# Estructuras de Control\n\nLas estructuras de control nos permiten tomar decisiones...',
        order: 3,
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });

    // Crear anuncios
    await prisma.announcement.create({
      data: {
        title: '¡Bienvenidos a la Plataforma!',
        message: 'Estamos emocionados de tenerte aquí. Comienza explorando las lecciones disponibles.',
        priority: 'high',
        published: true,
        professorId: professor.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });

    await prisma.announcement.create({
      data: {
        title: 'Nuevo Módulo Disponible',
        message: 'Ya está disponible el módulo de Introducción a Python. ¡No te lo pierdas!',
        priority: 'normal',
        published: true,
        professorId: professor.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });

    console.log('✅ Usuarios y datos iniciales creados exitosamente');

    res.json({
      success: true,
      message: 'Usuarios y datos iniciales creados exitosamente',
      users: [
        { email: student.email, role: student.role },
        { email: professor.email, role: professor.role }
      ],
      module: module1.title,
      lessonsCount: 3,
      announcementsCount: 2
    });

  } catch (error) {
    console.error('❌ Error al inicializar usuarios:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al crear usuarios iniciales',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Ruta de health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// ========================================
// 📊 ENDPOINT: Marcar lección como completada
// ========================================
// POST /api/progress/complete
// Body: { userId: number, lessonId: number, lastSubmittedCode?: string }
app.post('/api/progress/complete', async (req: Request, res: Response) => {
  try {
    const { userId, lessonId, lastSubmittedCode } = req.body;

    // Validar que vengan los datos requeridos
    if (!userId || !lessonId) {
      return res.status(400).json({ 
        error: 'userId y lessonId son requeridos' 
      });
    }

    // Validar que sean números
    if (typeof userId !== 'number' || typeof lessonId !== 'number') {
      return res.status(400).json({ 
        error: 'userId y lessonId deben ser números' 
      });
    }

    // Usar upsert para crear o actualizar el progreso
    // Si existe: actualiza completed a true
    // Si no existe: crea el registro con completed: true
    const progress = await prisma.progress.upsert({
      where: {
        userId_lessonId: {
          userId: userId,
          lessonId: lessonId
        }
      },
      update: {
        completed: true,
        lastSubmittedCode: lastSubmittedCode || undefined,
        updatedAt: new Date()
      },
      create: {
        userId: userId,
        lessonId: lessonId,
        completed: true,
        lastSubmittedCode: lastSubmittedCode || undefined
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true
          }
        },
        lesson: {
          select: {
            id: true,
            title: true,
            moduleId: true,
            order: true
          }
        }
      }
    });

    // Registrar la actividad en el ActivityLog
    await prisma.activityLog.create({
      data: {
        eventType: 'LESSON_VIEWED',
        userId: userId,
        details: JSON.stringify({
          lessonId: lessonId,
          lessonTitle: progress.lesson.title,
          completed: true,
          hasCode: !!lastSubmittedCode
        })
      }
    });

    // Si se envió código, registrar también el evento CODE_SUBMITTED
    if (lastSubmittedCode) {
      await prisma.activityLog.create({
        data: {
          eventType: 'CODE_SUBMITTED',
          userId: userId,
          details: JSON.stringify({
            lessonId: lessonId,
            lessonTitle: progress.lesson.title,
            codeLength: lastSubmittedCode.length,
            success: true
          })
        }
      });
    }

    console.log(`✅ Actividad registrada para usuario ${userId} en lección ${lessonId}`);

    // Devolver el progreso actualizado
    res.status(200).json({
      success: true,
      message: 'Progreso actualizado correctamente',
      data: progress
    });

  } catch (error) {
    console.error('❌ Error al actualizar progreso:', error);
    res.status(500).json({ 
      error: 'Error al actualizar el progreso',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// ========================================
// � ENDPOINT: Obtener estructura completa del curso
// ========================================
// GET /api/course/structure
// Devuelve todos los módulos con sus lecciones anidadas, ordenados
app.get('/api/course/structure', async (req: Request, res: Response) => {
  try {
    // Obtener todos los módulos con sus lecciones anidadas
    const modules = await prisma.module.findMany({
      orderBy: {
        order: 'asc' // Ordenar módulos por su campo order
      },
      include: {
        lessons: {
          orderBy: {
            order: 'asc' // Ordenar lecciones dentro de cada módulo
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      data: modules,
      total: modules.length
    });

  } catch (error) {
    console.error('❌ Error al obtener estructura del curso:', error);
    res.status(500).json({ 
      error: 'Error al obtener la estructura del curso',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// ========================================
//  ENDPOINTS: CRUD de Módulos
// ========================================

// POST /api/modules - Crear nuevo módulo
app.post('/api/modules', async (req: Request, res: Response) => {
  try {
    const { title, order, published = true } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'El título es requerido' });
    }

    const module = await prisma.module.create({
      data: {
        title,
        order: order || 1,
        published
      },
      include: {
        lessons: true
      }
    });

    res.status(201).json({ success: true, data: module });
  } catch (error) {
    console.error('❌ Error al crear módulo:', error);
    res.status(500).json({ 
      error: 'Error al crear el módulo',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// PUT /api/modules/:id - Actualizar módulo
app.put('/api/modules/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, order, published } = req.body;

    const module = await prisma.module.update({
      where: { id: parseInt(id) },
      data: {
        ...(title !== undefined && { title }),
        ...(order !== undefined && { order }),
        ...(published !== undefined && { published })
      },
      include: {
        lessons: {
          orderBy: { order: 'asc' }
        }
      }
    });

    res.status(200).json({ success: true, data: module });
  } catch (error) {
    console.error('❌ Error al actualizar módulo:', error);
    res.status(500).json({ 
      error: 'Error al actualizar el módulo',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// DELETE /api/modules/:id - Eliminar módulo (y sus lecciones en cascada)
app.delete('/api/modules/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.module.delete({
      where: { id: parseInt(id) }
    });

    res.status(200).json({ success: true, message: 'Módulo eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar módulo:', error);
    res.status(500).json({ 
      error: 'Error al eliminar el módulo',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// PUT /api/modules/reorder - Reordenar múltiples módulos
app.put('/api/modules/reorder', async (req: Request, res: Response) => {
  try {
    const { modules } = req.body; // Array de { id, order }

    if (!Array.isArray(modules)) {
      return res.status(400).json({ error: 'Se requiere un array de módulos' });
    }

    // Actualizar cada módulo con su nuevo orden
    const updatePromises = modules.map((mod: { id: number; order: number }) =>
      prisma.module.update({
        where: { id: mod.id },
        data: { order: mod.order }
      })
    );

    await Promise.all(updatePromises);

    res.status(200).json({ success: true, message: 'Módulos reordenados correctamente' });
  } catch (error) {
    console.error('❌ Error al reordenar módulos:', error);
    res.status(500).json({ 
      error: 'Error al reordenar los módulos',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// ========================================
//  ENDPOINTS: CRUD de Lecciones
// ========================================

// POST /api/lessons - Crear nueva lección
app.post('/api/lessons', async (req: Request, res: Response) => {
  try {
    const { title, content, order, moduleId, published = true } = req.body;

    if (!title || !moduleId) {
      return res.status(400).json({ error: 'El título y moduleId son requeridos' });
    }

    const lesson = await prisma.lesson.create({
      data: {
        title,
        content: content || '',
        order: order || 1,
        moduleId: parseInt(moduleId),
        published
      }
    });

    res.status(201).json({ success: true, data: lesson });
  } catch (error) {
    console.error('❌ Error al crear lección:', error);
    res.status(500).json({ 
      error: 'Error al crear la lección',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// PUT /api/lessons/:id - Actualizar lección
app.put('/api/lessons/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, order, moduleId, published } = req.body;

    const lesson = await prisma.lesson.update({
      where: { id: parseInt(id) },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(order !== undefined && { order }),
        ...(moduleId !== undefined && { moduleId: parseInt(moduleId) }),
        ...(published !== undefined && { published })
      }
    });

    res.status(200).json({ success: true, data: lesson });
  } catch (error) {
    console.error('❌ Error al actualizar lección:', error);
    res.status(500).json({ 
      error: 'Error al actualizar la lección',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// DELETE /api/lessons/:id - Eliminar lección
app.delete('/api/lessons/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.lesson.delete({
      where: { id: parseInt(id) }
    });

    res.status(200).json({ success: true, message: 'Lección eliminada correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar lección:', error);
    res.status(500).json({ 
      error: 'Error al eliminar la lección',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// PUT /api/lessons/reorder - Reordenar múltiples lecciones
app.put('/api/lessons/reorder', async (req: Request, res: Response) => {
  try {
    const { lessons } = req.body; // Array de { id, order, moduleId? }

    if (!Array.isArray(lessons)) {
      return res.status(400).json({ error: 'Se requiere un array de lecciones' });
    }

    // Actualizar cada lección con su nuevo orden (y opcionalmente moduleId si se movió entre módulos)
    const updatePromises = lessons.map((lesson: { id: number; order: number; moduleId?: number }) =>
      prisma.lesson.update({
        where: { id: lesson.id },
        data: { 
          order: lesson.order,
          ...(lesson.moduleId !== undefined && { moduleId: lesson.moduleId })
        }
      })
    );

    await Promise.all(updatePromises);

    res.status(200).json({ success: true, message: 'Lecciones reordenadas correctamente' });
  } catch (error) {
    console.error('❌ Error al reordenar lecciones:', error);
    res.status(500).json({ 
      error: 'Error al reordenar las lecciones',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// ========================================
//  ENDPOINT: Dashboard Overview para Profesores
// ========================================
// GET /api/dashboard/overview
// Devuelve un resumen del progreso de todos los estudiantes
app.get('/api/dashboard/overview', async (req: Request, res: Response) => {
  try {
    // Obtener todos los usuarios con rol STUDENT
    const students = await prisma.user.findMany({
      where: {
        role: 'STUDENT'
      },
      include: {
        progress: {
          where: {
            completed: true
          },
          orderBy: {
            updatedAt: 'desc'
          }
        }
      }
    });

    // Transformar los datos para el dashboard
    const dashboardData = students.map((student: any) => {
      const completedLessons = student.progress.length;
      const lastActivity = student.progress.length > 0 
        ? student.progress[0].updatedAt 
        : student.createdAt;

      return {
        userId: student.id,
        userEmail: student.email,
        userName: student.name,
        lessonsCompleted: completedLessons,
        lastSeen: lastActivity
      };
    });

    // Ordenar por última actividad (más reciente primero)
    dashboardData.sort((a: any, b: any) => 
      new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime()
    );

    res.status(200).json({
      success: true,
      data: dashboardData,
      total: dashboardData.length
    });

  } catch (error) {
    console.error('❌ Error al obtener dashboard:', error);
    res.status(500).json({ 
      error: 'Error al obtener los datos del dashboard',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// ==========================================
// 💬 FEEDBACK ENDPOINTS
// ==========================================

/**
 * POST /api/feedback
 * Crear retroalimentación del profesor hacia un estudiante
 * Body: { content: string, authorId: number, progressId: number, rating?: number }
 */
app.post('/api/feedback', async (req, res) => {
  try {
    const { content, authorId, progressId, rating } = req.body;

    // Validar campos requeridos
    if (!content || !authorId || !progressId) {
      return res.status(400).json({
        success: false,
        error: 'Campos requeridos: content, authorId, progressId'
      });
    }

    // Validar que el contenido no esté vacío
    if (typeof content !== 'string' || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'El contenido del feedback no puede estar vacío'
      });
    }

    // Validar rating si se proporciona (debe estar entre 1 y 5)
    if (rating !== undefined && rating !== null) {
      if (typeof rating !== 'number' || rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          error: 'El rating debe ser un número entre 1 y 5'
        });
      }
    }

    // Verificar que el progreso existe y obtener información relacionada
    const progress = await prisma.progress.findUnique({
      where: { id: progressId },
      include: {
        user: true,
        lesson: true
      }
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        error: `No se encontró el progreso con ID ${progressId}`
      });
    }

    // Verificar que el autor es un profesor
    const professor = await prisma.user.findUnique({
      where: { id: authorId }
    });

    if (!professor || professor.role !== 'PROFESSOR') {
      return res.status(403).json({
        success: false,
        error: 'Solo los profesores pueden crear retroalimentación'
      });
    }

    // Crear el feedback
    const feedback = await prisma.feedback.create({
      data: {
        comment: content,
        rating: rating || null,
        studentId: progress.userId,
        professorId: authorId,
        lessonId: progress.lessonId,
        progressId: progressId
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        professor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        lesson: {
          select: {
            id: true,
            title: true,
            moduleId: true
          }
        },
        progress: {
          select: {
            id: true,
            completed: true,
            lastSubmittedCode: true
          }
        }
      }
    });

    console.log(`💬 Feedback creado: ID ${feedback.id} por ${professor.name} para ${progress.user.name} en lección "${progress.lesson.title}"`);

    res.status(201).json({
      success: true,
      data: feedback,
      message: 'Retroalimentación creada exitosamente'
    });

  } catch (error) {
    console.error('❌ Error al crear feedback:', error);
    res.status(500).json({
      success: false,
      error: 'Error al crear la retroalimentación',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

/**
 * GET /api/feedback/student/:studentId
 * Obtener todos los feedbacks de un estudiante
 * Params: studentId (ID del estudiante)
 */
app.get('/api/feedback/student/:studentId', async (req, res) => {
  try {
    const studentId = parseInt(req.params.studentId);

    // Validar que el ID sea un número válido
    if (isNaN(studentId)) {
      return res.status(400).json({
        success: false,
        error: 'El ID del estudiante debe ser un número válido'
      });
    }

    // Verificar que el estudiante existe
    const student = await prisma.user.findUnique({
      where: { id: studentId }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        error: `No se encontró el estudiante con ID ${studentId}`
      });
    }

    // Obtener todos los feedbacks del estudiante
    const feedbacks = await prisma.feedback.findMany({
      where: {
        studentId: studentId
      },
      include: {
        professor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        lesson: {
          select: {
            id: true,
            title: true,
            moduleId: true,
            module: {
              select: {
                id: true,
                title: true
              }
            }
          }
        },
        progress: {
          select: {
            id: true,
            completed: true,
            lastSubmittedCode: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc' // Más recientes primero
      }
    });

    console.log(`📖 Feedbacks encontrados para estudiante ${student.name}: ${feedbacks.length}`);

    res.status(200).json({
      success: true,
      data: feedbacks,
      total: feedbacks.length,
      student: {
        id: student.id,
        name: student.name,
        email: student.email
      }
    });

  } catch (error) {
    console.error('❌ Error al obtener feedbacks del estudiante:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener los feedbacks',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// ==========================================
// 🤖 GEMINI AI ENDPOINTS
// ==========================================

/**
 * POST /api/gemini/critique
 * Crítica de código por IA usando Google Gemini
 * Body: { code: string, userId: string }
 */
app.post('/api/gemini/critique', async (req, res) => {
  try {
    const { code, userId } = req.body;

    // Validar campos requeridos
    if (!code || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Campos requeridos: code, userId'
      });
    }

    // Validar que el código no esté vacío
    if (typeof code !== 'string' || code.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'El código no puede estar vacío'
      });
    }

    // Verificar que GEMINI_KEY esté configurada
    if (!process.env.GEMINI_KEY || process.env.GEMINI_KEY === 'your-gemini-api-key-here') {
      return res.status(500).json({
        success: false,
        error: 'GEMINI_KEY no está configurada en el servidor. Por favor, configura tu API key de Google Gemini en el archivo .env'
      });
    }

    // Crear el prompt para Gemini
    const systemPrompt = `Eres un tutor de Python experto, amable y constructivo. Un alumno de 15 años ha escrito este código:

\`\`\`python
${code}
\`\`\`

Tu misión es darle **evaluación formativa**, no la solución.
NO escribas el código corregido.
Dale UNA SOLA pista o pregunta clave para que descubra su error.

Ejemplos:
- "¡Buen intento! Revisa la línea 3, ¿estás seguro de que \`frutas[i]\` es la forma correcta de acceder a ese elemento?"
- "Vas por buen camino, pero fíjate bien en la indentación de tu bucle \`else\`."
- "Excelente inicio, pero ¿qué pasa si la lista está vacía? ¿Tu código maneja ese caso?"

Responde en español, de manera concisa (máximo 2-3 oraciones) y siempre con un tono alentador.`;

    console.log(`🤖 Solicitando crítica de código para usuario ${userId}...`);

    // Llamar a Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const critique = response.text();

    console.log(`✅ Crítica generada exitosamente (${critique.length} caracteres)`);

    // Registrar en ActivityLog
    try {
      await prisma.activityLog.create({
        data: {
          eventType: 'AI_QUERY_ASKED',
          details: JSON.stringify({
            code: code,
            critique: critique,
            codeLength: code.length,
            critiqueLength: critique.length,
            timestamp: new Date().toISOString()
          }),
          userId: parseInt(userId)
        }
      });
      console.log(`📊 Actividad registrada: Usuario ${userId} usó crítica de IA`);
    } catch (logError) {
      console.warn('⚠️ No se pudo registrar en ActivityLog:', logError);
      // No fallar la petición si el log falla
    }

    res.status(200).json({
      success: true,
      data: {
        critique: critique,
        userId: userId,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('❌ Error al generar crítica de código:', error);
    
    // Manejar errores específicos de Gemini
    if (error.message?.includes('API key')) {
      return res.status(500).json({
        success: false,
        error: 'Error de autenticación con la API de Gemini. Verifica tu API key.',
        details: error.message
      });
    }

    res.status(500).json({
      success: false,
      error: 'Error al generar la crítica de código',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// ==========================================
// 📊 ANALYTICS & TRACKING ENDPOINTS
// ==========================================

/**
 * GET /api/student/:id/ai_logs
 * Obtener historial de consultas de IA de un estudiante
 * Params: id (userId del estudiante)
 * "Súper-Poder" del profesor para ver interacciones con IA
 */
app.get('/api/student/:id/ai_logs', async (req, res) => {
  try {
    const studentId = parseInt(req.params.id);

    // Validar que el ID sea un número válido
    if (isNaN(studentId)) {
      return res.status(400).json({
        success: false,
        error: 'El ID del estudiante debe ser un número válido'
      });
    }

    // Verificar que el estudiante existe
    const student = await prisma.user.findUnique({
      where: { id: studentId }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        error: `No se encontró el estudiante con ID ${studentId}`
      });
    }

    // Obtener todos los logs de consultas de IA del estudiante
    const aiLogs = await prisma.activityLog.findMany({
      where: {
        userId: studentId,
        eventType: 'AI_QUERY_ASKED'
      },
      orderBy: {
        createdAt: 'desc' // Más recientes primero
      }
    });

    // Parsear los detalles JSON de cada log
    const logsWithDetails = aiLogs.map((log: any) => {
      let parsedDetails = null;
      try {
        parsedDetails = log.details ? JSON.parse(log.details) : null;
      } catch (error) {
        console.warn(`⚠️ No se pudo parsear details del log ${log.id}`);
      }

      return {
        id: log.id,
        createdAt: log.createdAt,
        code: parsedDetails?.code || null,
        critique: parsedDetails?.critique || null,
        codeLength: parsedDetails?.codeLength || 0,
        critiqueLength: parsedDetails?.critiqueLength || 0
      };
    });

    console.log(`📖 Logs de IA encontrados para ${student.name}: ${aiLogs.length}`);

    res.status(200).json({
      success: true,
      data: logsWithDetails,
      total: logsWithDetails.length,
      student: {
        id: student.id,
        name: student.name,
        email: student.email
      }
    });

  } catch (error) {
    console.error('❌ Error al obtener logs de IA del estudiante:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener los logs de IA',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// ========================================
// 📢 ANNOUNCEMENTS ENDPOINTS
// ========================================

// GET /api/announcements - Obtener todos los anuncios (para estudiantes: solo publicados)
app.get('/api/announcements', async (req, res) => {
  try {
    const showAll = req.query.showAll === 'true'; // Para profesores ver todos (incluidos no publicados)
    
    const announcements = await prisma.announcement.findMany({
      where: showAll ? {} : { published: true },
      include: {
        professor: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`📢 Anuncios obtenidos: ${announcements.length}`);
    
    res.json({
      success: true,
      data: announcements,
      total: announcements.length
    });
  } catch (error) {
    console.error('❌ Error al obtener anuncios:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener anuncios',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// POST /api/announcements - Crear un nuevo anuncio (solo profesores)
app.post('/api/announcements', async (req, res) => {
  try {
    const { title, message, priority, published, professorId, lessonId, moduleId } = req.body;

    // Validaciones básicas
    if (!title || !message || !professorId) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos: title, message, professorId'
      });
    }

    // Verificar que el profesor existe y tiene el rol correcto
    const professor = await prisma.user.findUnique({
      where: { id: professorId }
    });

    if (!professor) {
      return res.status(404).json({
        success: false,
        error: `No se encontró el profesor con ID ${professorId}`
      });
    }

    if (professor.role !== 'PROFESSOR') {
      return res.status(403).json({
        success: false,
        error: 'Solo los profesores pueden crear anuncios'
      });
    }

    // Crear el anuncio
    const announcement = await prisma.announcement.create({
      data: {
        title,
        message,
        priority: priority || 'normal',
        published: published !== undefined ? published : true,
        professorId,
        lessonId: lessonId || null,
        moduleId: moduleId || null
      },
      include: {
        professor: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    console.log(`✅ Anuncio creado: "${title}" por ${professor.name}`);

    res.status(201).json({
      success: true,
      data: announcement,
      message: 'Anuncio creado exitosamente'
    });
  } catch (error) {
    console.error('❌ Error al crear anuncio:', error);
    res.status(500).json({
      success: false,
      error: 'Error al crear anuncio',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// PUT /api/announcements/:id - Actualizar un anuncio existente
app.put('/api/announcements/:id', async (req, res) => {
  try {
    const announcementId = parseInt(req.params.id);
    const { title, message, priority, published } = req.body;

    if (isNaN(announcementId)) {
      return res.status(400).json({
        success: false,
        error: 'El ID del anuncio debe ser un número válido'
      });
    }

    // Verificar que el anuncio existe
    const existingAnnouncement = await prisma.announcement.findUnique({
      where: { id: announcementId }
    });

    if (!existingAnnouncement) {
      return res.status(404).json({
        success: false,
        error: `No se encontró el anuncio con ID ${announcementId}`
      });
    }

    // Actualizar el anuncio
    const updatedAnnouncement = await prisma.announcement.update({
      where: { id: announcementId },
      data: {
        ...(title && { title }),
        ...(message && { message }),
        ...(priority && { priority }),
        ...(published !== undefined && { published })
      },
      include: {
        professor: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    console.log(`✏️ Anuncio actualizado: ID ${announcementId}`);

    res.json({
      success: true,
      data: updatedAnnouncement,
      message: 'Anuncio actualizado exitosamente'
    });
  } catch (error) {
    console.error('❌ Error al actualizar anuncio:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar anuncio',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// DELETE /api/announcements/:id - Eliminar un anuncio
app.delete('/api/announcements/:id', async (req, res) => {
  try {
    const announcementId = parseInt(req.params.id);

    if (isNaN(announcementId)) {
      return res.status(400).json({
        success: false,
        error: 'El ID del anuncio debe ser un número válido'
      });
    }

    // Verificar que el anuncio existe
    const existingAnnouncement = await prisma.announcement.findUnique({
      where: { id: announcementId }
    });

    if (!existingAnnouncement) {
      return res.status(404).json({
        success: false,
        error: `No se encontró el anuncio con ID ${announcementId}`
      });
    }

    // Eliminar el anuncio
    await prisma.announcement.delete({
      where: { id: announcementId }
    });

    console.log(`🗑️ Anuncio eliminado: ID ${announcementId}`);

    res.json({
      success: true,
      message: 'Anuncio eliminado exitosamente'
    });
  } catch (error) {
    console.error('❌ Error al eliminar anuncio:', error);
    res.status(500).json({
      success: false,
      error: 'Error al eliminar anuncio',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// ========================================
// 💬 STUDENT MESSAGES ENDPOINTS
// ========================================

// GET /api/messages - Obtener todos los mensajes
// Query params: ?studentId=1 (para ver mensajes de un estudiante específico)
app.get('/api/messages', async (req, res) => {
  try {
    const { studentId, status } = req.query;
    
    const where: any = {};
    if (studentId) where.studentId = parseInt(studentId as string);
    if (status) where.status = status as string;
    
    const messages = await prisma.studentMessage.findMany({
      where,
      include: {
        student: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`📬 Mensajes obtenidos: ${messages.length}`);

    res.json({
      success: true,
      data: messages,
      total: messages.length
    });
  } catch (error) {
    console.error('❌ Error al obtener mensajes:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener mensajes',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// POST /api/messages - Crear un nuevo mensaje (estudiante a profesor)
app.post('/api/messages', async (req, res) => {
  try {
    const { subject, message, category, studentId, lessonId, moduleId } = req.body;

    // Validaciones básicas
    if (!subject || !message || !studentId) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos: subject, message, studentId'
      });
    }

    // Verificar que el estudiante existe
    const student = await prisma.user.findUnique({
      where: { id: studentId }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        error: `No se encontró el estudiante con ID ${studentId}`
      });
    }

    if (student.role !== 'STUDENT') {
      return res.status(403).json({
        success: false,
        error: 'Solo los estudiantes pueden enviar mensajes'
      });
    }

    // Crear el mensaje
    const newMessage = await prisma.studentMessage.create({
      data: {
        subject,
        message,
        category: category || 'general',
        status: 'pending',
        studentId,
        lessonId: lessonId || null,
        moduleId: moduleId || null
      },
      include: {
        student: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    console.log(`✅ Mensaje creado: "${subject}" por ${student.name}`);

    res.status(201).json({
      success: true,
      data: newMessage,
      message: 'Mensaje enviado exitosamente'
    });
  } catch (error) {
    console.error('❌ Error al crear mensaje:', error);
    res.status(500).json({
      success: false,
      error: 'Error al crear mensaje',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// PUT /api/messages/:id - Responder a un mensaje (profesor)
app.put('/api/messages/:id', async (req, res) => {
  try {
    const messageId = parseInt(req.params.id);
    const { response, status, respondedBy } = req.body;

    if (isNaN(messageId)) {
      return res.status(400).json({
        success: false,
        error: 'El ID del mensaje debe ser un número válido'
      });
    }

    // Verificar que el mensaje existe
    const existingMessage = await prisma.studentMessage.findUnique({
      where: { id: messageId }
    });

    if (!existingMessage) {
      return res.status(404).json({
        success: false,
        error: `No se encontró el mensaje con ID ${messageId}`
      });
    }

    // Actualizar el mensaje
    const updatedMessage = await prisma.studentMessage.update({
      where: { id: messageId },
      data: {
        response: response || existingMessage.response,
        status: status || existingMessage.status,
        respondedBy: respondedBy || existingMessage.respondedBy,
        respondedAt: response ? new Date() : existingMessage.respondedAt
      },
      include: {
        student: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    console.log(`✅ Mensaje actualizado: ID ${messageId}`);

    res.json({
      success: true,
      data: updatedMessage,
      message: 'Mensaje actualizado exitosamente'
    });
  } catch (error) {
    console.error('❌ Error al actualizar mensaje:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar mensaje',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// DELETE /api/messages/:id - Eliminar un mensaje
app.delete('/api/messages/:id', async (req, res) => {
  try {
    const messageId = parseInt(req.params.id);

    if (isNaN(messageId)) {
      return res.status(400).json({
        success: false,
        error: 'El ID del mensaje debe ser un número válido'
      });
    }

    // Verificar que el mensaje existe
    const existingMessage = await prisma.studentMessage.findUnique({
      where: { id: messageId }
    });

    if (!existingMessage) {
      return res.status(404).json({
        success: false,
        error: `No se encontró el mensaje con ID ${messageId}`
      });
    }

    // Eliminar el mensaje
    await prisma.studentMessage.delete({
      where: { id: messageId }
    });

    console.log(`🗑️ Mensaje eliminado: ID ${messageId}`);

    res.json({
      success: true,
      message: 'Mensaje eliminado exitosamente'
    });
  } catch (error) {
    console.error('❌ Error al eliminar mensaje:', error);
    res.status(500).json({
      success: false,
      error: 'Error al eliminar mensaje',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`\n📋 Endpoints disponibles:`);
  console.log(`  📚 Health Check: GET http://localhost:${PORT}/health`);
  console.log(`\n📖 Course Structure:`);
  console.log(`  GET    http://localhost:${PORT}/api/course/structure`);
  console.log(`\n� Módulos:`);
  console.log(`  POST   http://localhost:${PORT}/api/modules`);
  console.log(`  PUT    http://localhost:${PORT}/api/modules/:id`);
  console.log(`  DELETE http://localhost:${PORT}/api/modules/:id`);
  console.log(`  PUT    http://localhost:${PORT}/api/modules/reorder`);
  console.log(`\n📝 Lecciones:`);
  console.log(`  POST   http://localhost:${PORT}/api/lessons`);
  console.log(`  PUT    http://localhost:${PORT}/api/lessons/:id`);
  console.log(`  DELETE http://localhost:${PORT}/api/lessons/:id`);
  console.log(`  PUT    http://localhost:${PORT}/api/lessons/reorder`);
  console.log(`\n📊 Progress & Dashboard:`);
  console.log(`  POST   http://localhost:${PORT}/api/progress/complete`);
  console.log(`  GET    http://localhost:${PORT}/api/dashboard/overview`);
  console.log(`\n💬 Feedback:`);
  console.log(`  POST   http://localhost:${PORT}/api/feedback`);
  console.log(`  GET    http://localhost:${PORT}/api/feedback/student/:studentId`);
  console.log(`\n🤖 Gemini AI:`);
  console.log(`  POST   http://localhost:${PORT}/api/gemini/critique`);
  console.log(`\n📈 Analytics:`);
  console.log(`  GET    http://localhost:${PORT}/api/student/:id/ai_logs`);
  console.log(`\n📢 Announcements:`);
  console.log(`  GET    http://localhost:${PORT}/api/announcements`);
  console.log(`  POST   http://localhost:${PORT}/api/announcements`);
  console.log(`  PUT    http://localhost:${PORT}/api/announcements/:id`);
  console.log(`  DELETE http://localhost:${PORT}/api/announcements/:id`);
  console.log(`\n💬 Student Messages:`);
  console.log(`  GET    http://localhost:${PORT}/api/messages`);
  console.log(`  POST   http://localhost:${PORT}/api/messages`);
  console.log(`  PUT    http://localhost:${PORT}/api/messages/:id`);
  console.log(`  DELETE http://localhost:${PORT}/api/messages/:id`);
  console.log(``);
});

// ========================================
// 📊 ANALYTICS ENDPOINTS
// ========================================

// GET /api/analytics/students - Obtener progreso de todos los estudiantes
app.get('/api/analytics/students', async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      include: {
        progress: {
          include: {
            lesson: true
          }
        },
        activityLogs: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    const totalLessons = await prisma.lesson.count();

    const studentsProgress = users.map(user => {
      const completedLessons = user.progress.filter((p: any) => p.completed).length;
      const progressPercentage = (completedLessons / totalLessons) * 100;
      
      // Calcular promedio de scores
      const scores = user.progress
        .map((p: any) => p.lastScore)
        .filter((score: any): score is number => score !== null);
      const averageScore = scores.length > 0 
        ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length)
        : 0;

      // Determinar estado basado en última actividad
      const lastActivity = user.activityLogs[0]?.createdAt || user.createdAt;
      const daysSinceActivity = Math.floor(
        (Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24)
      );
      
      let status: 'active' | 'inactive' | 'at-risk';
      if (daysSinceActivity <= 3) status = 'active';
      else if (progressPercentage < 30 && daysSinceActivity > 7) status = 'at-risk';
      else status = 'inactive';

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        completedLessons,
        totalLessons,
        averageScore,
        lastActivity: lastActivity.toISOString(),
        status
      };
    });

    res.json({
      success: true,
      students: studentsProgress
    });
  } catch (error) {
    console.error('Error al obtener analíticas de estudiantes:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener analíticas de estudiantes'
    });
  }
});

// GET /api/analytics/lessons - Obtener analíticas por lección
app.get('/api/analytics/lessons', async (req: Request, res: Response) => {
  try {
    const lessons = await prisma.lesson.findMany({
      include: {
        progress: {
          include: {
            user: true
          }
        }
      }
    });

    const totalStudents = await prisma.user.count({ where: { role: 'STUDENT' } });

    const lessonsAnalytics = lessons.map(lesson => {
      const completedProgress = lesson.progress.filter(p => p.completed);
      const studentsCompleted = completedProgress.length;
      const completionRate = totalStudents > 0 
        ? Math.round((studentsCompleted / totalStudents) * 100)
        : 0;

      // Calcular tiempo promedio (simulado basado en dificultad)
      const averageTime = lesson.order * 15 + Math.floor(Math.random() * 10);

      return {
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        completionRate,
        averageTime,
        studentsCompleted,
        totalStudents
      };
    });

    res.json({
      success: true,
      lessons: lessonsAnalytics
    });
  } catch (error) {
    console.error('Error al obtener analíticas de lecciones:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener analíticas de lecciones'
    });
  }
});

// GET /api/dashboard/professor-stats - Estadísticas para el dashboard del profesor
app.get('/api/dashboard/professor-stats', async (req: Request, res: Response) => {
  try {
    const totalStudents = await prisma.user.count({ where: { role: 'STUDENT' } });
    const totalLessons = await prisma.lesson.count();
    const totalModules = await prisma.module.count();
    
    const pendingMessages = await prisma.studentMessage.count({
      where: { status: 'PENDING' }
    });

    // Estudiantes activos (con actividad en últimos 7 días)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const activeStudents = await prisma.activityLog.groupBy({
      by: ['userId'],
      where: {
        createdAt: { gte: sevenDaysAgo }
      }
    });

    // Tasa de completitud general
    const allProgress = await prisma.progress.findMany({
      where: { completed: true }
    });
    const totalPossibleProgress = totalStudents * totalLessons;
    const completionRate = totalPossibleProgress > 0
      ? Math.round((allProgress.length / totalPossibleProgress) * 100)
      : 0;

    res.json({
      success: true,
      stats: {
        totalStudents,
        totalLessons,
        totalModules,
        pendingMessages,
        activeStudents: activeStudents.length,
        completionRate
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas del profesor:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener estadísticas'
    });
  }
});

// ========================================
// 📚 CONTENT LIBRARY ENDPOINTS
// ========================================

// GET /api/resources - Obtener todos los recursos
app.get('/api/resources', async (req: Request, res: Response) => {
  try {
    // Por ahora retornamos datos mock hasta que se cree el modelo Resource en Prisma
    const mockResources = [
      {
        id: 1,
        title: 'Guía de Variables en Python',
        type: 'pdf',
        category: 'teoría',
        url: '/resources/variables-guide.pdf',
        size: '2.5 MB',
        uploadDate: new Date().toISOString(),
        lessonIds: [1, 2],
        description: 'Documento completo sobre tipos de variables y su uso en Python',
        tags: ['variables', 'tipos', 'básico']
      },
      {
        id: 2,
        title: 'Ejercicios de Bucles',
        type: 'code',
        category: 'ejercicios',
        url: '/resources/loops-exercises.py',
        size: '45 KB',
        uploadDate: new Date().toISOString(),
        lessonIds: [5],
        description: 'Colección de ejercicios prácticos para dominar bucles for y while',
        tags: ['bucles', 'práctica', 'intermedio']
      },
      {
        id: 3,
        title: 'Tutorial de Funciones',
        type: 'video',
        category: 'tutorial',
        url: 'https://youtube.com/watch?v=example',
        uploadDate: new Date().toISOString(),
        lessonIds: [8, 9],
        description: 'Video explicativo sobre definición y uso de funciones',
        tags: ['funciones', 'video', 'intermedio']
      }
    ];

    res.json({
      success: true,
      resources: mockResources
    });
  } catch (error) {
    console.error('Error al obtener recursos:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener recursos'
    });
  }
});

// POST /api/resources/upload - Subir nuevo recurso
app.post('/api/resources/upload', async (req: Request, res: Response) => {
  try {
    // Por ahora simularemos la creación del recurso
    const { title, type, category, description } = req.body;
    
    const newResource = {
      id: Date.now(),
      title,
      type,
      category,
      url: `/resources/${title.toLowerCase().replace(/\s+/g, '-')}`,
      size: '1.2 MB',
      uploadDate: new Date().toISOString(),
      lessonIds: [],
      description,
      tags: []
    };

    res.json({
      success: true,
      resource: newResource,
      message: 'Recurso subido exitosamente'
    });
  } catch (error) {
    console.error('Error al subir recurso:', error);
    res.status(500).json({
      success: false,
      error: 'Error al subir recurso'
    });
  }
});

// DELETE /api/resources/:id - Eliminar recurso
app.delete('/api/resources/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    res.json({
      success: true,
      message: `Recurso ${id} eliminado exitosamente`
    });
  } catch (error) {
    console.error('Error al eliminar recurso:', error);
    res.status(500).json({
      success: false,
      error: 'Error al eliminar recurso'
    });
  }
});

// Manejar el cierre del servidor
process.on('SIGINT', async () => {
  console.log('\n👋 Cerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n👋 Cerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

export default app;
