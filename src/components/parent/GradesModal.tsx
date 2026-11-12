import React, { useState } from 'react';
import { Child, ThemeColor } from '../../types';
import { THEME_CONFIGS } from '../../utils/theme';
import {
  X,
  Award,
  BookOpen,
  TrendingUp,
  CheckCircle2,
  Calendar,
  User,
  Download,
  AlertCircle,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Star,
  Check,
  ChevronRight,
  ChevronDown,
  Layers,
  HeartHandshake,
} from 'lucide-react';

export type BimestreKey = 'all' | 'b1' | 'b2' | 'b3';

interface EvaluationItem {
  id: string;
  name: string;
  type: 'Examen' | 'Práctica' | 'Proyecto' | 'Laboratorio' | 'Tareas' | 'Oral';
  date: string;
  score: number;
  maxScore: number;
  weight: string;
  note?: string;
  status: 'calificado' | 'pendiente';
}

interface CourseDetailedGrade {
  id: string;
  course: string;
  category: 'ciencias' | 'humanidades' | 'artes' | 'idiomas';
  teacher: string;
  b1: number;
  b2: number;
  b3: number; // Current / in progress
  average: number;
  competency: string;
  teacherNote: string;
  evaluations: Record<'b1' | 'b2' | 'b3', EvaluationItem[]>;
}

interface BehaviorRecord {
  gradeLetter: 'AD' | 'A' | 'B' | 'C';
  label: string;
  scoreEquiv: number; // e.g. 19 / 20
  tutorComment: string;
  dimensions: {
    name: string;
    level: 'AD' | 'A' | 'B';
    detail: string;
  }[];
  merits: string[];
  demeritsCount: number;
}

interface ChildGradesData {
  courses: CourseDetailedGrade[];
  behavior: Record<'b1' | 'b2' | 'b3', BehaviorRecord>;
}

const DETAILED_GRADES_DATABASE: Record<string, ChildGradesData> = {
  mateo: {
    behavior: {
      b1: {
        gradeLetter: 'AD',
        label: 'Sobresaliente',
        scoreEquiv: 19,
        tutorComment: 'Mateo muestra una conducta intachable, respeto absoluto por las normas escolares y una convivencia armoniosa con todos sus compañeros.',
        dimensions: [
          { name: 'Puntualidad y Asistencia', level: 'AD', detail: '100% de asistencia puntual a todas las clases.' },
          { name: 'Respeto y Trato Empático', level: 'AD', detail: 'Trato cordial y maduro con docentes y pares.' },
          { name: 'Cuidado de Infraestructura y Materiales', level: 'AD', detail: 'Cuida el laboratorio y las aulas del colegio.' },
          { name: 'Cumplimiento del Reglamento Interno', level: 'AD', detail: 'Sin observaciones de indisciplina ni tardanzas.' },
        ],
        merits: ['Reconocimiento al Mérito en Convivencia Escolar Bimestre 1'],
        demeritsCount: 0,
      },
      b2: {
        gradeLetter: 'AD',
        label: 'Sobresaliente',
        scoreEquiv: 20,
        tutorComment: 'Excelente liderazgo positivo. Fue elegido delegado de equipo y fomenta el trabajo colaborativo pacífico.',
        dimensions: [
          { name: 'Puntualidad y Asistencia', level: 'AD', detail: 'Sin deméritos en asistencia.' },
          { name: 'Respeto y Trato Empático', level: 'AD', detail: 'Fomenta la inclusión y el compañerismo.' },
          { name: 'Cuidado de Infraestructura y Materiales', level: 'AD', detail: 'Responsable con los materiales de robótica y ciencias.' },
          { name: 'Cumplimiento del Reglamento Interno', level: 'AD', detail: 'Conducta modelo en la promoción.' },
        ],
        merits: ['Distinción al Liderazgo Positivo y Solidaridad Bimestre 2'],
        demeritsCount: 0,
      },
      b3: {
        gradeLetter: 'AD',
        label: 'Sobresaliente',
        scoreEquiv: 19,
        tutorComment: 'Continúa demostrando gran sentido ético, puntualidad y madurez pre-universitaria. Actitud ejemplar.',
        dimensions: [
          { name: 'Puntualidad y Asistencia', level: 'AD', detail: 'Llegadas a tiempo con registro RFID verificado.' },
          { name: 'Respeto y Trato Empático', level: 'AD', detail: 'Participación proactiva y respetuosa en debates.' },
          { name: 'Cuidado de Infraestructura y Materiales', level: 'AD', detail: 'Excelente uso de laboratorios y biblioteca.' },
          { name: 'Cumplimiento del Reglamento Interno', level: 'AD', detail: '0 incidencias o llamados de atención.' },
        ],
        merits: ['Candidato al Cuadro de Honor Conductual Anual'],
        demeritsCount: 0,
      },
    },
    courses: [
      {
        id: 'mat',
        course: 'Matemática',
        category: 'ciencias',
        teacher: 'Prof. Carlos Mendoza',
        b1: 17,
        b2: 18,
        b3: 17,
        average: 17.3,
        competency: 'Resuelve problemas de cantidad, regularidad y equivalencia',
        teacherNote: 'Excelente capacidad de análisis lógico y razonamiento cuantitativo.',
        evaluations: {
          b1: [
            { id: 'm-b1-1', name: 'Práctica Calificada 1: Funciones Cuadráticas', type: 'Práctica', date: '04 Abr 2026', score: 17, maxScore: 20, weight: '20%', status: 'calificado' },
            { id: 'm-b1-2', name: 'Examen Parcial Bimestre 1', type: 'Examen', date: '22 Abr 2026', score: 16, maxScore: 20, weight: '30%', status: 'calificado' },
            { id: 'm-b1-3', name: 'Resolución de Problemas y Portafolio', type: 'Tareas', date: '02 May 2026', score: 18, maxScore: 20, weight: '20%', status: 'calificado' },
            { id: 'm-b1-4', name: 'Examen Bimestral 1 de Matemática', type: 'Examen', date: '15 May 2026', score: 17, maxScore: 20, weight: '30%', status: 'calificado' },
          ],
          b2: [
            { id: 'm-b2-1', name: 'Práctica Calificada: Geometría Analítica', type: 'Práctica', date: '08 Jun 2026', score: 18, maxScore: 20, weight: '20%', status: 'calificado' },
            { id: 'm-b2-2', name: 'Examen Parcial Bimestre 2', type: 'Examen', date: '25 Jun 2026', score: 17, maxScore: 20, weight: '30%', status: 'calificado' },
            { id: 'm-b2-3', name: 'Taller de Razonamiento Trigonométrico', type: 'Laboratorio', date: '05 Jul 2026', score: 19, maxScore: 20, weight: '20%', status: 'calificado' },
            { id: 'm-b2-4', name: 'Examen Bimestral 2 de Matemática', type: 'Examen', date: '18 Jul 2026', score: 18, maxScore: 20, weight: '30%', status: 'calificado' },
          ],
          b3: [
            { id: 'm-b3-1', name: 'Práctica Calificada 1: Matrices y Determinantes', type: 'Práctica', date: '28 Ago 2026', score: 17, maxScore: 20, weight: '20%', status: 'calificado' },
            { id: 'm-b3-2', name: 'Examen Parcial Bimestre 3 (Álgebra Lineal)', type: 'Examen', date: '14 Sep 2026', score: 18, maxScore: 20, weight: '30%', status: 'calificado' },
            { id: 'm-b3-3', name: 'Entrega de Guía de Ejercicios Vectoriales', type: 'Tareas', date: '22 Sep 2026', score: 17, maxScore: 20, weight: '20%', status: 'calificado' },
            { id: 'm-b3-4', name: 'Examen Bimestral 3 (Programado)', type: 'Examen', date: '09 Oct 2026', score: 17, maxScore: 20, weight: '30%', status: 'calificado' },
          ],
        },
      },
      {
        id: 'com',
        course: 'Comunicación',
        category: 'humanidades',
        teacher: 'Prof. Elena Rivas',
        b1: 16,
        b2: 17,
        b3: 16,
        average: 16.3,
        competency: 'Escribe y redacta diversos tipos de textos en su lengua materna',
        teacherNote: 'Muy buena argumentación escrita y enriquecido vocabulario formal.',
        evaluations: {
          b1: [
            { id: 'c-b1-1', name: 'Control de Lectura: Crónica de una Muerte Anunciada', type: 'Práctica', date: '09 Abr 2026', score: 16, maxScore: 20, weight: '25%', status: 'calificado' },
            { id: 'c-b1-2', name: 'Ensayo Argumentativo de Ensayo Político', type: 'Proyecto', date: '28 Abr 2026', score: 17, maxScore: 20, weight: '35%', status: 'calificado' },
            { id: 'c-b1-3', name: 'Examen Bimestral de Lenguaje', type: 'Examen', date: '16 May 2026', score: 16, maxScore: 20, weight: '40%', status: 'calificado' },
          ],
          b2: [
            { id: 'c-b2-1', name: 'Análisis Literario: Generación del 50', type: 'Tareas', date: '12 Jun 2026', score: 17, maxScore: 20, weight: '25%', status: 'calificado' },
            { id: 'c-b2-2', name: 'Exposición Oral: Argumentación Retórica', type: 'Oral', date: '30 Jun 2026', score: 18, maxScore: 20, weight: '35%', status: 'calificado' },
            { id: 'c-b2-3', name: 'Examen Bimestral 2 de Literatura', type: 'Examen', date: '19 Jul 2026', score: 17, maxScore: 20, weight: '40%', status: 'calificado' },
          ],
          b3: [
            { id: 'c-b3-1', name: 'Control de Lectura: Lit. Peruana Contemporánea', type: 'Práctica', date: '01 Sep 2026', score: 16, maxScore: 20, weight: '25%', status: 'calificado' },
            { id: 'c-b3-2', name: 'Ensayo Crítico de Literatura Peruana', type: 'Proyecto', date: '18 Sep 2026', score: 16, maxScore: 20, weight: '35%', status: 'calificado' },
            { id: 'c-b3-3', name: 'Examen Bimestral 3 (En preparación)', type: 'Examen', date: '12 Oct 2026', score: 16, maxScore: 20, weight: '40%', status: 'calificado' },
          ],
        },
      },
      {
        id: 'cyt',
        course: 'Ciencia y Tecnología',
        category: 'ciencias',
        teacher: 'Prof. Marcos Díaz',
        b1: 18,
        b2: 17,
        b3: 18,
        average: 17.7,
        competency: 'Explica el mundo físico basándose en conocimientos científicos',
        teacherNote: 'Destacada participación en experimentos prácticos y rigurosidad metodológica.',
        evaluations: {
          b1: [
            { id: 'ct-b1-1', name: 'Informe Experimental: Dinámica de Newton', type: 'Laboratorio', date: '15 Abr 2026', score: 18, maxScore: 20, weight: '30%', status: 'calificado' },
            { id: 'ct-b1-2', name: 'Examen Parcial de Física Mecánica', type: 'Examen', date: '29 Abr 2026', score: 17, maxScore: 20, weight: '35%', status: 'calificado' },
            { id: 'ct-b1-3', name: 'Examen Bimestral de Ciencias', type: 'Examen', date: '14 May 2026', score: 19, maxScore: 20, weight: '35%', status: 'calificado' },
          ],
          b2: [
            { id: 'ct-b2-1', name: 'Laboratorio: Reacciones Químicas Redox', type: 'Laboratorio', date: '10 Jun 2026', score: 17, maxScore: 20, weight: '30%', status: 'calificado' },
            { id: 'ct-b2-2', name: 'Proyecto de Indagación Científica', type: 'Proyecto', date: '01 Jul 2026', score: 18, maxScore: 20, weight: '35%', status: 'calificado' },
            { id: 'ct-b2-3', name: 'Examen Bimestral 2', type: 'Examen', date: '16 Jul 2026', score: 17, maxScore: 20, weight: '35%', status: 'calificado' },
          ],
          b3: [
            { id: 'ct-b3-1', name: 'Informe de Laboratorio: Termodinámica y Calor', type: 'Laboratorio', date: '04 Sep 2026', score: 19, maxScore: 20, weight: '30%', status: 'calificado' },
            { id: 'ct-b3-2', name: 'Práctica Calificada: Leyes de los Gases', type: 'Práctica', date: '16 Sep 2026', score: 18, maxScore: 20, weight: '35%', status: 'calificado' },
            { id: 'ct-b3-3', name: 'Evaluación de Cierre Bimestral', type: 'Examen', date: '08 Oct 2026', score: 18, maxScore: 20, weight: '35%', status: 'calificado' },
          ],
        },
      },
      {
        id: 'soc',
        course: 'Ciencias Sociales',
        category: 'humanidades',
        teacher: 'Prof. Patricia Flores',
        b1: 16,
        b2: 16,
        b3: 17,
        average: 16.3,
        competency: 'Construye interpretaciones históricas y gestiona recursos responsablemente',
        teacherNote: 'Aporte reflexivo y maduro en discusiones de coyuntura histórica y geográfica.',
        evaluations: {
          b1: [
            { id: 's-b1-1', name: 'Ensayo: Consecuencias de la Guerra Fría', type: 'Proyecto', date: '18 Abr 2026', score: 16, maxScore: 20, weight: '40%', status: 'calificado' },
            { id: 's-b1-2', name: 'Examen Bimestral de Historia', type: 'Examen', date: '13 May 2026', score: 16, maxScore: 20, weight: '60%', status: 'calificado' },
          ],
          b2: [
            { id: 's-b2-1', name: 'Investigación: Geopolítica de los Recursos en Perú', type: 'Proyecto', date: '22 Jun 2026', score: 17, maxScore: 20, weight: '40%', status: 'calificado' },
            { id: 's-b2-2', name: 'Examen Bimestral 2', type: 'Examen', date: '15 Jul 2026', score: 16, maxScore: 20, weight: '60%', status: 'calificado' },
          ],
          b3: [
            { id: 's-b3-1', name: 'Debate Geopolítico Contemporáneo', type: 'Oral', date: '11 Sep 2026', score: 17, maxScore: 20, weight: '40%', status: 'calificado' },
            { id: 's-b3-2', name: 'Monografía: Globalización y Desarrollo', type: 'Proyecto', date: '24 Sep 2026', score: 17, maxScore: 20, weight: '30%', status: 'calificado' },
            { id: 's-b3-3', name: 'Examen Bimestral 3', type: 'Examen', date: '14 Oct 2026', score: 17, maxScore: 20, weight: '30%', status: 'calificado' },
          ],
        },
      },
      {
        id: 'ing',
        course: 'Inglés Avanzado',
        category: 'idiomas',
        teacher: 'Miss Sarah Jenkins',
        b1: 18,
        b2: 19,
        b3: 18,
        average: 18.3,
        competency: 'Se comunica oralmente y por escrito en inglés como lengua extranjera',
        teacherNote: 'Fluidez sobresaliente y pronunciación natural en debates y exposiciones.',
        evaluations: {
          b1: [
            { id: 'i-b1-1', name: 'Reading & Grammar Proficiency Test', type: 'Examen', date: '11 Abr 2026', score: 18, maxScore: 20, weight: '30%', status: 'calificado' },
            { id: 'i-b1-2', name: 'Speaking Presentation: Future Technologies', type: 'Oral', date: '25 Abr 2026', score: 19, maxScore: 20, weight: '35%', status: 'calificado' },
            { id: 'i-b1-3', name: 'Writing Essay & Term Exam', type: 'Examen', date: '12 May 2026', score: 18, maxScore: 20, weight: '35%', status: 'calificado' },
          ],
          b2: [
            { id: 'i-b2-1', name: 'Vocabulary & Listening Comprehension', type: 'Práctica', date: '15 Jun 2026', score: 19, maxScore: 20, weight: '30%', status: 'calificado' },
            { id: 'i-b2-2', name: 'Mock Cambridge Exam (C1 Advanced)', type: 'Examen', date: '04 Jul 2026', score: 19, maxScore: 20, weight: '40%', status: 'calificado' },
            { id: 'i-b2-3', name: 'Interactive Dialogue Assessment', type: 'Oral', date: '17 Jul 2026', score: 19, maxScore: 20, weight: '30%', status: 'calificado' },
          ],
          b3: [
            { id: 'i-b3-1', name: 'Oral Presentation: Global Sustainability', type: 'Oral', date: '08 Sep 2026', score: 19, maxScore: 20, weight: '35%', status: 'calificado' },
            { id: 'i-b3-2', name: 'Formal Essay: Artificial Intelligence in Education', type: 'Tareas', date: '21 Sep 2026', score: 18, maxScore: 20, weight: '35%', status: 'calificado' },
            { id: 'i-b3-3', name: 'Quarterly Final Assessment', type: 'Examen', date: '07 Oct 2026', score: 18, maxScore: 20, weight: '30%', status: 'calificado' },
          ],
        },
      },
      {
        id: 'edufis',
        course: 'Educación Física',
        category: 'ciencias',
        teacher: 'Prof. Roberto Sánchez',
        b1: 17,
        b2: 18,
        b3: 17,
        average: 17.3,
        competency: 'Asume una vida saludable e interactúa a través de sus habilidades sociomotrices',
        teacherNote: 'Gran disciplina física, espíritu de equipo y constancia deportiva.',
        evaluations: {
          b1: [
            { id: 'ef-b1-1', name: 'Test de Flexibilidad y Capacidad Aeróbica', type: 'Práctica', date: '17 Abr 2026', score: 17, maxScore: 20, weight: '50%', status: 'calificado' },
            { id: 'ef-b1-2', name: 'Fundamentos de Atletismo y Carrera', type: 'Práctica', date: '08 May 2026', score: 17, maxScore: 20, weight: '50%', status: 'calificado' },
          ],
          b2: [
            { id: 'ef-b2-1', name: 'Técnica de Básquetbol y Trabajo en Equipo', type: 'Práctica', date: '19 Jun 2026', score: 18, maxScore: 20, weight: '50%', status: 'calificado' },
            { id: 'ef-b2-2', name: 'Evaluación de Rendimiento Físico', type: 'Práctica', date: '10 Jul 2026', score: 18, maxScore: 20, weight: '50%', status: 'calificado' },
          ],
          b3: [
            { id: 'ef-b3-1', name: 'Evaluación de Resistencia Aeróbica (Cooper)', type: 'Práctica', date: '05 Sep 2026', score: 18, maxScore: 20, weight: '50%', status: 'calificado' },
            { id: 'ef-b3-2', name: 'Torneo Intersecciones de Vóley', type: 'Práctica', date: '19 Sep 2026', score: 17, maxScore: 20, weight: '50%', status: 'calificado' },
          ],
        },
      },
    ],
  },
  lucia: {
    behavior: {
      b1: {
        gradeLetter: 'AD',
        label: 'Sobresaliente',
        scoreEquiv: 20,
        tutorComment: 'Lucía es un rayito de luz en el salón. Siempre alegre, comparte sus colores con sus compañeros y escucha con respeto.',
        dimensions: [
          { name: 'Puntualidad y Asistencia', level: 'AD', detail: 'Asistencia impecable a primera hora.' },
          { name: 'Respeto y Convivencia', level: 'AD', detail: 'Trato cariñoso y solidario con sus amigos de 2do de Primaria.' },
          { name: 'Cuidado de Útiles y Aula', level: 'AD', detail: 'Mantiene su cartuchera y carpetita siempre ordenada.' },
          { name: 'Cumplimiento de Hábitos', level: 'AD', detail: 'Sigue todas las indicaciones y normas de la maestra.' },
        ],
        merits: ['Medalla de Oro al Compañerismo Infantil Bimestre 1'],
        demeritsCount: 0,
      },
      b2: {
        gradeLetter: 'AD',
        label: 'Sobresaliente',
        scoreEquiv: 20,
        tutorComment: 'Demuestra gran empatía. Ayuda a integrar a los niños nuevos y respeta las filas y momentos de silencio.',
        dimensions: [
          { name: 'Puntualidad y Asistencia', level: 'AD', detail: '100% puntual.' },
          { name: 'Respeto y Convivencia', level: 'AD', detail: 'Excelente compañera de juegos y estudio.' },
          { name: 'Cuidado de Útiles y Aula', level: 'AD', detail: 'Ordena sus materiales al terminar cada clase.' },
          { name: 'Cumplimiento de Hábitos', level: 'AD', detail: 'Participa levantando la manito.' },
        ],
        merits: ['Estrella de la Semana al Buen Trato Bimestre 2'],
        demeritsCount: 0,
      },
      b3: {
        gradeLetter: 'AD',
        label: 'Sobresaliente',
        scoreEquiv: 20,
        tutorComment: 'Continúa con un comportamiento ejemplar. Se destaca por su entusiasmo en las dinámicas y respeto hacia sus profesores.',
        dimensions: [
          { name: 'Puntualidad y Asistencia', level: 'AD', detail: 'Puntualidad constante.' },
          { name: 'Respeto y Convivencia', level: 'AD', detail: 'Muy respetuosa y colaboradora.' },
          { name: 'Cuidado de Útiles y Aula', level: 'AD', detail: 'Cuida su mochila y libros con mucho esmero.' },
          { name: 'Cumplimiento de Hábitos', level: 'AD', detail: 'Cumple felizmente los acuerdos del aula.' },
        ],
        merits: ['Reconocimiento a la Amabilidad y Compañerismo'],
        demeritsCount: 0,
      },
    },
    courses: [
      {
        id: 'mat_l',
        course: 'Matemática Lúdica',
        category: 'ciencias',
        teacher: 'Prof. Ana Torres',
        b1: 18,
        b2: 18,
        b3: 19,
        average: 18.3,
        competency: 'Resuelve problemas de cantidad con material multibase y ábaco',
        teacherNote: '¡Muy rápida y entusiasta! Disfruta resolviendo acertijos y retos numéricos.',
        evaluations: {
          b1: [
            { id: 'ml-b1-1', name: 'Conteo y Números hasta el 100', type: 'Práctica', date: '10 Abr 2026', score: 18, maxScore: 20, weight: '40%', status: 'calificado' },
            { id: 'ml-b1-2', name: 'Evaluación Bimestral de Sumas y Restas', type: 'Examen', date: '14 May 2026', score: 18, maxScore: 20, weight: '60%', status: 'calificado' },
          ],
          b2: [
            { id: 'ml-b2-1', name: 'Resolución de Problemas con Monedas y Billetes', type: 'Práctica', date: '12 Jun 2026', score: 19, maxScore: 20, weight: '40%', status: 'calificado' },
            { id: 'ml-b2-2', name: 'Examen Bimestral de Geometría Divertida', type: 'Examen', date: '16 Jul 2026', score: 18, maxScore: 20, weight: '60%', status: 'calificado' },
          ],
          b3: [
            { id: 'ml-b3-1', name: 'Cálculo Mental y Resolución de Retos', type: 'Práctica', date: '04 Sep 2026', score: 19, maxScore: 20, weight: '40%', status: 'calificado' },
            { id: 'ml-b3-2', name: 'Multiplicación Inicial y Dobles', type: 'Tareas', date: '18 Sep 2026', score: 19, maxScore: 20, weight: '30%', status: 'calificado' },
            { id: 'ml-b3-3', name: 'Examen Bimestral 3 (En curso)', type: 'Examen', date: '09 Oct 2026', score: 19, maxScore: 20, weight: '30%', status: 'calificado' },
          ],
        },
      },
      {
        id: 'com_l',
        course: 'Comunicación y Lectura',
        category: 'humanidades',
        teacher: 'Prof. Ana Torres',
        b1: 17,
        b2: 18,
        b3: 18,
        average: 17.7,
        competency: 'Lee y produce diversos tipos de textos breves con coherencia',
        teacherNote: 'Lee con entonación expresiva y comprende a la perfección cuentos y fábulas.',
        evaluations: {
          b1: [
            { id: 'cl-b1-1', name: 'Lectura en Voz Alta: Fábulas de Esopo', type: 'Oral', date: '16 Abr 2026', score: 17, maxScore: 20, weight: '40%', status: 'calificado' },
            { id: 'cl-b1-2', name: 'Evaluación Bimestral de Escritura Creativa', type: 'Examen', date: '15 May 2026', score: 18, maxScore: 20, weight: '60%', status: 'calificado' },
          ],
          b2: [
            { id: 'cl-b2-1', name: 'Comprensión Lectora: Los Animales del Perú', type: 'Práctica', date: '18 Jun 2026', score: 18, maxScore: 20, weight: '40%', status: 'calificado' },
            { id: 'cl-b2-2', name: 'Examen Bimestral 2: Ortografía y Cuentos', type: 'Examen', date: '17 Jul 2026', score: 18, maxScore: 20, weight: '60%', status: 'calificado' },
          ],
          b3: [
            { id: 'cl-b3-1', name: 'Comprensión Lectora: Cuentos Infantiles', type: 'Práctica', date: '10 Sep 2026', score: 18, maxScore: 20, weight: '40%', status: 'calificado' },
            { id: 'cl-b3-2', name: 'Redacción de Poema a la Primavera', type: 'Proyecto', date: '23 Sep 2026', score: 18, maxScore: 20, weight: '30%', status: 'calificado' },
            { id: 'cl-b3-3', name: 'Examen Bimestral 3', type: 'Examen', date: '13 Oct 2026', score: 18, maxScore: 20, weight: '30%', status: 'calificado' },
          ],
        },
      },
      {
        id: 'cyt_l',
        course: 'Ciencia y Ambiente',
        category: 'ciencias',
        teacher: 'Prof. Ana Torres',
        b1: 17,
        b2: 17,
        b3: 18,
        average: 17.3,
        competency: 'Indaga sobre el medio ambiente, seres vivos y ecosistemas',
        teacherNote: 'Muy curiosa por el cuidado de las plantas y los animales.',
        evaluations: {
          b1: [
            { id: 'ca-b1-1', name: 'El Cuerpo Humano y los Sentidos', type: 'Práctica', date: '14 Abr 2026', score: 17, maxScore: 20, weight: '50%', status: 'calificado' },
            { id: 'ca-b1-2', name: 'Examen Bimestral de Ciencias Naturales', type: 'Examen', date: '12 May 2026', score: 17, maxScore: 20, weight: '50%', status: 'calificado' },
          ],
          b2: [
            { id: 'ca-b2-1', name: 'Maqueta del Hábitat de los Animales', type: 'Proyecto', date: '15 Jun 2026', score: 18, maxScore: 20, weight: '50%', status: 'calificado' },
            { id: 'ca-b2-2', name: 'Examen Bimestral 2: Alimentos Saludables', type: 'Examen', date: '14 Jul 2026', score: 17, maxScore: 20, weight: '50%', status: 'calificado' },
          ],
          b3: [
            { id: 'ca-b3-1', name: 'Mini-Proyecto: El Ciclo de las Plantas', type: 'Proyecto', date: '11 Sep 2026', score: 18, maxScore: 20, weight: '50%', status: 'calificado' },
            { id: 'ca-b3-2', name: 'Evaluación del Cuidado del Agua', type: 'Práctica', date: '25 Sep 2026', score: 18, maxScore: 20, weight: '50%', status: 'calificado' },
          ],
        },
      },
      {
        id: 'ing_l',
        course: 'Inglés Kids',
        category: 'idiomas',
        teacher: 'Miss Claudia Prado',
        b1: 18,
        b2: 19,
        b3: 19,
        average: 18.7,
        competency: 'Comprende canciones, diálogos y vocabulario temático en inglés',
        teacherNote: 'Aprende con mucha alegría y participa siempre cantando en inglés.',
        evaluations: {
          b1: [
            { id: 'ik-b1-1', name: 'Colors, Numbers & Family Words Check', type: 'Oral', date: '17 Abr 2026', score: 18, maxScore: 20, weight: '50%', status: 'calificado' },
            { id: 'ik-b1-2', name: 'Term 1 Fun Test', type: 'Examen', date: '08 May 2026', score: 18, maxScore: 20, weight: '50%', status: 'calificado' },
          ],
          b2: [
            { id: 'ik-b2-1', name: 'Animals & Food Songs Quiz', type: 'Oral', date: '19 Jun 2026', score: 19, maxScore: 20, weight: '50%', status: 'calificado' },
            { id: 'ik-b2-2', name: 'Term 2 English Game Test', type: 'Examen', date: '10 Jul 2026', score: 19, maxScore: 20, weight: '50%', status: 'calificado' },
          ],
          b3: [
            { id: 'ik-b3-1', name: 'Vocabulary & Songs Check (Toys & School)', type: 'Oral', date: '04 Sep 2026', score: 20, maxScore: 20, weight: '50%', status: 'calificado' },
            { id: 'ik-b3-2', name: 'My Favorite Pet Presentation', type: 'Oral', date: '22 Sep 2026', score: 19, maxScore: 20, weight: '50%', status: 'calificado' },
          ],
        },
      },
    ],
  },
};

interface GradesModalProps {
  isOpen: boolean;
  onClose: () => void;
  child: Child;
  themeColor: ThemeColor;
}

export const GradesModal: React.FC<GradesModalProps> = ({
  isOpen,
  onClose,
  child,
  themeColor,
}) => {
  if (!isOpen) return null;

  const theme = THEME_CONFIGS[themeColor];
  const studentData = DETAILED_GRADES_DATABASE[child.id] || DETAILED_GRADES_DATABASE['mateo'];
  const { courses, behavior } = studentData;

  // Selected Bimestre Filter state (USER REQUIREMENT: Clic en cada bimestre para ver detalle de evaluaciones)
  const [selectedBimestre, setSelectedBimestre] = useState<BimestreKey>('all');
  
  // Accordion of expanded course details (when in 'all' view or clicking on a specific course)
  const [expandedCourses, setExpandedCourses] = useState<Record<string, boolean>>({
    [courses[0]?.id || 'mat']: true,
  });

  const toggleCourseExpand = (courseId: string) => {
    setExpandedCourses((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };

  // Overall calculations
  const totalCourses = courses.length;
  const overallAverage = (
    courses.reduce((sum, g) => sum + g.average, 0) / totalCourses
  ).toFixed(1);

  // Active behavior record depending on selected bimestre
  const activeBehaviorBimestre: 'b1' | 'b2' | 'b3' = selectedBimestre === 'all' ? 'b3' : selectedBimestre;
  const activeBehavior = behavior[activeBehaviorBimestre];

  const getScoreBadge = (score: number) => {
    if (score >= 18) {
      return {
        label: 'Sobresaliente (AD)',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        textClass: 'text-emerald-700 font-extrabold',
      };
    }
    if (score >= 14) {
      return {
        label: 'Logro Esperado (A)',
        badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
        textClass: 'text-blue-700 font-bold',
      };
    }
    return {
      label: 'En Proceso (B)',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
      textClass: 'text-amber-700 font-bold',
    };
  };

  const getEvaluationTypeBadge = (type: EvaluationItem['type']) => {
    switch (type) {
      case 'Examen':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Práctica':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Proyecto':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Laboratorio':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'Oral':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="grades-modal-title"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <img
              src={child.avatarImg}
              alt={child.name}
              className="w-11 h-11 rounded-2xl object-cover border-2 border-white shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 id="grades-modal-title" className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Boletín de Calificaciones y Comportamiento
                </h2>
                <span className="text-[11px] font-bold text-blue-800 bg-blue-100 border border-blue-200 px-2 py-0.5 rounded-full">
                  Año Escolar 2026
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Estudiante: <strong className="text-slate-800 font-semibold">{child.name}</strong> · {child.grade} · {child.section}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Cerrar ventana de notas"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Global KPI Summary Bar including NOTA DE COMPORTAMIENTO (USER REQUIREMENT) */}
        <div className="bg-white border-b border-slate-200/80 p-3.5 sm:px-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0">
          {/* Promedio General */}
          <div className="p-2.5 rounded-2xl bg-blue-50/80 border border-blue-200/80">
            <span className="text-[10px] font-bold text-blue-900/80 uppercase tracking-wider block">
              Promedio General
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-black text-blue-700 leading-none">
                {overallAverage}
              </span>
              <span className="text-xs font-bold text-blue-950/70">/ 20</span>
            </div>
            <span className="text-[10px] font-semibold text-emerald-800 mt-1 inline-flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              Destacado
            </span>
          </div>

          {/* NOTA DE COMPORTAMIENTO (USER REQUIREMENT) */}
          <div className="p-2.5 rounded-2xl bg-emerald-50/90 border border-emerald-200/90 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-950 uppercase tracking-wider block">
                Comportamiento
              </span>
              <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded-md bg-emerald-200/70 text-emerald-900">
                {selectedBimestre === 'all' ? 'B3 (Actual)' : selectedBimestre.toUpperCase()}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-black text-emerald-700 leading-none">
                {activeBehavior.gradeLetter}
              </span>
              <span className="text-[11px] font-extrabold text-emerald-900">
                {activeBehavior.label}
              </span>
            </div>
            <span className="text-[10px] font-semibold text-emerald-800 mt-1 inline-flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              0 incidencias · Ejemplar
            </span>
          </div>

          {/* Cursos Aprobados */}
          <div className="p-2.5 rounded-2xl bg-indigo-50/80 border border-indigo-200/80">
            <span className="text-[10px] font-bold text-indigo-950 uppercase tracking-wider block">
              Cursos Aprobados
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-black text-indigo-700 leading-none">
                {totalCourses}
              </span>
              <span className="text-xs font-bold text-indigo-900">de {totalCourses}</span>
            </div>
            <span className="text-[10px] font-semibold text-indigo-800 mt-1 inline-flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-indigo-600" />
              100% de efectividad
            </span>
          </div>

          {/* Periodo en curso */}
          <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Tutoría a Cargo
            </span>
            <p className="text-xs font-bold text-slate-800 mt-1 truncate">
              {child.teacherName}
            </p>
            <span className="text-[10px] text-slate-500 block truncate">
              Colegio San Agustín
            </span>
          </div>
        </div>

        {/* Bimestre Navigation Tabs (USER REQUIREMENT: Clic en cada bimestre) */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-100/60 border-b border-slate-200 flex items-center justify-between gap-2 flex-wrap shrink-0">
          <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200/90 shadow-2xs">
            <button
              onClick={() => setSelectedBimestre('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedBimestre === 'all'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Todos los Bimestres
            </button>

            <button
              onClick={() => setSelectedBimestre('b1')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedBimestre === 'b1'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Bimestre 1
            </button>

            <button
              onClick={() => setSelectedBimestre('b2')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedBimestre === 'b2'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Bimestre 2
            </button>

            <button
              onClick={() => setSelectedBimestre('b3')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer relative ${
                selectedBimestre === 'b3'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>Bimestre 3</span>
              <span className="ml-1 text-[9px] font-black px-1.5 py-0.2 rounded-full bg-amber-400 text-amber-950 uppercase">
                Actual
              </span>
            </button>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            {selectedBimestre === 'all' ? (
              <span>💡 Mostrando comparativa anual de todos los bimestres</span>
            ) : (
              <span className="font-semibold text-blue-700">
                🔎 Mostrando todas las evaluaciones de: <strong>{selectedBimestre.toUpperCase()}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Content Body: Scrollable area with Behavior Card and Courses Evaluations */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* Card Detallada de NOTA DE COMPORTAMIENTO (USER REQUIREMENT) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50/80 via-teal-50/60 to-emerald-50/80 border border-emerald-200/90 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">
                      Evaluación de Comportamiento y Convivencia Escolar
                    </h3>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-950 uppercase">
                      {selectedBimestre === 'all' ? 'Bimestre 3' : selectedBimestre.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Evaluado por: <strong className="text-slate-800">{child.teacherName}</strong> · Tutoría y Convivencia Democrática
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white/95 px-3 py-1.5 rounded-xl border border-emerald-300 shadow-2xs shrink-0 self-start sm:self-auto">
                <div className="text-right">
                  <span className="text-[9px] font-bold text-slate-400 block uppercase">Calificación Conductual</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg font-black text-emerald-700 leading-none">
                      {activeBehavior.gradeLetter}
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      ({activeBehavior.label} · {activeBehavior.scoreEquiv}/20)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Behavior Dimensions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-emerald-200/70">
              {activeBehavior.dimensions.map((dim) => (
                <div
                  key={dim.name}
                  className="bg-white/90 p-2.5 rounded-xl border border-emerald-100 flex items-start gap-2 shadow-2xs"
                >
                  <span className="w-5 h-5 rounded-lg bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                    {dim.level}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-800 leading-tight">{dim.name}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{dim.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tutor comment & recognition badge */}
            <div className="bg-white/95 p-3 rounded-xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-slate-700">
                  <strong className="text-slate-900">Observación del Tutor:</strong> {activeBehavior.tutorComment}
                </p>
              </div>
              {activeBehavior.merits.length > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-bold text-[11px] shrink-0 border border-amber-200">
                  <Award className="w-3.5 h-3.5 text-amber-700" />
                  {activeBehavior.merits[0]}
                </span>
              )}
            </div>
          </div>

          {/* Heading for Courses & Detail of Evaluations (USER REQUIREMENT) */}
          <div className="flex items-center justify-between gap-2 pt-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>
                {selectedBimestre === 'all'
                  ? 'Calificaciones y Evaluaciones por Asignatura'
                  : `Evaluaciones del ${selectedBimestre.toUpperCase()}`}
              </span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Haz clic en cualquier bimestre para ver el desglose completo
            </span>
          </div>

          {/* List of Courses with Detailed Evaluations per Bimestre */}
          <div className="space-y-3.5">
            {courses.map((course) => {
              const isExpanded = expandedCourses[course.id] || selectedBimestre !== 'all';
              const bimKeyToDisplay: 'b1' | 'b2' | 'b3' = selectedBimestre === 'all' ? 'b3' : selectedBimestre;
              const currentBimScore = course[bimKeyToDisplay];
              const evals = course.evaluations[bimKeyToDisplay] || [];

              return (
                <div
                  key={course.id}
                  className="rounded-2xl bg-white border border-slate-200/90 shadow-2xs overflow-hidden transition-all hover:border-slate-300"
                >
                  {/* Card Header */}
                  <div className="p-4 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/70">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-slate-900">{course.course}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getScoreBadge(course.average).badgeClass}`}>
                          {getScoreBadge(course.average).label}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Docente: <strong className="text-slate-700">{course.teacher}</strong> · {course.competency}
                      </p>
                    </div>

                    {/* Interactive Bimestre Selector Buttons per course */}
                    <div className="flex items-center gap-1.5 self-start sm:self-center flex-wrap">
                      <button
                        onClick={() => setSelectedBimestre('b1')}
                        className={`px-2.5 py-1 rounded-xl text-xs font-extrabold transition-all cursor-pointer border ${
                          selectedBimestre === 'b1'
                            ? 'bg-blue-600 text-white border-blue-600 shadow-2xs scale-105'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                        title="Ver detalle del Bimestre 1"
                      >
                        B1: {course.b1}
                      </button>

                      <button
                        onClick={() => setSelectedBimestre('b2')}
                        className={`px-2.5 py-1 rounded-xl text-xs font-extrabold transition-all cursor-pointer border ${
                          selectedBimestre === 'b2'
                            ? 'bg-blue-600 text-white border-blue-600 shadow-2xs scale-105'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                        title="Ver detalle del Bimestre 2"
                      >
                        B2: {course.b2}
                      </button>

                      <button
                        onClick={() => setSelectedBimestre('b3')}
                        className={`px-2.5 py-1 rounded-xl text-xs font-extrabold transition-all cursor-pointer border relative ${
                          selectedBimestre === 'b3'
                            ? 'bg-blue-600 text-white border-blue-600 shadow-2xs scale-105'
                            : 'bg-blue-50/80 hover:bg-blue-100 text-blue-900 border-blue-200'
                        }`}
                        title="Ver detalle del Bimestre 3 (Actual)"
                      >
                        <span>B3: {course.b3}</span>
                        {selectedBimestre !== 'b3' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block ml-1" />
                        )}
                      </button>

                      <div className="ml-2 pl-2 border-l border-slate-200 text-right">
                        <span className="text-[9px] font-bold text-slate-400 block uppercase">Promedio</span>
                        <span className="text-sm font-black text-slate-900">
                          {course.average.toFixed(1)}
                        </span>
                      </div>

                      {/* Expand / Collapse arrow button in 'all' view */}
                      {selectedBimestre === 'all' && (
                        <button
                          onClick={() => toggleCourseExpand(course.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors ml-1 cursor-pointer"
                          title={isExpanded ? 'Contraer evaluaciones' : 'Ver evaluaciones'}
                        >
                          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Detailed Evaluations List (USER REQUIREMENT) */}
                  {isExpanded && (
                    <div className="p-4 space-y-2.5 bg-white">
                      <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-100">
                        <span className="font-bold text-slate-700 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-blue-600" />
                          Evaluaciones registradas en {bimKeyToDisplay.toUpperCase()} ({evals.length} pruebas):
                        </span>
                        <span className="text-[11px] font-bold text-blue-700">
                          Nota Bimestral: {currentBimScore} / 20
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        {evals.map((ev) => (
                          <div
                            key={ev.id}
                            className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${getEvaluationTypeBadge(ev.type)}`}>
                                {ev.type}
                              </span>
                              <div>
                                <p className="text-xs font-bold text-slate-800 leading-tight">
                                  {ev.name}
                                </p>
                                <p className="text-[11px] text-slate-500 mt-0.2">
                                  Fecha: <strong>{ev.date}</strong> · Ponderación: <strong>{ev.weight}</strong>
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                              <span className="text-xs font-bold text-slate-500">Nota:</span>
                              <span className="text-sm font-black text-slate-900 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200 shadow-2xs">
                                {ev.score} <span className="text-[10px] font-normal text-slate-400">/ {ev.maxScore}</span>
                              </span>
                              <span className="w-2 h-2 rounded-full bg-emerald-500" title="Calificado y validado" />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Teacher observation note */}
                      {course.teacherNote && (
                        <div className="mt-2 p-2.5 rounded-xl bg-blue-50/50 border border-blue-100 flex items-start gap-2 text-[11px] text-slate-600">
                          <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <p>
                            <strong className="text-slate-800">Comentario del Docente:</strong> {course.teacherNote}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0 flex-wrap gap-2">
          <div className="text-xs text-slate-500">
            Escala oficial del Ministerio de Educación (MINEDU) · Sincronizado: <strong>Hoy, 25 Sep 2026</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
