<template>
	<!-- 代金券详情 -->
	<view class="voucher-detail-content p-l-34 p-r-34">
		<top-navbar :title="title"></top-navbar>
		<u-gap height="30"></u-gap>
		<u-swiper :list="swiperList" height="300"></u-swiper>
		<view class="flex col-center row-between m-t-20">
			<view class="font-30 text-333 hidden_one" style="width: 90%;">{{voucherDetail.d_name || ''}}</view>
		</view>
		<view class="flex col-center row-between m-t-20 m-b-36">
			<view class="font-28 text-333 hidden_one" style="width: 70%;">
				[所有机构通用]{{voucherDetail.deduction_price || 0}}元代金券</view>
			<view class="font-30 main-color">￥{{voucherDetail.sell_price || 0}}</view>
		</view>
		<view class="">代金券说明：</view>
		<view class="">{{ schoolDetail.d_coupon_desc || voucherDetail.desc || '无'}}</view>
		<view class="">
			<u-parse :html="voucherDetail.content_format" :tag-style="htmlStyle"></u-parse>
		</view>
		<u-gap height="130"></u-gap>
		<view class="flex col-center row-between detail-bottom">
			<view class="flex col-center">
				<view class="m-r-40" v-for="(item,index) in bottomIcon" :key="index" @tap="handleShareShow(index)">
					<image :src="`/static/index/detail-bottom-icon${item.icon}.png`" mode="aspectFit"></image>
					<view class="m-t-6 text-666 font-24">{{item.title}}</view>
				</view>
			</view>
			<view class="main-bg-color text-white buy-voucher-btn radius-50 font-24 text-center"
				@tap="handleShowPayPopup()">购买代金券</view>
		</view>

		<!-- 购买弹窗 -->
		<u-popup class="vip-pay-popup" v-model="payShow" mode="center" width="80%" border-radius="20"
			@close="handleClosePayPopup">
			<u-gap height="46"></u-gap>
			<view class="flex col-center row-between p-l-40 p-r-40">
				<u-icon name="close" color="#666666" size="28" style="visibility: hidden;"></u-icon>
				<view class="font-30">确认订单</view>
				<u-icon name="close" color="#666666" size="28" @tap="handleClosePayPopup()"></u-icon>
			</view>
			<view class="p-l-40 p-r-40 m-t-50">
				<view class="flex col-center row-between pay-body">
					<u-image width="120rpx" height="120rpx" border-radius="10" :src="voucherDetail.cover_image_format"
						mode="aspectFill"></u-image>
					<view class="u-flex-1 m-l-28 pay-top-right">
						<view class="hidden_two title font-30">[所有机构通用]{{voucherDetail.deduction_price || 0}}元代金券</view>
						<view class="price font-32 text-bold">￥{{voucherDetail.sell_price || 0}}</view>
					</view>
				</view>
				<view class="flex col-center row-between m-t-38">
					<view class="">购买数量</view>
					<u-number-box v-model="vipNum" :min="1" @change="handleVipNumChange"></u-number-box>
				</view>
				<view class="flex col-center row-between m-t-38 pay-type-row ">
					<view class="">支付方式</view>
					<view class="font-26 text-666 rela">
						<view class="select-pay-type flex row-center col-center" @tap="showPayType = !showPayType">
							<text class="m-r-6">{{payType[payIdx].title}}</text>
							<u-icon name="arrow-down-fill" color="#999999" size="15"></u-icon>
						</view>
						<view class="abso pay-item" v-if="showPayType" :class="{'animation-slide-top':showPayType}">
							<view class="" v-for="(item,index) in payType" :key="index"
								@tap="handleChangePayType(index)">
								{{item.title}}
							</view>
						</view>
					</view>
				</view>
				<view class="flex col-center row-between m-t-38 total-row">
					<view class="">总计</view>
					<view class="price">￥{{(vipNum * voucherDetail.sell_price).toFixed(2)}}</view>
				</view>
			</view>
			<u-gap height="56"></u-gap>
			<view class="dyan-btn">
				<view class="btn-1">
					<u-button :custom-style="customBtnStyle1" shape="circle" :hair-line="false" @tap="handlePopupPay()">
						立即购买</u-button>
				</view>
			</view>
			<u-gap height="36"></u-gap>
		</u-popup>
		<!-- 分享弹窗 -->
		<share-popup ref="sharePopup" :shareNum="2" shareType="coupon" @onShareType="handleShareInfo"></share-popup>
	</view>
</template>

<script>
	let app = getApp();
	// 分享弹窗
	import sharePopup from '@/components/share-popup/share-popup.vue'
	export default {
		components: {
			sharePopup,
		},
		data() {
			return {
				schoolDetail: {},
				title: '代金券详情',
				swiperList: [],
				htmlStyle: {
					p: `
						margin: 26rpx 0;
						line-height: 46rpx;
						letter-spacing: 2rpx;
						color:#666;
					`,
					img: `
						border-radius: 10rpx;
					`
				},
				bottomIcon: [{
						icon: 1,
						title: '咨询客服'
					},
					{
						icon: 2,
						title: '分享代金券'
					},
				],
				payShow: false,
				vipNum: 1,
				payType: [{
						title: '微信支付'
					},
					{
						title: '支付宝支付'
					},
				],
				showPayType: false,
				payIdx: 0,
				customBtnStyle1: getApp().globalData.customStyle1,
				voucherDetail: {}, //代金券配置
				share_id: 0, //分享人Id,暂时没有
				userInfo: {},
			};
		},
		onLoad(options) {
			if (options.shareId) {
				this.share_id = options.shareId * 1;
			}
			if (options.school_id) {
				this.getOrganSchoolDetail(options.school_id);
			}
			let userInfo = uni.getStorageSync('userInfo');
			if (userInfo) {
				this.userInfo = userInfo;
			}
			this.getVoucherDetail();
		},
		methods: {
		  // 获取机构详情，用来展示自定义代金券说明
			async getOrganSchoolDetail(school_id) {
				const res = await this.$api.getSchoolDetail({
					school_id
				});
				if (res.code == 1) {
					this.schoolDetail = res.data;
				}
			},
			// 获取代金券配置
			async getVoucherDetail() {
				this.swiperList = [];
				const res = await this.$api.getDcoupnConfig();
				if (res.code == 1) {
					this.voucherDetail = res.data;
					this.swiperList.push(res.data.cover_image_format);
				}
			},
			// 点击分享机构
			handleShareShow(index) {
				switch (index) {
					case 0: //咨询客服
						this.$u.route({
							url: '/pages/message/serveDialog/serveDialog',
						})
						break;
					case 1: //分享课程
						this.$refs.sharePopup.handleShowSharePopup(true, 'isVoucher', this.voucherDetail);
						break;
				}
			},
			// 显示支付弹窗
			handleShowPayPopup() {
				this.payShow = !this.payShow;
			},
			// 关闭支付弹窗
			handleClosePayPopup() {
				this.payShow = false;
			},
			// 改变购买数量
			handleVipNumChange(val) {
				this.vipNum = val.value;
			},
			// 切换支付方式
			handleChangePayType(idx) {
				if (this.payIdx == idx) return;
				this.payIdx = idx;
				this.showPayType = false;
			},
			// 弹窗内立即购买
			async handlePopupPay() {
				let location = uni.getStorageSync('location');
				let data = {
					share_id: this.share_id, //分享人id
					city: location.allAddress, //省市区斜线分割
					d_coupon_id: this.voucherDetail.id, //代金券id
					num: this.vipNum, //代金券数量
					pay_way: app.checkPayType(this.payIdx), //支付方式
				}
				const res = await this.$api.sendPay(data);
				console.log()
				if (res.code == 1) {
					if (this.payIdx == 0) {
						this.wxPay(res.data.pay_info);
					} else {
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
					orderInfo: {
						"appid": orderInfo.appid,
						"partnerid": orderInfo.partnerid,
						"noncestr": orderInfo.noncestr,
						"package": orderInfo.package,
						"prepayid": orderInfo.prepayid,
						"timestamp": orderInfo.timestamp,
						"sign": orderInfo.sign
					}, //微信、支付宝订单数据
					success: (res) => {
						this.payShow = !this.payShow;
						uni.showModal({
							title: '支付成功',
							content: '支付成功', //JSON.stringify(res)
							showCancel: false,
							success: async (res) => {

							}
						})
					},
					fail: function(err) {
						uni.showModal({
							title: '支付失败',
							content: '订单支付失败', // +JSON.stringify(err)
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
					success: (res) => {
						console.log('支付成功回调', res)
						this.payShow = !this.payShow;
						uni.showToast({
							title: '支付成功',
							icon: '支付成功',
							showCancel: false,
							success: async (res) => {

							}
						})
					},
					fail: function(err) {
						uni.showModal({
							title: '支付失败',
							content: '订单支付失败', //+ JSON.stringify(err)
							showCancel: false,
							success: (res) => {

							}
						})
					}
				})
			},
			// 点击分享回调
			handleShareInfo(shareType) {
				let data = {
					shareType,
					shareId: this.userInfo.id,
				}
				let encrypt = this.AES.encrypt(JSON.stringify(data), '1234567891234567', '1234567891234567');
				let shareStr = '启明星图代金券分享，复制此链接到启明星图App，' + this.voucherDetail.d_name + '#' + encrypt + '#';
				uni.setClipboardData({
					data: shareStr,
					success: () => { //复制成功的回调函数
						uni.showToast({
							icon: 'none',
							title: '复制分享链接成功！',
							duration: 2000,
						})
					}
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.voucher-detail-content {
		.detail-bottom {
			box-shadow: 0rpx 0rpx 32rpx -14rpx #999;
			background: $uni-bg-color;
			position: fixed;
			width: 100%;
			bottom: 0;
			left: 0;
			padding: 20rpx 34rpx 16rpx 36rpx;

			image {
				width: 34rpx;
				height: 34rpx;
				display: block;
				margin: 0 auto;
			}

			.buy-voucher-btn {
				padding: 15rpx 24rpx;
			}
		}

		.vip-pay-popup {
			.pay-body {
				.pay-top-right {
					.title {
						color: #1f1f1f;
						height: 80rpx;
					}

					.price {
						color: #3077FB;
					}
				}
			}

			.pay-type-row {
				.pay-item {
					left: 0;
					background: $uni-bg-color;
					padding: 8rpx 10rpx;
					width: 220rpx;

					>view {
						margin: 20rpx 0;
					}
				}

				.select-pay-type {
					border: 1px solid #666;
					padding: 8rpx 16rpx;
					border-radius: 6rpx;
					width: 220rpx;
				}
			}

			.total-row {
				.price {
					color: #3077FB;
				}
			}

			.btn-1 {
				padding: 0 88rpx;
			}
		}
	}
</style>
