import { KeyIcon, MailIcon, TrashIcon } from "lucide-react";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import DeleteTab from "./DeleteTab";
import EmailTab from "./EmailTab";
import PasswordTab from "./PasswordTab";

interface ProfileTabsProps {
  activeTab: "email" | "password" | "delete";
  setActiveTab: React.Dispatch<
    React.SetStateAction<"email" | "password" | "delete">
  >;
  setIsDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({
  activeTab,
  setActiveTab,
  setIsDeleteDialogOpen,
}) => {
  return (
    <Tabs
      defaultValue="email"
      value={activeTab}
      onValueChange={(value) => {
        setActiveTab(value as "email" | "password" | "delete");
      }}
      className="w-full"
    >
      <TabsList className="w-full grid grid-cols-3 mb-4">
        <TabsTrigger value="email" className="flex items-center gap-1">
          <MailIcon className="size-4" />
          <span className="hidden sm:inline">Modifier l'email</span>
          <span className="sm:hidden">Email</span>
        </TabsTrigger>
        <TabsTrigger value="password" className="flex items-center gap-1">
          <KeyIcon className="size-4" />
          <span className="hidden sm:inline">Modifier le mot de passe</span>
          <span className="sm:hidden">Mot de passe</span>
        </TabsTrigger>
        <TabsTrigger
          value="delete"
          className="flex items-center gap-1 text-destructive"
        >
          <TrashIcon className="size-4" />
          <span className="hidden sm:inline">Supprimer mes données</span>
          <span className="sm:hidden">Supprimer</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="email" className="mt-0">
        <EmailTab />
      </TabsContent>

      <TabsContent value="password" className="mt-0">
        <PasswordTab />
      </TabsContent>

      <TabsContent value="delete" className="mt-0">
        <DeleteTab setIsDeleteDialogOpen={setIsDeleteDialogOpen} />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
