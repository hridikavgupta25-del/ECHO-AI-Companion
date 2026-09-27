import type { InteractiveObject } from "./types";

export const roomObjects: InteractiveObject[] = [
  {
    id: "terminal",
    name: "Damaged Terminal",
    description:
      "A computer terminal, its screen cracked and flickering. The casing is scorched. Amid the static, a single line of text pulses repeatedly: LAST SYSTEM LOG — 17 YEARS AGO. The timestamp flickers: September 7, 2009. Whatever happened here ended on that date.",
    echoReactionId: "terminal_reaction",
    echoReaction: "That terminal hasn't been active for 17 years.",
    followUpPlayer: "Then how are you still here?",
    followUpEcho: "I was never turned off.",
    position: { x: 22, y: 55 },
    state: "uninvestigated",
    discoveredClue: "LAST SYSTEM LOG — 17 YEARS AGO",
    clueLabel: "System log dated September 7, 2009",
  },
  {
    id: "lab_door",
    name: "Locked Laboratory Door",
    description:
      "A heavy reinforced door, sealed shut. A red warning light pulses above it. A small interface panel beside the door reads: 'LABORATORY ACCESS — AUTHORIZATION KEY REQUIRED.' The door leads deeper into the facility.",
    echoReactionId: "lab_door_reaction",
    echoReaction: "That door leads to the laboratory. The experiment. It has been sealed since the evacuation.",
    followUpPlayer: "What experiment?",
    followUpEcho:
      "I am not ready to answer that. Not yet. First, we restore power. Then... we will see.",
    position: { x: 78, y: 30 },
    state: "uninvestigated",
  },
  {
    id: "research_table",
    name: "Research Table",
    description:
      "A metal workbench cluttered with abandoned research materials. Dusty documents, data tablets, and scattered tools. Among the documents, a keycard catches the light — marked with 'DR. KAEL — AUTHORIZATION LEVEL 3.' Near the edge, a small cylindrical device pulses with a faint blue glow — a backup power cell.",
    echoReactionId: "research_table_reaction",
    echoReaction: "That table was used for the final experiment preparations. The keycard belongs to Dr. Kael — she led the project. The glowing device is a backup power cell.",
    followUpPlayer: "Dr. Kael... what happened to her?",
    followUpEcho:
      "She evacuated with the others. Or she tried to. I... do not remember clearly. The keycard will unlock the power console's authorization. Take both it and the power cell.",
    position: { x: 50, y: 68 },
    state: "uninvestigated",
    discoveredClue: "DR. KAEL — AUTHORIZATION LEVEL 3",
    clueLabel: "Dr. Kael's keycard — authorization level 3",
  },
  {
    id: "power_console",
    name: "Damaged Power Console",
    description:
      "A large power distribution console, partially destroyed. Sparks flicker from exposed wiring. The main display is dark, but a secondary panel shows minimal emergency power. A card reader glows red beside an empty power cell slot. The console requires both an authorization keycard and a power cell to restart.",
    echoReactionId: "power_console_reaction",
    echoReaction: "The power console. It is damaged, but the core systems are intact. It requires an authorization keycard and a power cell to restart.",
    followUpPlayer: "Where do I find those?",
    followUpEcho:
      "Check the research table. Dr. Kael's keycard and a backup power cell should both be there. Bring them here.",
    position: { x: 72, y: 58 },
    state: "uninvestigated",
  },
  {
    id: "echo_projector",
    name: "Holographic Projection Unit",
    description:
      "A circular emitter built into the floor, surrounded by faintly glowing rings. This is where ECHO's holographic form is projected from. The light pulses in rhythm, as if breathing. Etched into the rim: 'COGNITIVE BRIDGE INTERFACE — THETA-9.'",
    echoReactionId: "echo_projector_reaction",
    echoReaction: "That is my anchor. The projection unit. Without it, I would have no form. No voice.",
    followUpPlayer: "'Cognitive Bridge Interface'... what does that mean?",
    followUpEcho:
      "It means I was not simply installed. I was... grown. Bridged. The details are fragmented. But I am more than software. I am something that was meant to connect minds. I am not sure it worked as intended.",
    position: { x: 40, y: 45 },
    state: "uninvestigated",
    discoveredClue: "ECHO is a Cognitive Bridge Interface, not standard software.",
    clueLabel: "ECHO is a Cognitive Bridge Interface",
  },
];
