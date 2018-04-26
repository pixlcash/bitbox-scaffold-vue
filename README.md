## BITBOX Scaffold Vue

### Intro

BITBOX scaffolds are basic apps w/ bindings to your local running BITBOX. They allow a developer to hit the ground running and waste no time w/ app set up and configuration.

This scaffold is a Vue app build w/ [Vue.js offical CLI `vue-cli`](https://vuejs.org/v2/guide/installation.html) using the "webpack" template. It already has `BITBOX` instantiated and is ready to roll.

## Setup

1. Download the latest build from [bitbox.earth](https://www.bitbox.earth/) and compare [the checksums](https://github.com/bigearth/keys-n-hashes)
2. Install and start your local BITBOX App
3. [Install `bitbox-cli`](https://www.npmjs.com/package/bitbox-cli) globally
	* `npm install bitbox-cli --global`
4. Scaffold a Vue app w/ BITBOX web bindings
	* `bitbox new hello-bitbox --scaffold vue`
5. Install dependencies
	* `npm install`
6. Start the app
	* `npm start`
7. Open a browser to `http://localhost:8081/`
8. Win

