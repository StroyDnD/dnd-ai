import { randPhrase } from '@ngneat/falso';

const races = [
  'Elf',
  'Dwarf',
  'Orc',
  'Human',
  'Dragonborn',
  'Tiefling',
  'Halfling',
  'Gnome',
  'Aasimar',
  'Genasi',
]
export function getFantasySaying() {
    const race = races[Math.floor(Math.random() * races.length)];
    const phrase = randPhrase();
    const sayings = [
      `A wise ${race} once said: "${phrase}"`,
      `In the realm of ${race}, adventure awaits!`,
      `The dice are rolling in your favor...`,
      `A new quest begins with a single step.`,
      `The tavern whispers: "${phrase}"`,
      `Magic stirs in the air...`,
      `Heroes are forged in moments like these.`,
    ];
    return sayings[Math.floor(Math.random() * sayings.length)];
  }