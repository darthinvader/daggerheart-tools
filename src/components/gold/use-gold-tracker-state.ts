import { useCallback, useState } from 'react';

type GoldDenomination = 'coins' | 'handfuls' | 'bags' | 'chests';

interface GoldState {
  coins: number;
  handfuls: number;
  bags: number;
  chests: number;
  showCoins: boolean;
  displayDenomination: GoldDenomination;
}

interface UseGoldTrackerStateProps {
  initialCoins?: number;
  initialHandfuls?: number;
  initialBags?: number;
  initialChests?: number;
  showCoinsInitially?: boolean;
  displayDenomination?: GoldDenomination;
  onChange?: (gold: GoldState) => void;
}

function calculateTotalInCoins(
  coins: number,
  handfuls: number,
  bags: number,
  chests: number
): number {
  return coins + handfuls * 10 + bags * 100 + chests * 1000;
}

function calculateTotal(
  totalCoins: number,
  denomination: GoldDenomination
): number {
  switch (denomination) {
    case 'coins':
      return totalCoins;
    case 'handfuls':
      return totalCoins / 10;
    case 'bags':
      return totalCoins / 100;
    case 'chests':
      return totalCoins / 1000;
  }
}

export function useGoldTrackerState({
  initialCoins = 0,
  initialHandfuls = 0,
  initialBags = 0,
  initialChests = 0,
  showCoinsInitially = false,
  displayDenomination: initialDenomination = 'handfuls',
  onChange,
}: UseGoldTrackerStateProps) {
  const [coins, setCoins] = useState(initialCoins);
  const [handfuls, setHandfuls] = useState(initialHandfuls);
  const [bags, setBags] = useState(initialBags);
  const [chests, setChests] = useState(initialChests);
  const [showCoins, setShowCoins] = useState(showCoinsInitially);
  const [totalDenomination, setTotalDenomination] =
    useState<GoldDenomination>(initialDenomination);

  const updateGold = useCallback(
    (newState: Partial<GoldState>) => {
      const state: GoldState = {
        coins: newState.coins ?? coins,
        handfuls: newState.handfuls ?? handfuls,
        bags: newState.bags ?? bags,
        chests: newState.chests ?? chests,
        showCoins: newState.showCoins ?? showCoins,
        displayDenomination: newState.displayDenomination ?? totalDenomination,
      };
      onChange?.(state);
    },
    [coins, handfuls, bags, chests, showCoins, totalDenomination, onChange]
  );

  const handleCoinsChange = useCallback(
    (value: number) => {
      setCoins(value);
      updateGold({ coins: value });
    },
    [updateGold]
  );

  const handleHandfulsChange = useCallback(
    (value: number) => {
      setHandfuls(value);
      updateGold({ handfuls: value });
    },
    [updateGold]
  );

  const handleBagsChange = useCallback(
    (value: number) => {
      setBags(value);
      updateGold({ bags: value });
    },
    [updateGold]
  );

  const handleChestsChange = useCallback(
    (value: number) => {
      setChests(value);
      updateGold({ chests: value });
    },
    [updateGold]
  );

  const handleShowCoinsChange = useCallback(
    (enabled: boolean) => {
      setShowCoins(enabled);
      if (!enabled) {
        setCoins(0);
        if (totalDenomination === 'coins') {
          setTotalDenomination('handfuls');
        }
      }
      updateGold({ showCoins: enabled, coins: enabled ? coins : 0 });
    },
    [coins, totalDenomination, updateGold]
  );

  const handleDenominationChange = useCallback(
    (denom: GoldDenomination) => {
      setTotalDenomination(denom);
      updateGold({ displayDenomination: denom });
    },
    [updateGold]
  );

  const totalInCoins = calculateTotalInCoins(coins, handfuls, bags, chests);
  const displayTotal = calculateTotal(totalInCoins, totalDenomination);

  return {
    coins,
    handfuls,
    bags,
    chests,
    showCoins,
    totalDenomination,
    displayTotal,
    handleCoinsChange,
    handleHandfulsChange,
    handleBagsChange,
    handleChestsChange,
    handleShowCoinsChange,
    handleDenominationChange,
  };
}
