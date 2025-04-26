import { randGender, randPhrase } from '@ngneat/falso';


export function getFantasySaying() {
    const races = randGender();
    const phrase = randPhrase();
    const sayings = [
      `A wise ${races} once said: "${phrase}"`,
      `In the realm of ${races}, adventure awaits!`,
      `The dice are rolling in your favor...`,
      `A new quest begins with a single step.`,
      `The tavern whispers: "${phrase}"`,
      `Magic stirs in the air...`,
      `Heroes are forged in moments like these.`,
    ];
    return sayings[Math.floor(Math.random() * sayings.length)];
  }