<template>
	<!-- 消息 -->
	<view class="message-content">
		<top-navbar :isBack="false" :title="title"></top-navbar>
		<u-gap height="31"></u-gap>
		<view class="msg-top flex col-center row-center">
			<view class="flex-col col-center msg-top-item" style="position: relative;" v-for="(item,index) in topList" :key="index" @tap="handleSysToast(index)">
				<u-image width="93rpx" height="93rpx" :src="`/static/message/message-top-icon${item.icon}.png`" mode="aspectFit"></u-image>
				<view class="m-t-20 font-26">{{item.title}}</view>
        <!-- 收到的赞显示 -->
        <u-badge type="error" :count="unreadInfo.like_unread_count" :offset="[0,0]" v-if="index == 0 && unreadInfo.like_is_msg"></u-badge>
        <!-- 收到的评论 -->
        <u-badge type="error" :count="unreadInfo.video_unread_count" :offset="[0,0]" v-if="index == 1 &&  unreadInfo.video_is_msg"></u-badge>
			</view>
		</view>
		<u-gap height="34"></u-gap>
		<u-gap height="20" bg-color="#F5F5F5"></u-gap>
		<!-- 服务通知 -->
    <view class="message-list flex col-center row-between m-l-20 p-r-10" @tap="handleSysToast(2)">
      <u-avatar mode="square" src="/static/message/message-list-icon1.png" :size="92"></u-avatar>
      <view class="title-wrap u-flex-1">
      	<view class="flex row-between">
      		<view class="font-30 user-name hidden_one u-flex-1">{{noticeInfo.title}}</view>
      		<view class="font-22 dialog-time">{{noticeInfo.createtime_format}}</view>
      	</view>
      	<view class="title flex col-center row-between">
      		<view class="hidden_one" style="visibility: hidden;">系统消息</view>	
      		<!-- <view class="badge flex col-center row-center" v-if="item.list.count > 0">{{item.list.count > 100 ? '...' : item.list.count || ''}}</view> -->
      	</view>
      </view>
    </view>
		<!-- 平台客服 -->
    <view class="message-list flex col-center row-between m-l-20 p-r-10" @tap="handleSysToast(3)">
      <u-avatar mode="square" src="/static/message/message-list-icon1.png" :size="92"></u-avatar>
      <view class="title-wrap u-flex-1">
      	<view class="flex row-between">
      		<view class="font-30 user-name hidden_one u-flex-1">平台客服</view>
      		<view class="font-22 dialog-time"></view>
      	</view>
      	<view class="title flex col-center row-between">
      		<view class="hidden_one">点击咨询平台客服</view>	
      		<!-- <view class="badge flex col-center row-center" v-if="item.list.count > 0">{{item.list.count > 100 ? '...' : item.list.count || ''}}</view> -->
      	</view>
      </view>
    </view>

    <!-- 系统消息 -->
    <view class="message-list flex col-center row-between m-l-20 p-r-10" @tap="handleSysToast(4)" v-if="sysMsgInfo.title">
      <u-avatar mode="square" src="/static/message/message-list-icon1.png" :size="92"></u-avatar>
      <view class="title-wrap u-flex-1">
      	<view class="flex row-between">
      		<view class="font-30 user-name hidden_one u-flex-1">{{sysMsgInfo.title}}</view>
      		<view class="font-22 dialog-time">{{sysMsgInfo.createtime_format}}</view>
      	</view>
      	<view class="title flex col-center row-between">
      		<view class="hidden_one">{{sysMsgInfo.content}}</view>
      		<view class="badge flex col-center row-center font-24" v-if="unreadInfo.all_is_msg">{{unreadInfo.all_unread_count > 100 ? '···' : unreadInfo.all_unread_count}}</view>
      	</view>
      </view>
    </view>
    <!-- <web-view v-if="serveSrc != ''" :src="serveSrc"></web-view> -->
		<!-- <u-tabbar v-model="current" icon-size="54" :border-top="false" inactive-color="#999" active-color="#3077FB" :list="tabbarList"></u-tabbar> -->
	</view>
</template>

<script>
  let app = getApp();
	import {tabbar} from '@/utils/tabBar.js';
	export default {
		data() {
			return {
				title:'消息',
				current:3,
				tabbarList:tabbar,
				topList:[
					{icon:1,title:'收到的赞'},
					{icon:2,title:'收到的评论'},
				],
        sysMsgInfo:{}, //第一条系统消息
        noticeInfo:{},  //第一条通知消息
        unreadInfo:{}, //未读消息内容
        num:1000,
			};
		},
    onShow() {
      // uni.hideTabBar();
      this.getNoticeList();
      this.getSysMsg();
      this.getUnreadMsgInfo();
    },
		methods:{
			// 点击的消息类型
			handleSysToast(type){
				let url = '';
				let params = {
          msgType:'',
        };
				// type值未 0,1,2,3,4
				//0=收到的赞,1=收到的评论,2=服务通知,3=平台客服,4=商家客服
				switch(type){
					case 0: //收到的赞
            params.msgType = 9;
						break;
					case 1: //收到的评论
            params.msgType = 3;
						break;
					case 2: //服务通知
            params.msgType = 2;
						break;
					case 3: //平台客服
            url = '/pages/message/serveDialog/serveDialog';
            this.$u.route({
            	url:url,
            })
            return
						break;
					case 4: //系统消息
            params = {
              msgType:99,
              allMsg:true,
            };
						break;
				}
				url = '/pages/message/msgList/msgList';
				this.$u.route({
					url:url,
					params:params,
				})
			},
      // 获取系统消息
      async getSysMsg(){
        const res = await this.$api.getSystemMessageList();
        if(res.code == 1){
          if(res.data.data.length > 0){
            this.sysMsgInfo = res.data.data[0];
          }
        }
      },
      // 获取通知消息
      async getNoticeList(){
        const res = await this.$api.getNoticeList();
        if(res.code == 1){
          if(res.data.data.length > 0){
            this.noticeInfo = res.data.data[0];
          }
        }
      },
      // 获取未读消息
      async getUnreadMsgInfo(){
        const res = await this.$api.getSystemMessage();
        if(res.code == 1){
          this.unreadInfo = res.data;
        }
      }
		}
	}
</script>

<style lang="scss" scoped>
	.message-content{
    .message-list{
      margin-bottom: 20rpx;
      padding-bottom: 20rpx;
      padding-top: 20rpx;
      border-bottom: 1px solid #eee;
    }
		.msg-top{
			>view:last-child{
				margin-left: 148rpx;
			}
      .msg-top-item{
        width: calc(100% / 5 - 20rpx);
      }
		}
		.msg-item {
			display: flex;
			padding: 20rpx 35rpx;
		}
		image {
			width: 120rpx;
			flex: 0 0 120rpx;
			height: 120rpx;
			margin-right: 20rpx;
			border-radius: 12rpx;
		}
		.title-wrap{
			margin-left: 17rpx;
			.user-name{
				width: 70%;
				font-weight: bold;
			}
			.dialog-time{
				color: #B0B0B0;
			}
			.title {
				text-align: left;
				font-size: 28rpx;
				color: #999;
				margin-top: 12rpx;
			}
      .badge{
        background: #fa3534;
        border-radius: 100rpx;
        padding: 2rpx 8rpx;
        color: #fff;
      }
		}
	}
</style>
