import React from 'react';
import useWeekStore from '../store/weekStore';
import { getPreviousWeekId, getNextWeekId } from '../utils/dateUtils';
import { Button } from './ui/button';
import { Input } from './ui/input';

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
    const currentWeekId = `${today.getFullYear()}-W${String(Math.ceil(
      (((today.getTime() - new Date(today.getFullYear(), 0, 1).getTime()) / 86400000) + 
      new Date(today.getFullYear(), 0, 1).getDay() + 1) / 7
    )).padStart(2, '0')}`;
    
    setCurrentWeekId(currentWeekId);
  };
  
  // Naviguer vers une semaine spécifique
  const goToSpecificWeek = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const weekInput = formData.get('weekInput') as string;
    
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
          ← Précédente
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
          Suivante →
        </Button>
      </div>
      
      {/* Formulaire pour aller à une semaine spécifique */}
      <form onSubmit={goToSpecificWeek} className="flex">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="text"
            name="weekInput"
            placeholder="AAAA-WXX"
            pattern="^\d{4}-W\d{2}$"
            title="Format: AAAA-WXX (ex: 2023-W01)"
            className="rounded-r-none"
          />
          <Button type="submit" className="rounded-l-none">
            Aller
          </Button>
        </div>
      </form>
    </div>
  );
};

export default WeekNavigation;