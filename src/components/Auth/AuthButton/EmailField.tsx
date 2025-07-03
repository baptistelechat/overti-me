import React from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

interface EmailFieldProps {
  email: string;
  setEmail: (email: string) => void;
  disabled?: boolean;
}

const EmailField: React.FC<EmailFieldProps> = ({ 
  email, 
  setEmail, 
  disabled = false 
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="votre@email.com"
        required
        disabled={disabled}
      />
    </div>
  );
};

export default EmailField;