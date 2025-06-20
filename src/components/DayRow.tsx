import React, { useState } from "react";
import type { WorkDay } from "../types";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { ArrowLeftRight } from "lucide-react";

interface DayRowProps {
  day: WorkDay;
  dayIndex: number;
  onUpdate: (data: Partial<WorkDay>) => void;
}

const DayRow: React.FC<DayRowProps> = ({ day, dayIndex, onUpdate }) => {
  // État local pour le mode d'édition (durée ou heures début/fin)
  const [editMode, setEditMode] = useState<"time" | "duration">("time");

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

  // Gérer le changement de durée directe
  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const duration = parseFloat(e.target.value) || 0;
    onUpdate({ duration });
  };

  // Déterminer la classe CSS en fonction du jour (weekend en gris)
  const isWeekend = dayIndex === 5 || dayIndex === 6; // Samedi ou Dimanche
  const rowClass = `grid grid-cols-12 p-3 border-b border-gray-200 items-center ${
    isWeekend ? "bg-gray-50" : ""
  }`;

  return (
    <div className={rowClass}>
      {/* Nom du jour */}
      <div className="col-span-3 capitalize">{dayName}</div>

      {/* Date formatée */}
      <div className="col-span-3">{formattedDate}</div>

      {editMode === "time" ? (
        // Mode édition par heures de début/fin
        <>
          {/* Heure de début */}
          <div className="col-span-2">
            <div className="space-y-1">
              <Label htmlFor="start-time" className="sr-only">Heure de début</Label>
              <Input
                id="start-time"
                type="time"
                value={day.startTime || ""}
                onChange={handleStartTimeChange}
                className="w-full"
              />
            </div>
          </div>

          {/* Heure de fin */}
          <div className="col-span-2">
            <div className="space-y-1">
              <Label htmlFor="end-time" className="sr-only">Heure de fin</Label>
              <Input
                id="end-time"
                type="time"
                value={day.endTime || ""}
                onChange={handleEndTimeChange}
                className="w-full"
              />
            </div>
          </div>

          {/* Durée calculée (en lecture seule) */}
          <div className="col-span-2 flex items-center gap-2">
            <span className="font-medium">{day.calculatedDuration.toFixed(2)}h</span>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setEditMode("duration")} 
              title="Passer en mode durée"
              className="h-7 w-7"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </Button>
          </div>
        </>
      ) : (
        // Mode édition par durée directe
        <>
          {/* Espaces vides pour l'alignement */}
          <div className="col-span-2"></div>
          <div className="col-span-2"></div>

          {/* Saisie directe de la durée */}
          <div className="col-span-2 flex items-center gap-2">
            <div className="flex items-center">
              <Label htmlFor="duration" className="sr-only">Durée</Label>
              <Input
                id="duration"
                type="number"
                value={day.calculatedDuration || ""}
                onChange={handleDurationChange}
                step="0.25"
                min="0"
                max="24"
                className="w-16 mr-1"
              />
              <span className="mr-2">h</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setEditMode("time")} 
              title="Passer en mode horaires"
              className="h-7 w-7"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default DayRow;
