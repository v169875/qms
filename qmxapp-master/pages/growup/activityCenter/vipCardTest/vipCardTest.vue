<template>
	<view class="vip-card-test-content m-l-36 m-r-36">
		<top-navbar :title="title"></top-navbar>
		<u-gap height="30"></u-gap>
		<view class="vip-card-test-top">
			<view class="top-image">
				<u-swiper :list="swiperList" height="300"></u-swiper>
				<!-- <u-image height="100%" width="100%" border-radius="20" src="/static/growup/active-center-item.png" mode="aspectFill"></u-image> -->
			</view>
			<view class="flex col-center row-between active-item-bottom m-t-26">
				<view class="font-28 text-black hidden_one u-flex-1">【{{vipTestDetail.t_name || ''}}】</view>
				<view class="vip-price font-30">￥{{vipTestDetail.sell_price || 0}}</view>
			</view>
		</view>
		<view class="m-t-36 m-b-26 text-black font-28">入学体验卡说明：</view>
		<view class="m-t-36 m-b-26 font-28">{{vipTestDetail.desc || ''}}</view>
		<u-parse :html="vipTestDetail.content_format" :tag-style="htmlStyle"></u-parse>
		<u-gap height="20"></u-gap>
		<view class="dyan-btn">
			<view class="btn-1">
				<u-button :custom-style="customBtnStyle1" shape="circle" :hair-line="false" @tap="handleShowPayPopup()">立即购买</u-button>
			</view>
		</view>
		<u-gap height="46"></u-gap>
		<!-- 购买弹窗 -->
		<u-popup class="vip-pay-popup" v-model="payShow" mode="center" width="80%" border-radius="20" @close="handleClosePayPopup">
			<u-gap height="46"></u-gap>
			<view class="flex col-center row-between p-l-40 p-r-40">
				<u-icon name="close" color="#666666" size="28" style="visibility: hidden;"></u-icon>
				<view class="font-30">确认订单</view>
				<u-icon name="close" color="#666666" size="28" @tap="handleClosePayPopup()"></u-icon>
			</view>
			<view class="p-l-40 p-r-40 m-t-50">
				<view class="flex col-center row-between pay-body">
					<u-image width="120rpx" height="120rpx" border-radius="10" :src="buyVipDetail.cover_image_format" mode="aspectFill"></u-image>
					<view class="u-flex-1 m-l-28 pay-top-right">
						<view class="hidden_two title font-30">{{buyVipDetail.t_name}}</view>
						<view class="price font-32 text-bold">￥{{buyVipDetail.sell_price}}</view>
					</view>
				</view>
				<view class="flex col-center row-between m-t-38 pay-type-row">
					<view class="">选择时间</view>
					<view class="font-26 text-666 rela">
						<view class="select-pay-type flex row-center col-center" @tap="showDuraType = !showDuraType;showPayType = false">
							<text class="m-r-6">{{payDuration[duraIdx].title}}</text>
							<u-icon name="arrow-down-fill" color="#999999" size="15"></u-icon>
						</view>
						<view class="abso pay-item" v-if="showDuraType" :class="{'animation-slide-top':showDuraType}">
							<view :class="duraIdx == index ? 'main-color' : ''" v-for="(item,index) in payDuration" :key="index" @tap="handleChangeDuraType(index)">
								{{item.title}}
							</view>
						</view>
					</view>
				</view>
				<view class="flex col-center row-between m-t-38 pay-type-row ">
					<view class="">支付方式</view>
					<view class="font-26 text-666 rela">
						<view class="select-pay-type flex row-center col-center" @tap="showPayType = !showPayType;showDuraType = false">
							<text class="m-r-6">{{payType[payIdx].title}}</text>
							<u-icon name="arrow-down-fill" color="#999999" size="15"></u-icon>
						</view>
						<view class="abso pay-item" v-if="showPayType" :class="{'animation-slide-top':showPayType}">
							<view :class="payIdx == index ? 'main-color' : ''" v-for="(item,index) in payType" :key="index" @tap="handleChangePayType(index)">
								{{item.title}}
							</view>
						</view>
					</view>
				</view>
				<view class="flex col-center row-between m-t-38 total-row">
					<view class="">总计</view>
					<view class="price">￥{{buyVipDetail.sell_price}}</view>
				</view>
			</view>
			<u-gap height="56"></u-gap>
			<view class="dyan-btn">
				<view class="btn-1">
					<u-button :custom-style="customBtnStyle1" shape="circle" :hair-line="false" @tap="handlePopupPay()">立即购买</u-button>
				</view>
			</view>
			<u-gap height="36"></u-gap>
		</u-popup>
	</view>
</template>

<script>
  let app = getApp();
	export default {
		data() {
			return {
				title:'会员体验卡',
				customBtnStyle1:getApp().globalData.customStyle1,
				swiperList:[],
				htmlStyle:{
					p:`
						margin: 26rpx 0;
						line-height: 46rpx;
						letter-spacing: 2rpx;
						color:#666;
					`,
					img:`
						border-radius: 10rpx;
						width:100%;
						margin: 26rpx 0;
					`
				},
				payDuration:[],  //会员卡类型id数组
				// payDuration:[
				// 	{title:'月卡'},
				// 	{title:'季卡'},
				// 	{title:'年卡'},
				// ],
				showDuraType:false,
				duraIdx:0,  //时长下标
				payShow:false,  //是否显示支付弹窗
				vipNum:1,  //购买数量
				payType:[
					{title:'微信支付'},
					{title:'支付宝支付'},
				],
				showPayType:false,
				payIdx:0, //支付方式下标
				vip_type_id:1,  //当前会员卡类型id 
				vipTestDetail:{}, //会员体验卡详情
				buyVipDetail:{}, //购买会员卡详情，独立的，不和会员卡详情冲突
				allAddress:'', //省市区地址  斜杠拼接
			};
		},
		onLoad(options) {
			let location = uni.getStorageSync('location');
			if(location){
				this.allAddress = location.allAddress;
			}
			if(options.vip_type_id){
				this.vip_type_id = options.vip_type_id * 1;
				this.payDuration = JSON.parse(options.vip_ids);
				// 获取进入会员体验卡下标
				this.payDuration.map((item,index)=>{
					if(item.id == this.vip_type_id){
						this.duraIdx = index;
					}
				})
				this.getVipTestDetail(this.vip_type_id);
			}
		},
		methods:{
			// 获取会员体验卡详情
			async getVipTestDetail(id){
        this.swiperList = [];
				let data = {
					id:id,
				};
				const res = await this.$api.getDcoupnConfigDetail(data);
				if(res.code == 1){
					this.vipTestDetail = res.data;
          this.swiperList.push(res.data.cover_image_format);
				}
			},
			// 显示支付弹窗
			handleShowPayPopup(){
				this.buyVipDetail = this.vipTestDetail;
				this.payShow = !this.payShow;
			},
			// 关闭支付弹窗
			handleClosePayPopup(){
				this.payShow = false;
			},
			// 改变购买数量
			handleVipNumChange(val){
				// console.log('tttttttt',val)
			},
			// 切换购买时长
			async handleChangeDuraType(idx){
				if(this.duraIdx == idx) return;
				this.duraIdx = idx;
				this.showDuraType = false;
				let data = {
					id:this.payDuration[idx].id,
				}
				const res = await this.$api.getDcoupnConfigDetail(data);
				if(res.code == 1){
					this.buyVipDetail = res.data;
				}
			},
			// 切换支付方式
			handleChangePayType(idx){
				if(this.payIdx == idx) return;
				this.payIdx = idx;
				this.showPayType = false;
			},
			// 弹窗内立即购买
			async handlePopupPay(){
				this.showDuraType = false;
				this.showPayType = false;
				let data = {
					city:this.allAddress,
					t_type:this.payDuration[this.duraIdx].id,
					pay_way:app.checkPayType(this.payIdx),
				}
				const res = await this.$api.tcoupon_sendPay(data);
				if(res.code == 1){
					if(this.payIdx == 0){
						this.wxPay(res.data.pay_info);
					}else{
						this.aliPay(res.data.pay_info);
					}
				}
			},
			// 微信支付
			wxPay(orderInfo) {
				uni.requestPayment({
					provider: 'wxpay',
					timeStamp: orderInfo.timestamp,
					nonceStr: orderInfo.noncestr,
					package: orderInfo.package,
					signType: "MD5",
					paySign: orderInfo.sign,
			    orderInfo:{
						"appid": orderInfo.appid,
						"partnerid": orderInfo.partnerid,
						"noncestr": orderInfo.noncestr,
						"package": orderInfo.package,
						"prepayid": orderInfo.prepayid,
						"timestamp": orderInfo.timestamp,
						"sign": orderInfo.sign
					}, //微信、支付宝订单数据
					success: (res)=> {
						this.payShow = !this.payShow;
						uni.showModal({
							title: '支付成功',
			        content: '支付成功', //JSON.stringify(res)
							showCancel:false,
							success:async (res) => {
			
							}
						})
					},
					fail: function(err) {
						uni.showModal({
							title: '支付失败',
							content: '订单支付失败',  // +JSON.stringify(err)
							showCancel: false,
							success: (res) => {
			
							}
						})
					}
				})
			},
			// 阿里支付
			aliPay(orderInfo) {
				uni.requestPayment({
					provider: 'alipay',
					orderInfo: orderInfo, //微信、支付宝订单数据
					success: (res)=> {
						console.log('支付成功回调',res)
						this.payShow = !this.payShow;
						uni.showToast({
							title: '支付成功',
							icon: '支付成功',
							showCancel:false,
							success:async (res) => {
								
							}
						})
					},
					fail: function(err) {
						uni.showModal({
							title: '支付失败',
							content: '订单支付失败',  //+ JSON.stringify(err)
							showCancel: false,
							success: (res) => {
			
							}
						})
					}
				})
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	.vip-card-test-content{
		/deep/ p{
			color: #666;
			font-size: 26rpx;
			line-height: 40rpx;
			margin: 30rpx 0;
		}
		/deep/ img{
		}
		.vip-card-test-top{
			.top-image{
				height: 300rpx;
			}
			.vip-price{
				color: #3077FB;
			}
		}
		.vip-pay-popup{
			.pay-body{
				.pay-top-right{
					.title{
						color: #1f1f1f;
						height: 80rpx;
					}
					.price{
						color: #3077FB;
					}
				}
			}
			.pay-type-row{
				.pay-item{
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
				.select-pay-type{
					border: 1px solid #666;
					padding: 8rpx 16rpx;
					border-radius: 6rpx;
					width: 220rpx;
				}
			}
			.total-row{
				.price{
					color: #3077FB;
				}
			}
			.btn-1{
				padding: 0 88rpx;
			}
		}
	}
</style>
