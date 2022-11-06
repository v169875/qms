<template>
	<!-- 订单确认 -->
	<view class="order-confirm-content">
		<top-navbar :title="title"></top-navbar>
		<u-gap height="30"></u-gap>
		<view class="goods-info flex m-l-36 m-r-36 p-b-28">
			<u-image width="154rpx" height="154rpx" border-radius="6" :src="courseDetail.classes_cover_image_format"
				mode="aspectFill"></u-image>
			<view class="u-flex-1 m-l-16">
				<view class="hidden_two font-30 goods-title">{{courseDetail.classes_name || ''}}</view>
				<view class="flex col-center row-between m-t-28">
					<view class="main-color font-32 text-bold">{{courseDetail.classes_current_price}}</view>
					<!-- 拼团订单禁止修改数量 -->
					<u-number-box :min="1" v-model="value" @change="valChange" :disabled="is_group"></u-number-box>
				</view>
			</view>
		</view>
		<u-cell-group class="order-info">
			<!-- <u-cell-item title="代金券" :title-style="titleStyle" :arrow="false">
				<view class="font-26 text-666 rela flex col-center row-right order-info-item">
					<view class="select-pay-type flex row-center col-center" @tap="voucherShow = !voucherShow;payTypeShow = false">
						<text class="m-r-6">{{voucherIdx != null ? voucherTitle : '请选择代金券'}}</text>
						<u-icon name="arrow-down-fill" color="#999999" size="15"></u-icon>
					</view>
					<view class="abso pay-item" v-if="voucherShow" :class="{'animation-slide-top':voucherShow}">
						<view class="" v-for="(item,index) in voucherList" :key="index" @tap="handleChangeVoucher(index)">
							￥{{item.deduction_price}}
						</view>
					</view>
				</view>
			</u-cell-item> -->
			<u-cell-item title="支付方式" :title-style="titleStyle" :arrow="false">
				<view class="font-26 text-666 rela flex col-center row-right order-info-item">
					<view class="select-pay-type flex row-center col-center"
						@tap="payTypeShow = !payTypeShow;voucherShow = false">
						<text class="m-r-6">{{payTypeIdx != null ? payTypeTitle : '选择支付方式'}}</text>
						<u-icon name="arrow-down-fill" color="#999999" size="15"></u-icon>
					</view>
					<view class="abso pay-item" v-if="payTypeShow" :class="{'animation-slide-top':payTypeShow}">
						<view class="" v-for="(item,index) in payTypeList" :key="index"
							@tap="handleChangePayType(index)">
							{{item.title}}
						</view>
					</view>
				</view>
			</u-cell-item>
			<u-cell-item title="验票" :title-style="titleStyle" :arrow="false">
				<view class="flex col-center row-right">
					<view class="flex col-center">
						<u-icon name="checkmark-circle" color="#3077FB" size="28"></u-icon>
						<view class="text-333 m-l-14">现场验票</view>
					</view>
				</view>
			</u-cell-item>
			<u-cell-item title="备注" :title-style="titleStyle" :arrow="false">
				<view class="flex col-center row-right m-l-20">
					<u-input v-model="remark" :clearable="false" input-align="right" placeholder="请输入备注说明"
						placeholder-style="text-align:right;"></u-input>
				</view>
			</u-cell-item>
			<u-cell-item title="姓名" :title-style="titleStyle" :arrow="false">
				<view class="flex col-center row-right m-l-20">
					<u-input v-model="username" :clearable="false" input-align="right" placeholder="请输入姓名"
						placeholder-style="text-align:right;"></u-input>
				</view>
			</u-cell-item>
			<u-cell-item title="手机号" :title-style="titleStyle" :arrow="false">
				<view class="flex col-center row-right m-l-20">
					<u-input v-model="phone" type="number" maxlength="11" :clearable="false" input-align="right"
						placeholder="请输入手机号" placeholder-style="text-align:right;"></u-input>
				</view>
			</u-cell-item>
			<u-cell-item v-if="addressList && addressList.length > 0" title="收货地址" :title-style="titleStyle" :arrow="false" @click="showAddress">
				<view>
					<span>{{slectAddress}}</span>
					<u-select
						v-model="isShowAddress"
						:list="addressList"
						value-name="value"
						label-name="label"
						@confirm="confirmAddress"
					></u-select>
				</view>
			</u-cell-item>
			<view v-else>
				<span class="add-address" @click="goToAddress">点击去添加收货地址</span>
			</view>
		</u-cell-group>
		<view class="flex col-center row-between bottom-order-confirm">
			<view class="">
				<text class="text-666 font-28">合计：</text>
				<text class="main-color font-32 text-bold">￥{{totalPrice}}</text>
			</view>
			<view class="flex col-center right-btn text-white">
				<view class="gray-btn radius-50" @tap="handleBack()">返回</view>
				<view class="m-l-16 blue-btn main-bg-color radius-50" @tap="handleSubmit()">立即付款</view>
			</view>
		</view>
	</view>
</template>

<script>
	let app = getApp();
	export default {
		data() {
			return {
				// 收货地址相关
				slectAddress:'',
				isShowAddress:false,
				addressId:'',
				addressList:[],
				title: '确认订单',
				value: 1,
				titleStyle: {
					fontSize: '30rpx',
					color: '#333',
					fontWeight: 'bold',
				},
				// 优惠券选择参数
				voucherList: [],
				voucherIdx: null,
				voucherTitle: '',
				voucherShow: false,
				// 支付方式选择参数
				payTypeList: [{
						title: '微信支付'
					},
					{
						title: '支付宝支付'
					},
				],
				payTypeIdx: null,
				payTypeTitle: '',
				payTypeShow: false,
				remark: '', //备注内容
				username: '', //用户姓名
				phone: '', //手机号
				classes_id: null, //课程id
				courseDetail: {}, //课程详情
				listQuery: {
					page: 1,
					limit: 10,
					status: 1,
				},
				isLoad: false,
				share_id: 0, //分享人id
				location: {}, //定位信息
				is_group: false, //是否拼团订单，false 不是 ，true是
			};
		},
		computed: {
			totalPrice: function() {
				let num = this.courseDetail.classes_current_price * this.value
				return num.toFixed(2)
			}
		},
		onShow(){
			this.getAddressList()
		},
		onLoad(options) {
			if (options.classes_id) {
				this.classes_id = options.classes_id * 1;
				this.getCourseDetail(this.classes_id);
				let location = uni.getStorageSync('location');
				if (location) {
					this.location = location;
				}
				// this.getMineDcouponList();
			}
			if (options.share_id) {
				this.share_id = options.share_id * 1;
				console.log('进入页面获取分享人id', this.share_id)
			}
			if (options.is_group) {
				this.is_group = options.is_group == 'true';
			}
		},
		methods: {
			goToAddress(){
				console.log('点击')
				this.$u.route({
					url: 'pages/mine/integralCenter/takeAddress/takeAddress',
					params: {}
				})
			},
			async getAddressList() {
				const res = await this.$api.getAddressList({
					'field':true
				});
				if (res.code == 1) {
					this.addressList = res.data
					// if(this.addressList.length > 0)
					// {
					// 	this.addressId = this.addressList[0].value
					// 	this.slectAddress = this.addressList[0].label
					// }
				}
			},
			confirmAddress(e){
				this.slectAddress = e[0].label
				this.addressId = e[0].value
			},
			showAddress(){
				this.isShowAddress = !this.isShowAddress
			},
			// 获取我的代金券  去掉代金券
			async getMineDcouponList() {
				if (this.isLoad) return;
				this.isLoad = true;
				const res = await this.$api.getDcouponList(this.listQuery);
				if (res.code == 1) {
					if (res.data.data.length > 0) {
						this.voucherList = this.voucherList.concat(res.data.data);
						this.listQuery.page++;
						this.isLoad = false;
					} else {
						this.isLoad = false;
					}
				}
			},
			// 获取课程详情
			async getCourseDetail(classes_id) {
				let data = {
					classes_id: classes_id,
				};
				const res = await this.$api.getClassesDetail(data);
				if (res.code == 1) {
					this.courseDetail = res.data;
				}
			},
			// 改变商品数量
			valChange(val) {

			},
			// 点击选择优惠券
			handleChangeVoucher(idx) {
				if (this.voucherIdx == idx) return;
				this.voucherIdx = idx;
				this.voucherShow = false;
				this.voucherTitle = this.voucherList[idx].title;
			},
			// 点击选择支付方式
			handleChangePayType(idx) {
				if (this.payTypeIdx == idx) return;
				this.payTypeIdx = idx;
				this.payTypeShow = false;
				this.payTypeTitle = this.payTypeList[idx].title;
			},
			// 点击全屏隐藏所有弹窗
			handleTouchStart() {
				this.voucherShow = false;
				this.payTypeShow = false;
			},
			// 点击返回
			handleBack() {
				this.$u.route({
					type: 'back',
				})
			},
			// 提交报名
			handleSubmit() {
				console.log(this.payTypeIdx)
				if (this.payTypeIdx == null) {
					this.$u.toast(`请选择支付方式`);
					return
				}
				if (this.username == '') {
					this.$u.toast(`请填写姓名`);
					return
				}
				if (this.phone == '') {
					this.$u.toast(`请填写手机号`);
					return
				}
				if (!this.$u.test.mobile(this.phone)) {
					this.$u.toast(`手机号格式错误`);
					return
				}
				this.handleClassesOrderSubmit();

			},
			// 提交订单
			async handleClassesOrderSubmit() {
				let data = {
					current_school_id: this.courseDetail.school_id, //学校id
					share_id: this.share_id, //分享人id
					city: this.location.allAddress, //所在城市,省/市/区县,斜杠分割
					classes_id: this.classes_id, //课程id
					num: this.value, //购买数量
					memo: this.remark, //备注
					real_name: this.username, //姓名
					phone: this.phone, //手机号
					addressId:this.addressId,
					pay_way: app.checkPayType(this.payTypeIdx),
				}
				// #ifdef H5
				data.pay_way = app.checkPayType(this.payTypeIdx) + '_h5'
				console.log(data)
				// #endif
				console.log(data)
				let res = {};
				// 拼团订单提交
				if (this.is_group) {
					delete data.num;
					res = await this.$api.classes_group_order_submitOrder(data);
				} else {
					//普通订单提交
					res = await this.$api.classes_order_submitOrder(data);
				}
				if (res.code == 1) {
					// 是否体验课，true 直接购买成功，false 拉起支付
					if (res.data.is_t_coupon) {
						this.$u.route({
							type: 'redirect',
							url: '/pages/index/organizationDetail/courseDetail/orderConfirm/paySuccess',
						})
					} else {
						this.classecOrderSendPay(res.data.order_id);
					}
				}
			},
			// 发起支付
			async classecOrderSendPay(order_id) {
				let data = {};
				let res = {};
				// 拼团订单发起支付
				if (this.is_group) {
					data = {
						classes_group_order_id: order_id,
					};
					res = await this.$api.classes_group_order_sendPay(data);
				} else {
					// 普通订单发起支付
					data = {
						classes_order_id: order_id,
					};
					res = await this.$api.classes_order_sendPay(data);
				}
				if (res.code == 1) {
					console.log(res)
					if (this.payTypeIdx == 0) {
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
						uni.showModal({
							title: '支付成功',
							content: '支付成功', //JSON.stringify(res)
							showCancel: false,
							success: async (res) => {
								this.$u.route({
									type: 'redirect',
									url: '/pages/index/organizationDetail/courseDetail/orderConfirm/paySuccess',
									params: {
										is_group: this.is_group
									}
								})
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
				// #ifdef APP-PLUS
				uni.requestPayment({
					provider: 'alipay',
					orderInfo: orderInfo, //微信、支付宝订单数据
					success: (res) => {
						console.log('支付成功回调', res)
						uni.showToast({
							title: '支付成功',
							icon: '支付成功',
							showCancel: false,
							success: async (res) => {
								this.$u.route({
									type: 'redirect',
									url: '/pages/index/organizationDetail/courseDetail/orderConfirm/paySuccess',
									params: {
										is_group: this.is_group
									}
								})
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
				// #endif

				// #ifdef H5
				// let routerData = this.$router.resolve({
				// 	path: '/pages/index/organizationDetail/courseDetail/payH5/pay',
				// 	query: {
				// 		htmlData: orderInfo
				// 	}
				// })
				// // 打开新页面
				// window.open(routerData.href, '_ blank')
				// uni.navigateTo({
				// 	url: "/pages/index/organizationDetail/courseDetail/payH5/pay?page=" + orderInfo
				// })
				document.querySelector('body').innerHTML = orderInfo
				document.forms[0].submit()
				// #endif
			},
		}
	}
</script>

<style lang="scss" scoped>
	.order-confirm-content {
		.goods-info {
			border-bottom: 1px solid rgba(153, 153, 153, .1);

			.goods-title {
				height: 80rpx;
			}
		}

		.order-info {
			/deep/ .u-cell__value {
				overflow: visible !important;
			}

			.order-info-item {
				.pay-item {
					border: 1px solid rgba(153, 153, 153, .1);
					right: 0;
					top: 100%;
					background: $uni-bg-color;
					padding: 0rpx 10rpx;
					text-align: center;
					width: 220rpx;
					z-index: 9999;

					>view {
						margin: 20rpx 0;
					}

					&>view:not(:last-child) {
						border-bottom: 1px solid rgba(153, 153, 153, .1);
					}
				}

				.select-pay-type {
					border: 1px solid #666;
					padding: 0rpx 16rpx;
					border-radius: 6rpx;
					width: 240rpx;
				}
			}
		}

		.bottom-order-confirm {
			box-shadow: 0rpx 0rpx 32rpx -14rpx #999;
			background: $uni-bg-color;
			position: fixed;
			width: 100%;
			bottom: 0;
			left: 0;
			padding: 26rpx 36rpx 20rpx 36rpx;

			.right-btn {
				>view {
					padding: 12rpx 32rpx;
				}

				.gray-btn {
					background: #999;
				}
			}

		}
		.add-address {
			color: red;
			margin-left: 20rpx;
			margin-top: 20rpx;
		}
	}
</style>
