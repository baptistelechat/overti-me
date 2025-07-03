import { CheckSquare, Square } from "lucide-react";
import React, { useMemo } from "react";
import useMediaQuery from "../../hooks/useMediaQuery";
import { useExportStore } from "../../store/exportStore";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../ui/tooltip";
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
      <div className="flex items-center mb-4">
        <div className="mr-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={
                  areAllColumnsSelected ? deselectAllColumns : selectAllColumns
                }
                className="size-7"
              >
                {areAllColumnsSelected ? (
                  <CheckSquare className="size-4" />
                ) : (
                  <Square className="size-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {areAllColumnsSelected
                  ? "Tout désélectionner"
                  : "Tout sélectionner"}
              </p>
            </TooltipContent>
          </Tooltip>
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
