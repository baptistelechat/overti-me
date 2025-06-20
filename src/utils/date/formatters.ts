/**
 * Fonctions de formatage des dates
 */

import { format } from "date-fns";
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
 * Formate une date pour afficher uniquement le jour de la semaine
 * @param date - Date à formater
 * @returns Jour de la semaine (ex: "lundi")
 */
export const formatWeekday = (date: Date): string => {
  // Créer une copie de la date pour éviter de modifier l'original
  const dateCopy = new Date(date);
  
  // S'assurer que l'heure est à midi pour éviter les problèmes de fuseau horaire
  dateCopy.setHours(12, 0, 0, 0);
  
  return format(dateCopy, "EEEE", { locale: fr });
};

// Note: Nous utilisons des dates avec l'heure à midi (12:00:00) pour éviter les problèmes
// de décalage horaire lors de l'affichage des dates en heure locale.