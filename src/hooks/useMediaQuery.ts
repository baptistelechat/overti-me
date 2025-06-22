import { useEffect, useState } from 'react';

/**
 * Hook personnalisé pour détecter si un media query correspond à l'écran actuel
 * @param query La media query à vérifier (ex: '(min-width: 768px)')
 * @returns Un booléen indiquant si la media query correspond
 */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // Vérifier si window est disponible (pour éviter les erreurs SSR)
    if (typeof window === 'undefined') {
      return;
    }

    const media = window.matchMedia(query);
    
    // Définir l'état initial
    setMatches(media.matches);

    // Fonction de callback pour les changements
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Ajouter l'écouteur d'événement
    media.addEventListener('change', listener);

    // Nettoyer l'écouteur d'événement
    return () => {
      media.removeEventListener('change', listener);
    };
  }, [query]);

  return matches;
}

export default useMediaQuery;