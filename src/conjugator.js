import pkg from 'kamiya-codec';
const {conjugate, conjugateAuxiliaries, verbDeconjugate} = pkg;

export const negative = (verb) => {
  const [_, negative] = conjugate(verb, "Negative")
  return negative
}

export const past = (verb) => {
  const [past] = conjugate(verb, "Ta")
  return past
}

export const pastNegative = (verb) => {
  const [past] = conjugateAuxiliaries(verb, ["Nai"], "Ta")
  return past
}
