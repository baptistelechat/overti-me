-- Création de la table weeks pour stocker les données des semaines
CREATE TABLE IF NOT EXISTS public.weeks (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_id TEXT NOT NULL,  -- Format: YYYY-WXX (ex: 2025-W25)
  data JSONB NOT NULL,    -- Données complètes de la semaine
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, week_id)
);

-- Ajouter les politiques de sécurité Row Level Security (RLS)
ALTER TABLE public.weeks ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs de lire uniquement leurs propres données
CREATE POLICY "Users can read their own weeks" 
  ON public.weeks 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Politique pour permettre aux utilisateurs d'insérer uniquement leurs propres données
CREATE POLICY "Users can insert their own weeks" 
  ON public.weeks 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Politique pour permettre aux utilisateurs de mettre à jour uniquement leurs propres données
CREATE POLICY "Users can update their own weeks" 
  ON public.weeks 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Politique pour permettre aux utilisateurs de supprimer uniquement leurs propres données
CREATE POLICY "Users can delete their own weeks" 
  ON public.weeks 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Créer un index sur user_id et week_id pour accélérer les recherches
CREATE INDEX IF NOT EXISTS weeks_user_id_week_id_idx ON public.weeks (user_id, week_id);

-- Fonction pour mettre à jour automatiquement le champ updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour automatiquement le champ updated_at
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.weeks
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();