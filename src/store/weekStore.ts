import { create } from "zustand";
import type { WeekData, WorkDay } from "../types";
import { NORMAL_HOURS_THRESHOLD, OVERTIME_25_THRESHOLD } from "../types";
import { getWeekId } from "@/utils/date/weekId";
import { getWeekDates } from "@/utils/date/weekDates";


interface WeekStore {
  // État
  currentWeekId: string;
  weeks: Record<string, WeekData>;

  // Actions
  initializeWeek: (weekId?: string) => void;
  setCurrentWeekId: (weekId: string) => void;
  updateDay: (dayIndex: number, dayData: Partial<WorkDay>) => void;
  calculateTotals: () => void;
  resetWeek: () => void;
  exportWeekData: (format: "json" | "csv" | "xlsx", columns: string[]) => void;
}

// Création du store Zustand
const useWeekStore = create<WeekStore>((set, get) => ({
  // État initial
  currentWeekId: getWeekId(new Date()),
  weeks: {},

  // Initialiser une semaine (courante par défaut ou spécifiée)
  initializeWeek: (weekId) => {
    const targetWeekId = weekId || getWeekId(new Date());
    const existingWeek = get().weeks[targetWeekId];

    if (!existingWeek) {
      // Créer une nouvelle semaine si elle n'existe pas
      const weekDates = getWeekDates(targetWeekId);

      const newWeek: WeekData = {
        id: targetWeekId,
        days: weekDates.map((date) => ({
          date: date.toISOString().split("T")[0],
          startTime: "",
          endTime: "",
          calculatedDuration: 0,
          isWorked: false,
        })),
        totalHours: 0,
        normalHours: 0,
        overtimeHours25: 0,
        overtimeHours50: 0,
      };

      set((state) => ({
        weeks: { ...state.weeks, [targetWeekId]: newWeek },
        currentWeekId: targetWeekId,
      }));
    } else {
      // Si la semaine existe déjà, définir simplement comme semaine courante
      set({ currentWeekId: targetWeekId });
    }
  },

  // Changer la semaine courante
  setCurrentWeekId: (weekId) => {
    const { initializeWeek } = get();
    initializeWeek(weekId);
  },

  // Mettre à jour les données d'un jour
  updateDay: (dayIndex, dayData) => {
    const { currentWeekId, weeks, calculateTotals } = get();
    const currentWeek = weeks[currentWeekId];

    if (currentWeek && dayIndex >= 0 && dayIndex < currentWeek.days.length) {
      // Mettre à jour le jour spécifié
      const updatedDays = [...currentWeek.days];
      updatedDays[dayIndex] = { ...updatedDays[dayIndex], ...dayData };

      // Récupérer les valeurs de startTime et endTime (soit des nouvelles valeurs, soit des valeurs existantes)
      const startTime = dayData.startTime || updatedDays[dayIndex].startTime;
      const endTime = dayData.endTime || updatedDays[dayIndex].endTime;
      
      // Calculer la durée si startTime et endTime sont tous les deux définis
      if (startTime && endTime) {
        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);

        // Si l'heure de fin est avant l'heure de début, ajouter 24h
        let diff = end.getTime() - start.getTime();
        if (diff < 0) {
          diff += 24 * 60 * 60 * 1000;
        }

        // Convertir en heures et arrondir à 2 décimales
        const hours = Math.round((diff / (1000 * 60 * 60)) * 100) / 100;
        updatedDays[dayIndex].calculatedDuration = hours;
        updatedDays[dayIndex].isWorked = hours > 0;
      }

      // Mettre à jour la semaine
      set((state) => ({
        weeks: {
          ...state.weeks,
          [currentWeekId]: {
            ...currentWeek,
            days: updatedDays,
          },
        },
      }));

      // Recalculer les totaux
      calculateTotals();
    }
  },

  // Calculer les totaux de la semaine
  calculateTotals: () => {
    const { currentWeekId, weeks } = get();
    const currentWeek = weeks[currentWeekId];

    if (currentWeek) {
      // Calculer le total des heures travaillées
      const totalHours = currentWeek.days.reduce(
        (sum, day) => sum + (day.isWorked ? day.calculatedDuration : 0),
        0
      );

      // Calculer les heures normales et supplémentaires
      let normalHours = Math.min(totalHours, NORMAL_HOURS_THRESHOLD);
      let overtimeHours25 = Math.max(
        0,
        Math.min(totalHours, OVERTIME_25_THRESHOLD) - NORMAL_HOURS_THRESHOLD
      );
      let overtimeHours50 = Math.max(0, totalHours - OVERTIME_25_THRESHOLD);

      // Arrondir à 2 décimales
      normalHours = Math.round(normalHours * 100) / 100;
      overtimeHours25 = Math.round(overtimeHours25 * 100) / 100;
      overtimeHours50 = Math.round(overtimeHours50 * 100) / 100;

      // Mettre à jour les totaux
      set((state) => ({
        weeks: {
          ...state.weeks,
          [currentWeekId]: {
            ...currentWeek,
            totalHours,
            normalHours,
            overtimeHours25,
            overtimeHours50,
          },
        },
      }));
    }
  },

  // Réinitialiser la semaine courante
  resetWeek: () => {
    const { currentWeekId } = get();

    set((state) => {
      const newWeeks = { ...state.weeks };
      delete newWeeks[currentWeekId];
      return { weeks: newWeeks };
    });

    // Réinitialiser avec une nouvelle semaine vide
    get().initializeWeek(currentWeekId);
  },

  // Exporter les données de la semaine
  exportWeekData: (format, columns) => {
    const { currentWeekId, weeks } = get();
    const currentWeek = weeks[currentWeekId];

    if (!currentWeek) return;

    // Préparer les données pour l'export
    const exportData = currentWeek.days.map((day) => {
      const data: Record<string, any> = {};

      // Filtrer les colonnes selon la sélection
      if (columns.includes("date")) data.date = day.date;
      if (columns.includes("jour")) {
        const date = new Date(day.date);
        const options: Intl.DateTimeFormatOptions = { weekday: "long" };
        data.jour = new Intl.DateTimeFormat("fr-FR", options).format(date);
      }
      if (columns.includes("debut")) data.debut = day.startTime || "";
      if (columns.includes("fin")) data.fin = day.endTime || "";
      if (columns.includes("duree")) data.duree = day.calculatedDuration;

      return data;
    });

    // Ajouter les totaux si demandé
    if (columns.includes("totaux")) {
      exportData.push({
        date: "TOTAUX",
        duree: currentWeek.totalHours,
      });
      exportData.push({
        date: "Heures normales",
        duree: currentWeek.normalHours,
      });
      exportData.push({
        date: "Heures +25%",
        duree: currentWeek.overtimeHours25,
      });
      exportData.push({
        date: "Heures +50%",
        duree: currentWeek.overtimeHours50,
      });
    }

    // Exporter selon le format demandé
    if (format === "json") {
      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `overti-me_${currentWeekId}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === "csv" || format === "xlsx") {
      // L'export CSV et Excel sera géré par la bibliothèque xlsx
      // Cette partie sera implémentée dans un composant dédié
    }
  },
}));

export default useWeekStore;
