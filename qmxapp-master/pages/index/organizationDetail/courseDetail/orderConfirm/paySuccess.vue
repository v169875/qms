<template>
	<!-- 支付成功 -->
	<view class="pay-success-content p-l-54 p-r-54">
		<top-navbar :title="title"></top-navbar>
		<u-gap height="30"></u-gap>
		<view class="flex col-center row-center">
			<u-image width="74rpx" height="74rpx" src="/static/index/pay-success-icon.png" mode="aspectFit"></u-image>
		</view>
		<view class="m-t-38 m-b-28 text-333 text-bold font-32 text-center">订单支付成功</view>
		<view class="font-28 text-666 m-b-54 text-center">您可以在{{is_group ? '我的拼团' : '我的'}}订单中查看详情</view>
		<view class="dyan-btn">
			<view class="btn-1">
				<u-button :custom-style="customBtnStyle1" shape="circle" :hair-line="false" @click="handleBack()">完成</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:'支付完成',
				customBtnStyle1:getApp().globalData.customStyle1,
        is_group:false, //是否是拼团订单
			};
		},
		onLoad(options) {
		  if(options.is_group){
        this.is_group = options.is_group == 'true';
      }
		},
		methods:{
			handleBack(){
				this.$u.route({
					type:'back',
					delta:1,
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pay-success-content{
		
	}
</style>
