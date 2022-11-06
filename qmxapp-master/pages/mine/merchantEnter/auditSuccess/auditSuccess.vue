<template>
	<!-- 审核通过 -->
	<view>
		<top-navbar :title="title" :isShowBorder="true"></top-navbar>
		<u-gap height="63"></u-gap>
		<u-image style="margin: 0 auto;" width="116rpx" height="116rpx" src="/static/mine/audit-success-icon.png" mode="aspectFit"></u-image>
		<u-gap height="41"></u-gap>
		<view class="font-30 text-center text-bold">审核通过</view>
		<u-gap height="30"></u-gap>
		<view class="font-28 text-center m-b-40">恭喜入驻成功</view>
		<u-gap height="50"></u-gap>
		<view class="dyan-btn">
			<view class="btn-1">
				<u-button :custom-style="customBtnStyle1" shape="circle" :hair-line="false" @click="handleBindAccount()">去绑定企业账号</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:'审核通过',
				customBtnStyle1:getApp().globalData.customStyle1,
			};
		},
		methods:{
			// 绑定企业账号
			handleBindAccount(){
				this.$u.route({
					url:'/pages/mine/merchantEnter/auditSuccess/bindAccount/bindAccount',
				})
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
