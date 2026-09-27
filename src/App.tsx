import { useState, useCallback, useEffect, useRef } from "react";
import { useGameState, getTrustLevel } from "./game/useGameState";
import { useGamePersistence } from "./game/useGamePersistence";
import { roomObjects as initialObjects } from "./game/objects";
import {
  openingDialogue,
  powerConsoleDialogue,
  powerRestoredDialogue,
  getAdaptiveDoorDialogue,
} from "./game/dialogue";
import { gameAudio } from "./game/audio";
import type { DialogueNode, DialogueChoice, InteractiveObject, GameState } from "./game/types";

import { TitleScreen } from "./components/TitleScreen";
import { GameRoom } from "./components/GameRoom";
import { DialoguePanel } from "./components/DialoguePanel";
import { ObjectivePanel } from "./components/ObjectivePanel";
import { MemoryPanel } from "./components/MemoryPanel";
import { SettingsPanel } from "./components/SettingsPanel";
import { InvestigationPanel } from "./components/InvestigationPanel";
import { MemoryUpdatedScreen } from "./components/MemoryUpdatedScreen";
import { MemoryFeedback } from "./components/MemoryFeedback";

type DialogueContext =
  | "opening"
  | "power_clue"
  | "power_restored"
  | "lab_door";

const END = "__end__";

export default function App() {
  const {
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
  } = useGameState();

  const [hasSavedGame, setHasSavedGame] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const savedStateRef = useRef<GameState | null>(null);

  const [objects, setObjects] = useState<InteractiveObject[]>(initialObjects);
  const [hasPowerCell, setHasPowerCell] = useState(false);
  const [currentDialogue, setCurrentDialogue] = useState<DialogueNode | null>(null);
  const [dialogueContext, setDialogueContext] = useState<DialogueContext | null>(null);
  const [investigating, setInvestigating] = useState<InteractiveObject | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [echoIntensity, setEchoIntensity] = useState<"idle" | "speaking" | "distressed" | "thinking">("idle");
  const [introStep, setIntroStep] = useState(0);
  const [showMemoryUpdated, setShowMemoryUpdated] = useState(false);
  const [objectiveFlash, setObjectiveFlash] = useState(false);
  const [memoryFeedback, setMemoryFeedback] = useState<string | null>(null);
  const [showAccessGranted, setShowAccessGranted] = useState(false);

  const prevObjective = useRef(state.currentObjective);
  const lastChoiceId = useRef<string | null>(null);

  const { deleteSave } = useGamePersistence(
    state,
    (loaded) => {
      savedStateRef.current = loaded;
      setHasSavedGame(true);
      setIsLoading(false);
    },
    () => {
      setHasSavedGame(false);
      setIsLoading(false);
    },
  );

  const handleContinue = useCallback(() => {
    if (savedStateRef.current) {
      const loaded = savedStateRef.current;
      loadState(loaded);
      setObjects((prev) =>
        prev.map((o) =>
          loaded.investigatedObjects.includes(o.id)
            ? { ...o, state: "investigated" as const }
            : o,
        ),
      );
      setHasPowerCell(loaded.hasAuthKey && !loaded.powerRestored);
      if (loaded.phase === "title") {
        setPhase("playing");
      }
    }
  }, [loadState, setPhase]);

  const getDialogueTree = (context: DialogueContext): Record<string, DialogueNode> => {
    switch (context) {
      case "opening": return openingDialogue;
      case "power_clue": return powerConsoleDialogue;
      case "power_restored": return powerRestoredDialogue;
      case "lab_door":
  return getAdaptiveDoorDialogue(
    state.trust,
    state.curiosity,
    state.discoveredClues,
    state.playerChoices,
  );
    }
  };

  // Flash objective when it changes
  useEffect(() => {
    if (state.currentObjective !== prevObjective.current) {
      setObjectiveFlash(true);
      gameAudio.playTransition();
      const t = setTimeout(() => setObjectiveFlash(false), 2000);
      prevObjective.current = state.currentObjective;
      return () => clearTimeout(t);
    }
  }, [state.currentObjective]);

  // Intro sequence
  useEffect(() => {
    if (state.phase !== "intro") return;
    if (introStep !== 0) return;

    const timer = window.setTimeout(() => {
      setCurrentDialogue({
        id: "sys_intro",
        speaker: "system",
        text: "Emergency power restored.",
        next: "sys_intro_done",
      });
      gameAudio.playPowerUp();
    }, 800);

    return () => clearTimeout(timer);
  }, [state.phase, introStep]);

  const handleStart = useCallback(() => {
    gameAudio.resume();
    gameAudio.playSelect();
    setPhase("intro");
  }, [setPhase]);

  const startOpeningDialogue = useCallback(() => {
    setIntroStep(1);
    setDialogueContext("opening");
    setEchoIntensity("speaking");
    setCurrentDialogue(openingDialogue.echo_awake);
  }, []);

  const handleIntroContinue = useCallback(() => {
    if (currentDialogue?.id === "sys_intro") {
      startOpeningDialogue();
    }
  }, [currentDialogue, startOpeningDialogue]);

  const triggerMemoryFeedback = useCallback((choiceId: string) => {
    const messages: Record<string, string> = {
      who_are_you: "ECHO will remember your curiosity.",
      where_am_i: "ECHO will remember your confusion.",
      no_trust: "ECHO will remember your distrust.",
      trust_echo: "ECHO will remember your trust.",
      stay_away: "ECHO will remember your hostility.",
      hiding_something: "ECHO will remember your suspicion.",
      ask_echo_help: "ECHO will remember you asked for help.",
      search_key_self: "ECHO will remember your independence.",
      nothing_to_hide: "ECHO will remember your openness.",
      remember_kindly: "ECHO will remember your warmth.",
      remember_whatever: "ECHO will remember your indifference.",
      open_it: "ECHO will remember your decision to enter.",
    };
    if (messages[choiceId]) {
      setMemoryFeedback(messages[choiceId]);
    }
  }, []);

  const handleChoice = useCallback(
    (choice: DialogueChoice) => {
      gameAudio.playSelect();
      lastChoiceId.current = choice.responseId;
      recordChoice(choice.responseId, choice.trustDelta, choice.curiosityDelta);

      if (choice.memorable) {
        triggerMemoryFeedback(choice.responseId);
      }

      const tree = getDialogueTree(dialogueContext || "opening");
      const nextNode = tree[choice.responseId];
      if (nextNode) {
        setEchoIntensity("speaking");
        setCurrentDialogue(nextNode);
      }
    },
    [dialogueContext, recordChoice, state.trust, triggerMemoryFeedback],
  );

  const endDialogue = useCallback(() => {
    setCurrentDialogue(null);
    setDialogueContext(null);
    setEchoIntensity("idle");
  }, []);

  const handleDialogueContinue = useCallback(() => {
    if (!currentDialogue) return;

    if (currentDialogue.id === "sys_intro") {
      startOpeningDialogue();
      return;
    }

    if (!dialogueContext) {
      endDialogue();
      return;
    }

    const tree = getDialogueTree(dialogueContext);

    if (currentDialogue.next && currentDialogue.next !== END) {
      const nextNode = tree[currentDialogue.next];
      if (nextNode) {
        if (nextNode.speaker === "system") {
          setEchoIntensity("thinking");
        } else {
          setEchoIntensity("speaking");
        }
        setCurrentDialogue(nextNode);
        return;
      }
    }

    if (currentDialogue.next === END || !currentDialogue.next) {
      switch (currentDialogue.id) {
        case "end_opening":
          setObjective("Restore power to the research wing.");
          setPhase("playing");
          break;
        case "end_power_clue":
          setObjective("Find the keycard and power cell on the research table.");
          break;
        case "end_power_restored":
          setObjective("Proceed to the laboratory door.");
          break;
        case "end_lab_door":
          gameAudio.playMemoryUpdate();
          setShowMemoryUpdated(true);
          setPhase("memory-updated");
          break;
      }
      endDialogue();
      return;
    }

    endDialogue();
  }, [
    currentDialogue,
    dialogueContext,
    setObjective,
    setPhase,
    startOpeningDialogue,
    endDialogue,
    state.trust,
  ]);

  const handleInteract = useCallback((object: InteractiveObject) => {
    gameAudio.playScan();
    setInvestigating(object);
  }, []);

  const handleInvestigationComplete = useCallback(() => {
    if (!investigating) return;

    const objId = investigating.id;

    investigateObject(investigating.id, investigating.discoveredClue);
    setObjects((prev) =>
      prev.map((o) =>
        o.id === objId ? { ...o, state: "investigated" as const } : o,
      ),
    );

    // Research table — pick up power cell AND keycard
    if (objId === "research_table" && !hasPowerCell) {
      setHasPowerCell(true);
      collectAuthKey();
      setObjective("Insert the keycard and power cell into the power console.");
    }

    // Power console WITH both items — restore power
    if (objId === "power_console" && hasPowerCell && state.hasAuthKey && !state.powerRestored) {
      restorePower();
      gameAudio.playPowerUp();
      setHasPowerCell(false);
      setObjects((prev) =>
        prev.map((o) =>
          o.id === "power_console" ? { ...o, state: "investigated" as const } : o,
        ),
      );
      setInvestigating(null);
      setTimeout(() => {
        setDialogueContext("power_restored");
        setEchoIntensity("speaking");
        setCurrentDialogue(powerRestoredDialogue.echo_power_restored);
      }, 700);
      return;
    }

    // Power console WITHOUT both items — ECHO gives clue about auth key
    if (objId === "power_console" && !state.powerRestored) {
      setInvestigating(null);
      setTimeout(() => {
        setDialogueContext("power_clue");
        setEchoIntensity("speaking");
        setCurrentDialogue(powerConsoleDialogue.echo_power_clue);
      }, 700);
      return;
    }

    // Lab door with power restored — unlock then trigger dialogue
    if (objId === "lab_door" && state.powerRestored && !state.labUnlocked) {
      unlockLab();
      gameAudio.playPowerUp();
      setShowAccessGranted(true);
      setObjective("Enter the research laboratory.");
      setInvestigating(null);
      setTimeout(() => {
        setShowAccessGranted(false);
        setDialogueContext("lab_door");
        setEchoIntensity("speaking");
        const doorTree = getAdaptiveDoorDialogue(
  state.trust,
  state.curiosity,
  state.discoveredClues,
  state.playerChoices,
);
        setCurrentDialogue(doorTree.echo_lab_door);
      }, 2500);
      return;
    }

    // Lab door already unlocked — go straight to dialogue
    if (objId === "lab_door" && state.labUnlocked) {
      setInvestigating(null);
      setTimeout(() => {
        setDialogueContext("lab_door");
        setEchoIntensity("speaking");
        const doorTree = getAdaptiveDoorDialogue(
  state.trust,
  state.curiosity,
  state.discoveredClues,
  state.playerChoices,
);
        setCurrentDialogue(doorTree.echo_lab_door);
      }, 700);
      return;
    }

    setInvestigating(null);
  }, [
    investigating,
    investigateObject,
    hasPowerCell,
    state.hasAuthKey,
    state.powerRestored,
    state.labUnlocked,
    state.trust,
    restorePower,
    collectAuthKey,
    unlockLab,
    setObjective,
  ]);

  const handleRestart = useCallback(() => {
    deleteSave();
    reset();
    setObjects(initialObjects);
    setHasPowerCell(false);
    setCurrentDialogue(null);
    setDialogueContext(null);
    setInvestigating(null);
    setSettingsOpen(false);
    setEchoIntensity("idle");
    setIntroStep(0);
    setShowMemoryUpdated(false);
    setMemoryFeedback(null);
    setShowAccessGranted(false);
  }, [reset, deleteSave]);

  const handleMemoryUpdatedContinue = useCallback(() => {
    gameAudio.playSelect();
    setShowMemoryUpdated(false);
    setPhase("playing");
  }, [setPhase]);

  // Sync ECHO visual intensity
  useEffect(() => {
    if (currentDialogue) {
      if (currentDialogue.speaker === "echo") {
        setEchoIntensity("speaking");
      } else if (currentDialogue.speaker === "system") {
        setEchoIntensity("thinking");
      }
    } else if (!investigating) {
      setEchoIntensity("idle");
    }
  }, [currentDialogue, investigating]);

  const trustLevel = getTrustLevel(state.trust);

  return (
    <div className="app">
      {state.phase === "title" && !isLoading && (
        <TitleScreen
          onStart={handleStart}
          onContinue={hasSavedGame ? handleContinue : undefined}
        />
      )}

      {isLoading && (
        <div className="loading-screen">
          <div className="loading-spinner" />
          <div className="loading-text">LOADING...</div>
        </div>
      )}

      {(state.phase === "intro" || state.phase === "playing" || state.phase === "memory-updated") && (
        <>
          <GameRoom
            objects={objects}
            investigatedObjects={state.investigatedObjects}
            hasPowerCell={hasPowerCell}
            hasAuthKey={state.hasAuthKey}
            powerRestored={state.powerRestored}
            labUnlocked={state.labUnlocked}
            onInteract={handleInteract}
            echoIntensity={echoIntensity}
          />

          {/* Top bar */}
          <div className="game-top-bar">
            <div className="game-title-small">ECHO</div>
            <div className={`trust-indicator trust-${trustLevel}`}>
              <span className="trust-indicator-dot" />
              {trustLevel === "positive" ? "TRUST: HIGH" : trustLevel === "negative" ? "TRUST: LOW" : "TRUST: NEUTRAL"}
            </div>
            <button
              className="game-pause-btn"
              onClick={() => {
                gameAudio.playClick();
                setSettingsOpen(true);
              }}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            </button>
          </div>

          {/* Objective panel */}
          <div className="ui-position ui-top-left">
            <div className={objectiveFlash ? "objective-flash" : ""}>
              <ObjectivePanel objective={state.currentObjective} />
            </div>
          </div>

          {/* Memory panel */}
          <div className="ui-position ui-top-right">
            <MemoryPanel
              trust={state.trust}
              curiosity={state.curiosity}
              investigatedCount={state.investigatedObjects.length}
              cluesCount={state.discoveredClues.length}
            />
          </div>

          {/* Interaction hint */}
          {state.phase === "playing" && !currentDialogue && !investigating && !showMemoryUpdated && !showAccessGranted && (
            <div className="interaction-hint">
              <span className="interaction-hint-icon">◈</span>
              CLICK OBJECTS TO INVESTIGATE
            </div>
          )}

          {/* Dialogue panel */}
          {currentDialogue && (
            <div className="ui-position ui-bottom">
              <DialoguePanel
                node={currentDialogue}
                onChoice={handleChoice}
                onContinue={currentDialogue.id === "sys_intro" ? handleIntroContinue : handleDialogueContinue}
                echoActive={echoIntensity === "speaking"}
              />
            </div>
          )}

          {/* Investigation overlay */}
          {investigating && (
            <InvestigationPanel object={investigating} onComplete={handleInvestigationComplete} />
          )}

          {/* Settings overlay */}
          <SettingsPanel
            open={settingsOpen}
            onClose={() => { gameAudio.playClick(); setSettingsOpen(false); }}
            onRestart={handleRestart}
          />

          {/* Memory feedback notification */}
          {memoryFeedback && (
            <MemoryFeedback
              message={memoryFeedback}
              onDone={() => setMemoryFeedback(null)}
            />
          )}

          {/* Access Granted cinematic */}
          {showAccessGranted && (
            <div className="access-granted-overlay">
              <div className="access-granted-content">
                <div className="access-granted-icon">◈</div>
                <div className="access-granted-text">ACCESS GRANTED</div>
                <div className="access-granted-subtitle">Laboratory door unlocked</div>
                <div className="access-granted-scanlines" />
              </div>
            </div>
          )}

          {/* Memory updated screen */}
          {showMemoryUpdated && (
            <MemoryUpdatedScreen
              trust={state.trust}
              curiosity={state.curiosity}
              choicesCount={state.playerChoices.length}
              cluesCount={state.discoveredClues.length}
              onContinue={handleMemoryUpdatedContinue}
            />
          )}
        </>
      )}
    </div>
  );
}
