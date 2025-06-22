import { Trash2Icon } from "lucide-react";
import React, { useEffect } from "react";
import useWeekStore from "../store/weekStore";
import ExportDrawer from "./ExportDrawer";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import WeekNavigation from "./WeekNavigation";
import WeekSummary from "./WeekSummary";
import WeekTable from "./WeekTable";

const WeekView: React.FC = () => {
  // Récupérer les données et actions du store
  const { currentWeekId, weeks, initializeWeek, updateDay, resetDay, resetWeek } =
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
          <WeekTable
            weekData={currentWeek}
            onUpdateDay={updateDay}
            onResetDay={resetDay}
            onResetWeek={resetWeek}
          />
        </CardContent>
      </Card>

      {/* Résumé des heures de la semaine */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <WeekSummary weekData={currentWeek} />
        </CardContent>
      </Card>

      {/* Options d'export */}
      <div className="flex justify-center mb-6">
        <ExportDrawer />
      </div>

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
