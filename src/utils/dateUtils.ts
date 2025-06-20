/**
 * Utilitaires pour la gestion des dates et des semaines
 */

/**
 * Obtient l'identifiant de la semaine au format YYYY-WXX
 * @param date - Date pour laquelle obtenir l'identifiant de semaine
 * @returns Identifiant de semaine au format YYYY-WXX
 */
export function getWeekId(date: Date): string {
  const year = date.getFullYear();
  
  // Créer une nouvelle date au 1er janvier de l'année
  const firstDayOfYear = new Date(year, 0, 1);
  
  // Calculer le nombre de jours depuis le premier jour de l'année
  const daysSinceFirstDay = Math.floor(
    (date.getTime() - firstDayOfYear.getTime()) / (24 * 60 * 60 * 1000)
  );
  
  // Calculer le numéro de semaine
  // Ajouter 1 car getDay() retourne 0 pour dimanche, et on veut que lundi soit le premier jour
  const weekNumber = Math.ceil(
    (daysSinceFirstDay + firstDayOfYear.getDay() + 1) / 7
  );
  
  // Formater avec un zéro devant si nécessaire
  const paddedWeekNumber = weekNumber.toString().padStart(2, '0');
  
  return `${year}-W${paddedWeekNumber}`;
}

/**
 * Obtient les dates des jours d'une semaine à partir de son identifiant
 * @param weekId - Identifiant de semaine au format YYYY-WXX
 * @returns Tableau de dates pour chaque jour de la semaine (lundi à dimanche)
 */
export function getWeekDates(weekId: string): Date[] {
  // Extraire l'année et le numéro de semaine
  const [year, weekPart] = weekId.split('-');
  const weekNumber = parseInt(weekPart.substring(1), 10);
  
  // Créer une date au 1er janvier de l'année
  const firstDayOfYear = new Date(parseInt(year, 10), 0, 1);
  
  // Calculer le jour de la semaine du 1er janvier (0 = dimanche, 1 = lundi, ...)
  const dayOfWeek = firstDayOfYear.getDay() || 7; // Convertir 0 (dimanche) en 7
  
  // Calculer la date du premier jour de la première semaine
  // Si le 1er janvier est un lundi, c'est le premier jour de la semaine 1
  // Sinon, c'est le lundi précédent
  const daysToFirstMonday = dayOfWeek === 1 ? 0 : (8 - dayOfWeek);
  const firstMonday = new Date(parseInt(year, 10), 0, 1 + daysToFirstMonday);
  
  // Calculer la date du lundi de la semaine demandée
  const mondayOfRequestedWeek = new Date(firstMonday);
  mondayOfRequestedWeek.setDate(firstMonday.getDate() + (weekNumber - 1) * 7);
  
  // Générer les dates pour chaque jour de la semaine
  const weekDates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(mondayOfRequestedWeek);
    date.setDate(mondayOfRequestedWeek.getDate() + i);
    weekDates.push(date);
  }
  
  return weekDates;
}

/**
 * Formate une date au format local (fr-FR)
 * @param date - Date à formater
 * @returns Date formatée (ex: "Lundi 25 juin 2025")
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Obtient l'identifiant de la semaine précédente
 * @param weekId - Identifiant de semaine actuel
 * @returns Identifiant de la semaine précédente
 */
export function getPreviousWeekId(weekId: string): string {
  const [year, weekPart] = weekId.split('-');
  const weekNumber = parseInt(weekPart.substring(1), 10);
  
  if (weekNumber > 1) {
    // Semaine précédente dans la même année
    const prevWeekNumber = (weekNumber - 1).toString().padStart(2, '0');
    return `${year}-W${prevWeekNumber}`;
  } else {
    // Dernière semaine de l'année précédente
    const prevYear = parseInt(year, 10) - 1;
    // Approximation: la dernière semaine est généralement la 52e ou 53e
    // Pour être précis, il faudrait calculer le nombre exact de semaines dans l'année précédente
    const lastWeek = '52';
    return `${prevYear}-W${lastWeek}`;
  }
}

/**
 * Obtient l'identifiant de la semaine suivante
 * @param weekId - Identifiant de semaine actuel
 * @returns Identifiant de la semaine suivante
 */
export function getNextWeekId(weekId: string): string {
  const [year, weekPart] = weekId.split('-');
  const weekNumber = parseInt(weekPart.substring(1), 10);
  
  if (weekNumber < 52) {
    // Semaine suivante dans la même année
    const nextWeekNumber = (weekNumber + 1).toString().padStart(2, '0');
    return `${year}-W${nextWeekNumber}`;
  } else {
    // Première semaine de l'année suivante
    const nextYear = parseInt(year, 10) + 1;
    return `${nextYear}-W01`;
  }
}