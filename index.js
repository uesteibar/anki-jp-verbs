import { select, confirm, checkbox } from '@inquirer/prompts'
import { VERBS } from "./src/verbs.js"
import { getDecks, createModel, modelExists, createNote } from "./src/anki.js";
import {
  FORMS
} from "./src/conjugator.js";

import { permutate } from "./src/conjugator.js"


const decks = await getDecks()
const deck = await select({
  message: "📖 Which deck do you want to import verb form flashcards to?",
  choices: decks.map(d => ({
    name: d,
    value: d,
  }))
})

const forms = await checkbox({
  message: "Which verb forms do you want to import?",
  choices: FORMS.map(f => ({name: f.name, value: f})),
});

let cards = (await permutate(VERBS, forms))
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)

console.log(`\I will import a total of ${cards.length} flashcards, for the following forms:
${forms.map(f => `\n- ${f.name}`)}
`)

let shouldContinue = await confirm({ message: `Flashcards will be added to ${deck}. Shall I proceed?` });
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

const runners = cards.map(card => {
  return async () => createNote(card, deck)
})

runners.reduce((p, fn) => p.then(fn), Promise.resolve())
