import type { Session, User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabaseClient } from "../../db/supabase.client";
import type { AuthState } from "../../types";

export const useAuthState = (): AuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Nasłuchuj zmian stanu autentyfikacji - to bezpieczniejsze podejście
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event, !!session, session?.user?.email);

      // Dla bezpiecznego pobierania danych użytkownika, używamy getUser() zamiast polegać tylko na sesji
      if (session?.access_token) {
        try {
          const { data: userData, error: userError } = await supabaseClient.auth.getUser();
          if (userError) {
            console.error("Error getting user:", userError);
            setSession(null);
            setUser(null);
            setIsAuthenticated(false);
          } else {
            setSession(session);
            setUser(userData.user);
            setIsAuthenticated(!!userData.user);
          }
        } catch (error) {
          console.error("Error in getUser:", error);
          setSession(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setSession(session);
        setUser(session?.user ?? null);
        setIsAuthenticated(!!session);
      }

      setIsLoading(false);
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    session,
    isLoading,
    isAuthenticated,
  };
};
