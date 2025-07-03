import { KeyIcon, LogInIcon, UserPlusIcon } from "lucide-react";
import React from "react";
import { Button } from "../../ui/button";

interface SubmitButtonProps {
  authAction: "login" | "signup" | "forgot";
  isLoading: boolean;
  isPasswordRecoveryMode: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ 
  authAction, 
  isLoading, 
  isPasswordRecoveryMode 
}) => {
  const getButtonText = () => {
    if (isLoading) return "Chargement...";
    
    if (authAction === "login") return "Se connecter";
    if (authAction === "signup") return "S'inscrire";
    
    return isPasswordRecoveryMode 
      ? "Mettre à jour le mot de passe" 
      : "Envoyer le lien de récupération";
  };

  const getButtonIcon = () => {
    if (authAction === "login") return <LogInIcon className="size-4 mr-2" />;
    if (authAction === "signup") return <UserPlusIcon className="size-4 mr-2" />;
    return <KeyIcon className="size-4 mr-2" />;
  };

  return (
    <div className="flex justify-end">
      <Button type="submit" disabled={isLoading}>
        {getButtonIcon()}
        {getButtonText()}
      </Button>
    </div>
  );
};

export default SubmitButton;