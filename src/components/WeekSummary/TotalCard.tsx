import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "../ui/card";

interface TotalCardProps {
  normalHours: number;
  overtimeHours25: number;
  overtimeHours50: number;
  totalHours: number;
  totalWithOvertime: string;
  isOverLegalLimit: boolean;
}

/**
 * Composant carte des totaux
 */
export const TotalCard: React.FC<TotalCardProps> = ({
  normalHours,
  overtimeHours25,
  overtimeHours50,
  totalHours,
  totalWithOvertime,
  isOverLegalLimit,
}) => {
  return (
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
            {totalHours.toFixed(2)}h
            {isOverLegalLimit && (
              <span className="text-sm ml-2">
                (+{(totalHours - 48).toFixed(2)}h)
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
            Calcul: {normalHours.toFixed(2)}h (normales) +{" "}
            {overtimeHours25.toFixed(2)}h (×1.25) +{" "}
            {overtimeHours50.toFixed(2)}h (×1.5)
          </p>
        </div>
      </CardContent>
    </Card>
  );
};