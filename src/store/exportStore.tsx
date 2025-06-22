import { create } from "zustand";
import useWeekStore from "./weekStore";
import { prepareExportData, exportToJson, exportToXlsxOrCsv } from "../components/WeekExport/ExportUtils";

interface ColumnOption {
  id: string;
  label: string;
}

interface ExportStore {
  // État
  selectedFormats: ("json" | "csv" | "xlsx")[];
  selectedColumns: string[];
  columnOptions: ColumnOption[];
  formatOptions: { id: "json" | "csv" | "xlsx"; label: string }[];

  // Actions
  handleFormatChange: (format: "json" | "csv" | "xlsx") => void;
  handleColumnChange: (columnId: string) => void;
  selectAllColumns: () => void;
  deselectAllColumns: () => void;
  selectAllFormats: () => void;
  deselectAllFormats: () => void;
  handleExport: () => void;
}

// Création du store Zustand
export const useExportStore = create<ExportStore>((set, get) => ({
  // État initial
  selectedFormats: ["xlsx"],
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
  formatOptions: [
    { id: "xlsx", label: "Excel (.xlsx)" },
    { id: "csv", label: "CSV" },
    { id: "json", label: "JSON" },
  ],

  // Actions
  handleFormatChange: (format) => {
    const { selectedFormats } = get();
    if (selectedFormats.includes(format)) {
      set({
        selectedFormats: selectedFormats.filter((f) => f !== format),
      });
    } else {
      set({ selectedFormats: [...selectedFormats, format] });
    }
  },

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

  selectAllColumns: () => {
    const { columnOptions } = get();
    set({ selectedColumns: columnOptions.map(option => option.id) });
  },

  deselectAllColumns: () => {
    set({ selectedColumns: [] });
  },

  selectAllFormats: () => {
    const { formatOptions } = get();
    set({ selectedFormats: formatOptions.map(option => option.id) });
  },

  deselectAllFormats: () => {
    set({ selectedFormats: [] });
  },

  handleExport: () => {
    const { selectedFormats, selectedColumns } = get();
    const { currentWeekId, weeks } = useWeekStore.getState();
    const currentWeek = weeks[currentWeekId];

    if (!currentWeek || selectedFormats.length === 0) return;

    // Préparer les données pour l'export
    const exportData = prepareExportData(currentWeek, selectedColumns);

    // Si un seul format est sélectionné, exporter directement
    if (selectedFormats.length === 1) {
      const format = selectedFormats[0];
      if (format === "json") {
        exportToJson(exportData, currentWeekId);
      } else if (format === "csv" || format === "xlsx") {
        exportToXlsxOrCsv(exportData, currentWeekId, format);
      }
    } else {
      // Si plusieurs formats sont sélectionnés, créer un zip
      import("jszip").then((JSZipModule) => {
        const JSZip = JSZipModule.default;
        const zip = new JSZip();
        
        // Créer un tableau de promesses pour chaque format
        const filePromises = selectedFormats.map(format => {
          return new Promise<void>((resolve) => {
            if (format === "json") {
              const jsonString = JSON.stringify(exportData, null, 2);
              zip.file(`overti-me_${currentWeekId}.json`, jsonString);
              resolve();
            } else if (format === "csv" || format === "xlsx") {
              // Importer XLSX dynamiquement
              import("xlsx").then((XLSXModule) => {
                // XLSX n'a pas de default export, on utilise directement le module
                const worksheet = XLSXModule.utils.json_to_sheet(exportData);
                const workbook = XLSXModule.utils.book_new();
                XLSXModule.utils.book_append_sheet(workbook, worksheet, "Semaine");
                
                // Obtenir le contenu binaire
                const content = format === "csv" 
                  ? XLSXModule.write(workbook, { type: "string", bookType: "csv" })
                  : XLSXModule.write(workbook, { type: "binary", bookType: "xlsx" });
                
                zip.file(`overti-me_${currentWeekId}.${format}`, content, { binary: format === "xlsx" });
                resolve();
              });
            }
          });
        });
        
        // Attendre que tous les fichiers soient ajoutés avant de générer le zip
        Promise.all(filePromises).then(() => {
          // Générer et télécharger le zip
          zip.generateAsync({ type: "blob" }).then(content => {
            const url = URL.createObjectURL(content);
            const a = document.createElement("a");
            a.href = url;
            a.download = `overti-me_${currentWeekId}.zip`;
            a.click();
            URL.revokeObjectURL(url);
          });
        });
      });
    }
  },
}));