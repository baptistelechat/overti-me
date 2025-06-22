import { CheckSquare, Square } from "lucide-react";
import React, { useMemo } from "react";
import useMediaQuery from "../../hooks/useMediaQuery";
import { useExportStore } from "../../store/exportStore";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

/**
 * Composant pour la sélection des colonnes à exporter
 */
export const ExportColumnSelector: React.FC = () => {
  const {
    selectedColumns,
    columnOptions,
    handleColumnChange,
    selectAllColumns,
    deselectAllColumns,
  } = useExportStore();

  // Détermine si toutes les colonnes sont sélectionnées
  const areAllColumnsSelected = useMemo(() => {
    return columnOptions.length === selectedColumns.length;
  }, [columnOptions.length, selectedColumns.length]);
  const isMediumScreen = useMediaQuery("(min-width: 768px)");

  return (
    <div>
      <div className="flex items-center mb-3">
        <div className="mr-3">
          <Button
            variant="outline"
            size="icon"
            onClick={
              areAllColumnsSelected ? deselectAllColumns : selectAllColumns
            }
            className="h-7 w-7"
            title={
              areAllColumnsSelected
                ? "Tout désélectionner"
                : "Tout sélectionner"
            }
          >
            {areAllColumnsSelected ? (
              <CheckSquare className="h-4 w-4" />
            ) : (
              <Square className="h-4 w-4" />
            )}
          </Button>
        </div>
        <h4 className="font-medium">Colonnes à inclure</h4>
      </div>
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
