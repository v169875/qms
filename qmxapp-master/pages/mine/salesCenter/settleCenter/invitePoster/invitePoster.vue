<template>
	<!-- 邀请海报 -->
	<view class="invite-poster-content">
		<top-navbar :title="title"></top-navbar>
		<u-gap height="70"></u-gap>
		<view class="invite-title text-center">邀请好友</view>
		<u-gap height="10"></u-gap>
		<view class="invite-sub-title text-center">赚取更多收益</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:'邀请海报',
			};
		}
	}
</script>
<style>
	page{
	}
</style>
<style lang="scss" scoped>
	.invite-poster-content{
		height:100vh;
		background: url('/static/mine/sales/invite-bg.png') no-repeat center center / cover;
		.invite-title{
			font-size: 123rpx;
			font-family: Source Han Sans CN;
			font-weight: 800;
			font-style: italic;
			color: #FFFFFF;
			background: linear-gradient(0deg, #FFE6E0 0%, #FFFFFF 100%);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
		}
		.invite-sub-title{
			font-size: 52rpx;
			font-weight: 600;
			color: #FFFFFF;
			background: linear-gradient(0deg, #FFE6E0 0%, #FFFFFF 100%);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
		}
	}
</style>
