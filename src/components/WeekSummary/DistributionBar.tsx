import React from "react";
import { cn } from "@/lib/utils";

interface DistributionBarProps {
  normalHours: number;
  overtimeHours25: number;
  overtimeHours50: number;
  totalHours: number;
  isOverLegalLimit?: boolean;
}

/**
 * Composant de barre de distribution des heures
 */
export const DistributionBar: React.FC<DistributionBarProps> = ({
  normalHours,
  overtimeHours25,
  overtimeHours50,
  totalHours,
  isOverLegalLimit = false,
}) => {
  // Calcul des pourcentages relatifs à la durée totale
  const safeTotal = totalHours || 0.001; // Éviter division par zéro
  const normalPercentage = (normalHours / safeTotal) * 100;
  const overtime25Percentage = (overtimeHours25 / safeTotal) * 100;
  const overtime50Percentage = (overtimeHours50 / safeTotal) * 100;

  return (
    <div className="mt-6 mb-4">
      <div className="flex justify-between items-center mb-2">
        <span
          className={cn(
            "text-muted-foreground",
            isOverLegalLimit && "text-destructive"
          )}
        >
          Répartition des heures
        </span>
        <span
          className={cn(
            "font-medium",
            isOverLegalLimit && "text-destructive"
          )}
        >
          {totalHours.toFixed(2)}h
        </span>
      </div>

      {/* Barre de progression personnalisée avec 3 sections */}
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
        {/* Section heures normales (verte) */}
        <div
          className="absolute left-0 top-0 h-full bg-green-500 z-10"
          style={{ width: `${normalPercentage}%` }}
          title={`Heures normales: ${normalHours.toFixed(2)}h (${normalPercentage.toFixed(1)}%)`}
        />

        {/* Section heures majorées 25% (jaune) */}
        <div
          className="absolute top-0 h-full bg-yellow-500 z-20"
          style={{
            left: `${normalPercentage}%`,
            width: `${overtime25Percentage}%`,
          }}
          title={`Heures majorées (+25%): ${overtimeHours25.toFixed(2)}h (${overtime25Percentage.toFixed(1)}%)`}
        />

        {/* Section heures majorées 50% (rouge) */}
        <div
          className="absolute top-0 h-full bg-red-500 z-30 rounded-r-full"
          style={{
            left: `${normalPercentage + overtime25Percentage}%`,
            width: `${overtime50Percentage}%`,
          }}
          title={`Heures majorées (+50%): ${overtimeHours50.toFixed(2)}h (${overtime50Percentage.toFixed(1)}%)`}
        />
      </div>

      {/* Légende */}
      <div className="flex items-center justify-start mt-2 text-xs text-muted-foreground gap-3">
        <div className="flex items-center">
          <div className="size-2 bg-green-500 rounded-full mr-1"></div>
          <span>Normales</span>
        </div>
        <div className="flex items-center">
          <div className="size-2 bg-yellow-500 rounded-full mr-1"></div>
          <span>+25%</span>
        </div>
        <div className="flex items-center">
          <div className="size-2 bg-red-500 rounded-full mr-1"></div>
          <span>+50%</span>
        </div>
      </div>
    </div>
  );
};