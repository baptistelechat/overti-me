# 🛠️ Roadmap – OverTime App (Overti.me)

**Overti.me** est une mini-application web qui permet de suivre ses heures de travail quotidiennes, de calculer automatiquement les heures supplémentaires (+25%, +50%), et d’exporter les données au format CSV, Excel ou JSON.

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

- [ ] Créer un projet Vite avec le template `react-ts`
- [ ] Installer Tailwind CSS
- [ ] Intégrer shadcn/ui pour les composants
- [ ] Configurer le routing si besoin (pour gestion de semaine future)

---

### 2. Structure de données & persistance

- [ ] Créer les types `WorkDay` et `WeekData`
- [ ] Créer un hook `useLocalStorage`
- [ ] Initialiser une structure de semaine complète (Lundi → Dimanche)
- [ ] Enregistrer automatiquement les données dans `localStorage`

---

### 3. Interface principale

- [ ] Afficher les 7 jours de la semaine avec date
- [ ] Ajouter la saisie horaire (début/fin OU durée)
- [ ] Calcul automatique de la durée par jour
- [ ] Affichage du total hebdomadaire

---

### 4. Calcul des heures supplémentaires

- [ ] Ajouter les règles :
  - Jusqu’à 35h : heures normales
  - 35h à 43h : +25%
  - Après 43h : +50%
- [ ] Affichage des totaux :
  - Heures normales
  - Heures +25%
  - Heures +50%

---

### 5. Navigation hebdomadaire

- [ ] Générer un ID de semaine (`2025-W25`)
- [ ] Permettre de consulter les semaines précédentes
- [ ] Persister les semaines passées dans le localStorage

---

### 6. Export de données

- [ ] Ajouter un bouton d’export
- [ ] Pouvoir sélectionner les colonnes à inclure ou masquer
- [ ] Exporter en :
  - [ ] Excel (via `xlsx`)
  - [ ] CSV
  - [ ] JSON

---

### 7. Finitions & Bonus

- [ ] UI responsive, claire et mobile-friendly
- [ ] Ajout d’un thème clair/sombre
- [ ] Bouton de réinitialisation de la semaine
- [ ] Confirmation lors de la suppression d'une semaine
- [ ] Ajout d'un aperçu avant export
