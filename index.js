import { negative, past, pastNegative, negativeFormal, pastFormal, pastNegativeFormal, verbType } from "./src/conjugator.js"
import { VERBS } from "./src/verbs.js"
import Kuroshiro from "@sglkc/kuroshiro";
import KuromojiAnalyzer from "@sglkc/kuroshiro-analyzer-kuromoji";

const NEGATIVE = { name: "Present Negative - informal", conjugator: negative }
const PAST = { name: "Past - informal", conjugator: past }
const PAST_NEGATIVE = { name: "Past Negative - informal", conjugator: pastNegative }
const NEGATIVE_FORMAL = { name: "Present Negative - formal", conjugator: negativeFormal }
const PAST_FORMAL = { name: "Past - formal", conjugator: pastFormal }
const PAST_NEGATIVE_FORMAL = { name: "Past Negative - formal", conjugator: pastNegativeFormal }

const conjugations = [
  NEGATIVE,
  PAST,
  PAST_NEGATIVE,
  NEGATIVE_FORMAL,
  PAST_FORMAL,
  PAST_NEGATIVE_FORMAL,
]

const kuroshiro = new Kuroshiro();
await kuroshiro.init(new KuromojiAnalyzer())
const furigana = async text =>
  await kuroshiro.convert(text, {mode:"furigana", to:"hiragana"});

const conjugated = await Promise.all(VERBS.map(v => {
  return Promise.all(conjugations.map(async conjugation => {
    const c = conjugation.conjugator(v.dictionaryForm)

    return {
      ...v,
      tense: conjugation.name,
      conjugation: c,
      furigana: await furigana(c),
      verbType: verbType(v.dictionaryForm)
    }
  }))
}))

console.log(conjugated.flat());
