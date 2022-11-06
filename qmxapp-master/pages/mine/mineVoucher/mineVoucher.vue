<template>
	<!-- 我的代金券 -->
	<view class="mine-voucher-content">
		<top-navbar :title="title"></top-navbar>
		<u-gap height="46"></u-gap>
		<view class="flex mine-voucher-tab">
			<view class="text-center text-333 font-28" :class="{'active-mine-voucher-tab':voucherIdx == index}" v-for="(item,index) in voucherTabs" :key="index" @tap="handleChangeTabs(index)">
				{{item}}
			</view>
		</view>
		<u-gap height="40"></u-gap>
		<!-- 未使用优惠券 -->
		<view class="mine-voucher-list p-l-30 p-r-30" v-if="voucherIdx == 0">
			<block>
				<view 
					class="mine-voucher-item flex col-center row-between m-b-34" 
					style="background: url('../../../static/mine/mine-voucher-bg.png') no-repeat center center / cover;" 
					v-for="(item,index) in voucherList" :key="index">
					<view class="voucher-left p-l-56">
						<view class="title text-bold p-b-12 p-r-30 m-b-8">{{item.deduction_price || 0}}元代金券</view>
						<view class="price text-bold font-30">￥{{item.deduction_price || 0}}/张</view>
					</view>
					<view class="voucher-right flex col-center row-center" @tap="handleShowConponDetail(item)">
						<view class="font-32 check-detail" style="width: 30rpx;">查看详情</view>
					</view>
				</view>
			</block>
		</view>
		<!-- 已使用优惠券 -->
		<view class="mine-voucher-list p-l-30 p-r-30" v-if="voucherIdx == 1">
			<block>
				<view 
					class="mine-voucher-item flex col-center row-between m-b-34"
					style="background: url('../../../static/mine/mine-voucher-use-bg.png') no-repeat center center / cover;" 
					v-for="(item,index) in voucherList" :key="index">
					<view class="voucher-left voucher-use p-l-56 u-flex-1">
						<view class="title text-bold p-r-30">{{item.deduction_price || 0}}元代金券</view>
						<view class="price font-26 m-t-4 m-b-4">使用时间：{{item.use_time_format || '未知'}}</view>
						<view class="price font-26 hidden_one">使用机构：{{item.verification_school || ''}}</view>
					</view>
					<view class="voucher-right flex col-center row-center" @tap="handleDelCoupon(item)">
						<view class="font-32 clear-text text-center" style="width: 44rpx;">清除</view>
					</view>
				</view>
			</block>
		</view>
		<view class="middleC" v-if="voucherList.length <= 0">
			<u-empty text="暂无代金券" mode="coupon"></u-empty>
		</view>
		<u-gap height="30"></u-gap>
		<!-- 代金券详情弹窗 -->
		<u-popup class="coupon-popup" v-model="couponShow" mode="center" width="80%" border-radius="20" @close="handleCloseCoupon">
			<u-gap height="46"></u-gap>
			<view class="flex col-center row-between p-l-40 p-r-40">
				<u-icon name="close" color="#666666" size="28" style="visibility: hidden;"></u-icon>
				<view class="font-30">查看详情</view>
				<u-icon name="close" color="#666666" size="28" @tap="handleCloseCoupon()"></u-icon>
			</view>
			<u-gap height="38"></u-gap>
			<view class="voucher-detail-top-bg m-l-40 m-r-40 flex col-center row-center">
				<view class="text-bold">{{couponInfo.deduction_price || 0}}元代金券</view>
			</view>
			<u-gap height="32"></u-gap>
			<view class="sheet-card m-t-30 p-t-30 p-b-22 radius-10 flex col-center row-center">
				<view class="sheet-item flex col-center row-center flex-col text-333 font-26">
					<view class="p-b-14">核销二维码</view>
					<!-- <view class="p-b-14"> (共10次还可以4次）</view> -->
					<u-image width="100rpx" height="100rpx" border-radius="4" :src="couponInfo.qrcode_img" mode="aspectFit"></u-image>
				</view>
				<view class="center-line"></view>
				<view class="sheet-item flex col-center row-center flex-col text-333 font-26">
					<view class="p-b-14">核销码</view>
					<!-- <view class="p-b-14"> (共10次还可以4次）</view> -->
					<view class="flex col-center" style="min-height: 100rpx;" @tap="handleCopy(couponInfo.qrcode)">
						<view class="sheet-num flex row-center">{{couponInfo.qrcode || '0'}}</view>
					</view>
				</view>
			</view>
			<u-gap height="50"></u-gap>
		</u-popup>
    <u-modal v-model="couponModalShow" content="是否删除该代金券?" :show-cancel-button="true" @cancel="delCouponId = null" @confirm="handleConfirmDelCoupon"></u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:'我的代金券',
				// tabs下标
				voucherIdx:0,
				// tabs列表
				voucherTabs:['未使用','已使用'],
        listQuery:{
          page:1,
          limit:10,
          status:1,
        },
        isLoad:false,
				// 代金券列表
				voucherList:[],
				// 代金券详情弹窗
				couponShow:false,
        couponInfo:{}, //代金券详情
        delCouponId:null, //删除已使用代金券的id+
        couponModalShow:false, //是否删除代金券模态框
			};
		},
		onLoad() {
			this.getVoucherList();
		},
		onReachBottom() {
			this.getVoucherList();
		},
    onPullDownRefresh() {
      this.listQuery.page = 1;
      this.isLoad = false;
      this.voucherList = [];
      this.getVoucherList();
      setTimeout(()=>{
        uni.stopPullDownRefresh();
      },500)
    },
		methods:{
      // 获取我的代金券列表
			async getVoucherList(){
        if(this.isLoad) return;
        this.isLoad = true;
				const res = await this.$api.getDcouponList(this.listQuery);
        if(res.code == 1){
          if(res.data.data.length > 0){
            this.voucherList = this.voucherList.concat(res.data.data);
            this.listQuery.page++;
            this.isLoad = false;
          }else{
            this.isLoad = false;
          }
        }
			},
			// 切换tab
			handleChangeTabs(idx){
				if(this.voucherIdx == idx) return;
				this.voucherIdx = idx;
        switch(this.voucherIdx){
          case 0:  //待使用
            this.listQuery.status = 1;
            break;
          case 1:  //已使用
            this.listQuery.status = 2;
            break;
        }
        this.couponShow = false;
        this.listQuery.page = 1;
        this.isLoad = false;
        this.couponModalShow = false;
        this.voucherList = [];
        this.couponInfo = {};
				this.getVoucherList();
			},
			// 关闭代金券详情弹窗
			handleCloseCoupon(){
				this.couponShow = false;
        this.couponInfo = {};
			},
			// 查看代金券详情
			async handleShowConponDetail(item){
        // let qrcodeInfo = {
        //   qrcode:item.qrcode,  //二维码数据
        //   qrcode_type:1, //二维码类型  1==代金券核销，2==体验/课程核销，3==拼团订单核销
        // };
        let qrcodeInfo = `${item.qrcode},${1}`
        let data = {
          open_link:qrcodeInfo,
          image_type:'base64',
        };
        // 创建二维码图片，并赋值
        const res = await this.$api.createQrcode(data);
        if(res.code == 1){
          this.couponInfo = Object.assign({},item);
          this.$set(this.couponInfo,'qrcode_img',res.data);
          this.couponShow = !this.couponShow;
        }
			},
      // 复制内容
      handleCopy(content) {
      	uni.setClipboardData({
      		data: content,
      		success: () => { //复制成功的回调函数
      			this.$u.toast(`复制成功`);
      		}
      	});
      },
      // 点击删除已使用代金券
      handleDelCoupon(item){
        this.delCouponId = item.id;
        this.couponModalShow = !this.couponModalShow;
      },
      // 确认删除已使用优惠券
      async handleConfirmDelCoupon(){
        let data = {
          user_dcoupon_id:this.delCouponId,
        };
        const res = await this.$api.delUserDcoupon(data);
        if(res.code == 1){
          this.$u.toast(res.msg);
          this.isLoad = false;
          this.listQuery.page = 1;
          this.delCouponId = null;
          this.voucherList = [];
          this.getVoucherList();
        }
      }
		}
	}
</script>

<style lang="scss" scoped>
	.mine-voucher-content{
		.mine-voucher-tab{
			padding: 0 137rpx;
			>view{
				width: calc(100% / 2);
				border: 1px solid #333;
				padding: 16rpx 0;
			}
			>view:first-child{
				border-top-left-radius: 35rpx;
				border-bottom-left-radius: 35rpx;
			}
			>view:last-child{
				border-top-right-radius: 35rpx;
				border-bottom-right-radius: 35rpx;
			}
			.active-mine-voucher-tab{
				background: #333;
				color: #fff !important;
			}
		}
		.mine-voucher-list{
			.mine-voucher-item{
				border-radius: 6rpx;
				// padding:22rpx 0;
				height: 178rpx;
				
				.voucher-left{
					color: #D1353B;
					.title{
						font-size: 54rpx;
						border-bottom: 1px dashed #D1353B;
					}
					.price{
						
					}
				}
				.voucher-use{
					color: #333333 !important;
					>view{
						border: none !important;
					}
				}
				.voucher-right{
					width: 25%;
					.check-detail{
						line-height: 36rpx;
						font-family: PingFang SC;
						font-weight: bold;
						color: #FCF1E1;
						text-shadow: 0rpx 10rpx 10rpx rgba(198, 51, 56, 0.75);
					}
					.clear-text{
						font-size: 38rpx;
						font-family: PingFang SC;
						font-weight: bold;
						color: #FFFFFF;
						line-height: 59rpx;
						text-shadow: 0rpx 5rpx 5rpx rgba(119, 119, 119, 0.75);
					}
				}
			}
		}
		.coupon-popup{
			.voucher-detail-top-bg{
				height: 180rpx;
				border-radius: 6rpx;
				font-size: 56rpx;
				color: #D1353B;
				background: url('/static/mine/mine-voucher-detail-bg.png') no-repeat center center / cover;
			}
			.sheet-card{
				background: #F5F5F5;
				margin: 0 40rpx;
				.center-line{
					height: 133rpx;
					width: 1rpx;
					background: #999;
				}
				.sheet-item{
					width: calc(100% / 2);
				}
				.u-image{
					margin: 0 auto;
				}
				.sheet-num{
					padding: 15rpx;
					background: #fff;
					width: 200rpx;
					margin: 0 auto;
				}
			}
		}
	}
</style>
