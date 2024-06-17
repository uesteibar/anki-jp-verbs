import { negative, past, pastNegative } from "./src/conjugator.js"
import { VERBS } from "./src/verbs.js"
import Kuroshiro from "@sglkc/kuroshiro";
import KuromojiAnalyzer from "@sglkc/kuroshiro-analyzer-kuromoji";

import pkg from 'kamiya-codec';
const {conjugate, conjugateAuxiliaries, verbDeconjugate} = pkg;

console.log(verbDeconjugate("食べった", "食べる"))

const NEGATIVE = { name: "Present Negative", conjugator: negative }
const PAST = { name: "Past", conjugator: past }
const PAST_NEGATIVE = { name: "Past Negative", conjugator: pastNegative }

const conjugations = [
  NEGATIVE,
  PAST,
  PAST_NEGATIVE
]

const kuroshiro = new Kuroshiro();
await kuroshiro.init(new KuromojiAnalyzer())
const furigana = async text =>
  await kuroshiro.convert(text, {mode:"furigana", to:"hiragana"});

const conjugated = await Promise.all(VERBS.flatMap(v => {
  return Promise.all(conjugations.map(async conjugation => {
    const c = conjugation.conjugator(v.dictionaryForm)

    return {
      ...v,
      tense: conjugation.name,
      conjugation: c,
      furigana: await furigana(c),
    }
  }))
}))

console.log(conjugated);
