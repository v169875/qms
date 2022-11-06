<template>
  <!-- 机构分类搜索 -->
  <view class="store-search-content">
    <top-navbar :title="title" :isShowBorder="true"></top-navbar>
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
    <u-gap height="30"></u-gap>
    <view class="store-list p-l-34" v-if="storeList.length > 0">
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
    </view>
    <view class="" v-else>
      <u-gap height="60"></u-gap>
      <u-empty text="暂无店铺" mode="list"></u-empty>
      <u-gap height="60"></u-gap>
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
  </view>
</template>

<script>
  export default {
    data() {
      return {
        title:'机构分类',
        cate_id:null,
        location:{},
        listQuery:{
        	page:1,
        	limit:15,
          keywords:'',
          category_id:null,
        },
        isLoad:false,
        isNotData:false, //是否还有更多店铺
        storeList:[],
        // 猜你喜欢查询
        hotListQuery:{
        	page:1,
        	limit:15,
        },
        hotList:[], //猜你喜欢列表数据
        hotIsLoad:false,  //猜你喜欢是否加载
      };
    },
    onLoad(options) {
      console.log('kkkkkkk',uni.getStorageSync('location'))
      let location = uni.getStorageSync('location');
      if(location){
        this.location = location;
      }
      if(options.cate_id){
        this.listQuery.category_id = options.cate_id;
        this.getStoreList();
      }
      
    },
    onReachBottom() {
      if(this.isNotData){
        this.getHotList(this.location.citys);
      }else{
        this.getStoreList();
      }
    },
    methods:{
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
      // 点击搜索
      handleSearchList(){
        this.listQuery.page = 1;
        this.isNotData = false;
        this.isLoad = false;
        this.storeList = [];
        
        this.hotIsLoad = false;
        this.hotListQuery.page = 1;
        this.hotList = [];
        this.getStoreList();
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
    }
  }
</script>

<style lang="scss" scoped>
  .store-search-content{
    .store-list{
      .store-item{
        border-bottom: 1px solid rgba(153, 153, 153, .1);
      }
    }
  }
</style>
