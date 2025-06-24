import useAuthStore from "@/store/authStore";
import {
  AlertCircleIcon,
  CheckCircleIcon,
  EyeIcon,
  EyeOffIcon,
  SaveIcon,
  UserIcon,
} from "lucide-react";
import React, { useState } from "react";
import { Alert, AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const ProfileButton: React.FC = () => {
  const { user, updatePassword, updateEmail } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<"email" | "password">("email");

  // Réinitialiser les champs lorsque la modal est fermée
  React.useEffect(() => {
    if (!isOpen) {
      setEmail(user?.email || "");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError(null);
      setSuccess(null);
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen, user]);

  // Initialiser l'email avec celui de l'utilisateur lorsque la modal s'ouvre
  React.useEffect(() => {
    if (isOpen && user) {
      setEmail(user.email || "");
    }
  }, [isOpen, user]);

  // Si l'utilisateur n'est pas connecté, ne rien afficher
  if (!user) return null;

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
            "IMPORTANT : Vous devez continuer à utiliser votre ancienne adresse email pour vous connecter jusqu'à ce que vous ayez confirmé le changement."
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
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <UserIcon className="size-4" />
        Profil
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Profil utilisateur</DialogTitle>
          </DialogHeader>

          <div className="flex gap-4 mb-4">
            <Button
              type="button"
              variant={activeTab === "email" ? "default" : "outline"}
              onClick={() => {
                setActiveTab("email");
                setError(null);
                setSuccess(null);
              }}
              className="flex-1"
            >
              Modifier l'email
            </Button>
            <Button
              type="button"
              variant={activeTab === "password" ? "default" : "outline"}
              onClick={() => {
                setActiveTab("password");
                setError(null);
                setSuccess(null);
              }}
              className="flex-1"
            >
              Modifier le mot de passe
            </Button>
          </div>

          {activeTab === "email" ? (
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

              <div className="space-y-2">
                <Label htmlFor="currentPasswordEmail">
                  Mot de passe actuel
                </Label>
                <div className="relative">
                  <Input
                    id="currentPasswordEmail"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    tabIndex={-1}
                  >
                    {showCurrentPassword ? (
                      <EyeIcon className="size-4" />
                    ) : (
                      <EyeOffIcon className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="py-2">
                  <AlertCircleIcon />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert variant="success" className="py-2">
                  <CheckCircleIcon />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

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
          ) : (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    tabIndex={-1}
                  >
                    {showCurrentPassword ? (
                      <EyeIcon className="size-4" />
                    ) : (
                      <EyeOffIcon className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    tabIndex={-1}
                  >
                    {showNewPassword ? (
                      <EyeIcon className="size-4" />
                    ) : (
                      <EyeOffIcon className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirmer le nouveau mot de passe
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeIcon className="size-4" />
                    ) : (
                      <EyeOffIcon className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="py-2">
                  <AlertCircleIcon />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert variant="success" className="py-2">
                  <CheckCircleIcon />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <SaveIcon className="size-4" />
                  {isLoading
                    ? "Chargement..."
                    : "Mettre à jour le mot de passe"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfileButton;
