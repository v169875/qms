<template>
	<view class="pay-type-popup-content">
		<u-popup v-model="payPopupShow" mode="bottom" @close="handleClosePayPopup">
			<u-gap height="33"></u-gap>
			<view class="popup-top flex col-center row-between p-r-20 p-l-20">
				<u-icon name="close" color="#333" size="28" style="visibility: hidden;"></u-icon>
				<view class="text-bold">支付金额</view>
				<u-icon name="close" color="#333" size="28" @tap="payPopupShow = !payPopupShow"></u-icon>
			</view>
			<u-gap height="43"></u-gap>
			<view class="popup-top flex col-center row-between p-r-20 p-l-20">
				<u-icon name="close" color="#333" size="28" style="visibility: hidden;"></u-icon>
				<view class="popup-price text-bold">
					<text class="font-26">￥</text>
					<text class="font-36">{{payPrice || 0}}</text>
				</view>
				<u-icon name="close" color="#333" size="28" style="visibility: hidden;"></u-icon>
			</view>
			<u-gap height="20"></u-gap>
			<view class="pay-type-list">
				<u-cell-group :border="false">
					<u-cell-item :title="item.title" :title-style="titleStyle" :arrow="false" v-for="(item,index) in payTypeList" :key="index" @click="handleChangePayType(index)">
						<image class="m-r-20 pay-icon" slot="icon" :src="`/static/mine/pay-icon${item.id}.png`" mode="aspectFit"></image>
						<view class="pay-right flex col-center row-right">
							<text class="m-r-20 font-30 text-black" v-if="index == 2">{{item.value}}</text>
							<image class="pay-radio-active" v-if="payTypeIdx == index" src="/static/mine/radio-active.png" mode="aspectFit"></image>
							<view class="pay-not-active round" v-else></view>
						</view>
					</u-cell-item>
				</u-cell-group>
			</view>
			<u-gap height="33"></u-gap>
			<view class="dyan-btn">
				<view class="btn-1">
					<u-button :custom-style="customBtnStyle1" shape="circle" :hair-line="false" @click="handleCreateOrder()">立即支付</u-button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		name:"pay-type-popup",
		props:{
			// 是否显示余额
			isShowRemaining:{
				type:Boolean,
				default:true,
			}
		},
		data() {
			return {
				customBtnStyle1:getApp().globalData.customStyle1,
				titleStyle:{
					color:'#333',
					fontWeight:'bold',
				},
				payPopupShow:false,
				payTypeList:[
					{id:1,title:'支付宝'},
					{id:2,title:'微信'},
				],
				payTypeIdx:0,
				payPrice:0, //支付金额
			};
		},
		methods:{
			//显示支付弹窗			显示   支付金额   用户余额
			handleShowPayPopup(show,payPrice){
				this.payPopupShow = show;
				this.payPrice = payPrice;
			},
			// 关闭支付弹窗
			handleClosePayPopup(){
				this.payPopupShow = false;
				this.payPrice = 0;
			},
			// 点击切换支付类型
			handleChangePayType(index){
				if(this.payTypeIdx == index) return;
				this.payTypeIdx = index;
			},
			// 点击支付
			handleCreateOrder(){
				this.$emit('onPayTypeIdx',this.payTypeIdx);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pay-type-popup-content{
		.popup-top{
			.popup-price{
				color: #F11111;
			}
		}
		.pay-type-list{
			.pay-icon{
				width: 59rpx;
				height: 59rpx;
			}
			.pay-right{
				.pay-radio-active,.pay-not-active{
					width: 41rpx;
					height: 41rpx;
				}
				.pay-not-active{
					border: 1px solid #B4B4B4;
				}
			}
		}
	}
</style>