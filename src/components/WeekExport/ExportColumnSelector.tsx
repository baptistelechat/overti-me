import React from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { useExportStore } from "../../store/exportStore";
import useMediaQuery from "../../hooks/useMediaQuery";

/**
 * Composant pour la sélection des colonnes à exporter
 */
export const ExportColumnSelector: React.FC = () => {
  const { selectedColumns, columnOptions, handleColumnChange } = useExportStore();
  const isMediumScreen = useMediaQuery("(min-width: 768px)");

  return (
    <div>
      <h4 className="font-medium mb-3">Colonnes à inclure</h4>
      <div className="grid grid-cols-2 gap-3">
        {columnOptions.map((option) => (
          <div key={option.id} className="flex items-center space-x-2">
            <Checkbox
              id={`${option.id}-${isMediumScreen ? "dialog" : "drawer"}`}
              checked={selectedColumns.includes(option.id)}
              onCheckedChange={() => handleColumnChange(option.id)}
            />
            <Label
              htmlFor={`${option.id}-${isMediumScreen ? "dialog" : "drawer"}`}
            >
              {option.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};