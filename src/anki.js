import { YankiConnect } from 'yanki-connect'

export const getDecks = async () => {
  const client = new YankiConnect({ autoLaunch: true })

  return client.deck.deckNames()
}

export const createModel = async () => {
  const client = new YankiConnect()

  return client.model.createModel({
    modelName: "jp-verb-conjugation",
    inOrderFields: [
      "dictionaryForm",
      "tense",
      "english",
      "conjugation",
      "furigana",
      "verbType"
    ],
    css: `
    .card {
       font-family: "ヒラギノ角ゴ Pro W3", "Hiragino Kaku Gothic Pro", "Noto Sans JP", Osaka, "メイリオ", Meiryo, "ＭＳ Ｐゴシック", "MS PGothic", "MS UI Gothic", sans-serif;
       font-size: 56px;
       text-align: center;
    }

    img {
      max-width: 300px;
      max-height: 250px;
    }

    .mobile img {
      max-width: 50vw;
    }

    /* This part defines the bold color. */
    b, strong {color: #5586cd}

    .hide {
      display: none;
    }
    `,
    cardTemplates: [
      {
        "Name": "Verb conjugation",
        "Front": `
        <div lang="ja">
          {{dictionaryForm}}
          <div id="sentence">
            <hr>
            <div style='font-size: 20px;'>{{tense}}</div>
            <hr>
          </div>
        </div>
        `,
        "Back": `
        <div lang="ja">
          <div id="furigana">
            {{furigana:furigana}}
          </div>

          <div style='font-size: 14px;'>
            <i>{{tense}}</i>
          </div>

          <hr>

          <div style='font-size: 18px; padding-bottom:16px;'>
            {{english}}
          </div>

          <div style='font-size: 14px;'>
            Dict. form: {{dictionaryForm}}
          </div>
          <div style='font-size: 14px;'>
            <i>{{verbType}}</i> verb
          </div>
        </div>
        `
      }
    ]
  })
}

export const modelExists = async () => {
  const client = new YankiConnect()
  const models = await client.model.modelNames()

  return !!models.find(m => m === "jp-verb-conjugation")
}

export const createDeck = async (form, parent) => {
  const client = new YankiConnect()

  const name = `${parent}::${form.name}`

  const decks = await getDecks()

  if (!!decks.find(m => m === name)) return

  console.log(`Creating deck ${name}`)

  return client.deck.createDeck({deck: `${parent}::${form.name}`})
}

export const createNote = async (verb, deck) => {
  const client = new YankiConnect()

  const deckName = `${deck}::${verb.tense}`

  await client.note.addNote({
    note: {
      deckName: deckName,
      modelName: "jp-verb-conjugation",
      fields: {
        dictionaryForm: verb.dictionaryForm,
        tense: verb.tense,
        english: verb.english,
        conjugation: verb.conjugation,
        furigana: verb.furigana,
        verbType: verb.verbType,
      },
      options: {
        allowDuplicate: true,
        duplicateScope: deckName,
      },
      tags: ["jp-verb-conjugations"]
    }
  })
}
