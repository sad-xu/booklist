<template>
	<div class="all">
		<h2>{{msg}}</h2>
		<p>
			<router-link to="/">jump to home ...</router-link>
		</p>
		<p>
			<router-link to="/project1">jump to project1 ... </router-link>
		</p>
	</div>
</template>

<script>
	export default {
		name: 'home',
		data() {
			return {
				msg: 'homePage'
			}
		},
		created() {
			console.log('oooo')
		},
	}
</script>

<style scoped lang="scss"  type="text/scss" >
	.all {
		background-color: #fff;
	}
</style>