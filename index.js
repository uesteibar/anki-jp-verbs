import { negative, past } from "./src/conjugator.js"
import { VERBS } from "./src/verbs.js"
import Kuroshiro from "@sglkc/kuroshiro";
import KuromojiAnalyzer from "@sglkc/kuroshiro-analyzer-kuromoji";

const NEGATIVE = { name: "Present Negative", conjugator: negative }
const PAST = { name: "Past", conjugator: past }

const conjugations = [
  NEGATIVE,
  PAST
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
