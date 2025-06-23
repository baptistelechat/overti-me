import type { WeekData } from "@/types";
import {
  createClient,
  type SupabaseClient,
  type User,
} from "@supabase/supabase-js";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import useWeekStore from "./weekStore";

// Définir les types pour le store d'authentification
interface AuthState {
  // État
  user: User | null;
  supabase: SupabaseClient | null;
  isInitialized: boolean;
  isSyncing: boolean;
  lastSyncedAt: string | null;
  syncStatus: "synced" | "not_synced" | "syncing" | "error";
  syncError: string | null;
  autoSyncInterval: number | null;

  // Actions
  initialize: () => Promise<void>;
  signup: (
    email: string,
    password: string
  ) => Promise<{ error: string | null }>;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  syncWeeks: () => Promise<void>;
  updateWeekInSupabase: (weekData: WeekData) => Promise<void>;
  setupAutoSync: () => void;
  stopAutoSync: () => void;
}

// Créer le client Supabase
const createSupabaseClient = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase credentials are missing");
    return null;
  }

  return createClient(supabaseUrl, supabaseKey);
};

// Créer le store d'authentification avec Zustand
const useAuthStore = create<AuthState>()(  
  persist(
    (set, get) => ({
      // État initial
      user: null,
      supabase: null,
      isInitialized: false,
      isSyncing: false,
      lastSyncedAt: null,
      syncStatus: "not_synced",
      syncError: null,
      autoSyncInterval: null,

      // Initialiser le client Supabase et vérifier la session
      initialize: async () => {
        if (get().isInitialized) return;

        const supabase = createSupabaseClient();
        if (!supabase) {
          set({ isInitialized: true });
          return;
        }

        set({ supabase });

        // Vérifier si l'utilisateur est déjà connecté
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          set({
            user: data.session.user,
            isInitialized: true,
            syncStatus: "not_synced",
          });

          console.log(
            "Session utilisateur trouvée, démarrage de la synchronisation..."
          );
          // Synchroniser les données immédiatement
          await get().syncWeeks();
          
          // Configurer la synchronisation automatique
          get().setupAutoSync();
        } else {
          set({ isInitialized: true });
        }

        // Configurer les listeners pour les changements d'authentification
        supabase.auth.onAuthStateChange(async (event, session) => {
          console.log("Changement d'état d'authentification:", event);

          if (event === "SIGNED_IN" && session?.user) {
            console.log(
              "Utilisateur connecté, préparation à la synchronisation..."
            );
            set({ user: session.user, syncStatus: "not_synced" });

            // Attendre un court instant pour s'assurer que tout est initialisé
            setTimeout(async () => {
              console.log("Démarrage de la synchronisation après connexion...");
              await get().syncWeeks();
              
              // Configurer la synchronisation automatique
              get().setupAutoSync();
            }, 500);
          } else if (event === "SIGNED_OUT") {
            console.log("Utilisateur déconnecté");
            set({
              user: null,
              lastSyncedAt: null,
              syncStatus: "not_synced",
              syncError: null,
            });
            
            // Arrêter la synchronisation automatique
            get().stopAutoSync();
          }
        });
      },

      // Inscription avec email/password
      signup: async (email, password) => {
        const { supabase } = get();
        if (!supabase) return { error: "Supabase client not initialized" };

        const result = await supabase.auth.signUp({ email, password });

        if (result.error) {
          return { error: result.error.message };
        }

        // Si l'email de confirmation est activé, l'utilisateur devra confirmer son email
        if (result.data.user && result.data.user.identities?.length === 0) {
          return { error: "Cet email est déjà utilisé" };
        }

        return { error: null };
      },

      // Connexion avec email/password
      login: async (email, password) => {
        const { supabase } = get();
        if (!supabase) return { error: "Supabase client not initialized" };

        console.log("Tentative de connexion...");
        const result = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (result.error) {
          console.error("Erreur de connexion:", result.error.message);
          return { error: result.error.message };
        }

        console.log("Connexion réussie, utilisateur:", result.data.user);

        // Mettre à jour l'état utilisateur manuellement
        set({
          user: result.data.user,
          syncStatus: "not_synced",
        });

        // Forcer une synchronisation immédiate
        console.log(
          "Démarrage de la synchronisation après connexion manuelle..."
        );
        setTimeout(async () => {
          try {
            await get().syncWeeks();
            console.log("Synchronisation après connexion terminée");
          } catch (error) {
            console.error(
              "Erreur lors de la synchronisation après connexion:",
              error
            );
          }
        }, 1000);

        return { error: null };
      },

      // Déconnexion
      logout: async () => {
        const supabase = get().supabase;
        if (!supabase) return;

        // Arrêter la synchronisation automatique avant la déconnexion
        get().stopAutoSync();

        await supabase.auth.signOut();
        set({
          user: null,
          lastSyncedAt: null,
          syncStatus: "not_synced",
          syncError: null,
        });
      },

      // Configurer la synchronisation automatique
      setupAutoSync: () => {
        // Arrêter toute synchronisation automatique existante
        get().stopAutoSync();
        
        // Vérifier si l'utilisateur est connecté
        if (!get().user) return;
        
        // Configurer un intervalle pour synchroniser toutes les 5 minutes (300000 ms)
        const intervalId = window.setInterval(async () => {
          console.log("Synchronisation automatique déclenchée");
          // Ne synchroniser que si l'utilisateur est toujours connecté et qu'on n'est pas déjà en train de synchroniser
          if (get().user && !get().isSyncing) {
            await get().syncWeeks();
          }
        }, 300000); // 5 minutes
        
        // Stocker l'ID de l'intervalle
        set({ autoSyncInterval: intervalId });
        console.log("Synchronisation automatique configurée");
      },
      
      // Arrêter la synchronisation automatique
      stopAutoSync: () => {
        const intervalId = get().autoSyncInterval;
        if (intervalId !== null) {
          window.clearInterval(intervalId);
          set({ autoSyncInterval: null });
          console.log("Synchronisation automatique arrêtée");
        }
      },

      // Synchroniser les semaines entre localStorage et Supabase
      syncWeeks: async () => {
        const { supabase, user } = get();
        if (!supabase || !user) return;

        set({ isSyncing: true, syncStatus: "syncing", syncError: null });

        try {
          // 1. Récupérer les semaines depuis Supabase
          const { data: remoteWeeks, error } = await supabase
            .from("weeks")
            .select("*")
            .eq("user_id", user.id);

          if (error) throw new Error(error.message);

          // 2. Récupérer les semaines locales
          const { weeks: localWeeks } = useWeekStore.getState();

          // 3. Préparer un nouvel objet pour les semaines fusionnées
          const mergedWeeks: Record<string, WeekData> = {};

          // Ajouter d'abord toutes les semaines distantes
          if (remoteWeeks && remoteWeeks.length > 0) {
            remoteWeeks.forEach((remoteWeek) => {
              const weekData = remoteWeek.data as WeekData;
              mergedWeeks[weekData.id] = weekData;
            });

            // Ensuite, fusionner avec les semaines locales (si plus récentes)
            Object.entries(localWeeks).forEach(([weekId, localWeek]) => {
              // Trouver la semaine distante correspondante
              const remoteWeek = remoteWeeks.find(
                (rw) => rw.week_id === weekId
              );

              if (remoteWeek) {
                const remoteUpdatedAt = new Date(remoteWeek.updated_at);
                // Si nous avons des modifications locales plus récentes, les conserver
                const localUpdatedAt = new Date(get().lastSyncedAt || 0);

                if (localUpdatedAt > remoteUpdatedAt) {
                  mergedWeeks[weekId] = localWeek;
                }
              } else {
                // Si la semaine n'existe pas sur le serveur, l'ajouter
                mergedWeeks[weekId] = localWeek;
              }
            });
          } else {
            // Si aucune donnée distante, conserver les données locales
            Object.assign(mergedWeeks, localWeeks);
          }

          // 4. Mettre à jour le store local avec les données fusionnées
          useWeekStore.setState({ weeks: mergedWeeks });

          // 5. Synchroniser les semaines locales vers Supabase
          const syncPromises = Object.values(mergedWeeks).map((weekData) =>
            get().updateWeekInSupabase(weekData)
          );

          await Promise.all(syncPromises);

          // 6. Mettre à jour le statut de synchronisation
          set({
            isSyncing: false,
            lastSyncedAt: new Date().toISOString(),
            syncStatus: "synced",
            syncError: null,
          });

          console.log(
            "Synchronisation terminée, données fusionnées:",
            mergedWeeks
          );
        } catch (error) {
          console.error("Sync error:", error);
          set({
            isSyncing: false,
            syncStatus: "error",
            syncError:
              error instanceof Error
                ? error.message
                : "Unknown error during synchronization",
          });
        }
      },

      // Mettre à jour une semaine dans Supabase
      updateWeekInSupabase: async (weekData) => {
        const { supabase, user } = get();
        if (!supabase || !user) {
          console.warn(
            "Impossible de mettre à jour la semaine: utilisateur non connecté ou client Supabase non initialisé"
          );
          return;
        }

        try {
          console.log(
            `Mise à jour de la semaine ${weekData.id} dans Supabase...`
          );

          // Vérifier si la semaine existe déjà
          const { data: existingWeek, error: checkError } = await supabase
            .from("weeks")
            .select("id")
            .eq("user_id", user.id)
            .eq("week_id", weekData.id)
            .maybeSingle();

          if (checkError) {
            console.error(
              "Erreur lors de la vérification de l'existence de la semaine:",
              checkError
            );
            throw checkError;
          }

          const timestamp = new Date().toISOString();

          if (existingWeek) {
            console.log(
              `La semaine ${weekData.id} existe déjà, mise à jour...`
            );
            // Mettre à jour la semaine existante
            const { error: updateError } = await supabase
              .from("weeks")
              .update({
                data: weekData,
                updated_at: timestamp,
              })
              .eq("user_id", user.id)
              .eq("week_id", weekData.id);

            if (updateError) {
              console.error(
                "Erreur lors de la mise à jour de la semaine:",
                updateError
              );
              throw updateError;
            }

            console.log(`Semaine ${weekData.id} mise à jour avec succès`);
          } else {
            console.log(
              `La semaine ${weekData.id} n'existe pas encore, création...`
            );
            // Créer une nouvelle semaine
            const { error: insertError } = await supabase.from("weeks").insert({
              user_id: user.id,
              week_id: weekData.id,
              data: weekData,
              created_at: timestamp,
              updated_at: timestamp,
            });

            if (insertError) {
              console.error(
                "Erreur lors de la création de la semaine:",
                insertError
              );
              throw insertError;
            }

            console.log(`Semaine ${weekData.id} créée avec succès`);
          }
        } catch (error) {
          console.error("Error updating week in Supabase:", error);
          throw error;
        }
      },
    }),
    {
      name: "overti-me-auth-storage", // nom unique pour le stockage
      storage: createJSONStorage(() => localStorage), // utiliser localStorage
      partialize: (state) => ({
        // ne stocker que ces propriétés
        user: state.user,
        lastSyncedAt: state.lastSyncedAt,
        syncStatus: state.syncStatus,
      }),
    }
  )
);

export default useAuthStore;
