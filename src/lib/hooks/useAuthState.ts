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
    // Pobierz początkową sesję
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabaseClient.auth.getSession();
        if (error) {
          console.error("Error getting session:", error);
          setSession(null);
          setUser(null);
          setIsAuthenticated(false);
        } else {
          console.log("Initial session loaded:", !!session, session?.user?.email);
          setSession(session);
          setUser(session?.user ?? null);
          setIsAuthenticated(!!session);
        }
      } catch (error) {
        console.error("Error in getInitialSession:", error);
        setSession(null);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Nasłuchuj zmian stanu autentyfikacji
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event, !!session, session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session);
      setIsLoading(false);

      // Handle auth state changes silently
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
