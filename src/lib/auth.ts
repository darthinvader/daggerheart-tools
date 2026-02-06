import type { AuthError, Session, User } from '@supabase/supabase-js';
import { redirect } from '@tanstack/react-router';

import { supabase } from './supabase';

export interface AuthResult {
  user: User | null;
  error: AuthError | null;
}

export interface SessionResult {
  session: Session | null;
  error: AuthError | null;
}

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(
  email: string,
  password: string
): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { user: data.user, error };
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { user: data.user, error };
}

/**
 * Sign in with Google OAuth
 * Redirects to Google for authentication
 */
export async function signInWithGoogle(): Promise<{ error: AuthError | null }> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/`,
    },
  });
  return { error };
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<{ error: AuthError | null }> {
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * Get the current session
 */
export async function getSession(): Promise<SessionResult> {
  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, error };
}

/**
 * Get the current user
 */
export async function getUser(): Promise<AuthResult> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  return { user, error };
}

/**
 * Send password reset email
 */
export async function resetPassword(
  email: string
): Promise<{ error: AuthError | null }> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  return { error };
}

/**
 * Update user password (after reset)
 */
export async function updatePassword(newPassword: string): Promise<AuthResult> {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  return { user: data.user, error };
}

/**
 * Route guard helper — throws a redirect to /login if user is not authenticated.
 * Use in TanStack Router `beforeLoad` hooks.
 */
export async function requireAuth(): Promise<User> {
  const { user } = await getUser();
  if (!user) {
    throw redirect({ to: '/login' });
  }
  return user;
}
