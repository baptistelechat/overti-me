import { z } from 'zod';

// Schéma Zod pour la validation des données
export const workDaySchema = z.object({
  date: z.string(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  // Pause méridienne
  lunchBreakStart: z.string().optional(),
  lunchBreakEnd: z.string().optional(),
  // La durée calculée en heures (calculée à partir de startTime/endTime et pause méridienne)
  calculatedDuration: z.number().default(0),
  // Indique si le jour est travaillé
  isWorked: z.boolean().default(false),
});

export const weekDataSchema = z.object({
  id: z.string(), // Format: YYYY-WXX (ex: 2025-W25)
  days: z.array(workDaySchema),
  // Totaux calculés
  totalHours: z.number().default(0),
  normalHours: z.number().default(0), // Heures normales (jusqu'à 35h)
  overtimeHours25: z.number().default(0), // Heures supp à +25% (35h-43h)
  overtimeHours50: z.number().default(0), // Heures supp à +50% (au-delà de 43h)
});

// Types TypeScript inférés à partir des schémas Zod
export type WorkDay = z.infer<typeof workDaySchema>;
export type WeekData = z.infer<typeof weekDataSchema>;

// Constantes pour les calculs d'heures supplémentaires
export const NORMAL_HOURS_THRESHOLD = 35; // Seuil des heures normales
export const OVERTIME_25_THRESHOLD = 43; // Seuil des heures supp à +25%