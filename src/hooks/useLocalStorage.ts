import { useState, useEffect } from 'react';

/**
 * Hook personnalisé pour gérer la persistance des données dans le localStorage
 * @param key - Clé de stockage dans le localStorage
 * @param initialValue - Valeur initiale si aucune donnée n'est trouvée
 * @returns [storedValue, setValue] - Valeur stockée et fonction pour la mettre à jour
 */
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Fonction pour obtenir la valeur initiale du localStorage ou utiliser la valeur par défaut
  const readValue = (): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Erreur lors de la lecture de ${key} depuis localStorage:`, error);
      return initialValue;
    }
  };

  // État pour stocker la valeur actuelle
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Fonction pour mettre à jour la valeur dans le state et le localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permet de passer une fonction pour mettre à jour la valeur (comme setState)
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Mise à jour du state
      setStoredValue(valueToStore);
      
      // Mise à jour du localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Erreur lors de l'écriture de ${key} dans localStorage:`, error);
    }
  };

  // Synchroniser avec les changements de localStorage externes (autres onglets)
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        setStoredValue(JSON.parse(event.newValue));
      }
    };

    // Ajouter l'écouteur d'événement pour les changements de storage
    window.addEventListener('storage', handleStorageChange);
    
    // Nettoyer l'écouteur d'événement
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
}

export default useLocalStorage;