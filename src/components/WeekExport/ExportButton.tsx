import React from "react";
import { Button } from "../ui/button";
import { useExportStore } from "../../store/exportStore";

/**
 * Composant pour le bouton d'exportation
 */
export const ExportButton: React.FC = () => {
  const { selectedColumns, handleExport } = useExportStore();

  return (
    <Button
      onClick={handleExport}
      disabled={selectedColumns.length === 0}
      variant="default"
      className="bg-green-500 hover:bg-green-600"
    >
      Exporter
    </Button>
  );
};