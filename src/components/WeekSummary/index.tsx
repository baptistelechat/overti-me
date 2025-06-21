import React from "react";
import { type WeekData } from "../../types";
import {
  NORMAL_HOURS_THRESHOLD,
  OVERTIME_25_THRESHOLD,
  OVERTIME_50_THRESHOLD,
} from "@/constants/hoursThreshold";
import { ProgressBarWithLabel } from "./ProgressBarWithLabel";
import { DistributionBar } from "./DistributionBar";
import { TotalCard } from "./TotalCard";

interface WeekSummaryProps {
  weekData: WeekData;
}

/**
 * Composant principal de récapitulatif de la semaine
 */
const WeekSummary: React.FC<WeekSummaryProps> = ({ weekData }) => {
  // Calculer le total des heures avec majoration
  const totalWithOvertime = (
    weekData.normalHours +
    weekData.overtimeHours25 * 1.25 +
    weekData.overtimeHours50 * 1.5
  ).toFixed(2);

  // Vérifier si le total dépasse 48h (limite légale)
  const isOverLegalLimit = weekData.totalHours > OVERTIME_50_THRESHOLD;

  // Constantes pour les maximums des barres de progression
  const NORMAL_HOURS_MAX = NORMAL_HOURS_THRESHOLD; // 35h
  const OVERTIME_25_MAX = OVERTIME_25_THRESHOLD - NORMAL_HOURS_THRESHOLD; // 8h (43h - 35h)
  const OVERTIME_50_MAX = OVERTIME_50_THRESHOLD - OVERTIME_25_THRESHOLD; // 5h (48h - 43h)

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Récapitulatif de la semaine</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Colonne des heures */}
        <div>
          <ProgressBarWithLabel
            label="Heures normales"
            value={weekData.normalHours}
            maxValue={NORMAL_HOURS_MAX}
            indicatorClassName="bg-green-500"
          />

          <ProgressBarWithLabel
            label="Heures majorées (+25%)"
            value={weekData.overtimeHours25}
            maxValue={OVERTIME_25_MAX}
            indicatorClassName="bg-yellow-500"
          />

          <ProgressBarWithLabel
            label="Heures majorées (+50%)"
            value={weekData.overtimeHours50}
            maxValue={OVERTIME_50_MAX}
            indicatorClassName="bg-red-500"
            showAlert={true}
          />

          {/* Barre récapitulative */}
          <DistributionBar
            normalHours={weekData.normalHours}
            overtimeHours25={weekData.overtimeHours25}
            overtimeHours50={weekData.overtimeHours50}
            totalHours={weekData.totalHours}
            isOverLegalLimit={isOverLegalLimit}
          />
        </div>

        {/* Colonne des totaux */}
        <TotalCard
          normalHours={weekData.normalHours}
          overtimeHours25={weekData.overtimeHours25}
          overtimeHours50={weekData.overtimeHours50}
          totalHours={weekData.totalHours}
          totalWithOvertime={totalWithOvertime}
          isOverLegalLimit={isOverLegalLimit}
        />
      </div>
    </div>
  );
};

export default WeekSummary;