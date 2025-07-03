import useAuthStore from "@/store/authStore";
import { UserIcon } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import DeleteAccountDialog from "./DeleteAccountDialog";
import ProfileTabs from "./ProfileTabs";

const ProfileButton: React.FC = () => {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"email" | "password" | "delete">(
    "email"
  );

  // Si l'utilisateur n'est pas connecté, ne rien afficher
  if (!user) return null;

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

          <ProfileTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setIsDeleteDialogOpen={setIsDeleteDialogOpen}
          />

          <DeleteAccountDialog
            isOpen={isDeleteDialogOpen}
            setIsOpen={setIsDeleteDialogOpen}
            setParentIsOpen={setIsOpen}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfileButton;
