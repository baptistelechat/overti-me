import React from "react";
import type { WorkDay } from "../../types";
import { DAILY_HOURS_THRESHOLD } from "@/constants/hoursThreshold";
import { cn } from "@/lib/utils";
import { Trash2Icon } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { TableCell, TableRow } from "../ui/table";

interface DayRowProps {
  day: WorkDay;
  dayIndex: number;
  onUpdate: (data: Partial<WorkDay>) => void;
  onReset: (dayIndex: number) => void;
}

/**
 * Composant représentant une ligne du tableau pour un jour de la semaine
 */
export const DayRow: React.FC<DayRowProps> = ({ 
  day, 
  dayIndex, 
  onUpdate, 
  onReset 
}) => {
  // Formater la date pour l'affichage
  const date = new Date(day.date);
  const dayName = date.toLocaleDateString("fr-FR", { weekday: "long" });
  const formattedDate = date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
  });
  
  // Gérer la réinitialisation du jour
  const handleResetDay = () => {
    onReset(dayIndex);
  };

  // Gérer le changement d'heure de début
  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ startTime: e.target.value });
  };

  // Gérer le changement d'heure de fin
  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ endTime: e.target.value });
  };

  // Gérer le changement d'heure de début de pause
  const handleLunchBreakStartChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onUpdate({ lunchBreakStart: e.target.value });
  };

  // Gérer le changement d'heure de fin de pause
  const handleLunchBreakEndChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onUpdate({ lunchBreakEnd: e.target.value });
  };

  // Déterminer la classe CSS en fonction du jour (weekend en gris)
  const isWeekend = dayIndex === 5 || dayIndex === 6; // Samedi ou Dimanche

  return (
    <TableRow className={isWeekend ? "bg-gray-50" : ""}>
      {/* Nom du jour */}
      <TableCell className="capitalize">{dayName}</TableCell>

      {/* Date formatée */}
      <TableCell>{formattedDate}</TableCell>

      {/* Heure de début */}
      <TableCell>
        <div className="space-y-1">
          <Label htmlFor={`start-time-${dayIndex}`} className="sr-only">
            Heure de début
          </Label>
          <Input
            id={`start-time-${dayIndex}`}
            type="time"
            value={day.startTime || ""}
            onChange={handleStartTimeChange}
            className="w-full"
            placeholder="Début"
          />
        </div>
      </TableCell>

      {/* Début pause méridienne */}
      <TableCell>
        <div className="space-y-1">
          <Label htmlFor={`lunch-break-start-${dayIndex}`} className="sr-only">
            Début pause
          </Label>
          <Input
            id={`lunch-break-start-${dayIndex}`}
            type="time"
            value={day.lunchBreakStart || ""}
            onChange={handleLunchBreakStartChange}
            className="w-full"
            placeholder="Début pause"
          />
        </div>
      </TableCell>

      {/* Fin pause méridienne */}
      <TableCell>
        <div className="space-y-1">
          <Label htmlFor={`lunch-break-end-${dayIndex}`} className="sr-only">
            Fin pause
          </Label>
          <Input
            id={`lunch-break-end-${dayIndex}`}
            type="time"
            value={day.lunchBreakEnd || ""}
            onChange={handleLunchBreakEndChange}
            className="w-full"
            placeholder="Fin pause"
          />
        </div>
      </TableCell>

      {/* Heure de fin */}
      <TableCell>
        <div className="space-y-1">
          <Label htmlFor={`end-time-${dayIndex}`} className="sr-only">
            Heure de fin
          </Label>
          <Input
            id={`end-time-${dayIndex}`}
            type="time"
            value={day.endTime || ""}
            onChange={handleEndTimeChange}
            className="w-full"
            placeholder="Fin"
          />
        </div>
      </TableCell>

      {/* Durée calculée (en lecture seule) */}
      <TableCell className="text-center">
        <span className={cn(
          "font-medium",
          day.calculatedDuration > DAILY_HOURS_THRESHOLD && "text-destructive"
        )}>
          {day.calculatedDuration.toFixed(2)}h
        </span>
      </TableCell>
      
      {/* Actions */}
      <TableCell className="text-center">
        {(day.startTime || day.endTime || day.lunchBreakStart || day.lunchBreakEnd) && (
          <Button
            variant="ghost"
            size="icon"
            className="size-5 hover:bg-destructive/10 transition-colors"
            onClick={handleResetDay}
            title="Réinitialiser ce jour"
            aria-label="Réinitialiser ce jour"
          >
            <Trash2Icon className="h-3 w-3" />
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};