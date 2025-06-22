import { create } from "zustand";
import useWeekStore from "./weekStore";
import { prepareExportData, exportToJson, exportToXlsxOrCsv } from "../components/WeekExport/ExportUtils";

interface ColumnOption {
  id: string;
  label: string;
}

interface ExportStore {
  // État
  exportFormat: "json" | "csv" | "xlsx";
  selectedColumns: string[];
  columnOptions: ColumnOption[];

  // Actions
  setExportFormat: (format: "json" | "csv" | "xlsx") => void;
  handleColumnChange: (columnId: string) => void;
  handleExport: () => void;
}

// Création du store Zustand
export const useExportStore = create<ExportStore>((set, get) => ({
  // État initial
  exportFormat: "xlsx",
  selectedColumns: [
    "Jour",
    "Date",
    "Debut",
    "PauseDebut",
    "PauseFin",
    "Fin",
    "Duree",
    "Totaux",
    "Majorations",
  ],
  columnOptions: [
    { id: "Jour", label: "Jour de la semaine" },
    { id: "Date", label: "Date (JJ/MM/AAAA)" },
    { id: "Debut", label: "Heure de début" },
    { id: "PauseDebut", label: "Début pause" },
    { id: "PauseFin", label: "Fin pause" },
    { id: "Fin", label: "Heure de fin" },
    { id: "Duree", label: "Durée (heures)" },
    { id: "Totaux", label: "Totaux" },
    { id: "Majorations", label: "Majorations" },
  ],

  // Actions
  setExportFormat: (format) => set({ exportFormat: format }),

  handleColumnChange: (columnId) => {
    const { selectedColumns } = get();
    if (selectedColumns.includes(columnId)) {
      set({
        selectedColumns: selectedColumns.filter((id) => id !== columnId),
      });
    } else {
      set({ selectedColumns: [...selectedColumns, columnId] });
    }
  },

  handleExport: () => {
    const { exportFormat, selectedColumns } = get();
    const { currentWeekId, weeks } = useWeekStore.getState();
    const currentWeek = weeks[currentWeekId];

    if (!currentWeek) return;

    // Préparer les données pour l'export
    const exportData = prepareExportData(currentWeek, selectedColumns, currentWeekId);

    // Exporter selon le format demandé
    if (exportFormat === "json") {
      exportToJson(exportData, currentWeekId);
    } else if (exportFormat === "csv" || exportFormat === "xlsx") {
      exportToXlsxOrCsv(exportData, currentWeekId, exportFormat);
    }
  },
}));