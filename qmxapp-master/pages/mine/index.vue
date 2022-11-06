<template>
	<!-- 我的 -->
	<view class="mine-content">
		<view class="mine-header">
			<u-gap height="100"></u-gap>
			<view class="p-l-40 p-r-34 flex col-center">
				<u-avatar size="114" :src="userInfo.avatar_format"></u-avatar>
				<view class="u-flex-1 m-l-22">
					<!-- 上 -->
					<view class="flex row-between m-b-30">
						<view class="font-32 text-bold">{{userInfo.nickname || '未登录'}}</view>
						<u-icon name="arrow-right" color="#fff" size="31" @tap="handleGoPage('mineInfo','','')"></u-icon>
					</view>
					<!-- 下 -->
					<view class="font-30">
						{{userInfo.mobile || '暂无'}}
					</view>
				</view>
			</view>
		</view>
		<view class="card-module mine-money-card p-t-50 p-b-30 p-l-30 p-r-30 flex col-center row-between">
			<view class="flex-col col-center" v-for="(item,index) in moneyList" :key="index" @tap="handleGoPage('money',item.url,item.id)">
				<u-image width="54rpx" height="54rpx" :src="`/static/mine/mine-money-icon${item.icon}.png`" mode="aspectFit"></u-image>
				<view class="m-t-24 text-666 font-28">{{item.title}}</view>
			</view>
		</view>
		<u-gap height="50"></u-gap>
		<view class="card-module mine-tool-card">
			<u-gap height="30"></u-gap>
			<view class="font-28 text-black p-l-30 p-r-30">常用工具</view>
			<u-gap height="42"></u-gap>
			<view class="flex flex-wrap col-center tool-list">
				<view class="flex-col col-center m-b-28" v-for="(item,index) in toolList" :key="index" @tap="handleGoPage('tool',item.url,item.id)">
					<u-image width="70rpx" height="70rpx" :src="`/static/mine/mine-tool-icon${item.icon}.png`" mode="aspectFit"></u-image>
					<view class="m-t-20 text-666 font-28">{{item.title}}</view>
				</view>
			</view>
		</view>
		<!-- 意见反馈弹窗 -->
		<eva-popup ref="evaPopup"></eva-popup>
		<!-- 待审核弹窗提示 -->
		<u-popup v-model="enterPopupShow" mode="center" width="80%" border-radius="20">
			<u-gap height="63"></u-gap>
			<view class="flex col-center row-center">
				<u-image width="124rpx" height="124rpx" src="/static/mine/audit-icon.png" mode="aspectFit"></u-image>
			</view>
			<u-gap height="39"></u-gap>
			<view class="text-center font-30 text-black text-bold">等待审核</view>
			<u-gap height="53"></u-gap>
			<view class="text-center m-l-68 m-r-68 font-28">预计1-3个工作日，届时会有站内消息 通知，或是在个人中心查看审核状态！ 感谢您使用平台。</view>
			<u-gap height="53"></u-gap>
			<view class="dyan-btn" style="position: relative;z-index: 9999999;">
				<view class="btn-1">
					<view class="main-bg-color p-t-20 p-b-20 text-center font-30 radius-50" :style="customBtnStyle1" @click="handleCloseMerchantEnter()">关闭</view>
					<!-- <u-button :custom-style="customBtnStyle1" shape="circle" :hair-line="false" @click="handleCloseMerchantEnter()">关闭</u-button> -->
				</view>
			</view>
			<u-gap height="20"></u-gap>
		</u-popup>
		<!-- <u-tabbar v-model="current" icon-size="54" :border-top="false" inactive-color="#999" active-color="#3077FB" :list="tabbarList"></u-tabbar> -->
	</view>
</template>

<script>
	let app = getApp();
	import evaPopup from '@/components/eva-popup/eva-popup.vue';
	import {tabbar} from '@/utils/tabBar.js';
	export default {
		components:{
			evaPopup
		},
		data() {
			return {
				current:4,
				tabbarList:tabbar,
				customBtnStyle1:getApp().globalData.customStyle1,
				enterPopupShow:false,  //待审核弹窗
				moneyList:[
					{icon:1,id:1,title:'我的代金券',url:'/pages/mine/mineVoucher/mineVoucher',},
					{icon:2,id:2,title:'我的订单',url:'/pages/mine/order/order',},   //拼团订单和课程订单共用页面
					{icon:3,id:3,title:'我的视频',url:'/pages/mine/mineVideo/mineVideo',},
					{icon:4,id:4,title:'积分中心',url:'/pages/mine/integralCenter/integralCenter',},
				],
				toolList:[
					// {icon:1,id:1,title:'会员卡体验',url:'/pages/mine/vipTestCard/vipTestCard',},
					// {icon:2,id:2,title:'我的收藏',url:'/pages/mine/mineCollect/mineCollect',},
					// {icon:3,id:3,title:'反馈意见',url:'showFeedBack',},
					// {icon:4,id:4,title:'系统设置',url:'/pages/mine/sysSetting/sysSetting',},
					// {icon:4,id:4,title:'商家后台',url:'/pages/mine/backstage',},
					// // {icon:5,id:5,title:'申请分销'},
					// {icon:6,id:6,title:'分销中心',url:'/pages/mine/salesCenter/salesCenter',},
					// {icon:7,id:7,title:'商家入驻',url:'/pages/mine/merchantEnter/merchantEnter',},
					// {icon:8,id:8,title:'选品库',url:'/pages/mine/agency/agency',},
					// //拼团订单和课程订单共用页面
					// {icon:9,id:9,title:'拼团订单',url:'/pages/mine/order/order',},
					// //拼团订单和课程订单共用页面
					// {icon:10,id:10,title:'我的核销',url:'/pages/mine/mineVerification/mineVerification',},
				 //    {icon:11,id:11,title:'收货地址',url:'pages/mine/integralCenter/takeAddress/takeAddress',},
				],
				userInfo:{},
			};
		},
		onShow() {
      // uni.hideTabBar();
			this.getUserInfo();
		},
		methods:{
			initToolList(){
				// const indexArr = [4,7];
				// let flag = true;
				// if (this.userInfo.is_school == 1 && indexArr.indexOf(index) != -1 ){
				// 	flag =  false;
				// }
				// return flag;
				if (this.userInfo.is_school == 0)
				{
					this.toolList = [
					{icon:1,id:1,title:'会员卡体验',url:'/pages/mine/vipTestCard/vipTestCard',},
					{icon:2,id:2,title:'我的收藏',url:'/pages/mine/mineCollect/mineCollect',},
					{icon:3,id:3,title:'反馈意见',url:'showFeedBack',},
					{icon:4,id:4,title:'系统设置',url:'/pages/mine/sysSetting/sysSetting',},
						// {icon:4,id:4,title:'商家后台',url:'/pages/mine/backstage',},
						// {icon:5,id:5,title:'申请分销'},
						{icon:6,id:6,title:'分销中心',url:'/pages/mine/salesCenter/salesCenter',},
						{icon:7,id:7,title:'商家入驻',url:'/pages/mine/merchantEnter/merchantEnter',},
						// {icon:8,id:8,title:'选品库',url:'/pages/mine/agency/agency',},
						//拼团订单和课程订单共用页面
						{icon:9,id:9,title:'拼团订单',url:'/pages/mine/order/order',},
						//拼团订单和课程订单共用页面
						{icon:10,id:10,title:'我的核销',url:'/pages/mine/mineVerification/mineVerification',},
						{icon:11,id:11,title:'收货地址',url:'pages/mine/integralCenter/takeAddress/takeAddress',},
					]
				} else {
					this.toolList = [
						{icon:1,id:1,title:'会员卡体验',url:'/pages/mine/vipTestCard/vipTestCard',},
						{icon:2,id:2,title:'我的收藏',url:'/pages/mine/mineCollect/mineCollect',},
						{icon:3,id:3,title:'反馈意见',url:'showFeedBack',},
						{icon:4,id:4,title:'系统设置',url:'/pages/mine/sysSetting/sysSetting',},
						{icon:12,id:4,title:'商家后台',url:'/pages/mine/backstage',},
					// {icon:5,id:5,title:'申请分销'},
					{icon:6,id:6,title:'分销中心',url:'/pages/mine/salesCenter/salesCenter',},
					{icon:7,id:7,title:'商家入驻',url:'/pages/mine/merchantEnter/merchantEnter',},
					{icon:8,id:8,title:'选品库',url:'/pages/mine/agency/agency',},
						//拼团订单和课程订单共用页面
						{icon:9,id:9,title:'拼团订单',url:'/pages/mine/order/order',},
						//拼团订单和课程订单共用页面
						{icon:10,id:10,title:'我的核销',url:'/pages/mine/mineVerification/mineVerification',},
						{icon:11,id:11,title:'收货地址',url:'pages/mine/integralCenter/takeAddress/takeAddress',},
					]
				}
		},
      onShow() {
        // uni.hideTabBar();
        this.getUserInfo();
      },
			// 获取用户信息
			getUserInfo(){
				app.getUserInfo();
				uni.$on('userInfo',(data)=>{
					this.userInfo = data
					this.initToolList();
				})
			},
			// 跳转
			handleGoPage(str,path,id){
				let url = '';
				let type = 'to';
				let params = {};
				if(path == 'showFeedBack'){ //意见反馈不跳转，只显示弹窗
					this.$refs.evaPopup.handleShowEvaPopup(true);
					return;
				}
				switch(str){
					case 'mineInfo':
						url = '/pages/mine/mineInfo/mineInfo';
						break;
					case 'money':
					case 'tool':
						// 如果点击的商家入驻，判断审核状态
						if(str == 'tool' && id == 7){
							// 如果已经绑定账号
							if(this.userInfo.is_bind == 1){
								this.$u.toast(`已绑定账号`);
							}else{  //没有绑定账号操作
								this.getMineStoreInfo(str,path,id);
							}
              return
						}else if(str == 'money' && id == 2){
              // 课程订单
              params = {
                order_class:1,
              }
						}else if(str == 'tool' && id == 9){
              // 课程拼单订单
              params = {
                order_class:2,
              }
            }else if(str == 'tool' && (id == 8 || id == 10)){// 如果点击我的核销
              if(this.userInfo.is_bind == 0){
              	this.$u.toast(`您还未绑定商家账号`);
                return;
              }
            }
            url = path;
						break;
				}
				// 共用跳转
				this.$u.route({
					url:url,
					type:type,
					params:params,
				})
			},
			// 获取我的店铺信息
			async getMineStoreInfo(str,path,id){
				let url = '';
				let type = 'to';
				let params = {};
				const res = await this.$api.getMeSchoolDetail();
				if(res.code == 1){
					if(res.data == null){
						url = path;
					}else{
						//  //商家入驻审核状态  1待审核，2审核失败，3审核成功
						if(res.data.status == 1){ //待审核
							this.enterPopupShow = true;
						}else if(res.data.status == 2){ //审核成功
							url = '/pages/mine/merchantEnter/auditSuccess/auditSuccess';
						}else if(res.data.status == 3){ //审核驳回
							url = '/pages/mine/merchantEnter/auditError/auditError';
						}
					}
				}
				// 共用跳转
				this.$u.route({
					url:url,
					type:type,
					params:params,
				})
			},
			// 关闭审核弹窗
			handleCloseMerchantEnter(){
				this.enterPopupShow = !this.enterPopupShow;
			}
 		}
	}
</script>

<style lang="scss" scoped>
	.mine-content{
		.mine-header{
			height: 400rpx;
			color: $uni-text-color-inverse;
			background: url('@/static/mine/mine-top-bg.png') no-repeat center center / cover;
		}
		.mine-money-card{
			margin-top: -80rpx;
			box-shadow: 0rpx 6rpx 16rpx 4rpx #E3F1FE;
			>view{
				width: calc(100% / 4);
			}
		}
		.mine-tool-card{
			box-shadow: 0rpx 6rpx 16rpx 4rpx #E3F1FE;
			.tool-list{
				>view{
					width: calc(100% / 4);
				}
			}
		}
	}
	.mine-top-bg-pic {
		width: 100%;
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
	}
</style>
