<template>
	<!-- 成长营 -->
	<view class="growup-content">
		<top-navbar :isBack="false" :title="title" :background="navbarBg"></top-navbar>
		<u-gap height="50"></u-gap>
		<view class="flex col-center row-between p-l-74 p-r-74">
			<view class="" v-for="(item,index) in typeList" :key="index" @tap="handleGrowupTop(index)">
				<u-image width="120rpx" height="120rpx" :src="`/static/growup/growup-icon${item.icon}.png`" mode="widthFix"></u-image>
				<view class="text-center m-t-22">{{item.title}}</view>
			</view>
		</view>
		<u-gap height="34"></u-gap>
		<view class="m-l-34 m-r-34" @tap="handleGrowupTop(9)">
			<u-image width="100%" height="300" src="http://oss.fqqmx.com/uploads/%E8%AF%BE%E7%A8%8B%E8%A1%A8%E5%89%AF%E6%9C%AC.png" mode="aspectFit"></u-image>
		</view>
		<u-gap height="42"></u-gap>
		<view class="font-28 text-333 text-bold text-center activity-title">精选活动</view>
		<u-gap height="30"></u-gap>
		<!-- 课程卡片 -->
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
		<!-- <u-tabbar v-model="current" icon-size="54" :border-top="false" inactive-color="#999" active-color="#3077FB" :list="tabbarList"></u-tabbar> -->
	</view>
</template>

<script>
	import {tabbar} from '@/utils/tabBar.js';
	import courseCard from '@/components/course-card/course-card.vue'
	export default {
		components:{
			courseCard
		},
		data() {
			return {
				navbarBg:{
					background:'#fff',
				},
				title:'成长营',
				current:2,
				tabbarList:tabbar,
				typeList:[
					{icon:1,title:'活动中心'},
					{icon:2,title:'资讯中心'},
					{icon:3,title:'心理咨询'},
				],
				courseList:[],
				listQuery:{
					page:1,
					limit:10,
				},
				location:{},
				isLoad:false,
			};
		},
		onLoad() {
			let location = uni.getStorageSync('location');
			if(location){
				this.location = location;
			}
		},
		onShow() {
      // uni.hideTabBar();
			this.isLoad = false;
			this.courseList = [];
			this.listQuery.page = 1;
			this.getCourseList();
		},
		onReachBottom() {
			this.getCourseList();
		},
		methods:{
			async getCourseList(){
				if(this.isLoad) return;
				this.isLoad = true;
				let data = {
					citys:this.location.citys,
					...this.listQuery,
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
			// 点击顶部每项
			handleGrowupTop(idx){
				let url = '';
				switch(idx){
					case 0: //活动中心
						url = '/pages/growup/activityCenter/activityCenter';
						break;
					case 1: // 资讯中心
						url = '/pages/growup/consultCenter/consultCenter';
						break;
					case 2: // 心里咨询
						url = '/pages/message/serveDialog/psychology';
						break;
					case 9: // 课程表
						url = '/pages/growup/courseSchedule/courseSchedule';
						break;
				}
				this.$u.route({
					url:url,
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.growup-content{
		
		
	}
</style>
