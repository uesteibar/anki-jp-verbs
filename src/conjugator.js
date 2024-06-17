import pkg from 'kamiya-codec';
const {conjugate} = pkg;

export const negative = (verb) => {
  const [_, negative] = conjugate(verb, "Negative")
  return negative
}

export const past = (verb) => {
  const [past] = conjugate(verb, "Ta")
  return past
}
