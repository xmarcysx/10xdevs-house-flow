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
    // Timeout fallback - jeśli onAuthStateChange nie wywoła się w ciągu 10 sekund, ustaw loading na false
    const timeoutId = setTimeout(() => {
      console.warn("Auth initialization timeout - setting loading to false");
      setIsLoading(false);
    }, 10000);

    // Użyj tylko onAuthStateChange - Supabase sam zarządza inicjalizacją
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change:", event, !!session, session?.user?.email);

      clearTimeout(timeoutId); // Anuluj timeout gdy dostaniemy odpowiedź

      setSession(session);
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session);
      setIsLoading(false);
    });

    return () => {
      clearTimeout(timeoutId);
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
