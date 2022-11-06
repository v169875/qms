<template>
	<!-- 收到的赞，收到的评论，服务通知，客服消息列表 -->
	<view class="msg-list-content">
		<top-navbar :title="title" :allMsg="allMsg" @onAllMsg="handleAllmsg"></top-navbar>
    <view 
      class="message-list flex col-center row-between m-l-20 p-r-10" 
      v-for="(item,index) in msgList" :key="index"
      @tap="handleReadMsg(item)"
      >
      <view class="flex-center rela">
        <u-avatar mode="square" src="/static/message/message-list-icon1.png" :size="92"></u-avatar>
        <u-badge type="error" :is-dot="true" :offset="[-4,-4]" v-if="item.status == 1"></u-badge>
      </view>
      <view class="title-wrap u-flex-1">
      	<view class="flex row-between">
      		<view class="font-30 user-name hidden_one u-flex-1 m-r-20">{{item.title}}</view>
      		<view class="font-22 dialog-time">{{item.createtime_format}}</view>
      	</view>
      	<view class="title text-666 item-msg-bottom flex row-between col-center">
          <view class="hidden_two u-flex-1">{{item.content ? item.content : ''}}</view>
          <!-- <view class="badge"></view> -->
        </view>
      </view>
    </view>
    <view class="middleC" v-if="msgList.length <= 0">
    	<u-empty text="暂无消息" mode="message"></u-empty>
    </view>
		<u-gap height="60"></u-gap>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:'',
				msgType:0,
				msgObj:{
					title:'',
					content:'',
				},
        lisQuery:{
          page:1,
          limit:10
        },
        isLoad:false,
				msgList:[],
        allMsg:false, //是否显示全部已读
			};
		},
		onLoad(options) {
			if(options.msgType){
				this.msgType = options.msgType * 1;
			}
      if(options.allMsg){
        this.allMsg = options.allMsg == 'true';
      }
			switch(this.msgType){
				case 9: //收到的赞
					this.title = '收到的赞';
					// this.msgObj = {
					// 	title:'用户张三点赞了你的视频用户张三点赞了你的视频',
					// 	content:'视频名称视频名称视频名称视频名称视频名称名称视频名称',
					// }
					break;
				case 3: //收到的评论
					this.title = '收到的评论';
					// this.msgObj = {
					// 	title:'用户张三点赞评论了你用户张三点赞评论了你',
					// 	content:'视频名称视频名称视频名称视频名称视频名称名称视频名称',
					// }
					break;
				case 2: //服务通知
					this.title = '服务通知';
					// this.msgObj = {
					// 	title:'用户张三点赞评论了你用户张三点赞评论了你',
					// 	content:'视频名称视频名称视频名称视频名称视频名称名称视频名称',
					// }
					break;
				case 3: //平台客服
					this.title = '平台客服';
					// this.msgObj = {
					// 	title:'用户张三点赞评论了你用户张三点赞评论了你',
					// 	content:'视频名称视频名称视频名称视频名称视频名称名称视频名称',
					// }
					break;
				case 99: //商家客服
					this.title = '系统消息';
          this.msgType = '';
					// this.msgObj = {
					// 	title:'商家名称商家名称商家名称商家名称商家名称',
					// 	content:'滴滴答答客服回复了您滴滴答答客服回复了您滴滴答答客服回复了您',
					// }
					break;
          
			}
			this.getMsgList(this.msgType);
		},
    onReachBottom() {
      this.getMsgList(this.msgType);
    },
		methods:{
			// 获取消息列表
			async getMsgList(msg_type){
        if(this.isLoad) return;
        this.isLoad = true;
        let data = {};
        let res = {};
        // 服务通知接口
        if(msg_type == 2){
          data = {
            ...this.lisQuery,
          };
          res = await this.$api.getNoticeList(data);
        }else{
          data = {
            ...this.lisQuery,
            msg_type
          };
          res = await this.$api.getSystemMessageList(data);
        }
        if(res.code == 1){
          if(res.data.data.length > 0){
            this.msgList = this.msgList.concat(res.data.data);
            this.lisQuery.page++;
            this.isLoad = false;
          }else{
            this.isLoad = false;
          }
        }
			},
      // 消息更改为已读
      async handleReadMsg(item){
        if(item.status != 1) return;
        let data = {
          system_message_id:item.id,
        };
        const res = await this.$api.updateStore(data);
        if(res.code == 1){
          item.status++;
        }
      },
      // 点击全部已读消息回调
      async handleAllmsg(status){
        const res = await this.$api.updateAllStore();
        if(res.code == 1){
          this.$u.toast(res.msg);
          this.lisQuery.page = 1;
          this.isLoad = false;
          this.msgList = [];
          this.getMsgList();
        }
      }
		}
	}
</script>

<style lang="scss" scoped>
	.msg-list-content{
    .message-list{
      margin-bottom: 20rpx;
      padding-bottom: 20rpx;
      padding-top: 20rpx;
      border-bottom: 1px solid #eee;
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
				margin-top: 12rpx;
			}
      .item-msg-bottom{
        .badge{
          background: #fa3534;
          border-radius: 50%;
          width: 15rpx;
          height: 15rpx;
        }
      }
		}
	}
</style>
