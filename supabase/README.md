# Configuration de Supabase pour OverTime

Ce document explique comment configurer Supabase pour la synchronisation des données de l'application OverTime.

## Prérequis

- Un compte Supabase (gratuit) : [https://supabase.com](https://supabase.com)
- Un projet Supabase créé

## Étapes de configuration

### 1. Créer un projet Supabase

1. Connectez-vous à votre compte Supabase
2. Créez un nouveau projet
3. Notez l'URL et la clé anon/public de votre projet (vous en aurez besoin pour la configuration de l'application)

### 2. Configurer l'authentification

1. Dans le dashboard Supabase, allez dans **Authentication** > **Providers**
2. Activez le provider **Email** et configurez-le selon vos besoins :
   - Pour utiliser les magic links : activez **Enable Email Confirmations**
   - Pour utiliser l'authentification par mot de passe : activez **Enable Email Signup**

### 3. Configurer les URLs de redirection

1. Dans le dashboard Supabase, allez dans **Authentication** > **URL Configuration**
2. Configurez le **Site URL** avec l'URL de votre application en production (ex: `https://votre-app.vercel.app`)
3. Ajoutez toutes les URLs de redirection nécessaires dans **Redirect URLs** :
   - Votre URL de production (ex: `https://votre-app.vercel.app`)
   - Votre URL de développement local (ex: `http://localhost:5173`)
   - Les URLs de déploiement de prévisualisation (vous pouvez utiliser des wildcards comme `https://*.vercel.app` pour les déploiements de prévisualisation Vercel)

Cette configuration est essentielle pour que les fonctionnalités comme la vérification d'email, la réinitialisation de mot de passe et le changement d'email fonctionnent correctement.

### 4. Créer la table `weeks`

1. Dans le dashboard Supabase, allez dans **SQL Editor**
2. Créez un nouveau script SQL
3. Copiez-collez le contenu du fichier `schema.sql` fourni dans ce dossier
4. Exécutez le script

### 5. Configurer les variables d'environnement

1. Copiez le fichier `.env.example` à la racine du projet et renommez-le en `.env.local`
2. Remplissez les variables avec les informations de votre projet Supabase :
   ```
   VITE_SUPABASE_URL=https://votre-projet.supabase.co
   VITE_SUPABASE_ANON_KEY=votre-clé-anon
   
   # URL de production pour les redirections d'authentification
   VITE_PRODUCTION_URL=https://votre-app.vercel.app
   ```
3. La variable `VITE_PRODUCTION_URL` est utilisée pour les redirections d'authentification et doit correspondre à l'URL de votre application en production

## Fonctionnement de la synchronisation

### Mode local (par défaut)

Par défaut, l'application fonctionne en mode local, sans authentification. Toutes les données sont stockées dans le localStorage du navigateur.

### Mode synchronisé

Lorsque l'utilisateur se connecte :

1. Les données existantes dans le localStorage sont conservées
2. Les données stockées dans Supabase sont récupérées
3. Les deux sources sont fusionnées (en cas de conflit, la version la plus récente est conservée)
4. Toutes les modifications ultérieures sont synchronisées automatiquement avec Supabase

### Déconnexion

Lorsque l'utilisateur se déconnecte :

1. Les données locales sont conservées
2. La synchronisation avec Supabase est désactivée
3. L'application revient en mode local

## Structure de la table `weeks`

- `id` : Identifiant unique de l'enregistrement
- `user_id` : Identifiant de l'utilisateur (référence à `auth.users`)
- `week_id` : Identifiant de la semaine au format `YYYY-WXX` (ex: `2025-W25`)
- `data` : Données complètes de la semaine au format JSON
- `created_at` : Date de création de l'enregistrement
- `updated_at` : Date de dernière mise à jour de l'enregistrement

## Sécurité

La table `weeks` est configurée avec Row Level Security (RLS) pour garantir que chaque utilisateur ne peut accéder qu'à ses propres données.