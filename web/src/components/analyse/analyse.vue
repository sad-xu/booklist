<template>
	<div class="analyse-wrapper">
		<span>{{msg}}</span>
	</div>
</template>

<script>
	export default {
		name: 'analyse',
		data() {
			return {
				msg: 'ok0'
			}
		},
		created() {

		},
	}
</script>

<style scoped type="text/scss" lang="scss">
	.analyse-wrapper {
		background-color: red;
	}
</style>