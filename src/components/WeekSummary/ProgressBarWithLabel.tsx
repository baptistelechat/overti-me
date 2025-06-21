import React from "react";
import { cn } from "@/lib/utils";
import { ProgressBar } from "./ProgressBar";

interface ProgressBarWithLabelProps {
  label: string;
  value: number;
  maxValue: number;
  unit?: string;
  className?: string;
  indicatorClassName?: string;
  labelClassName?: string;
  valueClassName?: string;
  showAlert?: boolean;
}

/**
 * Composant de barre de progression avec étiquette et valeur
 */
export const ProgressBarWithLabel: React.FC<ProgressBarWithLabelProps> = ({
  label,
  value,
  maxValue,
  unit = "h",
  className,
  indicatorClassName,
  labelClassName,
  valueClassName,
  showAlert = false,
}) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span
          className={cn(
            "text-muted-foreground",
            showAlert && value > maxValue && "text-destructive",
            labelClassName
          )}
        >
          {label}
        </span>
        <span
          className={cn(
            "font-medium",
            showAlert && value > maxValue && "text-destructive",
            valueClassName
          )}
        >
          {value.toFixed(2)}{unit}
        </span>
      </div>
      <ProgressBar
        value={value}
        maxValue={maxValue}
        className={className}
        indicatorClassName={indicatorClassName}
      />
    </div>
  );
};