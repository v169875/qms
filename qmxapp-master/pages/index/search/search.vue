<template>
	<!-- 点击输入框进入 搜索 -->
	<view class="search-content">
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
			<!-- <u-search 
        v-model="keyword" 
        placeholder="请输入搜索内容" 
        input-align="center" 
        disabled :show-action="false" 
        @click="$u.route({url:`/pages/index/search/searchResult/searchResult`})">
      </u-search> -->
		</view>
		<view class="search-history p-l-36 p-r-36 p-b-10">
			<view class="history-title flex col-center row-between m-t-30 m-b-26">
				<view class="text-333 text-bold">历史记录</view>
				<view class="text-666" @tap="handleClearSearchHistory()">清空</view>
			</view>
			<view class="flex flex-wrap history-list">
				<block v-if="historyList.length > 0">
					<view class="m-r-14 m-b-16 history-item text-999 font-22" v-for="(item,index) in historyList" :key="index">{{item.keywords}}</view>
				</block>
				<block v-else>
					<view class="p-30 text-center text-999 u-flex-1">暂无搜索历史</view>
				</block>
			</view>
		</view>
    <!-- 课程店铺tab -->
    <u-gap height="33"></u-gap>
    <view class="tab-row flex row-center col-center">
    	<view :class="{'active-tab':tabIndex == index}" v-for="(item,index) in tabList" :key="index" @tap="handleChangeTab(index)">{{item}}</view>
    </view>
    <u-gap height="35"></u-gap>
    <!-- 课程显示 -->
    <view class="" v-if="tabIndex == 0">
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
        <u-gap height="60"></u-gap>
        <u-empty text="暂无课程" mode="list"></u-empty>
        <u-gap height="60"></u-gap>
      </view>
    </view>
    <!-- 店铺显示 -->
    <view class="store-list p-l-34" v-if="tabIndex == 1">
    	<block v-if="storeList.length > 0">
    		<view class="store-item p-b-24 m-b-20 flex col-center" v-for="(item,index) in storeList" :key="index" @tap="handleOrganizationDetail(item)">
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
      <view class="" v-else>
        <u-gap height="60"></u-gap>
        <u-empty text="暂无店铺" mode="list"></u-empty>
        <u-gap height="60"></u-gap>
      </view>
    </view>
		<u-gap height="20" bg-color="#F5F5F5"></u-gap>
		<view class="font-28 m-t-26 text-333 text-bold text-center activity-title">猜你喜欢</view>
		<u-gap height="30"></u-gap>
		<view class="">
			<view class="course-list" v-if="hotList.length > 0">
				<block v-for="(item,index) in hotList" :key="index">
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
		</view>
		<u-gap height="30"></u-gap>
		<u-modal v-model="clearModal" content="是否清空搜索历史？" show-cancel-button @confirm="handleConfirmClear"></u-modal>
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
				title:'搜索',
				keyword:'',
        tabList:['课程','店铺'],
        tabIndex:0,
        courseList:[],  //课程列表
        storeList:[], //店铺列表
				historyList:[], //历史记录列表
				// 历史记录
				historyQuery:{
					page:1,
					limit:15,
				},
        // 课程或者店铺列表查询
        listQuery:{
        	page:1,
        	limit:15,
          keywords:'',
        },
        // 猜你喜欢查询
				hotListQuery:{
					page:1,
					limit:15,
				},
        hotList:[], //猜你喜欢列表数据
        hotIsLoad:false,  //猜你喜欢是否加载
				isLoad:false, //课程或者店铺是否加载
				clearModal:false,
				location:{},
        isNotData:false,  //课程或者店铺没有更多数据了
			};
		},
		onLoad() {
			let location = uni.getStorageSync('location');
			if(location){
				this.location = location;
        this.getCourseList();
			}
		},
		onShow() {
			this.gethistoryList();
		},
		onReachBottom() {
      // 如果是true就代表没有更多课程或者更多店铺了，就加载猜你喜欢
      if(this.isNotData){
        this.getHotList(this.location.citys);
      }else{
        if(this.tabIndex == 0){
        	this.getCourseList();
        }else{
        	this.getStoreList();
        }
      }
      
		},
		methods:{
			// 获取搜索历史
			async gethistoryList(){
				const res = await this.$api.searchList(this.historyQuery);
				if(res.code == 1){
					this.historyList = res.data.data;
				}
			},
			// 显示清空搜索历史弹窗
			handleClearSearchHistory(){
				this.clearModal = true;
			},
			// 确认清除搜索历史
			async handleConfirmClear(){
				const res = await this.$api.delAllSearch();
				if(res.code == 1){
					this.$u.toast(res.msg);
					this.gethistoryList();
				}
			},
      // 点击机构详情
      handleOrganizationDetail(item){
      	let params = {
      		school_id:item.id,
      	};
      	this.$u.route({
      		url:'/pages/index/organizationDetail/organizationDetail',
      		params:params
      	})
      },
			// 获取猜你喜欢 && 推荐课程
			async getHotList(citys){
				if(this.hotIsLoad) return;
				this.hotIsLoad = true;
				let data = {
					citys:citys,
					...this.hotListQuery,
				}
				const res = await this.$api.getHotClassesList(data);
				if(res.code == 1){
					if(res.data.data.length > 0){
						this.hotList = this.hotList.concat(res.data.data);
						this.hotListQuery.page++;
						this.hotIsLoad = false;
					}else{
						this.hotIsLoad = false;
					}
				}
			},
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
            if(res.data.data.length < 15){
              this.isNotData = true;
              this.getHotList(this.location.citys);
            }
      			this.storeList = this.storeList.concat(res.data.data);
      			this.listQuery.page++;
      			this.isLoad = false;
      		}else{
      			this.isLoad = false;
            this.isNotData = true;
            this.getHotList(this.location.citys);
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
            if(res.data.data.length < 15){
              this.isNotData = true;
              this.getHotList(this.location.citys);
            }
      			this.courseList = this.courseList.concat(res.data.data);
      			this.listQuery.page++;
      			this.isLoad = false;
      		}else{
      			this.isLoad = false;
            this.isNotData = true;
            this.getHotList(this.location.citys);
      		}
      	}
      },
		}
	}
</script>

<style lang="scss" scoped>
	.search-content{
		.history-list{
			.history-item{
				background: #F5F5F5;
				border-radius: 60rpx;
				padding: 8rpx 38rpx;
			}
		}
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
