import { VERBS } from "./src/verbs.js"
import { getDecks } from "./src/anki.js";
import { NEGATIVE, PAST, PAST_NEGATIVE, NEGATIVE_FORMAL, PAST_FORMAL, PAST_NEGATIVE_FORMAL } from "./src/conjugator.js";

import { permutate } from "./src/conjugator.js"

const cards = await permutate(VERBS, [
  NEGATIVE,
  PAST,
  PAST_NEGATIVE,
  NEGATIVE_FORMAL,
  PAST_FORMAL,
  PAST_NEGATIVE_FORMAL,
])

console.log(cards);

console.log(await getDecks());
