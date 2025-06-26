# 🛠️ Roadmap – OverTime App (Overti.me)

**Overti.me** est une mini-application web qui permet de suivre ses heures de travail quotidiennes, de calculer automatiquement les heures supplémentaires (+25%, +50%), et d'exporter les données au format CSV, Excel ou JSON.

Elle est pensée pour une utilisation personnelle, simple et sans backend. Les données sont sauvegardées en local (`localStorage`) pour permettre une saisie progressive au fil de la semaine.

🔗 URL de l'app (dev) : https://overti-me.vercel.app

---

## 🔧 Stack technique

- ⚡️ ViteJS avec le template `react-ts`
- 🎨 Tailwind CSS + shadcn/ui pour les composants
- 💾 Persistance via `localStorage`
- 📤 Export via la lib `xlsx` (CSV, Excel) + export JSON
- 🪝 Hooks personnalisés pour la persistance

---

## 📍 Étapes de développement

### 1. Initialisation du projet

- [x] Créer un projet Vite avec le template `react-ts`
- [x] Installer Tailwind CSS
- [x] Intégrer shadcn/ui pour les composants
- [x] Configurer le routing si besoin (pour gestion de semaine future)

---

### 2. Structure de données & persistance

- [x] Créer les types `WorkDay` et `WeekData`
- [x] Créer un hook `useLocalStorage`
- [x] Initialiser une structure de semaine complète (Lundi → Dimanche)
- [x] Enregistrer automatiquement les données dans `localStorage`

---

### 3. Interface principale

- [x] Afficher les 7 jours de la semaine avec date
- [x] Ajouter la saisie horaire (début/fin OU durée)
- [x] Calcul automatique de la durée par jour
- [x] Affichage du total hebdomadaire

---

### 4. Calcul des heures supplémentaires

- [x] Ajouter les règles :
  - Jusqu'à 35h : heures normales
  - 35h à 43h : +25%
  - Après 43h : +50%
- [x] Affichage des totaux :
  - Heures normales
  - Heures +25%
  - Heures +50%

---

### 5. Navigation hebdomadaire

- [x] Générer un ID de semaine (`2025-W25`)
- [x] Permettre de consulter les semaines précédentes
- [x] Persister les semaines passées dans le localStorage

---

### 6. Export de données

- [x] Ajouter un bouton d'export
- [x] Pouvoir sélectionner les colonnes à inclure ou masquer
- [x] Exporter en :
  - [x] Excel (via `xlsx`)
  - [x] CSV
  - [x] JSON

---

### 7. Authentification & Synchronisation Supabase

Permettre à l'utilisateur de synchroniser ses semaines entre plusieurs appareils grâce à Supabase. Le mode par défaut reste en `localStorage`, sans compte requis.

- [x] Installer et configurer Supabase dans le projet
- [x] Ajouter un bouton "Se connecter pour synchroniser"
- [x] Intégrer l'authentification Supabase (email/password ou magic link)
- [x] Gérer l'état de l'utilisateur (`user`) via Zustand ou contexte
- [x] Créer une table `weeks` sur Supabase
- [x] Au login :
  - Charger les semaines depuis Supabase
  - Fusionner avec celles du `localStorage`
- [x] Au logout :
  - Revenir en mode local uniquement
- [x] Ajouter un indicateur de statut (synchronisé / non synchronisé)
- [x] Mettre à jour Supabase à chaque modification de semaine (optimiste)

---

### 8. Améliorations de l'authentification

- [x] Gestion de la récupération de mot de passe
- [x] Extraction de l'email depuis les tokens JWT
- [ ] Amélioration des messages d'erreur et de succès
- [ ] Validation des formulaires avec Zod
- [x] Possibilité de modifier son email
- [ ] Possibilité de supprimer son compte
- [x] Ajout d'une page de profil utilisateur
- [x] Gestion des sessions multiples
- [ ] Ajout d'une option "Se souvenir de moi"

---

### 9. Sécurité et confidentialité

- [ ] Mise en place de politiques RLS plus strictes
- [ ] Ajout d'une page de confidentialité
- [ ] Option pour supprimer toutes les données utilisateur
- [ ] Chiffrement des données sensibles
- [ ] Audit de sécurité
- [ ] Mise en place de limites de taux (rate limiting)

---

### 10. Finitions & Bonus

- [x] UI responsive, claire et mobile-friendly
- [ ] Ajout d'un thème clair/sombre
- [x] Bouton de réinitialisation de la semaine
- [ ] Confirmation lors de la suppression d'une semaine
- [ ] Ajout d'un aperçu avant export
- [ ] Notifications pour les synchronisations réussies/échouées
- [ ] Mode hors ligne avec synchronisation différée
- [ ] Statistiques d'utilisation (heures travaillées par mois, etc.)
- [ ] Personnalisation des seuils d'heures supplémentaires
