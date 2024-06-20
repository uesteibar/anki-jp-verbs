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

export const volitional = (verb) => {
  if (verb.endsWith("する")) return verb.replace("する", "しよう")
  const { kanji } = getVerbConjugation({ verb: {kanji: verb}, type: vtype(verb) }, { formName: FormName.Volitional, negative: false, polite: false })
  return kanji
}

export const volitionalFormal = (verb) => {
  if (verb.endsWith("する")) return verb.replace("する", "しましょう")
  const { kanji } = getVerbConjugation({ verb: {kanji: verb}, type: vtype(verb) }, { formName: FormName.Volitional, negative: false, polite: true })
  return kanji
}

export const imperative = (verb) => {
  if (verb.endsWith("する")) return verb.replace("する", "しろ")
  const { kanji } = getVerbConjugation({ verb: {kanji: verb}, type: vtype(verb) }, { formName: FormName.Imperative, negative: false, polite: false })
  return kanji
}

export const continuous = (verb) => {
  return te(verb) + "いる"
}

export const continuousFormal = (verb) => {
  return te(verb) + presentFormal("いる")
}

export const FORMS = [
  { name: "Present - formal", conjugator: presentFormal },
  { name: "Present Negative - informal", conjugator: negative },
  { name: "Past - informal", conjugator: past },
  { name: "Past Negative - informal", conjugator: pastNegative },
  { name: "Present Negative - formal", conjugator: negativeFormal },
  { name: "Past - formal", conjugator: pastFormal },
  { name: "Past Negative - formal", conjugator: pastNegativeFormal },
  { name: "Te Form", conjugator: te },
  { name: "Present Continuous - informal", conjugator: continuous },
  { name: "Present Continuous - formal", conjugator: continuousFormal },
  { name: "Volitional (lets...) - informal", conjugator: volitional },
  { name: "Volitional (lets...) - formal", conjugator: volitionalFormal },
  { name: "Imperative - informal", conjugator: imperative },
]


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


