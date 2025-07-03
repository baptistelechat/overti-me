import React from "react";
import { cn } from "@/lib/utils";
import { Trash2Icon } from "lucide-react";
import { OVERTIME_50_THRESHOLD } from "@/constants/hoursThreshold";
import { Button } from "../ui/button";
import { TableCell, TableRow } from "../ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../ui/tooltip";

interface TableFooterRowProps {
  totalHours: number;
  onReset: () => void;
}

/**
 * Composant pour le pied de tableau affichant le total des heures travaillées
 */
export const TableFooterRow: React.FC<TableFooterRowProps> = ({
  totalHours,
  onReset,
}) => {
  const isOverLegalLimit = totalHours > OVERTIME_50_THRESHOLD;

  return (
    <TableRow
      className={cn(
        isOverLegalLimit && "text-destructive"
      )}
    >
      <TableCell colSpan={6} className="font-semibold text-right">
        <span>Total des heures travaillées</span>
      </TableCell>
      <TableCell className={cn("font-bold text-center")}>
        {totalHours.toFixed(2)}h
        {isOverLegalLimit && (
          <span className="text-sm ml-1">
            (+
            {(totalHours - OVERTIME_50_THRESHOLD).toFixed(2)}
            h)
          </span>
        )}
      </TableCell>
      <TableCell className="text-center">
        {totalHours > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-5 hover:bg-destructive/10 transition-colors"
                onClick={onReset}
                aria-label="Réinitialiser la semaine"
              >
                <Trash2Icon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Réinitialiser la semaine</p>
            </TooltipContent>
          </Tooltip>
        )}
      </TableCell>
    </TableRow>
  );
};