export type AuthMode = 'login' | 'signup';

export function validateCredentials(
  mode: AuthMode,
  password: string,
  confirmPassword: string
): string | null {
  if (mode === 'signup' && password !== confirmPassword) {
    return 'Passwords do not match';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }
  return null;
}

export async function submitAuthRequest({
  mode,
  email,
  password,
  signIn,
  signUp,
}: {
  mode: AuthMode;
  email: string;
  password: string;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
}): Promise<{ error?: string; message?: string; success?: boolean }> {
  if (mode === 'login') {
    const { error } = await signIn(email, password);
    return error ? { error: error.message } : { success: true };
  }

  const { error } = await signUp(email, password);
  return error
    ? { error: error.message }
    : { message: 'Check your email for a confirmation link!' };
}
