<template>
	<!-- 结算中心 -->
	<view class="settle-center-content">
		<view class="settle-top">
			<top-navbar :title="title" :background="navbarBg" titleColor="#fff" backColor="#fff"></top-navbar>
			<u-gap height="20"></u-gap>
			<view class="flex-col col-center" v-if="bonusInfo.user_info">
				<u-avatar size="112" :src="bonusInfo.user_info.avatar_format"></u-avatar>
				<view class="font-26 text-white m-t-18">{{bonusInfo.user_info.nickname || '未登录'}}</view>
			</view>
		</view>
		<view class="flex col-center row-around m-l-34 m-r-34 p-t-34 p-b-34 settle-card top-card" v-if="bonusInfo.user_info">
			<view class="text-center">
				<view class="money main-color">{{bonusInfo.already_withdraw_money || '0.00'}}</view>
				<u-gap height="14"></u-gap>
				<view class="title">已提现金额</view>
			</view>
			<view class="center-line"></view>
			<view class="text-center">
				<view class="money main-color">{{bonusInfo.user_info.total_in_money || '0.00'}}</view>
				<u-gap height="14"></u-gap>
				<view class="title">未提现金额</view>
			</view>
		</view>
		<view class="m-t-30 m-b-30 m-l-34 font-30 text-black">总计推广</view>
		<view class="flex col-center row-around m-l-34 m-r-34 p-t-34 p-b-34 settle-card ">
			<view class="text-center">
				<view class="title">金额（元）</view>
				<u-gap height="14"></u-gap>
				<view class="money main-color">{{bonusInfo.total_all_order_money || '0.00'}}</view>
			</view>
			<view class="center-line"></view>
			<view class="text-center">
				<view class="title">订单（单）</view>
				<u-gap height="14"></u-gap>
				<view class="money main-color">{{bonusInfo.total_all_order_count || '0.00'}}</view>
			</view>
			<view class="center-line"></view>
			<view class="text-center">
				<view class="title">结算（元）</view>
				<u-gap height="14"></u-gap>
				<view class="money main-color">{{bonusInfo.total_all_order_money || '0.00'}}</view>
			</view>
		</view>
		<view class="m-t-30 m-b-30 m-l-34 font-30 text-black">本月推广</view>
		<view class="flex col-center row-around m-l-34 m-r-34 p-t-34 p-b-34 settle-card ">
			<view class="text-center">
				<view class="title">金额（元）</view>
				<u-gap height="14"></u-gap>
				<view class="money main-color">{{bonusInfo.month_total_all_order_money || '0.00'}}</view>
			</view>
			<view class="center-line"></view>
			<view class="text-center">
				<view class="title">订单（单）</view>
				<u-gap height="14"></u-gap>
				<view class="money main-color">{{bonusInfo.month_total_all_order_count || '0.00'}}</view>
			</view>
			<view class="center-line"></view>
			<view class="text-center">
				<view class="title">结算（元）</view>
				<u-gap height="14"></u-gap>
				<view class="money main-color">{{bonusInfo.month_total_all_order_money || '0.00'}}</view>
			</view>
		</view>
<!-- 		<view class="bottom-list-body flex flex-wrap m-t-52">
			<u-grid :border="false" :col="3">
				<u-grid-item v-for="(item,index) in salesBottomIcon" :key="index" @tap="handleSalesBottomItem(index)">
					<image :src="`/static/mine/sales/sales-bottom-icon${item.icon}.png`" mode="aspectFit"></image>
					<view class="m-t-20 font-28 text-666">{{item.title}}</view>
				</u-grid-item>
			</u-grid>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:'结算中心',
				navbarBg:{
					background:'rgba(255,255,255,0)'
				},
				avatar:'https://tse1-mm.cn.bing.net/th/id/R-C.d8011b5d28ee607bfa5e427d0ad03b99?rik=eCm54QsjFJ81gQ&riu=http%3a%2f%2fimg2.woyaogexing.com%2f2018%2f01%2f09%2fa03c1358f5fee520!400x400_big.jpg&ehk=Tchj3Y063MGOw03bLmMHcWVT36v4WTVbUFjWdm%2fmH30%3d&risl=&pid=ImgRaw&r=0&sres=1&sresct=1',
				salesBottomIcon:[
					{icon:1,title:'邀请海报'},
					{icon:2,title:'达人排行榜'},
					// {icon:3,title:'我的团队'},
				],
				userInfo:{},
				bonusInfo:{},
			};
		},
		onShow() {
			let userInfo = uni.getStorageSync('userInfo');
			if(userInfo){
				this.userInfo = userInfo;
				this.getBonusMoneyInfo();
			}
		},
		methods:{
			// 获取结算中心页面参数
			async getBonusMoneyInfo(){
				const res = await this.$api.bonus_moneyPageParams();
				if(res.code == 1){
					this.bonusInfo = res.data;
				}
			},
			handleSalesBottomItem(index){
				let url = '';
				switch(index){
					case 0: //邀请海报
						url = '/pages/mine/salesCenter/settleCenter/invitePoster/invitePoster';
						break;
					case 1: //达人排行榜
						url = '/pages/mine/salesCenter/settleCenter/ranking/ranking';
						break;
					case 2: //我的团队
						url = '/pages/mine/salesCenter/settleCenter/mineTeam/mineTeam';
						break;
				}
				this.$u.route({
					url:url,
				})
			},

		}
	}
</script>

<style lang="scss" scoped>
	.settle-center-content{
		.settle-top{
			height:400rpx;
			background: url('@/static/mine/sales/settle-center-top-bg.png') no-repeat center center / cover;
		}
		.top-card{
			margin-top: -50rpx;
			position: relative;
			z-index: 999;
		}
		.settle-card{
			background: $uni-bg-color;
			border-radius: 10rpx;
			box-shadow: 0px 1px 43rpx 0px rgba(68, 111, 251, 0.09);
			.center-line{
				height: 82rpx;
				width: 1rpx;
				background: #999;
			}
			.money{
				font-size: 40rpx;
				font-weight: bold;
			}
			.title{
				font-size: 26rpx;
				color: #666;
			}
		}
		.bottom-list-body{
			margin: 0 26rpx;
			/deep/ .u-grid-item-box{
				padding: 0 !important;
				margin-bottom: 34rpx;
			}
			image{
				width: 105rpx;
				height: 105rpx;
				display: block;
			}
		}

	}
</style>
