import useAuthStore from "@/store/authStore";
import { SaveIcon } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../../ui/button";
import PasswordField from "./PasswordField";
import StatusAlerts from "./StatusAlerts";

const PasswordTab: React.FC = () => {
  const { updatePassword } = useAuthStore();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Vérifier que les mots de passe correspondent
      if (newPassword !== confirmPassword) {
        setError("Les mots de passe ne correspondent pas.");
        setIsLoading(false);
        return;
      }

      // TODO: Vérifier le mot de passe actuel avant de permettre la mise à jour
      // Pour l'instant, on met à jour directement
      const { error } = await updatePassword(newPassword);

      if (error) {
        setError(error);
      } else {
        setSuccess("Mot de passe mis à jour avec succès.");
        setNewPassword("");
        setConfirmPassword("");
        setCurrentPassword("");
      }
    } catch (err) {
      setError("Une erreur est survenue.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpdatePassword} className="space-y-4">
      <PasswordField
        id="currentPassword"
        label="Mot de passe actuel"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        showPassword={showCurrentPassword}
        setShowPassword={setShowCurrentPassword}
      />

      <PasswordField
        id="newPassword"
        label="Nouveau mot de passe"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        showPassword={showNewPassword}
        setShowPassword={setShowNewPassword}
      />

      <PasswordField
        id="confirmPassword"
        label="Confirmer le nouveau mot de passe"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        showPassword={showConfirmPassword}
        setShowPassword={setShowConfirmPassword}
      />

      <StatusAlerts error={error} success={success} />

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <SaveIcon className="size-4" />
          {isLoading ? "Chargement..." : "Mettre à jour le mot de passe"}
        </Button>
      </div>
    </form>
  );
};

export default PasswordTab;
