import React, { useEffect } from "react";
import useWeekStore from "../store/weekStore";
import DayRow from "./DayRow";
import ExportOptions from "./ExportOptions";
import WeekNavigation from "./WeekNavigation";
import WeekSummary from "./WeekSummary";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "./ui/table";

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
                  <TableHead className="w-[15%] text-center">Jour</TableHead>
                  <TableHead className="w-[15%] text-center">Date</TableHead>
                  <TableHead className="w-[14%] text-center">Début</TableHead>
                  <TableHead className="w-[14%] text-center">Début pause</TableHead>
                  <TableHead className="w-[14%] text-center">Fin pause</TableHead>
                  <TableHead className="w-[14%] text-center">Fin</TableHead>
                  <TableHead className="w-[14%] text-center">Durée</TableHead>
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

      {/* Bouton de réinitialisation */}
      <div className="mt-6 text-center">
        <Button onClick={resetWeek} variant="destructive">
          Réinitialiser la semaine
        </Button>
      </div>
    </div>
  );
};

export default WeekView;
