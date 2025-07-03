/**
 * Fonctions de formatage des dates
 */

import { format, formatDistanceToNow, formatISO } from "date-fns";
import { fr } from "date-fns/locale";

/**
 * Formate une date au format local (fr-FR)
 * @param date - Date à formater
 * @returns Date formatée (ex: "lundi 23 juin 2025")
 */
export const formatDate = (date: Date): string => {
  // Créer une copie de la date pour éviter de modifier l'original
  const dateCopy = new Date(date);
  
  // S'assurer que l'heure est à midi pour éviter les problèmes de fuseau horaire
  dateCopy.setHours(12, 0, 0, 0);
  
  return format(dateCopy, "EEEE d MMMM yyyy", { locale: fr });
};

/**
 * Formate une date au format court (fr-FR)
 * @param date - Date à formater
 * @returns Date formatée (ex: "23/06/2025")
 */
export const formatShortDate = (date: Date): string => {
  // Créer une copie de la date pour éviter de modifier l'original
  const dateCopy = new Date(date);
  
  // S'assurer que l'heure est à midi pour éviter les problèmes de fuseau horaire
  dateCopy.setHours(12, 0, 0, 0);
  
  return format(dateCopy, "dd/MM/yyyy", { locale: fr });
};

/**
 * Formate une date pour afficher uniquement le jour et le mois
 * @param date - Date à formater
 * @returns Date formatée (ex: "23 juin")
 */
export const formatDayMonth = (date: Date): string => {
  // Créer une copie de la date pour éviter de modifier l'original
  const dateCopy = new Date(date);
  
  // S'assurer que l'heure est à midi pour éviter les problèmes de fuseau horaire
  dateCopy.setHours(12, 0, 0, 0);
  
  return format(dateCopy, "d MMMM", { locale: fr });
};

/**
 * Formate une date avec l'heure complète
 * @param date - Date à formater
 * @returns Date et heure formatées (ex: "23/06/2025 14:30:45")
 */
export const formatDateTime = (date: Date | string | null): string => {
  if (!date) return "Jamais";
  
  // Convertir en objet Date si c'est une chaîne
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return format(dateObj, "dd/MM/yyyy HH:mm:ss", { locale: fr });
};

/**
 * Formate une date en temps relatif (il y a X minutes, etc.)
 * @param date - Date à formater
 * @returns Temps relatif formaté (ex: "il y a 5 minutes")
 */
export const formatRelativeTime = (date: Date | string | null): string => {
  if (!date) return "Jamais";
  
  // Convertir en objet Date si c'est une chaîne
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return formatDistanceToNow(dateObj, { addSuffix: true, locale: fr });
};

/**
 * Formate une date au format ISO (pour les attributs HTML comme title)
 * @param date - Date à formater
 * @returns Date au format ISO
 */
export const formatISODate = (date: Date | string | null): string => {
  if (!date) return "";
  
  // Convertir en objet Date si c'est une chaîne
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return formatISO(dateObj);
};

/**
 * Formate une date pour afficher uniquement le jour de la semaine
 * @param date - Date à formater
 * @param capitalize - Mettre la première lettre en majuscule
 * @returns Jour de la semaine (ex: "lundi" ou "Lundi" si capitalize=true)
 */
export const formatWeekday = (date: Date | string, capitalize: boolean = false): string => {
  // Convertir en objet Date si c'est une chaîne
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
  
  // S'assurer que l'heure est à midi pour éviter les problèmes de fuseau horaire
  dateObj.setHours(12, 0, 0, 0);
  
  const weekday = format(dateObj, "EEEE", { locale: fr });
  
  return capitalize ? weekday.charAt(0).toUpperCase() + weekday.slice(1) : weekday;
};

// Note: Nous utilisons des dates avec l'heure à midi (12:00:00) pour éviter les problèmes
// de décalage horaire lors de l'affichage des dates en heure locale.