import { useCallback, useState } from 'react';

import { useAuth } from '@/components/providers';
import { Card, CardContent } from '@/components/ui/card';
import {
  AuthDivider,
  AuthFields,
  AuthFooter,
  AuthHeader,
  AuthMessages,
  AuthSocialButton,
  AuthSubmitButton,
} from './auth-form-parts';
import {
  type AuthMode,
  submitAuthRequest,
  validateCredentials,
} from './auth-form-utils';

interface AuthFormProps {
  defaultMode?: AuthMode;
  onSuccess?: () => void;
}

export function AuthForm({ defaultMode = 'login', onSuccess }: AuthFormProps) {
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const { signIn, signUp, signInWithGoogle } = useAuth();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setMessage(null);

      const validationError = validateCredentials(
        mode,
        password,
        confirmPassword
      );
      if (validationError) {
        setError(validationError);
        return;
      }

      setLoading(true);
      try {
        const result = await submitAuthRequest({
          mode,
          email,
          password,
          signIn,
          signUp,
        });
        if (result.error) {
          setError(result.error);
        }
        if (result.message) {
          setMessage(result.message);
        }
        if (result.success) {
          onSuccess?.();
        }
      } finally {
        setLoading(false);
      }
    },
    [confirmPassword, email, mode, onSuccess, password, signIn, signUp]
  );

  const handleGoogleSignIn = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const { error: googleError } = await signInWithGoogle();
      if (googleError) {
        setError(googleError.message);
      }
    } finally {
      setLoading(false);
    }
  }, [signInWithGoogle]);

  const toggleMode = useCallback(() => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError(null);
    setMessage(null);
  }, [mode]);

  return (
    <Card className="w-full max-w-md">
      <AuthHeader mode={mode} />
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <AuthFields
            mode={mode}
            email={email}
            password={password}
            confirmPassword={confirmPassword}
            loading={loading}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onConfirmPasswordChange={setConfirmPassword}
          />
          <AuthMessages error={error} message={message} />
          <AuthSubmitButton mode={mode} loading={loading} />
        </form>

        <AuthDivider />
        <AuthSocialButton
          loading={loading}
          onGoogleSignIn={handleGoogleSignIn}
        />
      </CardContent>
      <AuthFooter mode={mode} loading={loading} onToggleMode={toggleMode} />
    </Card>
  );
}
