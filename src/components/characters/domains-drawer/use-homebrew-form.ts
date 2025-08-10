import * as React from 'react';

export type HomebrewState = {
  hbName: string;
  hbDomain: string;
  hbType: string;
  hbLevel: number;
  hbDescription: string;
  hbHopeCost: number | '';
  hbRecallCost: number | '';
};

export function useHomebrewForm(initial?: Partial<HomebrewState>) {
  const [state, setState] = React.useState<HomebrewState>({
    hbName: '',
    hbDomain: '',
    hbType: 'Spell',
    hbLevel: 1,
    hbDescription: '',
    hbHopeCost: '',
    hbRecallCost: '',
    ...initial,
  });

  const setPartial = React.useCallback((next: Partial<HomebrewState>) => {
    setState(prev => ({ ...prev, ...next }));
  }, []);

  const clear = React.useCallback(() => {
    setState({
      hbName: '',
      hbDomain: '',
      hbType: 'Spell',
      hbLevel: 1,
      hbDescription: '',
      hbHopeCost: '',
      hbRecallCost: '',
    });
  }, []);

  return { state, setState: setPartial, clear } as const;
}
