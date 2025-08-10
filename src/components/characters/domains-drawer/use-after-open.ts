import * as React from 'react';

export function useAfterOpenFlag(open: boolean) {
  const [afterOpen, setAfterOpen] = React.useState(false);
  React.useEffect(() => {
    let raf1 = 0;
    let raf2 = 0;
    if (open) {
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setAfterOpen(true));
      });
    } else {
      setAfterOpen(false);
    }
    return () => {
      if (raf1) cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
    };
  }, [open]);
  return afterOpen;
}
