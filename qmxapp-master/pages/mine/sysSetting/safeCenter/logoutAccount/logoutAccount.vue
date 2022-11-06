<template>
	<!-- 注销账号 -->
	<view class="logout-account-content p-l-34 p-r-34">
		<top-navbar :title="title" :isShowBorder="true"></top-navbar>
		<u-gap height="40"></u-gap>
		<view class="font-28 text-black">注销前期核实以下</view>
		<u-gap height="40"></u-gap>
		<view class="font-30 text-black text-bold">注销条件</view>
		<u-gap height="34"></u-gap>
		<view class="text-333 font-28 text-height">
			提交申请注销钱，系统将对您的账号进行资产验证，已确保您的账号安全，财产安全：
		</view>
		<u-gap height="34"></u-gap>
		<view class="text-333 font-28">
			一、是否有进行中的订单
		</view>
		<u-gap height="14"></u-gap>
		<view class="text-333 font-28">
			二、是否还有余额财产
		</view>
		<u-gap height="34"></u-gap>
		<view class="text-333 font-28 text-height">
			申请注销账号成功后，您的个人信息及个人积分等虚拟财 产都将一律删除，请您谨慎进行！
		</view>
		<view class="text-666 font-24 text-center m-t-56">
			点击下方“申请注销”，即表示你已阅读并同意《重要提醒》
		</view>
		<u-gap height="114"></u-gap>
		<view class="dyan-btn">
			<view class="btn-1">
				<u-button :custom-style="customBtnStyle1" shape="circle" :hair-line="false" @click="handleLogoutAccount()">申请注销</u-button>
			</view>
		</view>
		<u-modal v-model="modalShow" content="是否申请注销账号?" show-cancel-button @confirm="handleConfirmLogOutAccount()"></u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:'注销账号',
				customBtnStyle1:getApp().globalData.customStyle1,
				modalShow:false,
			};
		},
		methods:{
			// 申请注销
			handleLogoutAccount(){
				this.modalShow = !this.modalShow;
			},
			// 确认注销
			async handleConfirmLogOutAccount(){
        const res = await this.$api.delAccount();
        if(res.code == 1){
          // uni.clearStorageSync();
          // 不能全部清除，保留  regs_id
          uni.removeStorageSync('dataList');
          uni.removeStorageSync('List');
          uni.removeStorageSync('nowImage');
          uni.removeStorageSync('likeImage');
          uni.removeStorageSync('nowTimeEmojiList');
          uni.removeStorageSync('location');
          uni.removeStorageSync('allAddress');
          uni.removeStorageSync('token');
          uni.removeStorageSync('userInfo');
          uni.removeStorageSync('user');
          uni.removeStorageSync('videoID');
          uni.removeStorageSync('skJGRegistrationID');
          uni.removeStorageSync('userInfo');
          this.$u.toast(res.msg);
          setTimeout(()=>{
          	this.$u.route({
          		// type:'back',
              type:'reLaunch',
              url:'/pages/login/login',
          	})
          },500)
        }
			}
		}
	}
</script>

<style lang="scss" scoped>
	.logout-account-content{
		.text-height{
			line-height: 50rpx;
		}
	}
</style>
