import useAuthStore from "@/store/authStore";
import React, { useEffect, useState } from "react";
import { DialogHeader, DialogTitle } from "../../ui/dialog";
import AuthTabs from "./AuthTabs";
import ConfirmPasswordField from "./ConfirmPasswordField";
import EmailField from "./EmailField";
import ForgotPasswordLink from "./ForgotPasswordLink";
import PasswordField from "./PasswordField";
import StatusAlerts from "./StatusAlerts";
import SubmitButton from "./SubmitButton";

interface AuthFormProps {
  setIsOpen: (isOpen: boolean) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ setIsOpen }) => {
  const {
    login,
    signup,
    resetPasswordForEmail,
    updatePassword,
    isPasswordRecoveryMode,
    checkPasswordRecoveryMode,
  } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authAction, setAuthAction] = useState<"login" | "signup" | "forgot">(
    "login"
  );
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Réinitialiser les champs lorsque l'action change
  useEffect(() => {
    setError(null);
    setSuccess(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, [authAction]);

  // Vérifier le mode de récupération de mot de passe
  useEffect(() => {
    const checkRecoveryMode = async () => {
      await checkPasswordRecoveryMode();
    };

    checkRecoveryMode();
  }, [checkPasswordRecoveryMode]);

  // Gérer le mode de récupération de mot de passe
  useEffect(() => {
    if (isPasswordRecoveryMode) {
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
            const tokenParts = accessToken.split(".");
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]));
              if (payload.email) {
                setEmail(payload.email);
              }
            }
          }
        } catch (error) {
          console.error(
            "Erreur lors de l'extraction de l'email du token:",
            error
          );
        }
      }
    }
  }, [isPasswordRecoveryMode]);

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
          setSuccess(
            "Mot de passe mis à jour avec succès. Vous pouvez maintenant vous connecter."
          );
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

  return (
    <>
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
        {/* Onglets de navigation */}
        {!isPasswordRecoveryMode && (
          <AuthTabs authAction={authAction} setAuthAction={setAuthAction} />
        )}

        {/* Champ email */}
        <EmailField
          email={email}
          setEmail={setEmail}
          disabled={isPasswordRecoveryMode}
        />

        {/* Champ mot de passe */}
        {(authAction !== "forgot" || isPasswordRecoveryMode) && (
          <PasswordField
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
        )}

        {/* Champ confirmation mot de passe */}
        {(authAction === "signup" ||
          (authAction === "forgot" && isPasswordRecoveryMode)) && (
          <ConfirmPasswordField
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
          />
        )}

        {/* Alertes d'état */}
        <StatusAlerts error={error} success={success} />

        {/* Lien "Mot de passe oublié" */}
        {authAction === "login" && !isPasswordRecoveryMode && (
          <ForgotPasswordLink setAuthAction={setAuthAction} />
        )}

        {/* Bouton de soumission */}
        <SubmitButton
          authAction={authAction}
          isLoading={isLoading}
          isPasswordRecoveryMode={isPasswordRecoveryMode}
        />
      </form>
    </>
  );
};

export default AuthForm;
