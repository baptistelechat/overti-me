import {
  NORMAL_HOURS_THRESHOLD,
  OVERTIME_25_THRESHOLD,
  OVERTIME_50_THRESHOLD,
} from "@/constants/hoursThreshold";
import { cn } from "@/lib/utils";
import React from "react";
import { type WeekData } from "../types";
import { Card, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";

interface WeekSummaryProps {
  weekData: WeekData;
}

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
  const OVERTIME_50_MAX = OVERTIME_50_THRESHOLD - NORMAL_HOURS_THRESHOLD; // 5h maximum pour les heures majorées à 50%

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">
        Récapitulatif de la semaine
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Colonne des heures */}
        <div>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground">Heures normales</span>
              <span className="font-medium">
                {weekData.normalHours.toFixed(2)}h
              </span>
            </div>
            <Progress
              value={Math.min(
                (weekData.normalHours / NORMAL_HOURS_MAX) * 100,
                100
              )}
              className="h-2 bg-muted"
              indicatorClassName="bg-green-500"
            />
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground">
                Heures majorées (+25%)
              </span>
              <span className="font-medium">
                {weekData.overtimeHours25.toFixed(2)}h
              </span>
            </div>
            <Progress
              value={Math.min(
                (weekData.overtimeHours25 / OVERTIME_25_MAX) * 100,
                100
              )}
              className="h-2 bg-muted"
              indicatorClassName="bg-yellow-500"
            />
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span
                className={cn(
                  "text-muted-foreground",
                  weekData.overtimeHours50 > OVERTIME_50_MAX &&
                    "text-destructive"
                )}
              >
                Heures majorées (+50%)
              </span>
              <span
                className={cn(
                  "font-medium",
                  weekData.overtimeHours50 > OVERTIME_50_MAX &&
                    "text-destructive"
                )}
              >
                {weekData.overtimeHours50.toFixed(2)}h
              </span>
            </div>
            <Progress
              value={Math.min(
                (weekData.overtimeHours50 / OVERTIME_50_MAX) * 100,
                100
              )}
              className="h-2 bg-muted"
              indicatorClassName="bg-red-500"
            />
          </div>
        </div>

        {/* Colonne des totaux */}
        <Card>
          <CardContent className="pt-6">
            <div className="mb-4">
              <div className="text-muted-foreground mb-1">
                Total des heures travaillées
              </div>
              <div
                className={cn(
                  "text-3xl font-bold",
                  isOverLegalLimit && "text-destructive"
                )}
              >
                {weekData.totalHours.toFixed(2)}h
                {isOverLegalLimit && (
                  <span className="text-sm ml-2">
                    (+{(weekData.totalHours - 48).toFixed(2)}h)
                  </span>
                )}
              </div>
            </div>

            <div className="mb-4">
              <div className="text-muted-foreground mb-1">
                Total avec majoration
              </div>
              <div
                className={cn(
                  "text-3xl font-bold text-primary",
                  isOverLegalLimit && "text-destructive"
                )}
              >
                {totalWithOvertime}h
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>
                Calcul: {weekData.normalHours.toFixed(2)}h (normales) +{" "}
                {weekData.overtimeHours25.toFixed(2)}h (×1.25) +{" "}
                {weekData.overtimeHours50.toFixed(2)}h (×1.5)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WeekSummary;
