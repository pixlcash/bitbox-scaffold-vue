<template>
  <div>
    <b-form-textarea
                     v-model="text"
                     placeholder="Enter something"
                     :rows="3"
                     :max-rows="6">
    </b-form-textarea>
    <b-button v-on:click="login">Login</b-button>
  </div>
</template>

<script>
export default {
  name: 'login',

  data () {
    return {text: null}
  },

  methods: {
    login: function (event) {
      this.$parent.key = this.text
    }
  }
}
</script>

<style scoped>

</style>
