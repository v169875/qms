<template>
	<view class="consult-detail-content">
		<top-navbar :title="title"></top-navbar>
		<u-swiper :list="swiperList" height="350" border-radius="0"></u-swiper>
		<u-gap height="40"></u-gap>
		<view class="font-30 text-333 text-bold p-l-36 p-r-36 text-center">
			{{newsDetail.title || '暂无'}}
		</view>
		<view class="p-l-36 p-r-36">
			<u-parse :html="newsDetail.content_format" :tag-style="htmlStyle"></u-parse>
		</view>
		<u-gap height="30"></u-gap>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:'资讯详情',
				swiperList: [],
				htmlStyle:{
					p:`
						margin: 26rpx 0;
						line-height: 46rpx;
						letter-spacing: 2rpx;
						color:#666;
					`,
					img:`
						border-radius: 10rpx;
						width:100%;
						margin: 26rpx 0;
					`
				},
				news_id:null,  //资讯id
				newsDetail:{}, //资讯详情
			};
		},
		onLoad(options) {
			if(options.news_id){
				this.news_id = options.news_id * 1;
				this.getNewsDetail(this.news_id);
			}
		},
		methods:{
			// 增加浏览量
			async addNewsView(id){
				let data = {
					id:id,
				};
				const res = await this.$api.addNewsViews(data);
				if(res.code == 1){
				}
			},
			// 获取资讯详情
			async getNewsDetail(id){
				let data = {
					id:id,
				};
				const res = await this.$api.getNewsDetail(data);
				if(res.code == 1){
					this.newsDetail = res.data;
					this.swiperList.push({image:res.data.cover_image_format});
					this.addNewsView(id);
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.consult-detail-content{
	
	}
</style>
