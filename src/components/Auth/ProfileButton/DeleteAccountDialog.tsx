import useAuthStore from "@/store/authStore";
import { AlertCircleIcon, InfoIcon } from "lucide-react";
import React, { useState } from "react";
import { Alert, AlertDescription } from "../../ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/alert-dialog";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import PasswordField from "./PasswordField";

interface DeleteAccountDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setParentIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteAccountDialog: React.FC<DeleteAccountDialogProps> = ({
  isOpen,
  setIsOpen,
  setParentIsOpen,
}) => {
  const { deleteAccount } = useAuthStore();
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    setDeleteError(null);

    try {
      if (!deletePassword) {
        setDeleteError(
          "Veuillez entrer votre mot de passe pour confirmer la suppression."
        );
        setIsLoading(false);
        return;
      }

      // Vérifier que l'utilisateur a saisi "Supprimer mes données" dans le champ de confirmation (insensible à la casse)
      if (
        deleteConfirmation.toLowerCase() !==
        "supprimer mes données".toLowerCase()
      ) {
        setDeleteError(
          "Veuillez saisir 'Supprimer mes données' pour confirmer."
        );
        setIsLoading(false);
        return;
      }

      const { error } = await deleteAccount(deletePassword);

      if (error) {
        setDeleteError(error);
        setIsLoading(false);
      } else {
        // La suppression a réussi, la déconnexion est gérée dans la fonction deleteAccount
        setIsOpen(false);
        setParentIsOpen(false);
      }
    } catch (err) {
      setDeleteError(
        "Une erreur est survenue lors de la suppression du compte."
      );
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Êtes-vous sûr de vouloir supprimer vos données ?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. Toutes vos données sur Supabase
            seront définitivement supprimées et vous serez déconnecté.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          <Alert variant="info" className="py-2">
            <InfoIcon />
            <AlertDescription>
              Vos données locales seront conservées. L'application passera en
              mode non synchronisé.
            </AlertDescription>
          </Alert>

          <PasswordField
            id="deletePassword"
            label="Entrez votre mot de passe pour confirmer"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            showPassword={showDeletePassword}
            setShowPassword={setShowDeletePassword}
          />

          <div className="space-y-2">
            <Label htmlFor="deleteConfirmation">
              Pour confirmer, saisissez :
              <span className="font-semibold">"Supprimer mes données"</span>
            </Label>
            <Input
              id="deleteConfirmation"
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="Supprimer mes données"
              required
            />
          </div>

          {deleteError && (
            <Alert variant="destructive" className="py-2">
              <AlertCircleIcon />
              <AlertDescription>{deleteError}</AlertDescription>
            </Alert>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDeleteAccount();
            }}
            disabled={isLoading}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isLoading ? "Suppression..." : "Supprimer mes données"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAccountDialog;
