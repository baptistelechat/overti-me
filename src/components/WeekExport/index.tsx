import React from "react";
import useMediaQuery from "../../hooks/useMediaQuery";
import useWeekStore from "../../store/weekStore";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { ExportButton } from "./ExportButton";
import { ExportContent } from "./ExportContent";
import { useExportStore } from "../../store/exportStore";

/**
 * Composant principal d'exportation des données de la semaine
 */
const WeekExport: React.FC = () => {
  const { currentWeekId } = useWeekStore();
  const { selectedColumns } = useExportStore();

  // Utiliser le hook useMediaQuery pour détecter les écrans moyens et grands
  const isMediumScreen = useMediaQuery("(min-width: 768px)");

  // Rendu conditionnel en fonction de la taille de l'écran
  return isMediumScreen ? (
    // Dialog pour écrans moyens et grands
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-green-500 hover:bg-green-600">
          Exporter les données
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Exporter les données</DialogTitle>
          <DialogDescription>
            Configurez les options d'exportation pour la semaine {currentWeekId}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <ExportContent />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Fermer</Button>
          </DialogClose>
          <ExportButton />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ) : (
    // Drawer pour petits écrans
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="bg-green-500 hover:bg-green-600">
          Exporter les données
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Exporter les données</DrawerTitle>
          <DrawerDescription>
            Configurez les options d'exportation pour la semaine {currentWeekId}
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4">
          <ExportContent />
          <DrawerFooter className="flex flex-col gap-2">
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">
                Fermer
              </Button>
            </DrawerClose>
            <ExportButton />
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default WeekExport;