import React from "react";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useExportStore } from "../../store/exportStore";

/**
 * Composant pour la sélection du format d'exportation
 */
export const ExportFormatSelector: React.FC = () => {
  const { exportFormat, setExportFormat } = useExportStore();

  return (
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
  );
};