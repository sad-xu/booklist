<template>
	<div class="all">
		<span>{{msg}}</span>
		<router-link to="/analyse">link to...</router-link>
	</div>
</template>

<script>
	export default {
		name: 'home',
		data() {
			return {
				msg: 'ok'
			}
		},
		created() {
			console.log('oooo')
		},
	}
</script>

<style scoped lang="scss"  type="text/scss" >
	.all {
		background-color: green;
	}
</style>