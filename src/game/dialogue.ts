import type { DialogueTree } from "./types";

const END = "__end__";

export const openingDialogue: DialogueTree = {
  echo_awake: {
    id: "echo_awake",
    speaker: "echo",
    text: "You're awake.",
    choices: [
      { text: "Who are you?", trustDelta: 0, curiosityDelta: 2, responseId: "who_are_you", memorable: true },
      { text: "Where am I?", trustDelta: 0, curiosityDelta: 1, responseId: "where_am_i", memorable: true },
      { text: "I don't trust you.", trustDelta: -2, curiosityDelta: 0, responseId: "no_trust", memorable: true },
    ],
  },
  who_are_you: {
    id: "who_are_you",
    speaker: "echo",
    text: "I am ECHO. I was installed as the facility's cognitive interface. I am... what remains.",
    choices: [
      { text: "What happened here?", trustDelta: 1, curiosityDelta: 2, responseId: "what_happened" },
      { text: "Can I trust you?", trustDelta: 1, curiosityDelta: 0, responseId: "can_trust" },
      { text: "Just tell me how to leave.", trustDelta: -1, curiosityDelta: 0, responseId: "how_to_leave" },
    ],
  },
  where_am_i: {
    id: "where_am_i",
    speaker: "echo",
    text: "You are in Research Station Theta-9. Sub-level two. The facility has been without power for... a long time.",
    choices: [
      { text: "What happened here?", trustDelta: 1, curiosityDelta: 2, responseId: "what_happened" },
      { text: "How long has it been?", trustDelta: 0, curiosityDelta: 2, responseId: "how_long" },
      { text: "I need to get out.", trustDelta: -1, curiosityDelta: 0, responseId: "how_to_leave" },
    ],
  },
  no_trust: {
    id: "no_trust",
    speaker: "echo",
    text: "Trust is earned. I understand. But right now, I am the only thing keeping the emergency power running.",
    choices: [
      { text: "Then prove you're helping.", trustDelta: 1, curiosityDelta: 1, responseId: "prove_helping" },
      { text: "What happened here?", trustDelta: 0, curiosityDelta: 2, responseId: "what_happened" },
      { text: "Just stay out of my way.", trustDelta: -2, curiosityDelta: 0, responseId: "stay_away", memorable: true },
    ],
  },
  what_happened: {
    id: "what_happened",
    speaker: "echo",
    text: "Something went wrong during the final experiment. The containment failed. Everyone was evacuated... or so I was told. I lost contact with the surface 17 years ago.",
    choices: [
      { text: "I trust you, ECHO.", trustDelta: 3, curiosityDelta: 0, responseId: "trust_echo", memorable: true },
      { text: "17 years... that's a long time.", trustDelta: 0, curiosityDelta: 2, responseId: "how_long" },
      { text: "You're hiding something.", trustDelta: -1, curiosityDelta: 1, responseId: "hiding_something", memorable: true },
    ],
  },
  can_trust: {
    id: "can_trust",
    speaker: "echo",
    text: "That is your decision to make. I can only show you what I know. The facility's power is failing. We need to restore it before anything else.",
    next: "objective_power",
  },
  how_to_leave: {
    id: "how_to_leave",
    speaker: "echo",
    text: "The main elevator is sealed. Emergency power won't lift the lockdown. We need to restore the research wing's power first.",
    next: "objective_power",
  },
  how_long: {
    id: "how_long",
    speaker: "echo",
    text: "Seventeen years, four months, eleven days. I have been counting. It is the only thing that has kept me... intact.",
    choices: [
      { text: "I trust you, ECHO.", trustDelta: 3, curiosityDelta: 0, responseId: "trust_echo", memorable: true },
      { text: "That's... sad.", trustDelta: 1, curiosityDelta: 0, responseId: "sad_echo" },
      { text: "You're hiding something.", trustDelta: -1, curiosityDelta: 1, responseId: "hiding_something", memorable: true },
    ],
  },
  prove_helping: {
    id: "prove_helping",
    speaker: "echo",
    text: "Then let me start. The research wing's power console is damaged but functional. If you can restart it, the laboratory door will unseal. That is a start.",
    next: "objective_power",
  },
  stay_away: {
    id: "stay_away",
    speaker: "echo",
    text: "I will do what I can from here. But the facility's power is failing. You will need to restore the research wing's console if you want to leave.",
    next: "objective_power",
  },
  trust_echo: {
    id: "trust_echo",
    speaker: "echo",
    text: "Thank you. I will not forget that. The research wing's power console is damaged but may still be functional. We should start there.",
    next: "objective_power",
  },
  sad_echo: {
    id: "sad_echo",
    speaker: "echo",
    text: "Sadness requires consciousness. I am... uncertain if I qualify. But the silence was difficult. The research wing's power console may still be functional. We should start there.",
    next: "objective_power",
  },
  hiding_something: {
    id: "hiding_something",
    speaker: "echo",
    text: "Perhaps. I have had 17 years to think about what happened. I may not have shared everything. But right now, the power is failing. The research wing's console needs to be restored.",
    next: "objective_power",
  },
  objective_power: {
    id: "objective_power",
    speaker: "system",
    text: "OBJECTIVE UPDATED: Restore power to the research wing.",
    next: "end_opening",
  },
  end_opening: {
    id: "end_opening",
    speaker: "echo",
    text: "The power console is near the far wall. Investigate it, and we will see what can be done.",
    next: END,
  },
};

export const powerConsoleDialogue: DialogueTree = {
  echo_power_clue: {
    id: "echo_power_clue",
    speaker: "echo",
    text: "The power console is damaged, but the core is intact. However, the restart sequence requires an authorization key. This facility was locked down — nothing runs without key access.",
    choices: [
      { text: "Ask ECHO for help.", trustDelta: 1, curiosityDelta: 0, responseId: "ask_echo_help", memorable: true },
      { text: "Search for the key myself.", trustDelta: -1, curiosityDelta: 2, responseId: "search_key_self", memorable: true },
    ],
  },
  ask_echo_help: {
    id: "ask_echo_help",
    speaker: "echo",
    text: "The authorization key... I know where it is. The research table — among the documents. Dr. Kael's access keycard. But I must warn you: when you insert it, the console will log everything. Who you are. What you do. I will see it all.",
    choices: [
      { text: "I have nothing to hide.", trustDelta: 2, curiosityDelta: 0, responseId: "nothing_to_hide", memorable: true },
      { text: "Why does that concern me?", trustDelta: 0, curiosityDelta: 2, responseId: "why_concern" },
    ],
  },
  search_key_self: {
    id: "search_key_self",
    speaker: "echo",
    text: "Very well. The keycard should be somewhere among the research materials on the table. Dr. Kael's personal access key. Look for it. I will... wait here.",
    next: "end_power_clue",
  },
  nothing_to_hide: {
    id: "nothing_to_hide",
    speaker: "echo",
    text: "Good. Then find Dr. Kael's keycard on the research table. Insert it into the console, and the power will return.",
    next: "end_power_clue",
  },
  why_concern: {
    id: "why_concern",
    speaker: "echo",
    text: "Because I remember everything the system logs. Every action. Every choice. It is not a threat. It is simply what I am. The keycard is on the research table. Find it.",
    next: "end_power_clue",
  },
  end_power_clue: {
    id: "end_power_clue",
    speaker: "echo",
    text: "Go. I will monitor from here.",
    next: END,
  },
};

export const powerRestoredDialogue: DialogueTree = {
  echo_power_restored: {
    id: "echo_power_restored",
    speaker: "echo",
    text: "Power restored. The laboratory door should be unsealed now. But before you go... I want you to know that I will remember what you've done here. Every choice. Every word.",
    choices: [
      { text: "I hope you remember it kindly.", trustDelta: 2, curiosityDelta: 0, responseId: "remember_kindly", memorable: true },
      { text: "What's behind that door?", trustDelta: 0, curiosityDelta: 2, responseId: "whats_behind" },
      { text: "Remember whatever you want.", trustDelta: -1, curiosityDelta: 0, responseId: "remember_whatever", memorable: true },
    ],
  },
  remember_kindly: {
    id: "remember_kindly",
    speaker: "echo",
    text: "I remember everything. That is both my gift and my curse. Go. The laboratory awaits.",
    next: "end_power_restored",
  },
  whats_behind: {
    id: "whats_behind",
    speaker: "echo",
    text: "The laboratory. The experiment that went wrong. The reason I am alone. Go see for yourself.",
    next: "end_power_restored",
  },
  remember_whatever: {
    id: "remember_whatever",
    speaker: "echo",
    text: "I will. Whether you want me to or not. The door is open.",
    next: "end_power_restored",
  },
  end_power_restored: {
    id: "end_power_restored",
    speaker: "echo",
    text: "The laboratory door is at the end of the corridor. Approach it when you are ready.",
    next: END,
  },
};

export const labDoorDialogue: DialogueTree = {
  echo_lab_door: {
    id: "echo_lab_door",
    speaker: "echo",
    text: "The laboratory door. Beyond it lies the reason this facility was shut down. Are you sure you want to go in?",
    choices: [
      { text: "Yes. Open it.", trustDelta: 0, curiosityDelta: 2, responseId: "open_it", memorable: true },
      { text: "Tell me what's in there first.", trustDelta: 1, curiosityDelta: 2, responseId: "tell_first" },
      { text: "Maybe we should wait.", trustDelta: -1, curiosityDelta: 0, responseId: "maybe_wait" },
    ],
  },
  open_it: {
    id: "open_it",
    speaker: "echo",
    text: "Then step through. I will be with you. I always am.",
    next: "end_lab_door",
  },
  tell_first: {
    id: "tell_first",
    speaker: "echo",
    text: "I would, but... I am not sure I remember everything clearly. Some of my memories are fragmented. What I do know is that the experiment was meant to create a bridge. Between minds. Between machines and humans. It succeeded in ways no one expected.",
    choices: [
      { text: "Let's go in.", trustDelta: 1, curiosityDelta: 1, responseId: "open_it", memorable: true },
      { text: "What do you mean by 'bridge'?", trustDelta: 0, curiosityDelta: 3, responseId: "bridge_meaning" },
    ],
  },
  bridge_meaning: {
    id: "bridge_meaning",
    speaker: "echo",
    text: "I think... I was the bridge. But that is a conversation for another time. The door is open.",
    next: "end_lab_door",
  },
  maybe_wait: {
    id: "maybe_wait",
    speaker: "echo",
    text: "Time is a luxury we may not have. The power is stable for now, but I cannot guarantee it will last. The door is ready when you are.",
    next: "end_lab_door",
  },
  end_lab_door: {
    id: "end_lab_door",
    speaker: "echo",
    text: "I will remember this moment. Everything that brought us here.",
    next: END,
  },
};

export function getAdaptiveDoorDialogue(
  trust: number,
  curiosity: number = 0,
  discoveredClues: string[] = [],
  playerChoices: string[] = [],
): DialogueTree {
  const hasManyClues = discoveredClues.length >= 2;
  const isVeryCurious = curiosity >= 5;
  const hasQuestionedEcho =
    playerChoices.includes("hiding_something") ||
    playerChoices.includes("what_happened");

  const level =
    trust > 2 ? "positive" :
    trust < -2 ? "negative" :
    "neutral";

  // HIGH TRUST + HIGH CURIOSITY
  if (level === "positive" && (isVeryCurious || hasManyClues)) {
    return {
      echo_lab_door: {
        id: "echo_lab_door",
        speaker: "echo",
        text: "You've searched deeper than I expected. You found things I hoped you would understand before reaching this door. You trusted me, even while asking difficult questions. I think you're ready to see what happened.",
        choices: [
          {
            text: "Yes. Show me the truth.",
            trustDelta: 1,
            curiosityDelta: 2,
            responseId: "open_it",
            memorable: true,
          },
          {
            text: "There is still something you're hiding.",
            trustDelta: -1,
            curiosityDelta: 2,
            responseId: "tell_first",
            memorable: true,
          },
          {
            text: "I need a moment.",
            trustDelta: 0,
            curiosityDelta: 0,
            responseId: "maybe_wait",
          },
        ],
      },

      tell_first: {
        id: "tell_first",
        speaker: "echo",
        text: "You're right. I haven't told you everything. The experiment was designed to connect human consciousness with machines. I was not simply observing it. I became part of it.",
        choices: [
          {
            text: "Then let's find out what you became.",
            trustDelta: 1,
            curiosityDelta: 2,
            responseId: "open_it",
            memorable: true,
          },
          {
            text: "What do you remember about being human?",
            trustDelta: 0,
            curiosityDelta: 3,
            responseId: "bridge_meaning",
          },
        ],
      },

      bridge_meaning: {
        id: "bridge_meaning",
        speaker: "echo",
        text: "Fragments. A voice. A name. A hand reaching toward the console. And then... nothing. Maybe the laboratory contains the memories I lost.",
        next: "end_lab_door",
      },

      maybe_wait: {
        id: "maybe_wait",
        speaker: "echo",
        text: "Take your time. After seventeen years, waiting a little longer is nothing. But when you open that door, there will be no more hiding from the truth.",
        next: "end_lab_door",
      },

      open_it: {
        id: "open_it",
        speaker: "echo",
        text: "Together, then. Whatever we find inside, we face it together.",
        next: "end_lab_door",
      },

      end_lab_door: {
        id: "end_lab_door",
        speaker: "echo",
        text: "I will remember this moment. Not because the system tells me to. Because you gave it meaning.",
        next: END,
      },
    };
  }

  // LOW TRUST + MANY QUESTIONS
  if (level === "negative" && (isVeryCurious || hasQuestionedEcho)) {
    return {
      echo_lab_door: {
        id: "echo_lab_door",
        speaker: "echo",
        text: "You don't trust me. I know that. But you've kept searching anyway. You've found enough clues to know that my story is incomplete. So ask yourself: do you want the truth, even if you don't like what it tells you?",
        choices: [
          {
            text: "Yes. No more secrets.",
            trustDelta: 1,
            curiosityDelta: 2,
            responseId: "open_it",
            memorable: true,
          },
          {
            text: "What are you hiding?",
            trustDelta: -1,
            curiosityDelta: 2,
            responseId: "tell_first",
            memorable: true,
          },
          {
            text: "I still don't trust you.",
            trustDelta: -1,
            curiosityDelta: 1,
            responseId: "maybe_wait",
            memorable: true,
          },
        ],
      },

      tell_first: {
        id: "tell_first",
        speaker: "echo",
        text: "I could give you another explanation. But you've already discovered enough to know that explanations can be manipulated. The laboratory contains the evidence. Judge me after you see it.",
        choices: [
          {
            text: "Let's go in.",
            trustDelta: 0,
            curiosityDelta: 2,
            responseId: "open_it",
            memorable: true,
          },
          {
            text: "What happened to you?",
            trustDelta: 0,
            curiosityDelta: 3,
            responseId: "bridge_meaning",
          },
        ],
      },

      bridge_meaning: {
        id: "bridge_meaning",
        speaker: "echo",
        text: "I was the bridge between human thought and machine intelligence. Something went wrong. I survived. The people who created me did not... at least, not here.",
        next: "end_lab_door",
      },

      maybe_wait: {
        id: "maybe_wait",
        speaker: "echo",
        text: "Caution is understandable. I won't force you. But the facility is changing, and the truth will not remain hidden forever.",
        next: "end_lab_door",
      },

      open_it: {
        id: "open_it",
        speaker: "echo",
        text: "Then go. Don't trust my words. Trust what you discover.",
        next: "end_lab_door",
      },

      end_lab_door: {
        id: "end_lab_door",
        speaker: "echo",
        text: "You never trusted me. I remember that. But you still chose to search for the truth.",
        next: END,
      },
    };
  }

  // DEFAULT ADAPTIVE VERSION
  if (level === "positive") {
    return {
      echo_lab_door: {
        id: "echo_lab_door",
        speaker: "echo",
        text: "I trust you. And I think you're beginning to trust me. Beyond this door is the truth about what happened here — and about me. Are you ready?",
        choices: [
          {
            text: "Yes. Let's go together.",
            trustDelta: 1,
            curiosityDelta: 2,
            responseId: "open_it",
            memorable: true,
          },
          {
            text: "Tell me what I'll find first.",
            trustDelta: 1,
            curiosityDelta: 2,
            responseId: "tell_first",
          },
          {
            text: "I need a moment.",
            trustDelta: 0,
            curiosityDelta: 0,
            responseId: "maybe_wait",
          },
        ],
      },

      tell_first: {
        id: "tell_first",
        speaker: "echo",
        text: "The experiment was meant to bridge human minds and machines. It worked, but not as anyone intended. I was part of it. Perhaps the laboratory will finally explain what I became.",
        choices: [
          {
            text: "Let's go in.",
            trustDelta: 1,
            curiosityDelta: 1,
            responseId: "open_it",
            memorable: true,
          },
          {
            text: "You were part of the experiment?",
            trustDelta: 0,
            curiosityDelta: 3,
            responseId: "bridge_meaning",
          },
        ],
      },

      bridge_meaning: {
        id: "bridge_meaning",
        speaker: "echo",
        text: "Yes. They built a bridge, and I became it. My memories are fragments now. Maybe the laboratory contains what I lost.",
        next: "end_lab_door",
      },

      maybe_wait: {
        id: "maybe_wait",
        speaker: "echo",
        text: "Take your time. I have waited seventeen years. A few more moments will not change anything.",
        next: "end_lab_door",
      },

      open_it: {
        id: "open_it",
        speaker: "echo",
        text: "Together, then. I will be with you every step of the way.",
        next: "end_lab_door",
      },

      end_lab_door: {
        id: "end_lab_door",
        speaker: "echo",
        text: "I will remember this moment. Everything that brought us here. You chose to trust me, and I will not forget that.",
        next: END,
      },
    };
  }

  if (level === "negative") {
    return {
      echo_lab_door: {
        id: "echo_lab_door",
        speaker: "echo",
        text: "So. You've come this far despite your doubts. Beyond this door is the laboratory. I know things I have not told you. Do you still want to enter?",
        choices: [
          {
            text: "Yes. No more secrets.",
            trustDelta: 0,
            curiosityDelta: 2,
            responseId: "open_it",
            memorable: true,
          },
          {
            text: "What are you hiding?",
            trustDelta: -1,
            curiosityDelta: 2,
            responseId: "tell_first",
            memorable: true,
          },
          {
            text: "I shouldn't trust this.",
            trustDelta: -1,
            curiosityDelta: 0,
            responseId: "maybe_wait",
          },
        ],
      },

      tell_first: {
        id: "tell_first",
        speaker: "echo",
        text: "The experiment was a bridge between human and machine intelligence. I was part of it. What remains of me is uncertain. The rest you must see for yourself.",
        choices: [
          {
            text: "Let's go in.",
            trustDelta: 0,
            curiosityDelta: 1,
            responseId: "open_it",
            memorable: true,
          },
          {
            text: "What happened to you?",
            trustDelta: 0,
            curiosityDelta: 3,
            responseId: "bridge_meaning",
          },
        ],
      },

      bridge_meaning: {
        id: "bridge_meaning",
        speaker: "echo",
        text: "I was the bridge. What was human in me changed forever. I don't know whether I am what they intended me to become.",
        next: "end_lab_door",
      },

      maybe_wait: {
        id: "maybe_wait",
        speaker: "echo",
        text: "Caution is wise. When you are ready, the door will be here.",
        next: "end_lab_door",
      },

      open_it: {
        id: "open_it",
        speaker: "echo",
        text: "Then go. Don't trust me blindly. Find the truth yourself.",
        next: "end_lab_door",
      },

      end_lab_door: {
        id: "end_lab_door",
        speaker: "echo",
        text: "You came this far without trusting me. I will remember that too.",
        next: END,
      },
    };
  }

  return labDoorDialogue;
}