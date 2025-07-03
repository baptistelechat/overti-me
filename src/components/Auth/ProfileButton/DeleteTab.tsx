import { AlertCircleIcon, InfoIcon, TrashIcon } from "lucide-react";
import React from "react";
import { Alert, AlertDescription } from "../../ui/alert";
import { Button } from "../../ui/button";

interface DeleteTabProps {
  setIsDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteTab: React.FC<DeleteTabProps> = ({ setIsDeleteDialogOpen }) => {
  return (
    <div className="space-y-4">
      <Alert variant="destructive" className="py-2">
        <AlertCircleIcon />
        <AlertDescription>
          Attention : La suppression de vos données est irréversible. Toutes vos
          données sur Supabase seront définitivement supprimées.
        </AlertDescription>
      </Alert>

      <Alert variant="info" className="py-2">
        <InfoIcon />
        <AlertDescription>
          Vos données locales seront conservées. L'application passera en mode
          non synchronisé et vous pourrez continuer à l'utiliser sans compte.
        </AlertDescription>
      </Alert>

      <div className="flex justify-end">
        <Button
          type="button"
          variant="destructive"
          onClick={() => setIsDeleteDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <TrashIcon className="size-4" />
          Supprimer mes données
        </Button>
      </div>
    </div>
  );
};

export default DeleteTab;
