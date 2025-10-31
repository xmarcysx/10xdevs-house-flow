import React from "react";
import { useAuthState } from "../lib/hooks/useAuthState";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, fallback }) => {
  const { isLoading, isAuthenticated } = useAuthState();

  // Pokaż fallback podczas ładowania
  if (isLoading) {
    return fallback ? <>{fallback}</> : (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Jeśli użytkownik nie jest zalogowany, nie renderuj children
  if (!isAuthenticated) {
    return null;
  }

  // Renderuj children jeśli użytkownik jest zalogowany
  return <>{children}</>;
};

export default AuthGuard;
