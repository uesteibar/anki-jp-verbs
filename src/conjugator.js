import Kuroshiro from "@sglkc/kuroshiro";
import KuromojiAnalyzer from "@sglkc/kuroshiro-analyzer-kuromoji";
import godanIchidan from 'godan-ichidan'
import {getVerbConjugation, VerbType, FormName} from "jv-conjugator"

const vtype = v => {
  if (v.endsWith("する")) return VerbType.Suru
  if (v === "来る") return VerbType.Kuru
  if (v.endsWith("行く")) return VerbType.Iku

  return godanIchidan(v) == "godan" ? VerbType.Godan : VerbType.Ichidan
}

export const verbType = v => {
  if (v.endsWith("する")) return "irregular"
  if (v === "来る") return "irregular"
  if (v.endsWith("行く")) return "irregular"

  return godanIchidan(v)
}

export const presentFormal = (verb) => {
  if (verb.endsWith("する")) return verb.replace("する", "します")
  const { kanji } = getVerbConjugation({ verb: {kanji: verb}, type: vtype(verb) }, { formName: FormName.Present, polite: true })
  return kanji
}

export const negative = (verb) => {
  if (verb.endsWith("する")) return verb.replace("する", "しない")
  const { kanji } = getVerbConjugation({ verb: {kanji: verb}, type: vtype(verb) }, { formName: FormName.Present, negative: true })
  return kanji
}

export const past = (verb) => {
  if (verb.endsWith("する")) return verb.replace("する", "した")
  const { kanji } = getVerbConjugation({ verb: {kanji: verb}, type: vtype(verb) }, { formName: FormName.Past, negative: false })
  return kanji
}

export const pastNegative = (verb) => {
  if (verb.endsWith("する")) return verb.replace("する", "しません")
  const { kanji } = getVerbConjugation({ verb: {kanji: verb}, type: vtype(verb) }, { formName: FormName.Past, negative: true })
  return kanji
}

export const negativeFormal = (verb) => {
  if (verb.endsWith("する")) return verb.replace("する", "しなかった")
  const { kanji } = getVerbConjugation({ verb: {kanji: verb}, type: vtype(verb) }, { formName: FormName.Present, negative: true, polite: true })
  return kanji
}

export const pastFormal = (verb) => {
  if (verb.endsWith("する")) return verb.replace("する", "しました")
  const { kanji } = getVerbConjugation({ verb: {kanji: verb}, type: vtype(verb) }, { formName: FormName.Past, negative: false, polite: true })
  return kanji
}

export const pastNegativeFormal = (verb) => {
  if (verb.endsWith("する")) return verb.replace("する", "しませんでした")
  const { kanji } = getVerbConjugation({ verb: {kanji: verb}, type: vtype(verb) }, { formName: FormName.Past, negative: true, polite: true })
  return kanji
}

export const te = (verb) => {
  if (verb.endsWith("する")) return verb.replace("する", "して")
  const { kanji } = getVerbConjugation({ verb: {kanji: verb}, type: vtype(verb) }, { formName: FormName.Te, negative: false, polite: false })
  return kanji
}

export const continuous = (verb) => {
  return te(verb) + "いる"
}

export const continuousNegative = (verb) => {
  return te(verb) + negative("いる")
}

export const continuousFormal = (verb) => {
  return te(verb) + presentFormal("いる")
}

export const continuousFormalNegative = (verb) => {
  return te(verb) + negativeFormal("いる")
}

export const PRESENT_FORMAL = { name: "Present - formal", conjugator: presentFormal }
export const NEGATIVE = { name: "Present Negative - informal", conjugator: negative }
export const PAST = { name: "Past - informal", conjugator: past }
export const PAST_NEGATIVE = { name: "Past Negative - informal", conjugator: pastNegative }
export const NEGATIVE_FORMAL = { name: "Present Negative - formal", conjugator: negativeFormal }
export const PAST_FORMAL = { name: "Past - formal", conjugator: pastFormal }
export const PAST_NEGATIVE_FORMAL = { name: "Past Negative - formal", conjugator: pastNegativeFormal }
export const TE = { name: "Te Form", conjugator: te }
export const CONTINUOUS = { name: "Present Continuous", conjugator: continuous }
export const CONTINUOUS_NEGATIVE = { name: "Present Continuous Negative", conjugator: continuousNegative }
export const CONTINUOUS_FORMAL = { name: "Present Continuous - formal", conjugator: continuousFormal }
export const CONTINUOUS_FORMAL_NEGATIVE = { name: "Present Continuous Negative - formal", conjugator: continuousFormalNegative }

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


