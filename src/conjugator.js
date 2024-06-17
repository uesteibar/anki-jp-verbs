import Kuroshiro from "@sglkc/kuroshiro";
import KuromojiAnalyzer from "@sglkc/kuroshiro-analyzer-kuromoji";
import godanIchidan from 'godan-ichidan'
import {getVerbConjugation, VerbType, FormName} from "jv-conjugator"

const vtype = v => godanIchidan(v) == "godan" ? VerbType.Godan : VerbType.Ichidan

export const verbType = godanIchidan

// TODO: add exceptions like する

export const negative = (verb) => {
  const { kanji } = getVerbConjugation({ verb: {kanji: verb}, type: vtype(verb) }, { formName: FormName.Present, negative: true })
  return kanji
}

export const past = (verb) => {
  const { kanji } = getVerbConjugation({ verb: {kanji: verb}, type: vtype(verb) }, { formName: FormName.Past, negative: false })
  return kanji
}

export const pastNegative = (verb) => {
  const { kanji } = getVerbConjugation({ verb: {kanji: verb}, type: vtype(verb) }, { formName: FormName.Past, negative: true })
  return kanji
}

export const negativeFormal = (verb) => {
  const { kanji } = getVerbConjugation({ verb: {kanji: verb}, type: vtype(verb) }, { formName: FormName.Present, negative: true, polite: true })
  return kanji
}
export const pastFormal = (verb) => {
  const { kanji } = getVerbConjugation({ verb: {kanji: verb}, type: vtype(verb) }, { formName: FormName.Past, negative: false, polite: true })
  return kanji
}

export const pastNegativeFormal = (verb) => {
  const { kanji } = getVerbConjugation({ verb: {kanji: verb}, type: vtype(verb) }, { formName: FormName.Past, negative: true, polite: true })
  return kanji
}

export const NEGATIVE = { name: "Present Negative - informal", conjugator: negative }
export const PAST = { name: "Past - informal", conjugator: past }
export const PAST_NEGATIVE = { name: "Past Negative - informal", conjugator: pastNegative }
export const NEGATIVE_FORMAL = { name: "Present Negative - formal", conjugator: negativeFormal }
export const PAST_FORMAL = { name: "Past - formal", conjugator: pastFormal }
export const PAST_NEGATIVE_FORMAL = { name: "Past Negative - formal", conjugator: pastNegativeFormal }

export const permutate = async (verbs, conjugations) => {
  const kuroshiro = new Kuroshiro();
  await kuroshiro.init(new KuromojiAnalyzer())
  const furigana = async text =>
    await kuroshiro.convert(text, {mode:"furigana", to:"hiragana"});

  return (await Promise.all(verbs.map(v => {
    return Promise.all(conjugations.map(async conjugation => {
      const c = conjugation.conjugator(v.dictionaryForm)

      return {
        ...v,
        tense: conjugation.name,
        conjugation: c,
        furigana: await furigana(c),
        verbType: verbType(v.dictionaryForm),
      }
    }))
  }))).flat()
}


