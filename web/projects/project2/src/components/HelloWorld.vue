<template>
  <div class="hello">
    <h2>{{ msg }}</h2>
    <p>
      <router-link to="/project2/hello-project2">jump to project2 - children</router-link>
    </p>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'project2 - hello'
    }
  }
}
</script>