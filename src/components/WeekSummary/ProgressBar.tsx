import React from "react";
import { Progress } from "../ui/progress";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  maxValue: number;
  className?: string;
  indicatorClassName?: string;
}

/**
 * Composant de barre de progression simple
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  maxValue,
  className,
  indicatorClassName,
}) => {
  // Calculer le pourcentage avec un maximum de 100%
  const percentage = Math.min((value / maxValue) * 100, 100);

  return (
    <Progress
      value={percentage}
      className={cn("h-2 bg-muted", className)}
      indicatorClassName={indicatorClassName}
    />
  );
};