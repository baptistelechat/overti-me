import React, { useState } from "react";
import * as XLSX from "xlsx";
import useWeekStore from "../store/weekStore";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

const ExportOptions: React.FC = () => {
  const { currentWeekId, weeks } = useWeekStore();
  const currentWeek = weeks[currentWeekId];

  // État pour les options d'export
  const [exportFormat, setExportFormat] = useState<"json" | "csv" | "xlsx">(
    "xlsx"
  );
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    "date",
    "jour",
    "debut",
    "pauseDebut",
    "pauseFin",
    "fin",
    "duree",
    "totaux",
  ]);

  // Options de colonnes disponibles
  const columnOptions = [
    { id: "date", label: "Date (YYYY-MM-DD)" },
    { id: "jour", label: "Jour de la semaine" },
    { id: "debut", label: "Heure de début" },
    { id: "pauseDebut", label: "Début pause" },
    { id: "pauseFin", label: "Fin pause" },
    { id: "fin", label: "Heure de fin" },
    { id: "duree", label: "Durée (heures)" },
    { id: "totaux", label: "Totaux et majorations" },
  ];

  // Gérer le changement de sélection des colonnes
  const handleColumnChange = (columnId: string) => {
    if (selectedColumns.includes(columnId)) {
      setSelectedColumns(selectedColumns.filter((id) => id !== columnId));
    } else {
      setSelectedColumns([...selectedColumns, columnId]);
    }
  };

  // Exporter les données
  const handleExport = () => {
    if (!currentWeek) return;

    // Préparer les données pour l'export
    const exportData = currentWeek.days.map((day) => {
      const data: Record<string, any> = {};

      // Filtrer les colonnes selon la sélection
      if (selectedColumns.includes("date")) data.date = day.date;
      if (selectedColumns.includes("jour")) {
        const date = new Date(day.date);
        const options: Intl.DateTimeFormatOptions = { weekday: "long" };
        data.jour = new Intl.DateTimeFormat("fr-FR", options).format(date);
      }
      if (selectedColumns.includes("debut")) data.debut = day.startTime || "";
      if (selectedColumns.includes("pauseDebut")) data.pauseDebut = day.lunchBreakStart || "";
      if (selectedColumns.includes("pauseFin")) data.pauseFin = day.lunchBreakEnd || "";
      if (selectedColumns.includes("fin")) data.fin = day.endTime || "";
      if (selectedColumns.includes("duree"))
        data.duree = day.calculatedDuration;

      return data;
    });

    // Ajouter les totaux si demandé
    if (selectedColumns.includes("totaux")) {
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
    if (exportFormat === "json") {
      // Export JSON
      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `overti-me_${currentWeekId}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (exportFormat === "csv" || exportFormat === "xlsx") {
      // Export CSV ou Excel via xlsx
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Semaine");

      if (exportFormat === "csv") {
        // Export CSV
        XLSX.writeFile(workbook, `overti-me_${currentWeekId}.csv`);
      } else {
        // Export Excel
        XLSX.writeFile(workbook, `overti-me_${currentWeekId}.xlsx`);
      }
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Exporter les données</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Format d'export */}
          <div>
            <h4 className="font-medium mb-3">Format</h4>
            <RadioGroup
              value={exportFormat}
              onValueChange={(value) => setExportFormat(value as "json" | "csv" | "xlsx")}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="xlsx" id="xlsx" />
                <Label htmlFor="xlsx">Excel (.xlsx)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv">CSV</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="json" id="json" />
                <Label htmlFor="json">JSON</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Sélection des colonnes */}
          <div>
            <h4 className="font-medium mb-3">Colonnes à inclure</h4>
            <div className="grid grid-cols-2 gap-3">
              {columnOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={selectedColumns.includes(option.id)}
                    onCheckedChange={() => handleColumnChange(option.id)}
                  />
                  <Label htmlFor={option.id}>{option.label}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bouton d'export */}
        <div className="mt-6 text-center">
          <Button
            onClick={handleExport}
            disabled={selectedColumns.length === 0}
            variant="default"
            className="bg-green-500 hover:bg-green-600"
          >
            Exporter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExportOptions;
