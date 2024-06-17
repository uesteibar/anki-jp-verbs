import { YankiConnect } from 'yanki-connect'

export const getDecks = async () => {
  const client = new YankiConnect({ autoLaunch: true })

  return client.deck.deckNames()
}
