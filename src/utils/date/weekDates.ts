/**
 * Fonctions liées aux dates des semaines
 */

import { addDays, setISOWeek, setISOWeekYear, startOfISOWeek } from "date-fns";

/**
 * Obtient les dates des jours d'une semaine à partir de son identifiant
 * @param weekId - Identifiant de semaine au format YYYY-WXX
 * @returns Tableau de dates pour chaque jour de la semaine (lundi à dimanche)
 */
export const getWeekDates = (weekId: string): Date[] => {
  // Format: YYYY-WXX où YYYY est l'année et XX est le numéro de semaine
  // Exemple: 2025-W25 pour la semaine 25 de 2025
  try {
    // Extraire l'année et le numéro de semaine de l'identifiant
    const match = weekId.match(/^(\d{4})-W(\d{2})$/);
    if (!match) {
      throw new Error(`Format d'identifiant de semaine invalide: ${weekId}`);
    }

    const [, yearStr, weekNumberStr] = match;
    const year = parseInt(yearStr, 10);
    const weekNumber = parseInt(weekNumberStr, 10);

    // Créer une date de référence avec l'année et la semaine ISO
    // Utiliser une chaîne ISO pour éviter les problèmes de fuseau horaire
    const isoDateString = `${year}-01-01T12:00:00`;
    let referenceDate = new Date(isoDateString);

    // Définir l'année et la semaine ISO
    referenceDate = setISOWeekYear(referenceDate, year);
    referenceDate = setISOWeek(referenceDate, weekNumber);

    // Obtenir le lundi de cette semaine (début de la semaine ISO)
    // Utiliser 12:00:00 pour éviter les problèmes de fuseau horaire
    const mondayOfWeek = startOfISOWeek(referenceDate);
    // Régler l'heure à midi pour éviter les problèmes de fuseau horaire
    mondayOfWeek.setHours(12, 0, 0, 0);
    

    // Générer les dates pour chaque jour de la semaine (lundi à dimanche)
    const weekDates: Date[] = [];
    const dayNames = [
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
      "Dimanche",
    ];

    for (let i = 0; i < 7; i++) {
      const currentDate = addDays(mondayOfWeek, i);
      // S'assurer que l'heure est toujours à midi pour éviter les problèmes de fuseau horaire
      currentDate.setHours(12, 0, 0, 0);
      weekDates.push(currentDate);
    }

    // Note: Nous utilisons des dates avec l'heure à midi (12:00:00) pour éviter les problèmes
    // de décalage horaire lors de l'affichage des dates en heure locale.

    return weekDates;
  } catch (error) {
    console.error(
      `[getWeekDates] Erreur lors du parsing de l'identifiant de semaine: ${weekId}`,
      error
    );
    throw new Error(`Format d'identifiant de semaine invalide: ${weekId}`);
  }
};
