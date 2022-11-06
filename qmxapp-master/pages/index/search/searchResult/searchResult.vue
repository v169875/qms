<template>
	<!-- 搜索结果   此页不用了-->
	<view class="search-result-content">
		<top-navbar :title="title"></top-navbar>
		<u-gap height="30"></u-gap>
		<view class="p-l-50 p-r-50">
			<u-search 
				v-model="listQuery.keywords" 
				placeholder="请输入搜索内容" 
				input-align="center" 
				:show-action="true" 
				:animation="true" 
				:clearabled="false"
				@custom="handleSearchList"
			></u-search>
		</view>
		<u-gap height="33"></u-gap>
		<view class="tab-row flex row-center col-center">
			<view :class="{'active-tab':tabIndex == index}" v-for="(item,index) in tabList" :key="index" @tap="handleChangeTab(index)">{{item}}</view>
		</view>
		<u-gap height="35"></u-gap>
		<!-- 课程显示 -->
		<view class="" v-if="tabIndex == 0">
			<view class="course-list" v-if="courseList.length > 0">
				<block v-for="(item,index) in courseList" :key="index">
					<course-card :courseItem="item"></course-card>
				</block>
			</view>
			<view class="middleC" v-else>
				<u-empty text="暂无课程" mode="list"></u-empty>
			</view>
		</view>
		<!-- 店铺显示 -->
		<view class="store-list p-l-34" v-if="tabIndex == 1">
			<block v-if="storeList.length > 0">
				<view class="store-item p-b-24 m-b-20 flex col-center" v-for="(item,index) in storeList" :key="index">
					<u-image width="152rpx" height="152rpx" border-radius="10" :src="item.school_cover_image_format" mode="aspectFill"></u-image>
					<view class="u-flex-1 m-l-36">
						<view class="font-28 text-black text-bold">{{item.school_name}}</view>
						<view class="m-t-18 m-b-20">
							<u-rate 
								:count="5" 
								v-model="item.score" 
								active-icon="star-fill" 
								inactive-icon="star-fill" 
								active-color="#F6D350" 
								inactive-color="#999999" 
								disabled></u-rate>
							<text class="m-l-16 font-24 text-333">{{item.score}}分</text>
						</view>
						<view class="hidden_one font-26 text-333">{{item.school_desc}}</view>
					</view>
				</view>
			</block>
			<view class="middleC" v-else>
				<u-empty text="暂无店铺" mode="list"></u-empty>
			</view>
			<u-gap height="30"></u-gap>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:'搜索结果',
				tabList:['课程','店铺'],
				tabIndex:0,
				courseList:[],
				storeList:[],
				location:{},
				listQuery:{
					page:1,
					keywords:'',
				},
				isLoad:false,
			};
		},
		onLoad() {
      
			let location = uni.getStorageSync('location');
			if(location){
				this.location = location;
				this.getCourseList();
			}
		},
		onReachBottom() {
			// 根据当前tab触底 加载不同列表
			if(this.tabIndex == 0){
				this.getCourseList();
			}else{
				this.getStoreList();
			}
		},
		methods:{
			// 点击搜索
			async handleSearchList(){
				let data = {
					keywords:this.listQuery.keywords,
				}	
				const res = await this.$api.searchStore(data);//添加搜索历史
				if(res.code == 1){
					this.listQuery.page = 1;
					this.isLoad = false;
					if(this.tabIndex == 0){
						this.courseList = [];
						this.getCourseList();
					}else{
						this.storeList = [];
						this.getStoreList();
					}
				}
			},
			// 切换tab
			handleChangeTab(idx){
				if(this.tabIndex == idx) return;
				this.tabIndex = idx;
				this.listQuery.page = 1;
				this.isLoad = false;
				if(this.tabIndex == 0){
					this.courseList = [];
					this.getCourseList();
				}else{
					this.storeList = [];
					this.getStoreList();
				}
			},
			// 获取店铺列表
			async getStoreList(){
				if(this.isLoad) return;
				this.isLoad = true;
				let data = {
					...this.location,
					...this.listQuery,
				}
				const res = await this.$api.getSchoolList(data);
				if(res.code == 1){
					if(res.data.data.length > 0){
						this.storeList = this.storeList.concat(res.data.data);
						this.listQuery.page++;
						this.isLoad = false;
					}else{
						this.isLoad = false;
					}
				}
			},
			// 获取课程列表
			async getCourseList(){
				if(this.isLoad) return;
				this.isLoad = true;
				let data = {
					...this.location,
					...this.listQuery,
				}
				const res = await this.$api.getClassesList(data);
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
		}
	}
</script>

<style lang="scss" scoped>
	.search-result-content{
		.tab-row{
			>view{
				border: 1px solid #3077FB;
				color: #3077FB;
				width: 241rpx;
				padding: 16rpx 0;
				text-align: center;
			}
			>view:first-child{
				border-top-left-radius: 60rpx;
				border-bottom-left-radius: 60rpx;
			}
			>view:last-child{
				border-top-right-radius: 60rpx;
				border-bottom-right-radius: 60rpx;
			}
			.active-tab{
				background: #3077FB;
				color: $uni-text-color-inverse;
			}
		}
		.store-list{
			.store-item{
				border-bottom: 1px solid rgba(153, 153, 153, .1);
			}
		}
	}
</style>
