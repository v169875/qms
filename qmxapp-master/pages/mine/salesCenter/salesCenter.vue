<template>
	<!-- 分销中心 -->
	<view class="sales-center-content">
		<view class="sales-top" :style="`height:${327 + topBarHeight}rpx`">
			<top-navbar :title="title" :background="navbarBg" backColor="#fff" :isFixed="false" titleColor="#fff"></top-navbar>
			<view class="flex col-center p-l-34 p-r-34 m-t-10">
				<u-avatar size="112" :src="userInfo.avatar_format"></u-avatar>
				<view class="u-flex-1 m-l-18 text-white">
					<!-- 上 -->
					<view class="flex col-center row-between">
						<view class="font-30 text-bold">{{userInfo.nickname || '未登录'}}</view>
						<view class="font-28" style="visibility: hidden;">ID: 36236322</view>
					</view>
					<!-- 下 -->
					<view class="flex col-center row-between m-t-10">
						<view class="font-28">邀请码：{{userInfo.invite_code || '暂无'}}</view>
						<view class="main-color font-24 bind-invite radius-35" @tap="handleCopyInveCode(userInfo.invite_code)">复制邀请码</view>
					</view>
				</view>
			</view>
		</view>
		<view class="m-l-34 m-r-34 tab-row flex col-center row-around radius-10 text-center">
			<view class="p-t-46 p-b-32 font-30" v-for="(item,index) in tabList" :key="index" @tap="handleSalesTab(index)">
				{{item}}
			</view>
		</view>
		<u-gap height="20"></u-gap>
		<view class="font-28 m-t-26 text-333 text-bold text-center activity-title">推荐课程</view>
		<u-gap height="30"></u-gap>
		<view class="course-list" v-if="courseList.length > 0">
			<block v-for="(item,index) in courseList" :key="index">
				<course-card 
        :courseItem="item"
        :isShowVipTag="item.is_t_coupon == 1 ? true : false"
        :isShowFree="item.is_t_coupon == 1 && item.is_free"
        ></course-card>
			</block>
		</view>
		<view class="" v-else>
			<u-gap height="200"></u-gap>
			<u-empty text="暂无课程" mode="list"></u-empty>
		</view>
		<u-gap height="30"></u-gap>
		
		<!-- 绑定邀请人 -->
		<u-popup class="invite-popup" v-model="invitePopupShow" mode="center" width="620rpx" border-radius="15">
			<u-gap height="48"></u-gap>
			<view class="flex col-center row-between p-l-40 p-r-40">
				<u-icon name="close" color="#666666" size="28" style="visibility: hidden;"></u-icon>
				<view class="font-30">绑定邀请人</view>
				<u-icon name="close" color="#000" size="28" @tap="handleInviteClose()"></u-icon>
			</view>
			<u-gap height="70"></u-gap>
			<view class="invite-input">
				<u-input v-model="inviteCode" type="number" border placeholder="请输入邀请码" placeholder-style="text-align: center" :clearable="false"></u-input>
			</view>
			<u-gap height="50"></u-gap>
			<view class="invite-bottom flex col-center row-between">
				<view class="invite-btn gray-btn radius-50" @tap="handleInviteConfirm()">取消</view>
				<view class="invite-btn main-bg-color radius-50" @tap="handleInviteConfirm()">确定</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import courseCard from '@/components/course-card/course-card.vue'
	export default {
		components:{
			courseCard
		},
		data() {
			return {
				title:'分销中心',
				navbarBg:{
					background:'rgba(255,255,255,0)',
				},
				avatar:'https://tse1-mm.cn.bing.net/th/id/R-C.d8011b5d28ee607bfa5e427d0ad03b99?rik=eCm54QsjFJ81gQ&riu=http%3a%2f%2fimg2.woyaogexing.com%2f2018%2f01%2f09%2fa03c1358f5fee520!400x400_big.jpg&ehk=Tchj3Y063MGOw03bLmMHcWVT36v4WTVbUFjWdm%2fmH30%3d&risl=&pid=ImgRaw&r=0&sres=1&sresct=1',
				tabList:['资金','结算中心'],
				// 绑定邀请人弹窗
				invitePopupShow:false,
				// 邀请码
				inviteCode:'', 
				courseList:[],
				listQuery:{
					page:1,
					limit:10,
				},
				isLoad:false,
				location:{},
				userInfo:{},
        topBarHeight:20,
			};
		},
		onLoad() {
      // #ifdef APP-PLUS
        this.topBarHeight = plus.navigator.getStatusbarHeight()
      // #endif
			let location = uni.getStorageSync('location');
			let userInfo = uni.getStorageSync('userInfo');
			if(location){
				this.location = location;
				this.getCourseList();
			};
			if(userInfo){
				this.userInfo = userInfo;
			}
		},
		onReachBottom() {
			this.getCourseList();
		},
		methods:{
			// 获取推荐课程
			async getCourseList(){
				if(this.isLoad) return;
				this.isLoad = true;
				let data = {
					...this.listQuery,
					citys:this.location.citys,
				}
				const res = await this.$api.getHotClassesList(data);
				if(res.code == 1){
					if(res.data.data.length > 0){
						this.courseList = this.courseList.concat(res.data.data);
						this.listQuery.page++;
						this.isLoad = false;
					}else{
						this.isLoad = false;
					}
				}
			},
			handleSalesTab(index){
				let url = '';
				switch(index){
					case 0: //进入资金页面
						url = '/pages/mine/salesCenter/capital/capital';
						break;
					case 1: //进入结算中心
						url = '/pages/mine/salesCenter/settleCenter/settleCenter';
						break;
				};
				this.$u.route({
					url:url,
				})
			},
      // 点击复制邀请码
      handleCopyInveCode(content){
        uni.setClipboardData({
        	data:content,
        	success: () => { //复制成功的回调函数
            this.$u.toast(`复制成功`);
        	}
        });
      },
			// 显示绑定人弹窗
			handleShowBindPopup(){
				this.invitePopupShow = !this.invitePopupShow;
			},
			// 关闭添加邀请人弹窗
			handleInviteClose(){
				this.invitePopupShow = false;
			},
			// 确认填写邀请码
			async handleInviteConfirm(){
				if(this.inviteCode == ''){
					this.$u.toast(`请输入邀请码`);
					return
				}
				// let data = {
				// 	invitation_code:this.inviteCode,
				// };
				// const res = await this.$api.invitation_code(data);
				// if(res.code == 200){
				// 	this.$u.toast(res.msg);
				// 	app.getUserInfo();
				// 	this.invitePopupShow = false;
				// }
			},
		}
	}
</script>

<style lang="scss" scoped>
	.sales-center-content{
		.sales-top{
			background: url('@/static/mine/sales/sales-top-bg.png') no-repeat center center / cover;
			.bind-invite{
				padding: 6rpx 30rpx;
				background: $uni-bg-color;
			}
		}
		.tab-row{
			background: $uni-bg-color;
			margin-top: -50rpx;
			box-shadow: 0px 0px 14rpx 0px rgba(48, 119, 251, 0.1);
			>view{
				width: 200rpx;
			}
		}
		.invite-popup{
			.invite-popup-title{
				padding: 0 42rpx;
				// margin-top: 48rpx;
				margin-bottom: 61rpx;
				.title{
					margin-left: 30rpx;
				}
				>image{
					width: 30rpx;
					height: 30rpx;
					display: block;
				}
			}
			.invite-input{
				margin: 0 40rpx 0rpx 40rpx;
			}
			.invite-bottom{
				margin: 0 40rpx 47rpx 40rpx;
				>view{
					width: calc(100% / 2 - 50rpx);
				}
				.gray-btn{
					background: #999 !important;
				}
				.invite-btn{
					padding: 18rpx 0;
					text-align: center;
					color: $uni-text-color-inverse;
				}
			}
		}
	}
</style>
