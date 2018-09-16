<template>
  <div>
    <p>Das ist die Canvas</p>
    <canvas v-on:click="draw" id="canvas" width="160" height="160" style="border:1px solid #BBB;" v-insert-message="picture"></canvas>

    <p v-bind:style="{ backgroundColor: '#'+picture.colors[selectedColorIndex]}">{{selectedColorIndex}}</p>
    <button v-for="(color,index) in picture.colors" v-bind:style="{ backgroundColor: '#'+color,width: '2em',height:'2em'}" v-on:click="selectedColorIndex=index"></button>
    <table>
      <tr v-for="(pallette, i) in palletes" @mouseleave="selectedPallette = -1" @mouseover="selectedPallette = i" v-on:click="choosePallette (pallette, i)" v-bind:style="{backgroundColor: ((choosenPallette==i)?'#FFD700':((selectedPallette==i)?'#DAA520':'white'))}">
        <td>{{pallette.name}}</td>
        <td>
            <div v-for="color in pallette.colors" v-bind:style="{ backgroundColor: '#'+color,width: '1em',height:'1em',float:'left' }"></div>
        </td>
      </tr>
    </table>
    <p>{{loading}}</p>
    <br/>
  </div>
</template>

<script>
import { bus } from '../bus.js'
export default {
  name: 'paint',
  data () {
    return {
      palletes: [],
      loading: 'Loading Color Palette...',
      selectedColorIndex: 0,
      selectedPallette: -1,
      choosenPallette: 0,
      picture:
        {data: '0'.repeat(256),
          colors: [],
          palletteId: ''
        }
    }
  },
  directives: {
    insertMessage: function (canvasElement, picture) {
      let ctx = canvasElement.getContext('2d')
      ctx.clearRect(0, 0, 300, 150)

      for (let x = 0; x < 16; x++) {
        for (let y = 0; y < 16; y++) {
          ctx.fillStyle = '#' + picture.value.colors[parseInt('0x' + picture.value.data.charAt(x + (y * 16)))]
          ctx.fillRect(x * 10, y * 10, 10, 10)
        }
      }
    }
  },
  methods: {
    draw: function (event) {
      let rect = event.target.getBoundingClientRect()
      let x1 = parseInt((event.clientX - rect.left) / 10)
      let y1 = parseInt((event.clientY - rect.top) / 10)
      let index = x1 + (y1 * 16)
      this.picture.data = this.picture.data.substr(0, index) + this.selectedColorIndex.toString(16) + this.picture.data.substr(index + 1)
      bus.$emit('somethingUpdated', this.picture)
    },
    choosePallette: function (event, i) {
      console.log(i)
      console.log(event)
      this.picture.colors = event.colors
      this.choosenPallette = i
      this.picture.palletteId = this.palletes[i].tx
    }
  },
  created () {
    let parentData = this.$parent.data
    if (parentData != null) {
      this.picture = parentData
    }

    let query = {
      request: {
        encoding: {
          b1: 'hex'
        },
        'find': {
          b1: '7e01'
        }
      },
      response: {
        encoding: {
          b2: 'hex'
        }
      }
    }
    let b64 = btoa(JSON.stringify(query))
    let url = 'https://bitdb.network/q/' + b64
    let that = this
    let convert = function (r) {
      let pallette = {
        colors: r.b2.match(/.{1,6}/g),
        name: r.s3,
        tx: r.tx,
        sender: r.senders[0]
      }
      that.palletes.push(pallette)
    }

    let initPallette = function () {
      that.picture.colors = that.palletes[0].colors
      that.picture.palletteId = that.palletes[0].tx
      that.loading = ''
    }
    let header = {
      headers: { key: 'qz89vqmg67zp5ek8h07llug6vcva8y903yylykv4tz' }
    }

    fetch(url, header).then(function (r) {
      return r.json()
    }).then(function (r) {
      r.confirmed.forEach(convert)
      initPallette()
    })
  }
}
</script>

<style scoped>

</style>
