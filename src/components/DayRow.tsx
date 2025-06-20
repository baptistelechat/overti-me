import React from "react";
import type { WorkDay } from "../types";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { TableCell, TableRow } from "./ui/table";

interface DayRowProps {
  day: WorkDay;
  dayIndex: number;
  onUpdate: (data: Partial<WorkDay>) => void;
}

const DayRow: React.FC<DayRowProps> = ({ day, dayIndex, onUpdate }) => {

  // Formater la date pour l'affichage
  const date = new Date(day.date);
  const dayName = date.toLocaleDateString("fr-FR", { weekday: "long" });
  const formattedDate = date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
  });

  // Gérer le changement d'heure de début
  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ startTime: e.target.value });
  };

  // Gérer le changement d'heure de fin
  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ endTime: e.target.value });
  };

  // Gérer le changement d'heure de début de pause
  const handleLunchBreakStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ lunchBreakStart: e.target.value });
  };

  // Gérer le changement d'heure de fin de pause
  const handleLunchBreakEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          <Label htmlFor="start-time" className="sr-only">
            Heure de début
          </Label>
          <Input
            id="start-time"
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
          <Label htmlFor="lunch-break-start" className="sr-only">
            Début pause
          </Label>
          <Input
            id="lunch-break-start"
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
          <Label htmlFor="lunch-break-end" className="sr-only">
            Fin pause
          </Label>
          <Input
            id="lunch-break-end"
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
          <Label htmlFor="end-time" className="sr-only">
            Heure de fin
          </Label>
          <Input
            id="end-time"
            type="time"
            value={day.endTime || ""}
            onChange={handleEndTimeChange}
            className="w-full"
            placeholder="Fin"
          />
        </div>
      </TableCell>

      {/* Durée calculée (en lecture seule) */}
      <TableCell>
          <span className="font-medium">
            {day.calculatedDuration.toFixed(2)}h
          </span>
      </TableCell>
    </TableRow>
  );
};

export default DayRow;
