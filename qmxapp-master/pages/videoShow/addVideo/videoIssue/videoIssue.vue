<template>
  <view class="video-issue-content">
    <top-navbar :title="title"></top-navbar>
    <view class="issue-body flex row-between">
      <u-input type="textarea" v-model="videoIssueForm.video_title" :clearable="false" placeholder="写标题并使用合适的话题，能让更 多的人看到~"></u-input>
      <view class="video-cover-image flex col-center row-center rela" @tap="handleChooseCoverImage()">
        <u-icon name="plus" size="60" color="#fff" v-if="videoIssueForm.video_cover_image == ''"></u-icon>
        <u-image width="100%" height="100%" :src="videoIssueForm.video_cover_image" mode="aspectFill" v-else></u-image>
        <view class="abso choose-cover-title">选择视频封面</view>
      </view>
    </view>
    <view class="dyan-btn issue-btn">
    	<view class="btn-1">
    		<u-button :custom-style="customBtnStyle1" shape="circle" :hair-line="false" @click="handleIssueBtn()">发布</u-button>
    	</view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        title:'发布',
        videoIssueForm:{
          video_title:'', //视频标题
          video_image:'', //视频地址
          video_cover_image:'', //视频封面完整路径，展示用
          video_half_image:'',  //视频半截的路径，提交用
        },
        customBtnStyle1:getApp().globalData.customStyle1,
        location:{},
      };
    },
    onLoad(options) {
      if(options.video_url){
        this.videoIssueForm.video_image = options.video_url;
        let location = uni.getStorageSync('location');
        if(location){
          this.location = location;
          console.log('rrrr',this.location);
        }
      }
    },
    methods:{
      // 点击选择封面
      handleChooseCoverImage(){
        uni.chooseImage({
          count:1,
          sourceType:['album','camera'],
          sizeType:['original','compressed'],
          success:(res)=> {
            this.setImgUpload(res.tempFilePaths[0]);
          }
        })
      },
      // 上传图片
      async setImgUpload(path){
      	let data = {
      		file:path,
      		name:'file',
      	}
      	const res = await this.$api.fileUpload(data);
      	if(res.code == 1){
      		this.videoIssueForm.video_cover_image = res.data.fullurl;  //完整路径，展示用
      		this.videoIssueForm.video_half_image = res.data.url;  //半截路径，上传用
      	}
      },
      // 点击发布按钮
      async handleIssueBtn(){
        let data = {
          video_title:this.videoIssueForm.video_title,  //视频标题
          video_cover_image:this.videoIssueForm.video_half_image,  //视频封面，提交半截路径
          video_image:this.videoIssueForm.video_image,  //视频地址，半截路径
          lng:this.location.lng,
          lat:this.location.lat,
        };
        const res = await this.$api.videoStore(data);
        if(res.code == 1){
          this.$u.toast(res.msg);
          setTimeout(()=>{
            this.$u.route({
              type:'back',
              delta:2,
            })
          },300)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .video-issue-content{
    .issue-body{
      margin: 0 34rpx;
      padding: 34rpx 0;
      border-bottom: 1px solid #F5F5F5;
      .video-cover-image{
        width: 200rpx;
        height: 200rpx;
        background: #ccc;
        border-radius: 10rpx;
        overflow: hidden;
        margin-left: 60rpx;
        .choose-cover-title{
          bottom: 10rpx;
          width: 100%;
          text-align: center;
          color:#fff;
        }
      }
    }
    .issue-btn{
      position: fixed;
      bottom: 150rpx;
    }
  }
</style>
