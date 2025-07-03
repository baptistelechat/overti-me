import { AlertCircleIcon, CheckCircleIcon } from "lucide-react";
import React from "react";
import { Alert, AlertDescription } from "../../ui/alert";

interface StatusAlertsProps {
  error: string | null;
  success: string | null;
}

const StatusAlerts: React.FC<StatusAlertsProps> = ({ error, success }) => {
  return (
    <>
      {error && (
        <Alert variant="destructive" className="py-2">
          <AlertCircleIcon />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert variant="success" className="py-2">
          <CheckCircleIcon />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default StatusAlerts;
