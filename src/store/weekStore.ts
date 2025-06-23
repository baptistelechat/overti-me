import {
  NORMAL_HOURS_THRESHOLD,
  OVERTIME_25_THRESHOLD,
} from "@/constants/hoursThreshold";
import { getWeekDates } from "@/utils/date/weekDates";
import { getWeekId } from "@/utils/date/weekId";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { WeekData, WorkDay } from "../types";
import useAuthStore from "./authStore";

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
  resetDay: (dayIndex: number) => void;
  exportWeekData: (format: "json" | "csv" | "xlsx", columns: string[]) => void;
}

// Création du store Zustand avec persistance localStorage
const useWeekStore = create<WeekStore>()(
  persist(
    (set, get) => ({
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
          
          // Synchroniser la nouvelle semaine avec Supabase si l'utilisateur est connecté
          const { user, updateWeekInSupabase } = useAuthStore.getState();
          if (user) {
            updateWeekInSupabase(newWeek).catch(error => {
              console.error("Erreur lors de la synchronisation de la nouvelle semaine avec Supabase:", error);
            });
          }
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

        if (
          currentWeek &&
          dayIndex >= 0 &&
          dayIndex < currentWeek.days.length
        ) {
          // Mettre à jour le jour spécifié
          const updatedDays = [...currentWeek.days];
          updatedDays[dayIndex] = { ...updatedDays[dayIndex], ...dayData };

          // Récupérer les valeurs de startTime et endTime (soit des nouvelles valeurs, soit des valeurs existantes)
          const startTime =
            dayData.startTime || updatedDays[dayIndex].startTime;
          const endTime = dayData.endTime || updatedDays[dayIndex].endTime;
          const lunchBreakStart =
            dayData.lunchBreakStart || updatedDays[dayIndex].lunchBreakStart;
          const lunchBreakEnd =
            dayData.lunchBreakEnd || updatedDays[dayIndex].lunchBreakEnd;

          // Calculer la durée dans différents cas de figure
          let totalMinutes = 0;
          let hours = 0;

          // Cas 1: Journée complète (début et fin renseignés)
          if (startTime && endTime) {
            // Convertir les heures en minutes depuis minuit
            const [startHour, startMinute] = startTime.split(":").map(Number);
            const [endHour, endMinute] = endTime.split(":").map(Number);

            const startMinutes = startHour * 60 + startMinute;
            let endMinutes = endHour * 60 + endMinute;

            // Si l'heure de fin est avant l'heure de début, on ajoute 24h (pour les horaires qui passent minuit)
            if (endMinutes < startMinutes) {
              endMinutes += 24 * 60;
            }

            // Calculer la durée totale sans pause
            totalMinutes = endMinutes - startMinutes;

            // Soustraire la pause méridienne si elle est définie
            if (lunchBreakStart && lunchBreakEnd) {
              const [lunchStartHour, lunchStartMinute] = lunchBreakStart
                .split(":")
                .map(Number);
              const [lunchEndHour, lunchEndMinute] = lunchBreakEnd
                .split(":")
                .map(Number);

              const lunchStartMinutes = lunchStartHour * 60 + lunchStartMinute;
              let lunchEndMinutes = lunchEndHour * 60 + lunchEndMinute;

              // Si l'heure de fin de pause est avant l'heure de début de pause, on ajoute 24h
              if (lunchEndMinutes < lunchStartMinutes) {
                lunchEndMinutes += 24 * 60;
              }

              // Soustraire la durée de la pause
              const breakDuration = lunchEndMinutes - lunchStartMinutes;
              totalMinutes -= breakDuration;
            }
          }
          // Cas 2: Matinée uniquement (début et début pause renseignés)
          else if (startTime && lunchBreakStart) {
            const [startHour, startMinute] = startTime.split(":").map(Number);
            const [lunchStartHour, lunchStartMinute] = lunchBreakStart
              .split(":")
              .map(Number);

            const startMinutes = startHour * 60 + startMinute;
            let lunchStartMinutes = lunchStartHour * 60 + lunchStartMinute;

            // Si l'heure de début de pause est avant l'heure de début, on ajoute 24h
            if (lunchStartMinutes < startMinutes) {
              lunchStartMinutes += 24 * 60;
            }

            // Calculer la durée de la matinée
            totalMinutes = lunchStartMinutes - startMinutes;
          }
          // Cas 3: Après-midi uniquement (fin pause et fin renseignés)
          else if (lunchBreakEnd && endTime) {
            const [lunchEndHour, lunchEndMinute] = lunchBreakEnd
              .split(":")
              .map(Number);
            const [endHour, endMinute] = endTime.split(":").map(Number);

            const lunchEndMinutes = lunchEndHour * 60 + lunchEndMinute;
            let endMinutes = endHour * 60 + endMinute;

            // Si l'heure de fin est avant l'heure de fin de pause, on ajoute 24h
            if (endMinutes < lunchEndMinutes) {
              endMinutes += 24 * 60;
            }

            // Calculer la durée de l'après-midi
            totalMinutes = endMinutes - lunchEndMinutes;
          }

          // Calculer la différence en heures (arrondie à 2 décimales)
          if (totalMinutes > 0) {
            hours = Math.round((totalMinutes / 60) * 100) / 100;
          }
          updatedDays[dayIndex].calculatedDuration = hours;
          updatedDays[dayIndex].isWorked = hours > 0;

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
          
          // Synchroniser avec Supabase si l'utilisateur est connecté
          const { user, updateWeekInSupabase } = useAuthStore.getState();
          if (user) {
            // On récupère la semaine mise à jour après le calcul des totaux
            const updatedWeek = get().weeks[currentWeekId];
            updateWeekInSupabase(updatedWeek).catch(error => {
              console.error("Erreur lors de la synchronisation avec Supabase:", error);
            });
          }
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
          
          // Synchroniser avec Supabase si l'utilisateur est connecté
          const { user, updateWeekInSupabase } = useAuthStore.getState();
          if (user) {
            // On récupère la semaine mise à jour
            const updatedWeek = get().weeks[currentWeekId];
            updateWeekInSupabase(updatedWeek).catch(error => {
              console.error("Erreur lors de la synchronisation avec Supabase:", error);
            });
          }
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
        
        // La synchronisation avec Supabase est gérée dans initializeWeek
      },

      // Réinitialiser un jour spécifique
      resetDay: (dayIndex) => {
        const { currentWeekId, weeks, calculateTotals } = get();
        const currentWeek = weeks[currentWeekId];

        if (
          currentWeek &&
          dayIndex >= 0 &&
          dayIndex < currentWeek.days.length
        ) {
          // Récupérer la date du jour à réinitialiser
          const dateToKeep = currentWeek.days[dayIndex].date;

          // Créer un jour vide avec la même date
          const resetDay: WorkDay = {
            date: dateToKeep,
            startTime: "",
            endTime: "",
            lunchBreakStart: "",
            lunchBreakEnd: "",
            calculatedDuration: 0,
            isWorked: false,
          };

          // Mettre à jour le jour spécifié
          const updatedDays = [...currentWeek.days];
          updatedDays[dayIndex] = resetDay;

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
          
          // Synchroniser avec Supabase si l'utilisateur est connecté
          const { user, updateWeekInSupabase } = useAuthStore.getState();
          if (user) {
            // On récupère la semaine mise à jour après le calcul des totaux
            const updatedWeek = get().weeks[currentWeekId];
            updateWeekInSupabase(updatedWeek).catch(error => {
              console.error("Erreur lors de la synchronisation avec Supabase:", error);
            });
          }
        }
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
          if (columns.includes("pauseDebut"))
            data.pauseDebut = day.lunchBreakStart || "";
          if (columns.includes("pauseFin"))
            data.pauseFin = day.lunchBreakEnd || "";
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
    }),
    {
      name: "overti-me-storage", // nom unique pour le stockage
      storage: createJSONStorage(() => localStorage), // utiliser localStorage
      partialize: (state) => ({
        // ne stocker que ces propriétés
        currentWeekId: state.currentWeekId,
        weeks: state.weeks,
      }),
    }
  )
);

export default useWeekStore;
