import React, { useEffect, useState } from 'react';
import useAuthStore from '@/store/authStore';
import { Alert, AlertDescription } from '../ui/alert';
import { CheckCircleIcon } from 'lucide-react';

const EmailChangeConfirmationHandler: React.FC = () => {
  const { handleEmailChangeConfirmation } = useAuthStore();
  const [confirmationStatus, setConfirmationStatus] = useState<{
    success: boolean;
    message: string | null;
  }>({ success: false, message: null });

  useEffect(() => {
    // Vérifier si l'URL contient des paramètres liés à la confirmation d'email
    const url = new URL(window.location.href);
    const type = url.searchParams.get('type');
    
    if (type === 'email_change' || url.hash.includes('type=email_change')) {
      // Appeler la fonction de gestion de confirmation d'email
      handleEmailChangeConfirmation().then(({ error }) => {
        if (error) {
          setConfirmationStatus({
            success: false,
            message: `Erreur lors de la confirmation du changement d'email: ${error}`
          });
        } else {
          setConfirmationStatus({
            success: true,
            message: 'Votre adresse email a été mise à jour avec succès. Vous pouvez maintenant vous connecter avec votre nouvelle adresse email.'
          });
          
          // Nettoyer l'URL des paramètres de confirmation
          if (window.history && window.history.replaceState) {
            const cleanUrl = window.location.pathname + window.location.search.replace(/[?&]type=email_change/, '');
            window.history.replaceState({}, document.title, cleanUrl);
          }
        }
      });
    }
  }, [handleEmailChangeConfirmation]);

  if (!confirmationStatus.message) {
    return null;
  }

  return (
    <Alert className={confirmationStatus.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
      {confirmationStatus.success && <CheckCircleIcon className="h-4 w-4 text-green-600" />}
      <AlertDescription>
        {confirmationStatus.message}
      </AlertDescription>
    </Alert>
  );
};

export default EmailChangeConfirmationHandler;