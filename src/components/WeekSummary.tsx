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
  const OVERTIME_50_MAX = OVERTIME_50_THRESHOLD - OVERTIME_25_THRESHOLD; // 5h (48h - 43h)

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

          {/* Barre récapitulative */}
          <div className="mt-6 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span
                className={cn(
                  "text-muted-foreground",
                  isOverLegalLimit &&
                    "text-destructive"
                )}
              >
                Répartition des heures
              </span>
              <span
                className={cn(
                  "font-medium",
                  isOverLegalLimit && 
                    "text-destructive"
                )}
              >
                {weekData.totalHours.toFixed(2)}h
              </span>
            </div>

            {/* Barre de progression personnalisée avec 3 sections */}
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
              {/* Calcul des pourcentages pour chaque type d'heures */}
              {(() => {
                // Calcul des pourcentages relatifs à la durée totale
                const totalHours = weekData.totalHours || 0.001; // Éviter division par zéro
                const normalPercentage =
                  (weekData.normalHours / totalHours) * 100;
                const overtime25Percentage =
                  (weekData.overtimeHours25 / totalHours) * 100;
                const overtime50Percentage =
                  (weekData.overtimeHours50 / totalHours) * 100;

                return (
                  <>
                    {/* Section heures normales (verte) */}
                    <div
                      className="absolute left-0 top-0 h-full bg-green-500 z-10"
                      style={{ width: `${normalPercentage}%` }}
                      title={`Heures normales: ${weekData.normalHours.toFixed(
                        2
                      )}h (${normalPercentage.toFixed(1)}%)`}
                    />

                    {/* Section heures majorées 25% (jaune) */}
                    <div
                      className="absolute top-0 h-full bg-yellow-500 z-20"
                      style={{
                        left: `${normalPercentage}%`,
                        width: `${overtime25Percentage}%`,
                      }}
                      title={`Heures majorées (+25%): ${weekData.overtimeHours25.toFixed(
                        2
                      )}h (${overtime25Percentage.toFixed(1)}%)`}
                    />

                    {/* Section heures majorées 50% (rouge) */}
                    <div
                      className="absolute top-0 h-full bg-red-500 z-30 rounded-r-full"
                      style={{
                        left: `${normalPercentage + overtime25Percentage}%`,
                        width: `${overtime50Percentage}%`,
                      }}
                      title={`Heures majorées (+50%): ${weekData.overtimeHours50.toFixed(
                        2
                      )}h (${overtime50Percentage.toFixed(1)}%)`}
                    />
                  </>
                );
              })()}
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
