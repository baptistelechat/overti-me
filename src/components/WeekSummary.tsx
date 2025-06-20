import React from "react";
import { type WeekData } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
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
              value={(weekData.normalHours / weekData.totalHours) * 100} 
              className="h-2 bg-muted" 
              indicatorClassName="bg-green-500"
            />
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground">Heures majorées (+25%)</span>
              <span className="font-medium">
                {weekData.overtimeHours25.toFixed(2)}h
              </span>
            </div>
            <Progress 
              value={(weekData.overtimeHours25 / weekData.totalHours) * 100} 
              className="h-2 bg-muted" 
              indicatorClassName="bg-yellow-500"
            />
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground">Heures majorées (+50%)</span>
              <span className="font-medium">
                {weekData.overtimeHours50.toFixed(2)}h
              </span>
            </div>
            <Progress 
              value={(weekData.overtimeHours50 / weekData.totalHours) * 100} 
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
              <div className="text-3xl font-bold">
                {weekData.totalHours.toFixed(2)}h
              </div>
            </div>

            <div className="mb-4">
              <div className="text-muted-foreground mb-1">Total avec majoration</div>
              <div className="text-3xl font-bold text-primary">
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
