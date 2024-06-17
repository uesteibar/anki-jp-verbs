import godanIchidan from 'godan-ichidan'
import {getVerbConjugation, VerbType, FormName} from "jv-conjugator"

const vtype = v => godanIchidan(v) == "godan" ? VerbType.Godan : VerbType.Ichidan

export const verbType = godanIchidan

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
