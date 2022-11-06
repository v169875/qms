<template>
	<!-- 会员体验卡 -->
	<view class="mine-vip-test-card-content">
		<top-navbar :title="title" :isShowBorder="true"></top-navbar>
		<u-gap height="36"></u-gap>
		<view class="vip-test-top m-l-32 m-r-32 radius-20 p-t-34 p-l-34 p-r-34 p-b-44 text-white">
			<view class="flex col-top">
				<u-avatar size="104" :src="userInfo.avatar_format"></u-avatar>
				<view class="font-30 m-l-26 p-t-4">
					<view class="text-bold">{{userInfo.nickname || '暂无'}}</view>
					<view class="m-t-16">剩余选课次数：{{mineVipInfo.times || 0}}次</view>
					<view class="m-t-16 font-26">到期时间：{{mineVipInfo.end_time_format || '暂无体验次数'}}</view>
				</view>
			</view>
		</view>
		<view class="font-28 m-t-26 text-333 text-bold text-center activity-title">已选课程</view>
		<u-gap height="16"></u-gap>
		<view class="vip-test-list">
			<block v-if="vipTestList.length > 0">
				<view class="flex col-center m-l-36 p-r-34 p-b-30 p-t-28 vip-test-item" v-for="(item,index) in vipTestList" :key="index">
					<u-image width="153rpx" height="153rpx" border-radius="6" :src="item.classes_info[0].classes_info.classes_cover_image_format" mode="aspectFill"></u-image>
					<view class="u-flex-1 m-l-24">
						<view class="hidden_two course-title m-b-22">{{item.classes_info[0].classes_info.classes_name}}</view>
						<view class="text-666 font-28 flex col-center">
							<u-avatar size="46" :src="item.school.school_cover_image_format"></u-avatar>
							<text class="m-l-14">{{item.school.school_name}}</text>
						</view>
					</view>
				</view>
			</block>
			<view class="" v-else>
				<u-gap height="100"></u-gap>
				<u-empty text="暂无课程" mode="data"></u-empty>
			</view>
		</view>
	</view>
</template>

<script>
  let app = getApp();
	export default {
		data() {
			return {
				title:'会员体验卡',
				vipTestList:[],
        listQuery:{
          page:1,
          limit:15,
        },
        isLoad:false,
        mineVipInfo:{}, //我的会员卡信息
        userInfo:{}, 
			};
		},
		onLoad() {
      this.getUserInfo();
			this.getMineVipTestList();
		},
		onReachBottom() {
			this.getMineVipTestList();
		},
		methods:{
      getUserInfo(){
        app.getUserInfo();
        uni.$on('userInfo',(data)=>{
        	this.userInfo = data;
          this.getMineVipInfo();
        })
      },
      // 获取我的会员体验卡信息
      async getMineVipInfo(){
        const res = await this.$api.getMyTcoupon();
        if(res.code == 1){
          this.mineVipInfo = res.data;
        }
      },
      // 获取已选会员体验课列表
			async getMineVipTestList(){
        if(this.isLoad) return;
        this.isLoad = true;
				const res = await this.$api.tcoupon_getOrderList(this.listQuery);
        if(res.code == 1){
          if(res.data.data.length > 0){
            this.vipTestList = this.vipTestList.concat(res.data.data);
            this.listQuery.page++;
            this.isLoad = false;
          }else{
            this.isLoad = false;
          }
        }
			},
		}
	}
</script>

<style lang="scss" scoped>
	.mine-vip-test-card-content{
		.vip-test-top{
			height: 220rpx;
			background: url('../../../static/mine/mine-vip-test-top-bg.png') no-repeat center center / cover;
		}
		.vip-test-list{
			.vip-test-item{
				border-bottom: 1px solid rgba(181, 181, 181, .1);
				.course-title{
					height: 76rpx;
				}
			}
		}
	}
</style>
