/**
 * Utilitaires pour la gestion des dates et des semaines
 */

/**
 * Obtient l'identifiant de la semaine au format YYYY-WXX
 * @param date - Date pour laquelle obtenir l'identifiant de semaine
 * @returns Identifiant de semaine au format YYYY-WXX
 */
export function getWeekId(date: Date): string {
  // Utiliser la méthode standard pour obtenir le numéro de semaine ISO
  // ISO 8601 définit la semaine 1 comme la semaine contenant le premier jeudi de l'année
  // et les semaines commencent le lundi
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  
  // Définir le jour au jeudi de la même semaine
  d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
  
  // Obtenir le premier jour de l'année
  const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
  
  // Calculer le numéro de semaine
  const weekNumber = Math.ceil(((d.getTime() - firstDayOfYear.getTime()) / 86400000 + 1) / 7);
  
  // Formater avec un zéro devant si nécessaire
  const paddedWeekNumber = weekNumber.toString().padStart(2, '0');
  
  return `${d.getFullYear()}-W${paddedWeekNumber}`;
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
  const yearNumber = parseInt(year, 10);
  
  // Utiliser la norme ISO 8601 pour calculer la date du lundi de la semaine demandée
  // La première semaine de l'année est celle qui contient le premier jeudi
  
  // Trouver le premier jour de l'année
  const firstDayOfYear = new Date(yearNumber, 0, 1);
  
  // Trouver le premier jeudi de l'année
  const firstThursday = new Date(firstDayOfYear);
  firstThursday.setDate(firstDayOfYear.getDate() + (4 - (firstDayOfYear.getDay() || 7)) + 7);
  
  // Calculer le lundi de la première semaine (4 jours avant le premier jeudi)
  const firstMondayOfFirstWeek = new Date(firstThursday);
  firstMondayOfFirstWeek.setDate(firstThursday.getDate() - 3);
  
  // Calculer le lundi de la semaine demandée
  const mondayOfRequestedWeek = new Date(firstMondayOfFirstWeek);
  mondayOfRequestedWeek.setDate(firstMondayOfFirstWeek.getDate() + (weekNumber - 1) * 7);
  
  // Générer les dates pour chaque jour de la semaine (lundi à dimanche)
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