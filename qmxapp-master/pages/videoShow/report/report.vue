<template>
  <!-- 举报 -->
  <view class="report-content">
    <top-navbar :title="title"></top-navbar>
    <u-gap height="30"></u-gap>
    <view class="report-row">
      <view class="report-title flex col-center row-between">
        <view>举报理由：</view>
        <view class="flex col-center report-tag" @tap="handleShowSelectReport()">
          <view class="m-r-10">{{submitForm.reportText}}</view>
          <u-icon name="arrow-down-fill" color="#666666" size="28"></u-icon>
        </view>
      </view>
      <u-gap height="38"></u-gap>
      <view class="report-title">
        <view class="m-b-20">文字说明：</view>
        <u-input type="textarea" height="140" :clearable="false" :auto-height="true" placeholder="请写下您精彩的反馈" border></u-input>
      </view>
      <u-gap height="38"></u-gap>
      <view class="report-title">
        <view class="m-b-20">图片证据：</view>
        <u-upload
        	ref="uUpload"
        	:action="action" 
        	:header="header"
        	:auto-upload="true"
        	width="140"
        	height="140"
        	max-count="9"
        	:show-progress="false"
        	:custom-btn="true"
        	@on-success="handleUploadSuccess"
        	@on-remove="handleRemoveImg"
        >
        	<u-image class="m-10" width="140" height="140" max-count="9" slot="addBtn" src="/static/mine/upload-icon.png" mode="aspectFit"></u-image>
        </u-upload>
      </view>
    </view>
    <u-gap height="164"></u-gap>
    <view class="dyan-btn">
    	<view class="btn-1">
    		<u-button 
    			:custom-style="customBtnStyle1" 
    			shape="circle" 
    			:hair-line="false" 
    			@click="handleSubmitReport()">
    			提交
    		</u-button>
    	</view>
    </view>
    <u-select v-model="reportShow" value-name="report_content" label-name="report_content" :list="reportList" @confirm="handleSelectReport"></u-select>
  </view>
</template>

<script>
  import config from '@/utils/config.js';
  export default {
    data() {
      return {
        title:'举报',
        action: config.httpUrl + 'api/common/upload1',  //图片上传路径
        header:{
        	token:uni.getStorageSync('token'),
        },
        fileList: [],
        customBtnStyle1:getApp().globalData.customStyle1,
        reportList:[], //举报内容列表
        // 举报表单
        submitForm:{
          reportText:'', //举报标题
          reportContent:'', // 举报内容
        },
        reportShow:false,
        video_id:null, //视频id
      };
    },
    onLoad(options) {
      if(options.video_id){
        this.video_id = options.video_id * 1;
        console.log('ttt',this.video_id)
        this.getReportList();
      }
    },
    methods:{
      // 获取举报内容列表
      async getReportList(){
        const res = await this.$api.reportList();
        if(res.code == 1){
          this.reportList = res.data;
          console.log('yyyy',this.reportList[0])
          this.submitForm.reportText = res.data[0].report_content;
        }
      },
      // 监听图片上传成功
      handleUploadSuccess(data, index, lists, name){
      	this.fileList.push(data.data.url);
      },
      // 监听移除图片
      handleRemoveImg(index, lists, name){
      	this.fileList.splice(index,1);
      },
      // 点击选择举报内容
      handleSelectReport(e){
        this.submitForm.reportText = e[0].value;
      },
      // 点击显示选择举报列表
      handleShowSelectReport(){
        this.reportShow = !this.reportShow;
      },
      // 点击提交举报信息
      async handleSubmitReport(){
        let data = {
          video_id:this.video_id,
          report_content:this.submitForm.reportText,
          content:this.submitForm.reportContent,
          images:this.fileList.join(',')
        };
        const res = await this.$api.reportStore(data);
        if(res.code == 1){
          this.$u.toast(res.msg);
          setTimeout(()=>{
            this.$u.route({
              type:'back',
            })
          },500)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .report-content{
    font-size: 26rpx;
    .report-row{
      padding:0 37rpx;
      .report-title{
        width: 100%;
        .report-tag{
          padding: 8rpx 16rpx;
          border: 1px solid #999999;
          border-radius: 10rpx;
        }
      }
    }
  }
</style>
