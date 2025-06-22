import React from "react";
import { ExportFormatSelector } from "./ExportFormatSelector";
import { ExportColumnSelector } from "./ExportColumnSelector";

/**
 * Composant pour le contenu du dialogue d'exportation
 */
export const ExportContent: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Format d'export */}
      <ExportFormatSelector />

      {/* Sélection des colonnes */}
      <ExportColumnSelector />
    </div>
  );
};