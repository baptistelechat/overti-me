import useAuthStore from "@/store/authStore";
import { SaveIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import PasswordField from "./PasswordField";
import StatusAlerts from "./StatusAlerts";

const EmailTab: React.FC = () => {
  const { user, updateEmail } = useAuthStore();
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  // Initialiser l'email avec celui de l'utilisateur
  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
    }
  }, [user]);

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Vérifier que le mot de passe actuel est fourni
      if (!currentPassword) {
        setError(
          "Veuillez entrer votre mot de passe actuel pour confirmer le changement d'email."
        );
        setIsLoading(false);
        return;
      }

      // Vérifier que l'email est différent de l'email actuel
      if (email === user?.email) {
        setError(
          "La nouvelle adresse email est identique à l'adresse actuelle."
        );
        setIsLoading(false);
        return;
      }

      // Mettre à jour l'email avec la fonction du store
      const { error } = await updateEmail(email, currentPassword);

      if (error) {
        setError(error);
      } else {
        setSuccess(
          "Un email de confirmation a été envoyé à votre nouvelle adresse email. " +
            "Veuillez cliquer sur le lien dans cet email pour confirmer le changement. " +
            "IMPORTANT : Vous devez continuer à utiliser votre ancienne adresse email pour vous connecter jusqu'à ce que vous ayez confirmé le changement. " +
            "Après avoir cliqué sur le lien de confirmation, veuillez vous déconnecter et vous reconnecter avec votre nouvelle adresse email."
        );
        // Réinitialiser le mot de passe actuel après succès
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
    <form onSubmit={handleUpdateEmail} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Nouvel email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.com"
          required
        />
      </div>

      <PasswordField
        id="currentPasswordEmail"
        label="Mot de passe actuel"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        showPassword={showCurrentPassword}
        setShowPassword={setShowCurrentPassword}
      />

      <StatusAlerts error={error} success={success} />

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <SaveIcon className="size-4" />
          {isLoading ? "Chargement..." : "Mettre à jour l'email"}
        </Button>
      </div>
    </form>
  );
};

export default EmailTab;
