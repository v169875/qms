<template>
	<!-- 资金 -->
	<view class="capital-content">
		<top-navbar :title="title"></top-navbar>
		<view class="capital-top flex col-center row-center" v-if="moneyInfo.total_in_money">
			<view class="capital-num text-white">
				<text>￥</text>
				<text>{{moneyInfo.total_in_money || 0}}</text>
			</view>
		</view>
		<u-cell-group v-if="moneyInfo.total_in_money">
			<!-- <u-cell-item title="累计收入" :title-style="titleStyle" :value="moneyInfo.total_in_money + '元' || '0.00元'" :arrow="false"></u-cell-item> -->
			<u-cell-item title="已提现金额" :title-style="titleStyle" :value="moneyInfo.already_withdraw_money + '元' || '0.00元'" :arrow="false"></u-cell-item>
			<u-cell-item title="提现" :title-style="titleStyle" @click="handleCellItem(3)"></u-cell-item>
			<u-cell-item title="最近收支" :title-style="titleStyle" @click="handleCellItem(4)"></u-cell-item>
		</u-cell-group>
		<u-popup class="cash-popup" v-model="cashShow" mode="center" width="80%" border-radius="20" @close="handleCloseCashPopup">
			<u-gap height="46"></u-gap>
			<view class="flex col-center row-between p-l-40 p-r-40">
				<u-icon name="close" color="#666666" size="28" style="visibility: hidden;"></u-icon>
				<view class="font-30">申请提现</view>
				<u-icon name="close" color="#666666" size="28" @tap="handleCloseCashPopup()"></u-icon>
			</view>
			<view class="p-l-40 p-r-40 m-t-50">
				<view class="flex col-center row-between m-t-38 cash-type-row">
					<view class="">提现金额</view>
					<view class="font-26 text-666 flex col-center row-right">
						<u-input v-model="cashNum" type="number" placeholder="请输入提现金额" :clearable="false" height="54" input-align="center" :custom-style="customStyle" :border="true"></u-input>
					</view>
				</view>
				<view class="flex col-center row-between m-t-38 cash-type-row ">
					<view class="">到账方式</view>
					<view class="font-26 text-666 rela">
						<view class="select-cash-type flex row-center col-center" @tap="showCashType = !showCashType">
							<text class="m-r-6">{{cashType[cashIdx].title}}</text>
							<u-icon name="arrow-down-fill" color="#999999" size="15"></u-icon>
						</view>
						<view class="abso cash-item" v-if="showCashType" :class="{'animation-slide-top':showCashType}">
							<view class="" v-for="(item,index) in cashType" :key="index" @tap="handleChangeCashType(index)">
								{{item.title}}
							</view>
						</view>
					</view>
				</view>
				<view class="font-24 text-666 m-t-10 total-row">
					可提现金额￥{{moneyInfo.can_money || 0}}
				</view>
			</view>
			<u-gap height="56"></u-gap>
			<view class="dyan-btn">
				<view class="btn-1">
					<u-button :custom-style="customBtnStyle1" shape="circle" :hair-line="false" @tap="handlePopupCash()">申请提现</u-button>
				</view>
			</view>
			<u-gap height="14"></u-gap>
			<view class="font-24 text-999 m-l-44 m-r-44">
				提现须知：提现金额必须大于10元，管理员审核通过后可提现。
			</view>
			<u-gap height="40"></u-gap>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:'资金',
				titleStyle:{
					fontSize:'28rpx',
					color:'#000',
				},
				customStyle:{
					width:'220rpx',
				},
				customBtnStyle1:getApp().globalData.customStyle1,
				cashShow:false,  //是否显示提现弹窗
				cashNum:'',  // 提现金额
				cashType:[
					{title:'微信'},
					{title:'支付宝'},
				],
				showCashType:false, //提现方式弹窗
				cashIdx:0, //提现方式下标
				moneyInfo:{}, //资金
			};
		},
		onLoad() {
			this.getMoneyPageData();
		},
		methods:{
			// 获取资金页面参数
			async getMoneyPageData(){
				const res = await this.$api.moneyPageParams();
				if(res.code == 1){
					this.moneyInfo = res.data;
				}
			},
			// 点击资金每项
			handleCellItem(type){
				let url = '';
				switch(type){
					case 3: // 提现
						this.handleShowPayPopup();
						return;
						break;
					case 4: // 最近收支
						url = '/pages/mine/salesCenter/capital/latelyIncome/latelyIncome';
						break;
				};
				this.$u.route({
					url:url,
				})
			},
			// 显示支付弹窗
			handleShowPayPopup(){
				this.cashShow = !this.cashShow;
			},
			// 关闭支付弹窗
			handleCloseCashPopup(){
				this.cashShow = false;
        this.showCashType = false;
				this.cashNum = '';
			},
			// 切换支付方式
			handleChangeCashType(idx){
				if(this.cashIdx == idx) return;
				this.cashIdx = idx;
				this.showCashType = false;
			},
			// 弹窗内提现按钮
			async handlePopupCash(){
				if(this.cashNum == ''){
					this.$u.toast(`请输入提现金额`);
					return;
				}
				// if(this.cashNum > this.moneyInfo.total_in_money)
				let data = {
					amount:this.cashNum,
					account:this.cashIdx == 0 ? 2 : 1,
				}
				const res = await this.$api.withdrawStore(data);
				if(res.code == 1){
					this.$u.toast(res.msg);
					this.cashShow = !this.cashShow;
					this.showCashType = false;
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.capital-content{
		.capital-top{
			height: 216rpx;
			background: url('@/static/mine/sales/capital-top-bg.png') no-repeat center center / cover;
			.capital-num{
				>text:first-child{
					font-size: 50rpx;
				}
				>text:last-child{
					font-size: 62rpx;
				}
			}
		}
		
		.cash-popup{
			.cash-type-row{
				/deep/ .u-input{
					border: 1px solid #666 !important;
				}
				.cash-item{
					left: 0;
					background: $uni-bg-color;
					padding: 8rpx 10rpx;
					width: 220rpx;
					z-index: 9999;
					border-radius:10rpx;
					>view{
						margin: 20rpx 0;
					}
				}
				.select-cash-type{
					border: 1px solid #666;
					padding: 8rpx 16rpx;
					border-radius: 6rpx;
					width: 220rpx;
				}
			}
			.total-row{

			}
			.btn-1{
				padding: 0 88rpx;
			}
		}
	}
</style>
