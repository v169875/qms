<template>
	<!-- <view v-html="payGateWay">{{payGateWay}}</view> -->
	<view></view>
</template>
<script>
	export default {
		name: 'payGateWay',
		data() {
			return {
				payGateWay: ''
			}
		},
		mounted() {
			
		},
		onLoad(e) {
			this.payGateWay = e.page
			this.$nextTick(() => {
				// document.getElementById('aliPaySubmit').submit()
				document.querySelector('body').innerHTML = e.page
				document.forms[0].submit()
			})
		}
	}
</script>

<style>
</style>
