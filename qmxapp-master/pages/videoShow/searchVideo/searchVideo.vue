<template>
  <!-- 搜索作品 -->
  <view>
    <top-navbar :title="title"></top-navbar>
    <u-gap height="10"></u-gap>
    <view class="p-l-56 p-r-56">
      <u-search 
        v-model="listQuery.keywords"
        placeholder="请输入搜索内容"
        :show-action="true" 
        action-text="搜索" 
        :animation="true"
        @custom="handleSearchVideo"
        @search="handleSearchVideo"
      ></u-search>
    </view>
    <u-gap height="30"></u-gap>
    <!-- 课程推荐 卡片 -->
    <view class="course-list">
    	<block v-for="(item,index) in videoNewList" :key="index">
    		<course-card 
    			:courseItem="item" 
    			:rowNum="3" 
    			:isShowPriceRow="false" 
    			:isShowPlayIcon="true"
          :videoIndex="index"
          :dataList="videoNewList"
          :listQuery="listQuery"
          :isCourseCard="false"
          isCardType='isVideo'
    			>
    		</course-card>
    	</block>
    </view>
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
        title:'搜索作品',
        videoNewList:[], //视频列表
        listQuery:{
          page:1,
          limit:20,
          keywords:'',
        },
        isLoad:false,
        location:{},
      };
    },
    onLoad() {
      let location = uni.getStorageSync('location');
      if(location){
        this.location = location;
        this.get();
      }
    },
    onReachBottom() {
      this.get();
    },
    methods:{
      async get(){
      	// 这个方法主要就是用来第一次进入视频播放时用来处理的
      	// this.dataList = userList;//这个就是赋值加载视频啦
        if(this.isLoad) return;
        this.isLoad = true;
        let data = {
          ...this.listQuery,
          lng:this.location.lng,
          lat:this.location.lat,
        };
        const res = await this.$api.videoList(data);
        if(res.code == 1){
          if(res.data.data.length > 0){
            let videoList = res.data.data;
            videoList.map((item,index)=>{
              this.$set(item,'isplay',true); //是否播放音频
              this.$set(item,'isShowProgressBarTime',false); //是否显示进度条（默认这个即可）
              this.$set(item,'state','pause'); //初始状态标志（不改）
              this.$set(item,'isShowimage',false); //是否显示封面（默认这个即可）
              this.$set(item,'playIng',false); //播放（默认这个即可）
            })
            this.videoNewList = this.videoNewList.concat(videoList);
            this.listQuery.page++;
            this.isLoad = false;
          }else{
            this.isLoad = false;
          }
        }
      },
      // 点击搜索视频
      handleSearchVideo(){
        this.listQuery.page = 1;
        this.videoNewList = [];
        this.isLoad = false;
        this.get();
      }
    }
  }
</script>

<style lang="scss">

</style>
