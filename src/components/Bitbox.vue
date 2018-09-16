<template>
  <div class="App">

      <ul>
        <li v-for="(address, index) in addresses" :key="index">m/44&rsquo;/145&rsquo;/0&rsquo;/0/{{index}}:{{address}}
        </li>
      </ul>
    <button v-on:click="sende">Sende</button>
    <button v-on:click="sendeBild">Sende</button>

  </div>
</template>

<script>

export default {
  name: 'BitBox',
  data () {
    return {
      addresses: []
    }
  },

  methods: {
    sende: function (event) {
      // addInput('7e01','0000007e7e7ebebebeffffff7e0000fe0000047e0006ff04ffff047e7e0000007e0000ff7e007efe00ff047e7e06ffff','Windows 3.11')
    },

    sendeBild: function (event) {
      let BITBOXCli = require('bitbox-cli/lib/bitbox-cli').default
      let BITBOX = new BITBOXCli()

      let mnemonic = this.$parent.key
      let rootSeed = BITBOX.Mnemonic.toSeed(mnemonic)

      let masterHDNode = BITBOX.HDNode.fromSeed(rootSeed, 'bitcoincash')

      for (let i = 0; i < 10; i++) {
        let childNode = masterHDNode.derivePath(`m/44'/145'/0'/0/${i}`)
        this.addresses.push(BITBOX.HDNode.toCashAddress(childNode))
      }

    //    addInput('7e02', this.data.palletteId, this.data.data)
    }

  }
}

</script>
