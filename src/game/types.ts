export type GamePhase = "title" | "intro" | "playing" | "memory-updated";

export type DialogueChoice = {
  text: string;
  trustDelta: number;
  curiosityDelta: number;
  responseId: string;
  memorable?: boolean;
};

export type DialogueNode = {
  id: string;
  speaker: "echo" | "system" | "narration";
  text: string;
  choices?: DialogueChoice[];
  next?: string;
};

export type InteractiveObject = {
  id: string;
  name: string;
  description: string;
  echoReactionId: string;
  echoReaction: string;
  followUpPlayer: string;
  followUpEcho: string;
  position: { x: number; y: number };
  state: "uninvestigated" | "investigated";
  discoveredClue?: string;
  clueLabel?: string;
};

export type DialogueTree = Record<string, DialogueNode>;

export type TrustLevel = "positive" | "neutral" | "negative";

export type GameState = {
  phase: GamePhase;
  trust: number;
  curiosity: number;
  investigatedObjects: string[];
  playerChoices: string[];
  discoveredClues: string[];
  currentObjective: string;
  powerRestored: boolean;
  hasAuthKey: boolean;
  labUnlocked: boolean;
};
