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
          <AlertCircleIcon className="size-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert variant="success" className="py-2">
          <CheckCircleIcon className="size-4 mr-2" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default StatusAlerts;