import useAuthStore from "@/store/authStore";
import {
  CloudIcon,
  EyeIcon,
  EyeOffIcon,
  LogInIcon,
  LogOutIcon,
  UserPlusIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const AuthButton: React.FC = () => {
  const { user, isInitialized, login, logout, signup } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authAction, setAuthAction] = useState<"login" | "signup">("login");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Réinitialiser les champs lorsque la modal est fermée
  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setError(null);
      setSuccess(null);
      setShowPassword(false);
      setShowConfirmPassword(false);
      setAuthAction("login");
    }
  }, [isOpen]);

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

  return (
    <>
      {user ? (
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
      ) : (
        <Button
          variant="outline"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2"
        >
          <CloudIcon className="h-4 w-4 mr-2" />
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
                  setShowPassword(false);
                  setShowConfirmPassword(false);
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
                  setShowPassword(false);
                  setShowConfirmPassword(false);
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
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeIcon className="h-4 w-4" />
                  ) : (
                    <EyeOffIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {authAction === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirmer le mot de passe
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
                      <EyeIcon className="h-4 w-4" />
                    ) : (
                      <EyeOffIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {error && <p className="text-sm text-red-500">{error}</p>}
            {success && <p className="text-sm text-green-500">{success}</p>}

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {authAction === "login" ? <LogInIcon /> : <UserPlusIcon />}
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
