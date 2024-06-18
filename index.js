import { select, confirm } from '@inquirer/prompts'
import { VERBS } from "./src/verbs.js"
import { getDecks, createModel, modelExists, createNote, createDeck } from "./src/anki.js";
import {
  NEGATIVE,
  PAST,
  PAST_NEGATIVE,
  NEGATIVE_FORMAL,
  PAST_FORMAL,
  PAST_NEGATIVE_FORMAL,
  TE,
} from "./src/conjugator.js";

import { permutate } from "./src/conjugator.js"

const FORMS = [
  TE,
  NEGATIVE,
  PAST,
  PAST_NEGATIVE,
  NEGATIVE_FORMAL,
  PAST_FORMAL,
  PAST_NEGATIVE_FORMAL,
]
let cards = await permutate(VERBS, FORMS)

cards = cards
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)

const decks = await getDecks()

const deck = await select({
  message: "📖 Select the deck to which you want to import verb form flashcards",
  choices: decks.map(d => ({
    name: d,
    value: d,
  }))
})

console.log(`\nImporting a total of ${cards.length} flashcards, for the following forms:
${FORMS.map(f => `\n- ${f.name}`)}
`)

let shouldContinue = await confirm({ message: `Flashcards will be added as sub-decks, one deck per verb form. Shall I proceed?` });
if (!shouldContinue) {
  console.log("\n❌ Alrighty! Cancelling.")
  process.exit()
}

const shouldCreateModel = !(await modelExists())

if (shouldCreateModel) {
  shouldContinue = await confirm({ message: `I will first create a new card model for you. Is that alright?` });
  if (!shouldContinue) {
    console.log("\n❌ Alrighty! Cancelling.")
    process.exit()
  }

  await createModel()
} else {
  console.log("\nModel 'jp-verb-conjugation' already exists. I'll use that.")
}

const formRunners = FORMS.map(f => {
  return async () => createDeck(f, deck)
})
formRunners.reduce((p, fn) => p.then(fn), Promise.resolve())

await new Promise(r => setTimeout(r, 2000));

const runners = cards.map(card => {
  return async () => createNote(card, deck)
})

runners.reduce((p, fn) => p.then(fn), Promise.resolve())
