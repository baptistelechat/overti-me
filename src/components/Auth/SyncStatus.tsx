import useAuthStore from "@/store/authStore";
import { formatDateTime } from "@/utils/date/formatters";
import { RefreshCwIcon } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

interface SyncStatusProps {
  className?: string;
}

const SyncStatus: React.FC<SyncStatusProps> = ({ className = "" }) => {
  const { user, syncStatus, lastSyncedAt, syncWeeks } = useAuthStore();

  // Si l'utilisateur n'est pas connecté, ne rien afficher
  if (!user) return null;

  // Utilisation des fonctions de formatage centralisées
  const getFullLastSyncedAt = () => {
    return formatDateTime(lastSyncedAt);
  };

  const getSyncStatusText = () => {
    switch (syncStatus) {
      case "synced":
        return "Synchronisé";
      case "not_synced":
        return "Non synchronisé";
      case "syncing":
        return "Synchronisation en cours...";
      case "error":
        return "Erreur de synchronisation";
      default:
        return "État inconnu";
    }
  };

  const getSyncStatusColor = () => {
    switch (syncStatus) {
      case "synced":
        return "text-green-500";
      case "not_synced":
        return "text-yellow-500";
      case "syncing":
        return "text-blue-500";
      case "error":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      <span className={`text-sm font-medium ${getSyncStatusColor()}`}>
        {getSyncStatusText()}
      </span>
      {lastSyncedAt && (
        <span className="text-xs text-muted-foreground">
          Dernière synchronisation : {getFullLastSyncedAt()}
        </span>
      )}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => syncWeeks()}
          disabled={syncStatus === "syncing"}
          className="flex items-center gap-2"
        >
          <RefreshCwIcon className="size-4" />
          Synchroniser
        </Button>
      </div>
    </div>
  );
};

export default SyncStatus;
