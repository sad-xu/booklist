<template>
  <div class="hello">
    <h2>{{ msg }}</h2>
    <p>
      <router-link to="/project1/hello-project1">jump to project1 - children</router-link>
    </p>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'project1 - hello'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
