import {
  getNextWeekId,
  getPreviousWeekId,
  getWeekId,
} from "@/utils/date/weekId";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import useWeekStore from "../store/weekStore";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface WeekNavigationProps {
  weekId: string;
}

const WeekNavigation: React.FC<WeekNavigationProps> = ({ weekId }) => {
  const { setCurrentWeekId } = useWeekStore();

  // Calculer les identifiants des semaines précédente et suivante
  const previousWeekId = getPreviousWeekId(weekId);
  const nextWeekId = getNextWeekId(weekId);

  // Naviguer vers la semaine précédente
  const goToPreviousWeek = () => {
    setCurrentWeekId(previousWeekId);
  };

  // Naviguer vers la semaine suivante
  const goToNextWeek = () => {
    setCurrentWeekId(nextWeekId);
  };

  // Naviguer vers la semaine courante
  const goToCurrentWeek = () => {
    const today = new Date();
    // Utiliser la fonction getWeekId de dateUtils pour assurer la cohérence
    const currentWeekId = getWeekId(today);

    setCurrentWeekId(currentWeekId);
  };

  // Naviguer vers une semaine spécifique
  const goToSpecificWeek = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const weekInput = formData.get("weekInput") as string;

    if (weekInput && /^\d{4}-W\d{2}$/.test(weekInput)) {
      setCurrentWeekId(weekInput);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
      {/* Boutons de navigation */}
      <div className="flex space-x-2">
        <Button
          onClick={goToPreviousWeek}
          variant="outline"
          aria-label="Semaine précédente"
        >
          <ChevronLeft />
          Précédente
        </Button>

        <Button
          onClick={goToCurrentWeek}
          variant="default"
          aria-label="Semaine actuelle"
        >
          Aujourd'hui
        </Button>

        <Button
          onClick={goToNextWeek}
          variant="outline"
          aria-label="Semaine suivante"
        >
          Suivante <ChevronRight />
        </Button>
      </div>

      {/* Formulaire pour aller à une semaine spécifique */}
      <form onSubmit={goToSpecificWeek} className="flex">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                type="text"
                name="weekInput"
                placeholder="AAAA-WXX"
                pattern="^\d{4}-W\d{2}$"
                className="rounded-r-none"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Format: AAAA-WXX (ex: 2025-W01)</p>
            </TooltipContent>
          </Tooltip>
          <Button type="submit" className="rounded-l-none">
            Aller
          </Button>
        </div>
      </form>
    </div>
  );
};

export default WeekNavigation;
