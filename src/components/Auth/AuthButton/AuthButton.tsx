import useAuthStore from "@/store/authStore";
import { CloudIcon, LogOutIcon } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../../ui/button";
import { Dialog, DialogContent } from "../../ui/dialog";
import AuthForm from "./AuthForm";

const AuthButton: React.FC = () => {
  const { user, isInitialized, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Si le store n'est pas encore initialisé, ne rien afficher
  if (!isInitialized) return null;

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
            className="flex items-center gap-2"
          >
            <LogOutIcon className="size-4" />
            Déconnexion
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2"
        >
          <CloudIcon className="size-4" />
          Se connecter pour synchroniser
        </Button>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <AuthForm setIsOpen={setIsOpen} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AuthButton;
