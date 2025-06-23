import useAuthStore from "@/store/authStore";
import {
  CloudIcon,
  LogInIcon,
  LogOutIcon,
  RefreshCwIcon,
  UserPlusIcon,
} from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const AuthButton: React.FC = () => {
  const {
    user,
    isInitialized,
    syncStatus,
    lastSyncedAt,
    login,
    logout,
    syncWeeks,
    signup,
  } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authAction, setAuthAction] = useState<"login" | "signup">("login");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Si le store n'est pas encore initialisé, ne rien afficher
  if (!isInitialized) return null;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Si c'est une inscription
      if (authAction === "signup") {
        // Vérifier que les mots de passe correspondent
        if (password !== confirmPassword) {
          setError("Les mots de passe ne correspondent pas.");
          setIsLoading(false);
          return;
        }

        const { error } = await signup(email, password);

        if (error) {
          setError(error);
        } else {
          // Connexion automatique après inscription réussie
          const loginResult = await login(email, password);
          if (loginResult.error) {
            setSuccess(
              "Compte créé avec succès. Vous pouvez maintenant vous connecter."
            );
            setAuthAction("login");
          } else {
            setIsOpen(false);
          }
        }
      }
      // Si c'est une connexion
      else {
        const { error } = await login(email, password);

        if (error) {
          setError(error);
        } else {
          setIsOpen(false);
        }
      }
    } catch (err) {
      setError("Une erreur est survenue.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async () => {
    setIsLoading(true);
    try {
      await syncWeeks();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatLastSyncedAt = () => {
    if (!lastSyncedAt) return "Jamais";

    const date = new Date(lastSyncedAt);
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getSyncStatusText = () => {
    switch (syncStatus) {
      case "synced":
        return "Synchronisé";
      case "not_synced":
        return "Non synchronisé";
      case "syncing":
        return "Synchronisation en cours...";
      case "error":
        return "Erreur de synchronisation";
      default:
        return "État inconnu";
    }
  };

  const getSyncStatusColor = () => {
    switch (syncStatus) {
      case "synced":
        return "text-green-500";
      case "not_synced":
        return "text-yellow-500";
      case "syncing":
        return "text-blue-500";
      case "error":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <>
      {user ? (
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">Connecté en tant que {user.email}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              disabled={isLoading}
            >
              <LogOutIcon className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-sm ${getSyncStatusColor()}`}>
              {getSyncStatusText()}
            </span>
            <span className="text-xs text-muted-foreground">
              Dernière synchronisation : {formatLastSyncedAt()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSync}
              disabled={isLoading || syncStatus === "syncing"}
            >
              <RefreshCwIcon className="h-4 w-4 mr-2" />
              Synchroniser
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2"
        >
          <CloudIcon className="h-4 w-4" />
          Se connecter pour synchroniser
        </Button>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {authAction === "login" ? "Connexion" : "Inscription"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAuth} className="space-y-4">
            {/* Onglets simplifiés */}
            <div className="flex gap-4 mb-4">
              <Button
                type="button"
                variant={authAction === "login" ? "default" : "outline"}
                onClick={() => {
                  setAuthAction("login");
                  setError(null);
                }}
                className="flex-1"
              >
                <LogInIcon className="h-4 w-4 mr-2" />
                Connexion
              </Button>
              <Button
                type="button"
                variant={authAction === "signup" ? "default" : "outline"}
                onClick={() => {
                  setAuthAction("signup");
                  setError(null);
                }}
                className="flex-1"
              >
                <UserPlusIcon className="h-4 w-4 mr-2" />
                Inscription
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
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
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {authAction === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            )}

            {error && <p className="text-sm text-red-500">{error}</p>}
            {success && <p className="text-sm text-green-500">{success}</p>}

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Chargement..."
                  : authAction === "login"
                  ? "Se connecter"
                  : "S'inscrire"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AuthButton;
