import type { Session, User } from '@supabase/supabase-js';
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  signInWithGoogle as authSignInWithGoogle,
  signOut as authSignOut,
  signInWithEmail,
  signUpWithEmail,
} from '@/lib/auth';
import { supabase } from '@/lib/supabase';

import { AuthContext, type AuthState } from './auth-context';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth
      .getSession()
      .then(({ data: { session: initialSession } }) => {
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Failed to get auth session:', error);
        setIsLoading(false);
      });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await signInWithEmail(email, password);
    return { error };
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const { error } = await signUpWithEmail(email, password);
    return { error };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const { error } = await authSignInWithGoogle();
    return { error };
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await authSignOut();
    return { error };
  }, []);

  const value: AuthState = useMemo(
    () => ({
      user,
      session,
      isLoading,
      isAuthenticated: !!user,
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
    }),
    [user, session, isLoading, signIn, signUp, signInWithGoogle, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
