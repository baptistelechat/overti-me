import { OVERTIME_50_THRESHOLD } from "@/constants/hoursThreshold";
import { cn } from "@/lib/utils";
import { Trash2Icon } from "lucide-react";
import React, { useEffect } from "react";
import useWeekStore from "../store/weekStore";
import DayRow from "./DayRow";
import ExportOptions from "./ExportOptions";
import WeekNavigation from "./WeekNavigation";
import WeekSummary from "./WeekSummary";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

const WeekView: React.FC = () => {
  // Récupérer les données et actions du store
  const { currentWeekId, weeks, initializeWeek, updateDay, resetWeek } =
    useWeekStore();

  // Initialiser la semaine au chargement du composant
  useEffect(() => {
    initializeWeek();
  }, [initializeWeek]);

  // Récupérer les données de la semaine courante
  const currentWeek = weeks[currentWeekId];

  // Si les données de la semaine ne sont pas encore chargées
  if (!currentWeek) {
    return (
      <div className="flex justify-center items-center h-screen">
        Chargement...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-6">⌚ Overti.me</h1>

      {/* Navigation entre les semaines */}
      <WeekNavigation weekId={currentWeekId} />

      {/* Carte principale avec les données de la semaine */}
      <Card className="mb-6">
        <CardHeader className="bg-muted/50">
          <CardTitle className="text-xl text-center">
            Semaine {currentWeekId}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Tableau des jours */}
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
                {currentWeek.days.map((day, index) => (
                  <DayRow
                    key={day.date}
                    day={day}
                    dayIndex={index}
                    onUpdate={(data) => updateDay(index, data)}
                  />
                ))}
              </TableBody>
              <TableFooter>
                <TableRow
                  className={cn(
                    currentWeek.totalHours > OVERTIME_50_THRESHOLD &&
                      "text-destructive"
                  )}
                >
                  <TableCell colSpan={6} className="font-semibold text-right">
                    <span>Total des heures travaillées</span>
                  </TableCell>
                  <TableCell className={cn("font-bold text-center")}>
                    {currentWeek.totalHours.toFixed(2)}h
                    {currentWeek.totalHours > OVERTIME_50_THRESHOLD && (
                      <span className="text-sm ml-1">
                        (+
                        {(
                          currentWeek.totalHours - OVERTIME_50_THRESHOLD
                        ).toFixed(2)}
                        h)
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {currentWeek.totalHours > 0 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-5 hover:bg-destructive/10 transition-colors"
                        onClick={resetWeek}
                        title="Réinitialiser la semaine"
                        aria-label="Réinitialiser la semaine"
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Résumé des heures de la semaine */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <WeekSummary weekData={currentWeek} />
        </CardContent>
      </Card>

      {/* Options d'export */}
      <ExportOptions />

      {/* Bouton de réinitialisation - visible uniquement si des heures sont enregistrées */}
      {currentWeek.totalHours > 0 && (
        <div className="mt-6 text-center">
          <Button 
            onClick={resetWeek} 
            variant="outline" 
            className="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2Icon className="h-4 w-4 mr-2" />
            Réinitialiser toutes les données de la semaine
          </Button>
        </div>
      )}
    </div>
  );
};

export default WeekView;
