import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDashboardQuery() {
  console.log('🧪 Probando la query del dashboard...\n');

  // Query exacta del endpoint
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

  console.log('📊 Estudiantes encontrados:', students.length);
  console.log('');

  students.forEach((student, index) => {
    console.log(`👨‍🎓 Estudiante ${index + 1}:`);
    console.log(`   ID: ${student.id}`);
    console.log(`   Email: ${student.email}`);
    console.log(`   Nombre: ${student.name}`);
    console.log(`   Rol: ${student.role}`);
    console.log(`   Progreso completado: ${student.progress.length} lecciones`);
    
    if (student.progress.length > 0) {
      console.log(`   Última actividad: ${student.progress[0].updatedAt}`);
      console.log('   Lecciones completadas:');
      student.progress.forEach((p) => {
        console.log(`      - Lección ${p.lessonId} (${p.updatedAt})`);
      });
    } else {
      console.log('   Sin progreso aún');
    }
    console.log('');
  });

  // Transformación (igual que en el endpoint)
  const dashboardData = students.map((student) => {
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

  console.log('📤 Datos transformados para el dashboard:');
  console.log(JSON.stringify(dashboardData, null, 2));

  await prisma.$disconnect();
}

testDashboardQuery()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  });
