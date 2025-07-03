import { Button } from "@/components/ui/button";
import React from "react";

interface ForgotPasswordLinkProps {
  setAuthAction: (action: "login" | "signup" | "forgot") => void;
}

const ForgotPasswordLink: React.FC<ForgotPasswordLinkProps> = ({
  setAuthAction,
}) => {
  return (
    <div className="text-sm text-right">
      <Button 
        type="button" 
        variant={"link"} 
        onClick={() => setAuthAction("forgot")}
      >
        Mot de passe oublié ?
      </Button>
    </div>
  );
};

export default ForgotPasswordLink;
