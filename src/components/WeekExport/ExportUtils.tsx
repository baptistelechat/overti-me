import * as XLSX from "xlsx";
import type { WeekData } from "../../types/index";

/**
 * Prépare les données pour l'exportation en filtrant les colonnes selon la sélection
 * et en ajoutant les totaux et majorations si demandé
 */
export const prepareExportData = (
  currentWeek: WeekData,
  selectedColumns: string[],
) => {
  if (!currentWeek) return [];

  // Préparer les données pour l'export
  const exportData = currentWeek.days.map((day) => {
    const data: Record<string, any> = {};

    // Filtrer les colonnes selon la sélection
    if (selectedColumns.includes("Jour")) {
      const date = new Date(day.date);
      const options: Intl.DateTimeFormatOptions = { weekday: "long" };
      const jour = new Intl.DateTimeFormat("fr-FR", options).format(date);
      data.Jour = jour.charAt(0).toUpperCase() + jour.slice(1);
    }
    if (selectedColumns.includes("Date")) {
      const date = new Date(day.date);
      data.Date = date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
    if (selectedColumns.includes("Debut")) data.Debut = day.startTime || "";
    if (selectedColumns.includes("PauseDebut"))
      data.PauseDebut = day.lunchBreakStart || "";
    if (selectedColumns.includes("PauseFin"))
      data.PauseFin = day.lunchBreakEnd || "";
    if (selectedColumns.includes("Fin")) data.Fin = day.endTime || "";
    if (selectedColumns.includes("Duree"))
      data.Duree = day.calculatedDuration;

    return data;
  });

  // Ajouter les totaux si demandé
  if (
    selectedColumns.includes("Totaux") ||
    selectedColumns.includes("Majorations")
  ) {
    const totalRow: Record<string, any> = {};
    const normalRow: Record<string, any> = {};
    const overtime25Row: Record<string, any> = {};
    const overtime50Row: Record<string, any> = {};

    // Déterminer quelle colonne utiliser pour les libellés
    if (selectedColumns.includes("Jour")) {
      totalRow.Jour = "Totaux";
      normalRow.Jour = "Heures normales";
      overtime25Row.Jour = "Heures +25%";
      overtime50Row.Jour = "Heures +50%";
    } else if (selectedColumns.includes("Date")) {
      totalRow.Date = "Totaux";
      normalRow.Date = "Heures normales";
      overtime25Row.Date = "Heures +25%";
      overtime50Row.Date = "Heures +50%";
    }

    if (selectedColumns.includes("Duree")) {
      totalRow.Duree = currentWeek.totalHours;
      normalRow.Duree = currentWeek.normalHours;
    }

    // Ajouter le total général si l'option Totaux est sélectionnée
    if (selectedColumns.includes("Totaux")) {
      exportData.push(totalRow);
      exportData.push(normalRow);
    }

    // Ajouter les majorations si l'option Majorations est sélectionnée
    if (selectedColumns.includes("Majorations")) {
      if (selectedColumns.includes("Duree")) {
        overtime25Row.Duree = currentWeek.overtimeHours25;
        overtime50Row.Duree = currentWeek.overtimeHours50;
      }
      exportData.push(overtime25Row);
      exportData.push(overtime50Row);
    }
  }

  return exportData;
};

/**
 * Exporte les données au format JSON
 */
export const exportToJson = (exportData: Record<string, any>[], currentWeekId: string) => {
  const jsonString = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `overti-me_${currentWeekId}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

/**
 * Exporte les données au format CSV ou XLSX
 */
export const exportToXlsxOrCsv = (
  exportData: Record<string, any>[],
  currentWeekId: string,
  format: "csv" | "xlsx"
) => {
  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Semaine");

  if (format === "csv") {
    // Export CSV
    XLSX.writeFile(workbook, `overti-me_${currentWeekId}.csv`);
  } else {
    // Export Excel
    XLSX.writeFile(workbook, `overti-me_${currentWeekId}.xlsx`);
  }
};