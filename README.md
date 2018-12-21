# Node Starter Pack

## Installation

1. Node should already be installed on your computer. If not, heads to https://nodejs.org/en/download/
2. Type `npm install` to install the project dependencies

## Usage

Open the _config.json_ file and replace `INSERT_TEAM_KEY_HERE` with your team key.

## Rules

The games rules can be found here: [Goldblain Rules](https://docs.google.com/document/d/1QJRF8SreVT9CrHF2ON60cznwdIRk9ne1sziRTF-SF7A)

You can find a sample "state" object (the object the server return) in the file "sample-state.json". More details can be found here [Technical docs](https://docs.google.com/document/d/1TS1HFEmIKUkiG5jtMwx0NtZh-GVs0VHTejPSZGezOIk)

You can watch some previous match here: http://vind-legacy.thegrid.red/ (ps: this version does not contain spike)

### Movement Helper

The coord system is a bit tricky to understand, in the file "movement-helper.md" there is a little guide to understand and save you time.

## VS Code

### Debugging

You can debug (with breakpoin and all) with the debug configuration "Debug bot in test game"

### Editor config

If you use VS code and install the prettier extension, the worspace settings have some settings to quickstart the coding.

### Training

Simply type `npm test` or `node bot.js -t 1 config.json` to run your bot in training mode. This will start a new game on a random map with 3 bots moving randomly.
It will also open your default browser to the game address.

You can also use custom maps by using the `map` parameter. E.g., `node bot.js -t 1 --map m1 config.json`.

You can also specify the number of turns by using the `turns` parameter. E.g., `node bot.js -t 1 --turns 50 config.json` to use game of 50 turns.

The `t` parameter specify the number of runs, should always be 1.

You can kill the run at any moment with a _SIGINT_

## Evaluation Round

Be sure to be ready for the evaluation round.

We will provide you with a gameId that you'll need to queue for a game.

Replace `INSERT_GAME_ID_HERE` with the gameId in `node bot.js -a --id INSERT_GAME_ID_HERE config.json`

Don't leave the game or your bot will stay at its emplacement for the rest of the game.

## Additional Informations

The map parsing is already done for you. Feel free to modify it if you need to.

The files in the **client** folder shouldn't be modified. If you do modify them, we won't be responsible of what happens.

Have fun!
