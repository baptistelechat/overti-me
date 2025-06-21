import React from "react";
import { type WeekData, type WorkDay } from "../../types";
import {
  Table,
  TableBody,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { DayRow } from "./DayRow";
import { TableFooterRow } from "./TableFooterRow";

interface WeekTableProps {
  weekData: WeekData;
  onUpdateDay: (dayIndex: number, data: Partial<WorkDay>) => void;
  onResetDay: (dayIndex: number) => void;
  onResetWeek: () => void;
}

/**
 * Composant de tableau pour la saisie des données hebdomadaires
 */
const WeekTable: React.FC<WeekTableProps> = ({
  weekData,
  onUpdateDay,
  onResetDay,
  onResetWeek,
}) => {
  return (
    <div className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead className="w-[14%] text-center">Jour</TableHead>
            <TableHead className="w-[12%] text-center">Date</TableHead>
            <TableHead className="w-[13%] text-center">Début</TableHead>
            <TableHead className="w-[13%] text-center">
              Début pause
            </TableHead>
            <TableHead className="w-[13%] text-center">
              Fin pause
            </TableHead>
            <TableHead className="w-[13%] text-center">Fin</TableHead>
            <TableHead className="w-[13%] text-center">Durée</TableHead>
            <TableHead className="w-[9%] text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Lignes pour chaque jour de la semaine */}
          {weekData.days.map((day, index) => (
            <DayRow
              key={day.date}
              day={day}
              dayIndex={index}
              onUpdate={(data) => onUpdateDay(index, data)}
              onReset={onResetDay}
            />
          ))}
        </TableBody>
        <TableFooter>
          <TableFooterRow 
            totalHours={weekData.totalHours} 
            onReset={onResetWeek} 
          />
        </TableFooter>
      </Table>
    </div>
  );
};

export default WeekTable