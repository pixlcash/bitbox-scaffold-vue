<template>
  <div>
    <div>{{data}}</div>
    <div>{{key}}</div>

    <router-link to="/">Home</router-link>
    <router-link to="/paint">New</router-link>
    <router-link to="/login">Login</router-link>
    <hr>
    <router-view></router-view>
  </div>
</template>

<script>

import { bus } from './bus.js'
export default {
  name: 'App',
  components: {

  },
  data () {
    return {
      data: null,
      key: null
    }
  },
  methods: {
    addInput: function (data1, data2, data3, ok, count) {
      let BITBOXCli = require('bitbox-cli/lib/bitbox-cli').default
      let BITBOX = new BITBOXCli()
      count(1)
      let transactionBuilder = new BITBOX.TransactionBuilder('bitcoincash')
      count(2)
      // create 256 bit BIP39 mnemonic
      let mnemonic = this.key
      // root seed buffer
      let rootSeed = BITBOX.Mnemonic.toSeed(mnemonic)
      count(3)
      // master HDNode
      let masterHDNode = BITBOX.HDNode.fromSeed(rootSeed, 'bitcoincash')
      count(4)
      let account = BITBOX.HDNode.derivePath(masterHDNode, "m/44'/145'/0'")
      let change = BITBOX.HDNode.derivePath(account, '0/0')
      count(5)
      let cashAddress = BITBOX.HDNode.toCashAddress(change)
      count(10)
      BITBOX.Address.utxo(cashAddress).then((result) => {
        if (result[0]) {
          let vout = result[0].vout
          let txid = result[0].txid
          let originalAmount = result[0].satoshis
          console.log('GELD=')
          console.log(originalAmount)
          console.log('ENDE GELD')
          count(12)
          transactionBuilder.addInput(txid, vout)
          let buf = Buffer.from(data1, 'hex')
          let bild = Buffer.from(data2, 'hex')
          let text = Buffer.from(data3, 'hex')
          let data = BITBOX.Script.encode([BITBOX.Script.opcodes.OP_RETURN, buf, bild, text])
          count(20)
          let byteCount = BITBOX.BitcoinCash.getByteCount({P2PKH: 1}, {P2PKH: 1})
          let sendAmount = originalAmount - byteCount - 200

          transactionBuilder.addOutput(cashAddress, sendAmount)
          transactionBuilder.addOutput(data, 0)
          console.log(transactionBuilder)

          let keyPair = BITBOX.HDNode.toKeyPair(change)
          let redeemScript
          transactionBuilder.sign(0, keyPair, redeemScript, transactionBuilder.hashTypes.SIGHASH_ALL, originalAmount)
          let tx = transactionBuilder.build()
          let hex = tx.toHex()
          count(30)
          console.log('Jetzt kommen die Daten')
          console.log(data)
          console.log('Das waren die Daten')
          count(80)
          BITBOX.RawTransactions.sendRawTransaction(hex).then((result) => {
            ok(result)
            console.log(result)
          }, (err) => {
            console.log(err)
          })
        } else {
          console.log('Arm')
        }
      })
    }
  },
  created () {
    let that = this
    bus.$on('somethingUpdated', function (data) {
      console.log(data)
      that.data = data
    })
  }
}

</script>
