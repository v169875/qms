<template>
	<view class="activity-detail-content">
		<top-navbar :title="title"></top-navbar>
		<view class="activity-detail-top">
			<view class="top-image">
				<u-swiper :list="swiperList" height="300" border-radius="0"></u-swiper>
				<!-- <u-image height="100%" width="100%" border-radius="20" src="/static/growup/active-center-item.png" mode="aspectFill"></u-image> -->
			</view>
			<view class="activity-item-bottom m-t-40 p-r-36 p-l-36">
				<view class="font-30 text-333 text-black hidden_two title">{{activeDetail.active_name || ''}}</view>
				<view class="text-right m-t-16 font-28 bottom-time p-b-26">截止时间：{{$u.timeFormat(activeDetail.start_time, 'mm/dd')}}至{{$u.timeFormat(activeDetail.end_time, 'mm/dd')}}</view>
			</view>
		</view>
		<view class="p-r-36 p-l-36">
			<view class="m-t-36 m-b-26 text-black font-28">活动具体介绍：</view>
			<u-parse :html="activeDetail.content_format"></u-parse>
		</view>
		<u-gap height="30"></u-gap>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:'活动详情',
				active_id:null, // 活动详情id
				activeDetail:{}, //活动详情内容
				swiperList:[],
				vipTestContent:`
					<p>文字介绍具体内容文字介绍具体内容文字介绍具体内容文字 介绍具体内容文字介绍具体内容文字介绍具体</p>
					<img src="/static/growup/active-center-item.png" alt=""/>
				`,
			};
		},
		onLoad(options) {
			if(options.active_id){
				this.active_id = options.active_id * 1;
				this.getActivityDetail(this.active_id);
			}
		},
		methods:{
			// 获取活动详情
			async getActivityDetail(id){
				this.swiperList = [];
				let data = {
					id:id,
				}
				const res = await this.$api.getActiveDetail(data);
				if(res.code == 1){
					this.activeDetail = res.data;
					this.swiperList.push(res.data.cover_image_format);
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.activity-detail-content{
		/deep/ p{
			color: #666;
			font-size: 26rpx;
			line-height: 40rpx;
			margin: 30rpx 0;
		}
		/deep/ img{
		}
		.activity-detail-top{
			.top-image{
				height: 300rpx;
			}
			.activity-item-bottom{
				.title{
					height: 80rpx;
				}
				.bottom-time{
					border-bottom: 1px dashed #BFBFBF;
				}
			}
		}
	}
</style>
