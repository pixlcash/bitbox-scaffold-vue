<template>
  <div class="container">
    <b>Mnemonic:</b><br>{{mnemonic}}
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

export default {
  name: 'BitBox',
  data () {
    return {
      mnemonic: BITBOX.Mnemonic.generate(256)
    }
  }
}
</script>

<style scoped>
  .container {
    text-align: left;
  }
</style>
