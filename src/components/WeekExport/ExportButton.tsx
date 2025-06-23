import React from "react";
import { useExportStore } from "../../store/exportStore";
import { Button } from "../ui/button";

/**
 * Composant pour le bouton d'exportation
 */
export const ExportButton: React.FC = () => {
  const { selectedColumns, selectedFormats, handleExport } = useExportStore();

  return (
    <Button
      onClick={handleExport}
      disabled={selectedColumns.length === 0 || selectedFormats.length === 0}
      variant="default"
      className="bg-green-500 hover:bg-green-600"
    >
      Exporter
    </Button>
  );
};
