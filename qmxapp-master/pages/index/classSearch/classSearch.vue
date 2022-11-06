<template>
	<!-- 分类搜索 -->
	<view class="class-search-content">
		<top-navbar :title="title"></top-navbar>
		<u-gap height="30"></u-gap>
		<view class="p-l-50 p-r-50">
			<u-search 
				v-model="keyword" 
				placeholder="请输入搜索内容" 
				input-align="center" 
				:show-action="true"
				:animation="true" 
				:clearabled="false"
				@custom="handleSearchList"
			></u-search>
		</view>
		<u-gap height="30"></u-gap>
		<view class="top-tab">
			<u-tabs-swiper 
				ref="uTabs" :list="tabsList" 
				:current="current" 
				@change="tabsChange"
				font-size="28"
				bar-width="52"
				bar-height="16"
				name="title"
				inactive-color="#666666"
				active-color="#333333"
			  swiperWidth="750"
			></u-tabs-swiper>
		</view>
		<view class="sort-row m-t-38 m-l-36 m-r-36 flex col-center row-between">
			<view class="flex col-center">
				<view class="font-26 text-666 rela">
					<view class="select-sort-type flex row-center col-center" @tap="handleShowSortDist()">
						<text class="m-r-6">{{distSortList[distIndex].title}}</text>
						<u-icon name="arrow-down-fill" color="#999999" size="15"></u-icon>
					</view>
					<view class="abso sort-item" v-if="distSortShow" :class="{'animation-slide-top':distSortShow}">
						<view :class="{'main-color':distIndex == index}" v-for="(item,index) in distSortList" :key="index" @tap.stop="handleChangeDistType(index)">
							{{item.title}}
						</view>
					</view>
				</view>
				<!-- <view class="font-26 text-666 rela m-l-32">
					<view class="select-sort-type flex row-center col-center" @tap="allSortShow = !allSortShow; distSortShow = false">
						<text class="m-r-6">{{allSortList[allIndex].title}}</text>
						<u-icon name="arrow-down-fill" color="#999999" size="15"></u-icon>
					</view>
					<view class="abso sort-item" v-if="allSortShow" :class="{'animation-slide-top':allSortShow}">
						<view class="" v-for="(item,index) in allSortList" :key="index" @tap="handleChangeAllType(index)">
							{{item.title}}
						</view>
					</view>
				</view> -->
			</view>
			<view class=" font-26 text-666" @tap="handleChangeGlanceMode()">浏览模式</view>
		</view>
		<u-gap height="30"></u-gap>
		<view class="user-avatar"></view>
		<!-- 课程列表 -->
		<swiper class="search-swiper" :style="'height:' + ScrollHeight" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
			<swiper-item class="search-swiper-item" v-for="(swiperItem,swiperIndex) in courseList" :key="swiperIndex">
				<scroll-view class="search-scroll-view" style="width: 100%;height: 100%;" scroll-y @scrolltolower="onreachBottom">
					<view class="course-list" v-if="swiperItem.length > 0">
						<block v-for="(item,index) in swiperItem" :key="index">
							<course-card 
                :courseItem="item" 
                :rowNum="glanceMode ? 2 : 1"
              ></course-card>
						</block>
					</view>
					<view class="middleC" v-else>
						<u-empty text="暂无课程" mode="list"></u-empty>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
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
				title:'分类搜索',
				keyword:'',
				tabsList:[],
				// 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
				current: 0, // tabs组件的current值，表示当前活动的tab选项
				swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
				ScrollHeight:0,
				courseList:[], //课程列表，切记数据最终样式是二维数组  类似[[],[]]
				// 距离排序弹窗显示
				distSortShow:false,
				// 距离分类排序列表
				distSortList:[
					{title:'距离最近'},
					{title:'好评最多'},
					{title:'热度最多'},
				],
				distIndex:0,  //距离排序下标
				// 全部分类弹窗显示
				allSortShow:false,
				// 全部分类排序列表
				allSortList:[
					{title:'全部分类'},
					{title:'XX分类'},
					{title:'SS分类'},
				],
				allIndex:0, //全部分类下标
				glanceMode:true,  //浏览模式
				location:{},
				listQuery:{
					page:1,
					limit:10,
				},
				isLoad:false,
				sort:1, //左一排序，
			};
		},
		onLoad(options) {
			if(options.tabIndex){
				// this.tabsList = JSON.parse(options.tabsList);
				this.swiperCurrent = options.tabIndex * 1;
				this.current = options.tabIndex * 1;
				this.getGoodsClassList(this.swiperCurrent)
			}
		},
		onReady() {
			this.getElInfo();
		},
		watch:{
			swiperCurrent(newVal,oldVal){
        if(this.tabsList.length > 0){
          this.getCourseList(this.location);
        }
				// console.log('sssss',oldVal)
			}
		},
		onReachBottom() {
			this.getCourseList(this.location);
		},
		methods:{
			// 获取首页分类
			async getGoodsClassList(){
				let location = uni.getStorageSync('location');
				if(location){
					this.location = location;
				}
				let data = {
					type:'school',
				}
				const res = await this.$api.getCategoryList(data);
				if(res.code == 1){
					this.tabsList = res.data;
					this.tabsList.map((item)=>{
						this.courseList.push([]); //有多少tab就有多少空数组
					})
					let location = uni.getStorageSync('location');
					if(location){
						this.location = location;
						this.getCourseList(this.location);
					}
				}
			},
			// 获取课程列表
			async getCourseList(location){
				if(this.isLoad) return;
				this.isLoad = false;
				let data = {
					keywords:this.keyword,
					citys:location.citys,
					lng:location.lng,
					lat:location.lat,
					...this.listQuery,
					category_id:this.tabsList[this.swiperCurrent].id,
					sort:this.sort,
				}
				console.log('查看搜索值',this.keyword)
				const res = await this.$api.getClassesList(data);
				console.log('搜索结果',res.data.data);
				if(res.code == 1){
					if(res.data.data.length > 0){
						let result = this.courseList[this.swiperCurrent].concat(res.data.data);
						this.$set(this.courseList,this.swiperCurrent,result);
						this.listQuery.page++;
						this.isLoad = false;
					}else{
						this.isLoad = false;
					}
				}
				
			},
			// tabs通知swiper切换
			tabsChange(index) {
				this.swiperCurrent = index;
			},
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e) {
				let dx = e.detail.dx;
				this.$refs.uTabs.setDx(dx);
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
				this.$refs.uTabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
			},
			// scroll-view到底部加载更多
			onreachBottom() {
				// this.getClassGoodsList()
			},
			// 获取屏幕剩余高度
			getElInfo() {
				this.$u.getRect('.user-avatar').then(res => {
				  let windowHeight = this.$u.sys()
				  this.ScrollHeight = windowHeight.windowHeight - res.top + 'px'
				})
			},
			// 点击搜索课程
			handleSearchList(){
				this.distSortShow = false;
				this.isLoad = false;
				this.$set(this.courseList,this.current,[]);
				// this.courseList[this.current].length = 0;
				this.listQuery.page = 1;
				this.getCourseList(this.location);
			},
      // 点击显示排序弹窗
      handleShowSortDist(){
        this.distSortShow = !this.distSortShow;
      },
			// 点击切换距离排序
			handleChangeDistType(index){
				if(this.distIndex == index) return false;
				this.distIndex = index;
				switch(index){
					case 0: //距离最近
						this.sort = 1;
						break;
					case 1: //好评最多
						this.sort = 2;
						break;
					case 2: //热度最多
						this.sort = 3;
						break;
				}
				this.isLoad = false;
				this.$set(this.courseList,this.current,[]);
				// this.courseList[this.swiperCurrent] = [];
				this.listQuery.page = 1;
				this.distSortShow = false;
				this.getCourseList(this.location);
			},
			// 点击切换全部排序
			handleChangeAllType(index){
				if(this.allIndex == index) return false;
				this.allIndex = index;
			},
			// 切换浏览模式
			handleChangeGlanceMode(){
				this.glanceMode = !this.glanceMode;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.class-search-content{
		.top-tab{
			/deep/.u-scroll-bar{
				background:linear-gradient(to bottom,rgba(255,255,255,.1),#9BBDFD) !important;
				border-radius: 60rpx;
				bottom: 18rpx;
			}
		}
		.sort-row{
			.sort-item{
				left: 0;
        border: 1px solid rgba(153, 153, 153, .1);
        border-radius: 10rpx;
				background: $uni-bg-color;
				padding: 8rpx 10rpx;
				width: 100%;
				z-index: 99999;
				>view{
					margin: 20rpx 0;
				}
			}
			.select-sort-type{
				// border: 1px solid #666;
				padding: 8rpx 16rpx;
				border-radius: 6rpx;
				width: 200rpx;
			}
		}
	}
</style>
