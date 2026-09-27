import { useCallback, useEffect, useRef } from "react";
import type { GameState } from "./types";

const SAVE_KEY = "echo_game_save";

export function useGamePersistence(
  state: GameState,
  onLoad: (loaded: GameState) => void,
  onNoSave: () => void,
) {
  const loadedRef = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load saved game when the game starts
  useEffect(() => {
    let cancelled = false;

    try {
      const saved = localStorage.getItem(SAVE_KEY);

      if (cancelled) return;

      loadedRef.current = true;

      if (!saved) {
        onNoSave();
        return;
      }

      const loaded = JSON.parse(saved) as GameState;

      // Don't treat the title screen as an active saved game
      if (!loaded || loaded.phase === "title") {
        onNoSave();
        return;
      }

      onLoad(loaded);
    } catch (error) {
      console.error("Failed to load ECHO save:", error);
      loadedRef.current = true;
      onNoSave();
    }

    return () => {
      cancelled = true;
    };
  }, [onLoad, onNoSave]);

  // Save game whenever the state changes
  const save = useCallback((s: GameState) => {
    if (!loadedRef.current) return;
    if (s.phase === "title") return;

    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
    }

    saveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(s));
      } catch (error) {
        console.error("Failed to save ECHO game:", error);
      }
    }, 800);
  }, []);

  useEffect(() => {
    save(state);

    return () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
      }
    };
  }, [state, save]);

  // Delete saved game when Restart is selected
  const deleteSave = useCallback(async () => {
    localStorage.removeItem(SAVE_KEY);
  }, []);

  return { deleteSave };
}