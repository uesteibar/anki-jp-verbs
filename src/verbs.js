import Kuroshiro from "@sglkc/kuroshiro";
import KuromojiAnalyzer from "@sglkc/kuroshiro-analyzer-kuromoji";
import {readingBeginning, kanjiBeginning, setup as setupJmdict} from 'jmdict-simplified-node';

const verbs = `
する
食べる
行く
来る
見る
聞く
話す
書く
言う
分かる
終わる
飲む
遊ぶ
泳ぐ
作る
使う
働く
やる
寝る
会う
起きる
終わる
開ける
閉める
帰る
思う
教える
知る
入る
入れる
出る
立つ
座る
歩く
笑う
歌う
踊る
着る
脱ぐ
貸す
借りる
待つ
急ぐ
持つ
死ぬ
生きる
忘れる
降りる
できる
切る
要る
`.split("\n").map(w => w.trim()).filter(w => w != "")

const jmdictPromise = setupJmdict('my-jmdict-simplified-db', 'data/jmdict-eng-3.5.0.json')
const {db} = await jmdictPromise;

const translate = async text => {
  const fn = ( Kuroshiro.Util.hasKanji(text) ? kanjiBeginning : readingBeginning)
  const [result] = await fn(db, text, 1);

  return result.sense[0].gloss.map(g => g.text).join(", ")
}

export const VERBS = await Promise.all(verbs.map(async v => {
  const translation = await translate(v)

  return {
    dictionaryForm: v,
    english: translation,
  }
}))
