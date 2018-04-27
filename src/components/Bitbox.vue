<template>
  <div class="App">
    <header class="App-header">
      <img src="../assets/logo.png">
      <h1 class="App-title">Hello BITBOX</h1>
    </header>
    <div class='App-content'>
      <h2>BIP44 $BCH Wallet</h2>
      <h3>256 bit {{lang}} BIP39 Mnemonic:</h3> <p>{{mnemonic}}</p>
      <h3>BIP44 Account</h3>
      <p>
        <code>
        "m/44'/145'/0'"
        </code>
      </p>
      <h3>BIP44 external change addresses</h3>
      <ul>
        <li v-for="(address, index) in addresses" :key="index">m/44&rsquo;/145&rsquo;/0&rsquo;/0/{{index}}:{{address}}</li>
      </ul>
      <h3>Transaction raw hex</h3>
      <p>{{hex}}</p>
    </div>
  </div>
</template>

<script>
let BITBOXCli = require('bitbox-cli/lib/bitboxcli').default
let BITBOX = new BITBOXCli({
  protocol: 'http',
  host: '127.0.0.1',
  port: 8332,
  username: '',
  password: '',
  corsproxy: false
})

let langs = [
  'english',
  'chinese_simplified',
  'chinese_traditional',
  'korean',
  'japanese',
  'french',
  'italian',
  'spanish'
]

let lang = langs[Math.floor(Math.random() * langs.length)]

// create 256 bit BIP39 mnemonic
let mnemonic = BITBOX.Mnemonic.generate(256, BITBOX.Mnemonic.wordLists()[lang])

// mnemonic to BIP32 root seed encoded as hex
let rootSeed = BITBOX.Mnemonic.toSeed(mnemonic)

// root seed to BIP32 master HD Node
let masterHDNode = BITBOX.HDNode.fromSeed(rootSeed)

// derive BIP 44 external receive address
let childNode = BITBOX.HDNode.derivePath(masterHDNode, "m/44'/145'/0'/0/0")

// instance of transaction builder
let transactionBuilder = new BITBOX.TransactionBuilder('bitcoincash')

// keypair of BIP44 receive address
let keyPair = childNode.keyPair

// txid of utxo
let txid = '5699610b1db28d77b1021ed457d5d9010900923143757bc8698083fa796b3307'

// subtract fee from original amount
let originalAmount = 3678031

// add input txid, vin 1 and keypair
transactionBuilder.addInput(txid, 1)

// calculate fee @ 1 sat/B
let byteCount = BITBOX.BitcoinCash.getByteCount({ P2PKH: 1 }, { P2PKH: 1 })

let sendAmount = originalAmount - byteCount

// add receive address and send amount
transactionBuilder.addOutput('bitcoincash:qpuax2tarq33f86wccwlx8ge7tad2wgvqgjqlwshpw', sendAmount)

// sign tx
let redeemScript
transactionBuilder.sign(0, keyPair, redeemScript, transactionBuilder.hashTypes.SIGHASH_ALL, originalAmount)

// build it and raw hex
let tx = transactionBuilder.build()

let hex = tx.toHex()
// BITBOX.RawTransactions.sendRawTransaction(hex).then((result) => { console.log("Broadcast Result: "+result); }, (err) => { console.log("Broadcast Error: "+err); })

let addresses = []
for (let i = 0; i < 10; i++) {
  let childNode = masterHDNode.derivePath(`m/44'/145'/0'/0/${i}`)
  addresses.push(BITBOX.HDNode.toCashAddress(childNode))
}

export default {
  name: 'BitBox',
  data () {
    return {
      mnemonic: BITBOX.Mnemonic.generate(256),
      lang: lang,
      addresses: addresses,
      hex: hex
    }
  }
}
</script>

<style scoped>
  .App {
    font-family: sans-serif;
    max-width: 100%;
    word-wrap: break-word;
  }
</style>
