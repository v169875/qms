<template>
	<!-- 订单卡片 -->
	<view class="card-module order-card-content">
		<view class="card-top flex col-center row-between">
			<view class="flex col-center" v-if="orderItem.school">
				<u-image width="64" height="64" :src="orderItem.school.school_cover_image_format" mode="aspectFit">
				</u-image>
				<text class="m-l-20 font-26 text-black">{{orderItem.school.school_name || '暂无'}}</text>
			</view>
			<!-- 正常订单显示 -->
			<view class="font-28 order-state text-bold" v-if="orderItem.is_refund == 0">
				{{orderItem.status | orderState(orderItem.order_class)}}
			</view>
			<!-- 退款订单显示 -->
			<view class="font-28 order-state text-bold" v-else>{{orderItem.is_refund | orderRefundType}}</view>
		</view>
		<view class="card-sn text-666 font-26 m-t-24 p-b-20">
			<view class="flex col-center row-between m-t-10 m-b-10">
				<text>订单号：</text>
				<text>{{orderItem.out_trade_no || '--'}}</text>
			</view>
			<view class="flex col-center row-between">
				<text>时间：</text>
				<text>{{orderItem.createtime_format || '--'}}</text>
			</view>
			<view class="flex col-center row-between" v-if="orderItem.address">
				<text>收货地址：</text>
				<text>{{orderItem.address || '--'}}</text>
			</view>
		</view>
		<view class="card-course-content m-t-22 m-b-28" v-if="orderItem.order_type == 2">
			<view class="flex u-row-between m-l-20 m-b-10" v-if="!orderItem.isGroup" v-for="item in orderItem.classes_info">
				<u-image width="138rpx" height="138rpx" border-radius="10"
					:src="item.classes_info.classes_cover_image_format" mode=""></u-image>
				<view class="hidden_two course-title font-30">
					<view>{{item.classes_info.classes_name}}</view>
					<view>共{{item.num}}次，可用{{item.can_num}}次</view>
				</view>
			</view>
			<view class="flex col-center  row-between m-t-10 m-l-20">
				<text class="font-26 text-333"></text>
				<view class="">
					<text class="font-26 text-333">付款金额：</text>
					<text class="order-price-num text-bold">
						<text class="font-27">￥</text>
						<text class="font-37">{{orderItem.total_price || 0}}</text>
					</text>
				</view>
			</view>
		</view>
		<view class="card-course-content m-t-22 m-b-28 right col-center" v-else>
      <view class="flex u-row-between m-l-20 m-b-10" v-for="item in orderItem.classes_info">
        <u-image width="138rpx" height="138rpx" border-radius="10"
                 :src="item.classes_info.classes_cover_image_format" mode=""></u-image>
        <view class="hidden_two course-title font-30">
          <view>{{item.classes_info.classes_name}}</view>
        </view>
      </view>
			<view class="u-flex-1 m-l-20">
				<view class="flex col-center row-between m-t-10">
					<text class="font-26 text-333">可用次数：{{orderItem.can_num || 0}}次</text>
					<view class="">
						<text class="font-26 text-333">付款金额：</text>
						<text class="order-price-num text-bold">
							<text class="font-27">￥</text>
							<text class="font-37">{{orderItem.total_price || 0}}</text>
						</text>
					</view>
				</view>
			</view>
		</view>
		<view class="order-bottom-btn-group flex col-center row-right">
			<!-- 待付款显示 -->
			<view class="gray-btn" v-if="orderItem.status == 1"
				@tap="handleOrderShowModal(orderItem,'closeOrder','是否确认取消订单？')">取消订单</view>
			<view class="blue-btn" v-if="orderItem.status == 1" @tap="handleGoPay(orderItem)">去支付</view>
			<!-- 普通订单,待完成显示 -->
			<view class="gray-btn" v-if="orderItem.status == 2 && orderItem.order_class == 1" @tap="handleOrderShowModal(orderItem,'refundOrder','是否确认退款？')">
				申请退款</view>
			<!-- 拼团订单,拼团中显示 -->
			<view class="gray-btn" v-if="orderItem.status == 8 && orderItem.order_class == 2"
				@tap="handleOrderShowModal(orderItem,'refundOrder','是否确认退款？')">申请退款</view>
			<!-- 订单详情在 待完成，已完成，已失效，退款/售后等都显示 -->
			<view class="blue-btn" v-if="orderItem.status != 1 && orderItem.status != 3"
				@tap="handleOrderDetail(orderItem)">订单详情</view>
			<!-- 待评价显示 -->
			<view class="blue-btn" v-if="orderItem.status == 3" @tap="handleEvaluate(orderItem)">评价</view>
			<!-- 已完成，已失效，退款/售后 显示 -->
			<view class="gray-btn" v-if="orderItem.status == 4 || orderItem.status == 5 || orderItem.status == 6"
				@tap="handleOrderShowModal(orderItem,'deleteOrder','是否确认删除订单？')">删除订单</view>
		</view>
		<!-- 共用模态框 -->
		<u-modal v-model="orderModalShow" :content="modalContent" :show-cancel-button="true" @cancel="handleCancelModal"
			@confirm="handleConfirmModal"></u-modal>
		<!-- 显示退款日期模态框 -->
		<u-modal v-model="orderRefundShow" :content-style="contentStyle" @confirm="handleConfirmRefund">
			<rich-text :nodes="refundModalContent"></rich-text>
		</u-modal>
		
	</view>
</template>

<script>
	export default {
		name: "order-card",
		props: {
			// 订单信息
			orderItem: {
				type: Object,
				default: () => {},
			},
			// 1==课程订单 ，2==课程拼团订单
			orderClass: {
				type: Number,
				default: 1,
			},
		},
		data() {
			return {
				orderModalShow: false, //模态框共用
				modalContent: '', //模态框内容共用
				orderRefundShow: false, //退款日期模态框显示
				//退款日期模态框显示
				refundModalContent: `
          <p style="color:#333;margin-top:20px;margin-bottom:10px;font-size:16px;font-weight:bold;">操作成功</p>
          <p style="font-size:13px;color:#666666;">系统已收到你的退款申请</p>
          <p style="font-size:13px;color:#666666;margin-bottom:15px;">预计1~3个工作日内审核完毕</p>
        `,
				contentStyle: {
					textAlign: 'center',
				},
				order_id: null, //订单id共用
				modalType: '', //模态框类型  closeOrder == 取消订单  refundOrder == 申请退款
				order_class: 1, // 1== 普通订单， 2==拼团订单
				isShow: false,
			};
		},
		filters: {
			orderState(val, order_class) {
				let str = '';
				switch (val) {
					case 1: //待付款
						str = '待付款';
						break;
					case 2: //待完成 || 已成团
						if (order_class == 1) {
							str = '待完成';
						} else {
							str = '已成团';
						}
						break;
					case 3: //待评价
						str = '待评价';
						break;
					case 4: //已完成
						str = '已完成';
						break;
					case 5: //已失效
						str = '已失效';
						break;
					case 6: //退款/售后
						str = '退款/售后';
						break;
					case 7: //已取消
						str = '已取消';
						break;
					case 8: //拼团中
						str = '拼团中';
						break;
				};
				return str;
			},
			// 订单退款状态 0=无退款,1=退款待审核,2=同意退款,3=拒绝退款
			orderRefundType(status) {
				let str = '';
				switch (status) {
					case 1: //  退款待审核
						str = '退款待审核'
						break;
					case 2: //  同意退款
						str = '同意退款'
						break;
					case 3: //  拒绝退款
						str = '拒绝退款'
						break;
				}
				return str;
			},
		},
		mounted() {
			this.$set(this.orderItem, 'order_class', this.orderClass);
			console.log(this.orderItem)
		},
		methods: {
			// 点击操作订单，显示模态框
			handleOrderShowModal(item, type, content) {
				this.modalType = type;
				this.modalContent = content;
				this.order_id = item.id;
				this.order_class = item.order_class;
				this.orderModalShow = true;
			},
			// 点击取消模态框
			handleCancelModal() {
				this.modalType = '';
				this.modalContent = '';
				this.order_id = null;
				this.order_class = 1;
				this.orderModalShow = false;
			},
			// 模态框点击确认
			async handleConfirmModal() {
				let res = {};
				let data = {
					order_id: this.order_id,
				};
				console.log('yyyy', this.modalType)
				// 取消订单模态框
				switch (this.modalType) {
					case 'refundOrder': //申请退款
						// order_class == 1是普通订单 ==2是拼团订单
						if (this.order_class == 1) {
							res = await this.$api.classes_order_refundOrder(data);
						} else if (this.order_class == 2) {
							res = await this.$api.classes_group_order_refundOrder(data);
						} else {
							this.$u.toast(`系统异常`);
						}
						if (res.code == 1) {
							this.orderRefundShow = true; //显示退款日期模态框
						}
						return
						break;
					case 'closeOrder': //取消订单
						// order_class == 1是普通订单 ==2是拼团订单
						if (this.order_class == 1) {
							res = await this.$api.classes_order_cancelOrder(data);
						} else if (this.order_class == 2) {
							res = await this.$api.classes_group_order_cancelOrder(data);
						} else {
							this.$u.toast(`系统异常`);
						}
						break;
					case 'deleteOrder': //删除订单
						// order_class == 1是普通订单 ==2是拼团订单
						if (this.order_class == 1) {
							res = await this.$api.classes_order_delOrder(data);
						} else if (this.order_class == 2) {
							res = await this.$api.classes_group_order_delOrder(data);
						} else {
							this.$u.toast(`系统异常`);
						}
						break;
				}
				if (res.code == 1) {
					this.$u.toast(res.msg);
					this.modalType = '';
					this.modalContent = '';
					this.order_id = null;
					this.orderModalShow = false;
					this.$emit('onRefresh', true); //操作成功通知列表刷新
				}
			},
			// 点击确认退款日期模态框
			handleConfirmRefund() {
				this.modalType = '';
				this.modalContent = '';
				this.order_id = null;
				this.orderModalShow = false;
				this.$emit('onRefresh', true); //操作成功通知列表刷新
			},
			// 点击评价
			handleEvaluate(item) {
				this.$emit('onEvaluate', true, item);
			},
			// 点击跳转到详情
			handleOrderDetail(item) {
				this.$u.route({
					url: '/pages/mine/order/orderDetail/orderDetail',
					params: {
						// orderDetail:JSON.stringify(item),
						order_id: item.id,
						order_class: item.order_class,
					}
				})
			},
			// 点击去支付显示支付弹窗
			async handleGoPay(item) {
				let data = {};
				let res = {};
				// order_class == 1是普通订单， ==2是拼团订单
				if (item.order_class == 1) {
					data = {
						classes_order_id: item.id,
					}
					res = await this.$api.classes_order_sendPay(data);
				} else if (item.order_class == 2) {
					data = {
						classes_group_order_id: item.id,
					};
					res = await this.$api.classes_group_order_sendPay(data);
				}
				if (res.code == 1) {
					if (item.pay_way == 'wechat') {
						this.wxPay(res.data.pay_info);
					} else if (item.pay_way == 'alipay') {
						this.aliPay(res.data.pay_info);
					} else {
						this.$u.toast(`系统错误，请重试`);
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
						this.$emit('onRefresh', true); //操作成功通知列表刷新
						uni.showModal({
							title: '支付成功',
							content: '支付成功', //JSON.stringify(res)
							showCancel: false,
							success: async (res) => {
								this.$u.route({
									url: '/pages/index/organizationDetail/courseDetail/orderConfirm/paySuccess',
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
				uni.requestPayment({
					provider: 'alipay',
					orderInfo: orderInfo, //微信、支付宝订单数据
					success: (res) => {
						console.log('支付成功回调', res)
						this.$emit('onRefresh', true); //操作成功通知列表刷新
						uni.showToast({
							title: '支付成功',
							icon: '支付成功',
							showCancel: false,
							success: async (res) => {
								this.$u.route({
									url: '/pages/index/organizationDetail/courseDetail/orderConfirm/paySuccess',
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
			},
		}
	}
</script>
<style lang="scss" scoped>
	.order-card-content {
		padding: 28rpx;
		box-shadow: 0rpx 0rpx 10rpx 4rpx #f2f6ff;
		margin-bottom: 30rpx;

		.card-top {
			.order-state {
				color: #3077FB;
			}
		}

		.card-sn {
			border-bottom: 1px dashed #DBDBDB;
		}

		.card-course-content {
			.course-title {
				// height: 80rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				padding-bottom: 20rpx;
				box-sizing: border-box;
			}

			.order-price-num {
				color: #3077FB;
			}
		}

		.order-bottom-btn-group {
			color: #fff;

			>view {
				padding: 13rpx 0rpx;
				border-radius: 10rpx;
				min-width: 170rpx;
				text-align: center;
			}

			&>view:not(:first-child) {
				margin-left: 30rpx;
			}

			.gray-btn {
				background: #999999;
			}

			.blue-btn {
				background: #3077FB;
			}
		}
	}

</style>
