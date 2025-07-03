import { LogInIcon, UserPlusIcon } from "lucide-react";
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs";

interface AuthTabsProps {
  authAction: "login" | "signup" | "forgot";
  setAuthAction: (action: "login" | "signup" | "forgot") => void;
}

const AuthTabs: React.FC<AuthTabsProps> = ({ authAction, setAuthAction }) => {
  return (
    <Tabs 
      value={authAction === "forgot" ? "login" : authAction} 
      onValueChange={(value) => setAuthAction(value as "login" | "signup" | "forgot")}
      className="mb-4"
    >
      <TabsList className="w-full">
        <TabsTrigger 
          value="login" 
          className="flex items-center gap-2 flex-1"
        >
          <LogInIcon className="size-4" />
          Connexion
        </TabsTrigger>
        <TabsTrigger 
          value="signup" 
          className="flex items-center gap-2 flex-1"
        >
          <UserPlusIcon className="size-4" />
          Inscription
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default AuthTabs;
