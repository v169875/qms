<template>
	<!-- 活动中心 -->
	<view class="active-center-content">
		<top-navbar :title="title"></top-navbar>
		<u-gap height="39"></u-gap>
		<view class="active-center-item m-l-36 m-r-36 m-b-38">
			<view class="active-center-img rela">
				<u-swiper :list="vipList" height="100%" name="cover_image_format" @change="handleChangeSwiper"></u-swiper>
				<view class="active-time abso font-22 text-white" style="visibility: hidden;">活动时间：05/27-06/27</view>
			</view>
			<view class="flex col-center row-between active-item-bottom m-t-26" v-if="vipList.length > 0">
				<view class="font-28 text-black hidden_one u-flex-1">{{vipList[swiperIdx].t_name || ''}}</view>
				<view class="text-white font-28 detail-btn" @tap="handleActiveItem(vipList[swiperIdx],'vip')">查看详情</view>
			</view>
		</view>
		<!-- 第一条置顶为会员体验卡 -->
		<view class="active-center-item m-l-36 m-r-36 m-b-38" v-for="(item,index) in activeList" :key="index">
			<view class="active-center-img rela">
				<u-image height="100%" width="100%" border-radius="20" :src="item.cover_image_format" mode="aspectFill"></u-image>
				<view class="active-time abso font-22 text-white">活动时间：{{$u.timeFormat(item.start_time, 'mm/dd')}}-{{$u.timeFormat(item.end_time, 'mm/dd')}}</view>
			</view>
			<view class="flex col-center row-between active-item-bottom m-t-26">
				<view class="font-28 text-black hidden_one u-flex-1">{{item.active_name || ''}}</view>
				<view class="text-white font-28 detail-btn" @tap="handleActiveItem(item,'active')">查看详情</view>
			</view>
		</view>
		<u-gap height="30"></u-gap>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:'活动中心',
				vipList:[], //会员体验卡配置列表
				vipIds:[], //会员卡会员id数组
				swiperIdx:0, //轮播图下标
				activeList:[],
				listQuery:{
					page:1,
					limit:10,
				},
				isLoad:false,
			};
		},
		onLoad() {
			this.getVipTestList();
			this.handleGetActiveList();
		},
		onReachBottom() {
			this.handleGetActiveList();
		},
		methods:{
			// 获取体验卡配置列表
			async getVipTestList(){
				this.vipIds = [];
				const res = await this.$api.activeDcoupnConfig();
				if(res.code == 1){
					this.vipList = res.data;
					this.vipList.map((item)=>{
						this.vipIds.push({title:item.t_name,id:item.id});
					})
				}
			},
			// 轮播图自动切换
			handleChangeSwiper(idx){
				this.swiperIdx = idx;
			},
			// 获取活动列表
			async handleGetActiveList(){
				if(this.isLoad) return;
				this.isLoad = true;
				const res = await this.$api.getActiveList(this.listQuery);
				if(res.code == 1){
					if(res.data.data.length > 0){
						this.activeList = this.activeList.concat(res.data.data);
						this.listQuery.page++;
						this.isLoad = false;
					}else{
						this.isLoad = false;
					}
				}
			},
			// 点击每项活动
			handleActiveItem(item,type){
				let url = '';
				let params = {};
				// 根据不同类型的活动跳转到不同的页面,会员体验卡或者活动详情，根据后续接口返回值跳转
				if(type == 'vip'){ 
					url = '/pages/growup/activityCenter/vipCardTest/vipCardTest';
					params = {
						vip_type_id:item.id,
						vip_ids:JSON.stringify(this.vipIds),
					}
				}else if(type == 'active'){
					url = '/pages/growup/activityCenter/activityDetail/activityDetail';
					params = {
						active_id:item.id,
					}
				}else{
					this.$u.toast(`系统错误，请重试！`);
				}
				this.$u.route({
					url:url,
					params:params,
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.active-center-content{
		.active-center-item{
			.active-center-img{
				height: 310rpx;
				.active-time{
					bottom: 16rpx;
					left: 11rpx;
					background: rgba(255,255,255,.3);
					border-radius: 60rpx;
					padding: 13rpx 21rpx;
				}
			}
			.active-item-bottom{
				.detail-btn{
					padding: 14rpx 34rpx;
					background: #3077FB;
					border-radius: 60rpx;
				}
			}
		}
	}
</style>
