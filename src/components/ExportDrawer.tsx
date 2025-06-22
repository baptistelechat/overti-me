import React, { useState } from "react";
import * as XLSX from "xlsx";
import useWeekStore from "../store/weekStore";
import useMediaQuery from "../hooks/useMediaQuery";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

const ExportDrawer: React.FC = () => {
  const { currentWeekId, weeks } = useWeekStore();
  const currentWeek = weeks[currentWeekId];
  
  // Utiliser le hook useMediaQuery pour détecter les écrans moyens et grands
  const isMediumScreen = useMediaQuery('(min-width: 768px)');

  // État pour les options d'export
  const [exportFormat, setExportFormat] = useState<"json" | "csv" | "xlsx">(
    "xlsx"
  );
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    "Jour",
    "Date",
    "Debut",
    "PauseDebut",
    "PauseFin",
    "Fin",
    "Duree",
    "Totaux",
    "Majorations",
  ]);

  // Options de colonnes disponibles
  const columnOptions = [
    { id: "Jour", label: "Jour de la semaine" },
    { id: "Date", label: "Date (JJ/MM/AAAA)" },
    { id: "Debut", label: "Heure de début" },
    { id: "PauseDebut", label: "Début pause" },
    { id: "PauseFin", label: "Fin pause" },
    { id: "Fin", label: "Heure de fin" },
    { id: "Duree", label: "Durée (heures)" },
    { id: "Totaux", label: "Totaux" },
    { id: "Majorations", label: "Majorations" },
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

  // Composant interne pour le contenu partagé entre Dialog et Drawer
  const ExportContent = () => (
    <>
      <div className="grid grid-cols-1 gap-6">
        {/* Format d'export */}
        <div>
          <h4 className="font-medium mb-3">Format</h4>
          <RadioGroup
            value={exportFormat}
            onValueChange={(value) =>
              setExportFormat(value as "json" | "csv" | "xlsx")
            }
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
                  id={`${option.id}-${isMediumScreen ? 'dialog' : 'drawer'}`}
                  checked={selectedColumns.includes(option.id)}
                  onCheckedChange={() => handleColumnChange(option.id)}
                />
                <Label htmlFor={`${option.id}-${isMediumScreen ? 'dialog' : 'drawer'}`}>{option.label}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  // Bouton d'export pour Dialog et Drawer
  const ExportButton = () => (
    <Button
      onClick={handleExport}
      disabled={selectedColumns.length === 0}
      variant="default"
      className="bg-green-500 hover:bg-green-600"
    >
      Exporter
    </Button>
  );

  // Rendu conditionnel en fonction de la taille de l'écran
  return isMediumScreen ? (
    // Dialog pour écrans moyens et grands
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-green-500 hover:bg-green-600">
          Exporter les données
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Exporter les données</DialogTitle>
          <DialogDescription>
            Configurez les options d'exportation pour la semaine {currentWeekId}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <ExportContent />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Fermer</Button>
          </DialogClose>
          <ExportButton />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ) : (
    // Drawer pour petits écrans
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="bg-green-500 hover:bg-green-600">
          Exporter les données
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Exporter les données</DrawerTitle>
          <DrawerDescription>
            Configurez les options d'exportation pour la semaine {currentWeekId}
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4">
           <ExportContent />
          <DrawerFooter className="flex flex-col gap-2">
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">
                Fermer
              </Button>
            </DrawerClose>
            <ExportButton />
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ExportDrawer;
