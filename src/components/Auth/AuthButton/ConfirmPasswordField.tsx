import { EyeIcon, EyeOffIcon } from "lucide-react";
import React from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

interface ConfirmPasswordFieldProps {
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (show: boolean) => void;
}

const ConfirmPasswordField: React.FC<ConfirmPasswordFieldProps> = ({ 
  confirmPassword, 
  setConfirmPassword, 
  showConfirmPassword, 
  setShowConfirmPassword 
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
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
            <EyeIcon className="size-4" />
          ) : (
            <EyeOffIcon className="size-4" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ConfirmPasswordField;