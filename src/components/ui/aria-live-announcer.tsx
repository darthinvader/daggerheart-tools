import { createContext, useCallback, useEffect, useRef, useState } from 'react';

export interface AnnounceOptions {
  priority?: 'polite' | 'assertive';
}

export type AnnounceFn = (message: string, options?: AnnounceOptions) => void;

export const AnnounceContext = createContext<AnnounceFn | null>(null);

export function AriaLiveAnnouncer({ children }: { children: React.ReactNode }) {
  const [politeMessage, setPoliteMessage] = useState('');
  const [assertiveMessage, setAssertiveMessage] = useState('');
  const politeTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const assertiveTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    return () => {
      clearTimeout(politeTimerRef.current);
      clearTimeout(assertiveTimerRef.current);
    };
  }, []);

  const announce: AnnounceFn = useCallback((message, options) => {
    const priority = options?.priority ?? 'polite';

    if (priority === 'assertive') {
      setAssertiveMessage(message);
      clearTimeout(assertiveTimerRef.current);
      assertiveTimerRef.current = setTimeout(
        () => setAssertiveMessage(''),
        5_000
      );
    } else {
      setPoliteMessage(message);
      clearTimeout(politeTimerRef.current);
      politeTimerRef.current = setTimeout(() => setPoliteMessage(''), 5_000);
    }
  }, []);

  return (
    <AnnounceContext value={announce}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        role="status"
        className="sr-only"
      >
        {politeMessage}
      </div>
      <div
        aria-live="assertive"
        aria-atomic="true"
        role="alert"
        className="sr-only"
      >
        {assertiveMessage}
      </div>
    </AnnounceContext>
  );
}
