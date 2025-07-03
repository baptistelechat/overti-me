import { CheckSquare, Square } from "lucide-react";
import React, { useMemo } from "react";
import { useExportStore } from "../../store/exportStore";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

/**
 * Composant pour la sélection du format d'exportation
 * Permet de sélectionner plusieurs formats à la fois
 */
export const ExportFormatSelector: React.FC = () => {
  const {
    selectedFormats,
    formatOptions,
    handleFormatChange,
    selectAllFormats,
    deselectAllFormats,
  } = useExportStore();

  // Détermine si tous les formats sont sélectionnés
  const areAllFormatsSelected = useMemo(() => {
    return formatOptions.length === selectedFormats.length;
  }, [formatOptions.length, selectedFormats.length]);

  return (
    <div>
      <div className="flex items-center mb-4">
        <div className="mr-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={
                  areAllFormatsSelected ? deselectAllFormats : selectAllFormats
                }
                className="size-7"
              >
                {areAllFormatsSelected ? (
                  <CheckSquare className="size-4" />
                ) : (
                  <Square className="size-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {areAllFormatsSelected
                  ? "Tout désélectionner"
                  : "Tout sélectionner"}
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
        <h4 className="font-medium">Format(s)</h4>
      </div>
      <div className="flex flex-row space-x-4">
        {formatOptions.map((format) => (
          <div key={format.id} className="flex items-center space-x-2">
            <Checkbox
              id={format.id}
              checked={selectedFormats.includes(format.id)}
              onCheckedChange={() => handleFormatChange(format.id)}
            />
            <Label htmlFor={format.id} className="cursor-pointer">
              {format.label}
            </Label>
          </div>
        ))}
      </div>

      {selectedFormats.length > 1 && (
        <p className="text-xs text-muted-foreground mt-2">
          Les fichiers seront regroupés dans une archive ZIP.
        </p>
      )}
    </div>
  );
};
