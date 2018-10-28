<template>
	<div class="analyse-wrapper">
		<h2>{{msg}}</h2>
		<p>
			<router-link to="/">back to home</router-link>
		</p>
	</div>
</template>

<script>
	export default {
		name: 'analyse',
		data() {
			return {
				msg: 'home - analyse'
			}
		},
		created() {

		},
	}
</script>

<style scoped type="text/scss" lang="scss">
	.analyse-wrapper {
		background-color: #fff;
	}
</style>