/**
 * Fonctions liées aux identifiants de semaine
 */

import {
  addWeeks,
  getISOWeek,
  getISOWeekYear,
  startOfISOWeek,
  subWeeks,
} from "date-fns";

/**
 * Obtient l'identifiant de la semaine au format YYYY-WXX
 * @param date - Date pour laquelle obtenir l'identifiant de semaine
 * @returns Identifiant de semaine au format YYYY-WXX
 */
export const getWeekId = (date: Date): string => {
  // Créer une copie de la date pour éviter de modifier l'original
  const dateCopy = new Date(date);
  
  // S'assurer que l'heure est à midi pour éviter les problèmes de fuseau horaire
  dateCopy.setHours(12, 0, 0, 0);

  // Utiliser date-fns pour obtenir le numéro de semaine ISO (semaine commençant le lundi)
  const weekNumber = getISOWeek(dateCopy);

  // Obtenir l'année de la semaine ISO
  // Pour les dates proches du début/fin d'année, l'année de la semaine ISO peut différer de l'année calendaire
  const weekYear = getISOWeekYear(dateCopy);

  // Formater avec un zéro devant si nécessaire
  const paddedWeekNumber = weekNumber.toString().padStart(2, "0");

  const result = `${weekYear}-W${paddedWeekNumber}`;

  return result;
};

/**
 * Obtient l'identifiant de la semaine précédente
 * @param weekId - Identifiant de semaine actuel
 * @returns Identifiant de la semaine précédente
 */
export const getPreviousWeekId = (weekId: string): string => {


  try {
    // Extraire l'année et le numéro de semaine de l'identifiant
    const match = weekId.match(/^(\d{4})-W(\d{2})$/);
    if (!match) {
      throw new Error(`Format d'identifiant de semaine invalide: ${weekId}`);
    }

    const [, yearStr, weekNumberStr] = match;
    const year = parseInt(yearStr, 10);
    const weekNumber = parseInt(weekNumberStr, 10);

    // Créer une date de référence pour le lundi de la semaine actuelle
    // Utiliser une chaîne ISO pour éviter les problèmes de fuseau horaire
    const isoDateString = `${year}-01-01T12:00:00`;
    let referenceDate = new Date(isoDateString);
    
    // Définir l'année et la semaine ISO
    referenceDate.setHours(12, 0, 0, 0);
    referenceDate = startOfISOWeek(referenceDate);

    // Ajouter le nombre de semaines nécessaires pour atteindre la semaine spécifiée
    const mondayOfCurrentWeek = addWeeks(referenceDate, weekNumber - 1);
    // S'assurer que l'heure est toujours à midi pour éviter les problèmes de fuseau horaire
    mondayOfCurrentWeek.setHours(12, 0, 0, 0);
    
    // Obtenir le lundi de la semaine précédente
    const mondayOfPreviousWeek = subWeeks(mondayOfCurrentWeek, 1);
    // S'assurer que l'heure est toujours à midi pour éviter les problèmes de fuseau horaire
    mondayOfPreviousWeek.setHours(12, 0, 0, 0);

    // Obtenir l'ID de la semaine précédente
    const previousWeekId = getWeekId(mondayOfPreviousWeek);

    return previousWeekId;
  } catch (error) {
    console.error(
      `[getPreviousWeekId] Erreur lors du parsing de l'identifiant de semaine: ${weekId}`,
      error
    );
    throw new Error(`Format d'identifiant de semaine invalide: ${weekId}`);
  }
};

/**
 * Obtient l'identifiant de la semaine suivante
 * @param weekId - Identifiant de semaine actuel
 * @returns Identifiant de la semaine suivante
 */
export const getNextWeekId = (weekId: string): string => {
  try {
    // Extraire l'année et le numéro de semaine de l'identifiant
    const match = weekId.match(/^(\d{4})-W(\d{2})$/);
    if (!match) {
      throw new Error(`Format d'identifiant de semaine invalide: ${weekId}`);
    }

    const [, yearStr, weekNumberStr] = match;
    const year = parseInt(yearStr, 10);
    const weekNumber = parseInt(weekNumberStr, 10);

    // Créer une date de référence pour le lundi de la semaine actuelle
    // Utiliser une chaîne ISO pour éviter les problèmes de fuseau horaire
    const isoDateString = `${year}-01-01T12:00:00`;
    let referenceDate = new Date(isoDateString);
    
    // Définir l'année et la semaine ISO
    referenceDate.setHours(12, 0, 0, 0);
    referenceDate = startOfISOWeek(referenceDate);

    // Ajouter le nombre de semaines nécessaires pour atteindre la semaine spécifiée
    const mondayOfCurrentWeek = addWeeks(referenceDate, weekNumber - 1);
    // S'assurer que l'heure est toujours à midi pour éviter les problèmes de fuseau horaire
    mondayOfCurrentWeek.setHours(12, 0, 0, 0);
    
    // Obtenir le lundi de la semaine suivante
    const mondayOfNextWeek = addWeeks(mondayOfCurrentWeek, 1);
    // S'assurer que l'heure est toujours à midi pour éviter les problèmes de fuseau horaire
    mondayOfNextWeek.setHours(12, 0, 0, 0);

    // Obtenir l'ID de la semaine suivante
    const nextWeekId = getWeekId(mondayOfNextWeek);

    return nextWeekId;
  } catch (error) {
    console.error(
      `[getNextWeekId] Erreur lors du parsing de l'identifiant de semaine: ${weekId}`,
      error
    );
    throw new Error(`Format d'identifiant de semaine invalide: ${weekId}`);
  }
};
