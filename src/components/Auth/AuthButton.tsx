import useAuthStore from "@/store/authStore";
import {
  AlertCircleIcon,
  CheckCircleIcon,
  CloudIcon,
  EyeIcon,
  EyeOffIcon,
  KeyIcon,
  LogInIcon,
  LogOutIcon,
  UserPlusIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Alert, AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const AuthButton: React.FC = () => {
  const { 
    user, 
    isInitialized, 
    login, 
    logout, 
    signup, 
    resetPasswordForEmail, 
    updatePassword, 
    isPasswordRecoveryMode, 
    checkPasswordRecoveryMode 
  } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authAction, setAuthAction] = useState<"login" | "signup" | "forgot">("login");
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

  // Vérifier le mode de récupération de mot de passe
  useEffect(() => {
    const checkRecoveryMode = async () => {
      await checkPasswordRecoveryMode();
    };
    
    checkRecoveryMode();
  }, [checkPasswordRecoveryMode]);

  // Ouvrir la modal si on est en mode récupération de mot de passe
  useEffect(() => {
    if (isPasswordRecoveryMode && !isOpen) {
      setIsOpen(true);
      setAuthAction("forgot");
      setSuccess("Veuillez définir votre nouveau mot de passe.");
      
      // Récupérer l'email de l'utilisateur depuis l'URL si disponible
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.substring(1));
      const email = params.get("email");
      
      // Si l'email n'est pas directement disponible, essayer de l'extraire du token
      if (email) {
        setEmail(email);
      } else {
        // Essayer d'extraire l'email du token JWT (si présent dans l'URL)
        try {
          const accessToken = params.get("access_token");
          if (accessToken) {
            const tokenParts = accessToken.split('.');
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]));
              if (payload.email) {
                setEmail(payload.email);
              }
            }
          }
        } catch (error) {
          console.error("Erreur lors de l'extraction de l'email du token:", error);
        }
      }
    }
  }, [isPasswordRecoveryMode, isOpen]);

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
      // Si c'est une demande de récupération de mot de passe
      else if (authAction === "forgot" && !isPasswordRecoveryMode) {
        const { error } = await resetPasswordForEmail(email);

        if (error) {
          setError(error);
        } else {
          setSuccess(
            "Un email de récupération a été envoyé. Veuillez vérifier votre boîte de réception."
          );
        }
      }
      // Si c'est une mise à jour du mot de passe (après avoir cliqué sur le lien de récupération)
      else if (authAction === "forgot" && isPasswordRecoveryMode) {
        // Vérifier que les mots de passe correspondent
        if (password !== confirmPassword) {
          setError("Les mots de passe ne correspondent pas.");
          setIsLoading(false);
          return;
        }

        const { error } = await updatePassword(password);

        if (error) {
          setError(error);
        } else {
          setSuccess("Mot de passe mis à jour avec succès. Vous pouvez maintenant vous connecter.");
          setAuthAction("login");
        }
      }
      // Si c'est une connexion
      else if (authAction === "login") {
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
              {authAction === "login" 
                ? "Connexion" 
                : authAction === "signup" 
                ? "Inscription" 
                : isPasswordRecoveryMode 
                ? "Réinitialisation du mot de passe" 
                : "Mot de passe oublié"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAuth} className="space-y-4">
            {/* Onglets simplifiés (masqués en mode récupération de mot de passe) */}
            {!isPasswordRecoveryMode && (
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
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                disabled={isPasswordRecoveryMode}
              />
            </div>

            {/* Champ mot de passe (masqué en mode 'mot de passe oublié' sans récupération) */}
            {(authAction !== "forgot" || isPasswordRecoveryMode) && (
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
            )}

            {(authAction === "signup" || authAction === "forgot" && isPasswordRecoveryMode) && (
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

            {/* Lien "Mot de passe oublié" (visible uniquement en mode connexion) */}
            {authAction === "login" && !isPasswordRecoveryMode && (
              <div className="text-sm text-right">
                <button
                  type="button"
                  className="text-primary hover:underline focus:outline-none"
                  onClick={() => {
                    setAuthAction("forgot");
                    setError(null);
                    setSuccess(null);
                  }}
                >
                  Mot de passe oublié ?
                </button>
              </div>
            )}

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {authAction === "login" ? (
                  <LogInIcon />
                ) : authAction === "signup" ? (
                  <UserPlusIcon />
                ) : (
                  <KeyIcon />
                )}
                {isLoading
                  ? "Chargement..."
                  : authAction === "login"
                  ? "Se connecter"
                  : authAction === "signup"
                  ? "S'inscrire"
                  : isPasswordRecoveryMode
                  ? "Mettre à jour le mot de passe"
                  : "Envoyer le lien de récupération"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AuthButton;
