import { EyeIcon, EyeOffIcon } from "lucide-react";
import React from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

interface PasswordFieldProps {
  password: string;
  setPassword: (password: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
}

const PasswordField: React.FC<PasswordFieldProps> = ({ 
  password, 
  setPassword, 
  showPassword, 
  setShowPassword 
}) => {
  return (
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
            <EyeIcon className="size-4" />
          ) : (
            <EyeOffIcon className="size-4" />
          )}
        </button>
      </div>
    </div>
  );
};

export default PasswordField;