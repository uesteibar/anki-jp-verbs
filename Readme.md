# Anki verb conjugations

A handy script to generate anki cards for japanese verb conjugations.

![ankideck](https://github.com/uesteibar/anki-jp-verbs/assets/7823996/7d5a2037-63f6-4bc8-b5e7-71045f771dfd)

<img width="478" alt="front" src="https://github.com/uesteibar/anki-jp-verbs/assets/7823996/51d08ed7-2dae-4da3-871b-931a1a7accca">
<img width="478" alt="back" src="https://github.com/uesteibar/anki-jp-verbs/assets/7823996/f869451f-d80e-4756-aa0a-1b77bca16c39">


### Installation

1. Clone the repository
2. Download [jmdict-eng-3.5.0.json.zip](https://github.com/scriptin/jmdict-simplified/releases/tag/3.5.0+20240617121821), unzip and place json into `data/`
3. Install dependencies
    ```
    npm install
    ```
4. Install Anki and Anki-Connect


### Running

You'll need Anki with Anki-Connect up and running.

Then run

```
npm run create-deck
```

And select your preferred options.

You can add your own verbs in `src/verbs.js`

### Currently supported forms

- [x] Present formal (食べます)
- [x] Present informal negative (食べない),
- [x] Past informal (食べた),
- [x] Past informal negative (食べなかった),
- [x] Present formal negative (食べません),
- [x] Past formal (食べました),
- [x] Past formal negative (食べませんでした),
- [x] Te (食べて) form,
- [x] Present continuous informal (食べている),
- [ ] Present continuous informal negative (食べていない),
- [x] Present continuous formal (食べています),
- [ ] Present continuous formal negative (食べていません),
- [ ] Past continuous informal (食べていた),
- [ ] Past continuous informal negative (),
- [ ] Past continuous formal (食べていました),
- [ ] Past continuous formal negative (食べていませんでした),
