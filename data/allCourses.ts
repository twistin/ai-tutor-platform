import { Course, Module } from '../types';
import { MODULE_5, MODULE_6, MODULE_7 } from './coursesData';

// Función helper para cargar todos los módulos del curso completo
export function getAllPythonTeensCourseModules(): Module[] {
  // Los primeros 4 módulos están en constants.ts
  // Aquí agregamos los módulos 5, 6 y 7
  return [MODULE_5, MODULE_6, MODULE_7];
}
