import { useCallback, useState } from "react";
import type { GameState, GamePhase, TrustLevel } from "./types";

const initialState: GameState = {
  phase: "title",
  trust: 0,
  curiosity: 0,
  investigatedObjects: [],
  playerChoices: [],
  discoveredClues: [],
  currentObjective: "Explore the facility.",
  powerRestored: false,
  hasAuthKey: false,
  labUnlocked: false,
};

export function getTrustLevel(trust: number): TrustLevel {
  if (trust > 2) return "positive";
  if (trust < -2) return "negative";
  return "neutral";
}

export function useGameState() {
  const [state, setState] = useState<GameState>(initialState);

  const setPhase = useCallback((phase: GamePhase) => {
    setState((prev) => ({ ...prev, phase }));
  }, []);

  const recordChoice = useCallback(
    (choiceId: string, trustDelta: number, curiosityDelta: number) => {
      setState((prev) => ({
        ...prev,
        playerChoices: [...prev.playerChoices, choiceId],
        trust: prev.trust + trustDelta,
        curiosity: prev.curiosity + curiosityDelta,
      }));
    },
    [],
  );

  const investigateObject = useCallback(
    (objectId: string, clue?: string) => {
      setState((prev) => {
        if (prev.investigatedObjects.includes(objectId)) return prev;
        return {
          ...prev,
          investigatedObjects: [...prev.investigatedObjects, objectId],
          discoveredClues: clue
            ? [...prev.discoveredClues, clue]
            : prev.discoveredClues,
        };
      });
    },
    [],
  );

  const setObjective = useCallback((objective: string) => {
    setState((prev) => ({ ...prev, currentObjective: objective }));
  }, []);

  const restorePower = useCallback(() => {
    setState((prev) => ({
      ...prev,
      powerRestored: true,
    }));
  }, []);

  const collectAuthKey = useCallback(() => {
    setState((prev) => ({
      ...prev,
      hasAuthKey: true,
    }));
  }, []);

  const unlockLab = useCallback(() => {
    setState((prev) => ({
      ...prev,
      labUnlocked: true,
    }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  const loadState = useCallback((loaded: GameState) => {
    setState(loaded);
  }, []);

  return {
    state,
    setPhase,
    recordChoice,
    investigateObject,
    setObjective,
    restorePower,
    collectAuthKey,
    unlockLab,
    reset,
    loadState,
  };
}
