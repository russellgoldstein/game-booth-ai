import { useEffect, useState } from "react";

// Define types for the game object and plate appearance
interface Game {
  game: {
    plateAppearances: PlateAppearance[];
    gameState: {
      currentPlateAppearanceId: string;
      nextPlateAppearanceId: string;
    };
  };
}

interface PlateAppearance {
  id: string;
  battedBallOutcome?: string;
  hitQuality?: string;
  paOutcome?: string;
}

interface PlayResult {
  battedBallOutcome?: string;
  hitQuality?: string;
  paOutcome?: string;
}

export function usePlateAppearances(game: Game | null, refetch: () => void) {
  const [nextPlateAppearance, setNextPlateAppearance] = useState<PlateAppearance | null>(null);
  const [hiddenPlateAppearance, setHiddenPlateAppearance] = useState<PlateAppearance | null>(null);
  const [currentPlateAppearance, setCurrentPlateAppearance] = useState<PlateAppearance | null>(null);
  const [playResult, setPlayResult] = useState<PlayResult | null>(null);

  useEffect(() => {
    if (game) {
      const initialPlateAppearance = game.game.plateAppearances.find(
        (pa) => pa.id === game.game.gameState.currentPlateAppearanceId
      );

      // Check if there is a change in plate appearance to manage hiddenPlateAppearance
      if (initialPlateAppearance && currentPlateAppearance && initialPlateAppearance.id !== currentPlateAppearance.id) {
        const hiddenPA = game.game.plateAppearances.find(
          (pa) => pa.id === currentPlateAppearance.id
        );
        setHiddenPlateAppearance(hiddenPA || null);
      } else {
        setPlayResult({
          battedBallOutcome: initialPlateAppearance?.battedBallOutcome,
          hitQuality: initialPlateAppearance?.hitQuality,
          paOutcome: initialPlateAppearance?.paOutcome,
        });
        setCurrentPlateAppearance(initialPlateAppearance || null);
        setHiddenPlateAppearance(null); // Ensure hiddenPlateAppearance is reset when not needed
      }

      // Set nextPlateAppearance based on updated game data
      const nextPA = game.game.plateAppearances.find(
        (pa) => pa.id === game.game.gameState.nextPlateAppearanceId
      );
      setNextPlateAppearance(nextPA || null);
    }
  }, [game, currentPlateAppearance]);

  // Auto-refetch game state
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 10000);

    return () => clearInterval(interval);
  }, [refetch]);

  return {
    nextPlateAppearance,
    setNextPlateAppearance,
    hiddenPlateAppearance,
    setHiddenPlateAppearance,
    playResult,
    setPlayResult,
    currentPlateAppearance,
    setCurrentPlateAppearance,
  };
}
