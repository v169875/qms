<template>
	<!-- 咨询中心 -->
	<view class="consult-center-content">
		<top-navbar :title="title"></top-navbar>
		<u-swiper :list="swiperList" height="350" name="image_format" border-radius="0"></u-swiper>
		<u-cell-group>
			<u-cell-item title="热点政策解读" :title-style="titleStyle" value="查看全部" @click="handleConsultClassItem('all')"></u-cell-item>
		</u-cell-group>
		<!-- 分类 -->
		<view class="goods-class-body flex flex-wrap m-t-34">
			<u-grid :border="false" :col="4">
				<u-grid-item v-for="(item,index) in consultClassList" :key="index" @tap="handleConsultClassItem(index)">
					<image :src="item.image_format" mode="aspectFit"></image>
					<view class="goods-class-title m-t-20">{{item.name}}</view>
				</u-grid-item>
			</u-grid>
		</view>
		<u-gap height="20" bg-color="#F8F8F8"></u-gap>
		<view class="consult-list p-t-44 p-l-34 p-r-34">
			<block v-if="consultList.length > 0">
				<view class="" v-for="(item,index) in consultList" :key="index">
					<consult-center-item :consultItem="item"></consult-center-item>
				</view>
				<u-gap height="30"></u-gap>
			</block>
			<view class="" v-else>
				<u-gap height="200"></u-gap>
				<u-empty text="暂无推荐咨询" mode="list"></u-empty>
        <u-gap height="200"></u-gap>
			</view>
		</view>
	</view>
</template>

<script>
	import consultCenterItem from '@/components/consult-center-item/consult-center-item.vue'
	export default {
		components:{
			consultCenterItem
		},
		data() {
			return {
				title:'资讯中心',
				swiperList: [],
				titleStyle:{
					color:'#333',
					fontSize:'28rpx',
				},
				// 分类列表
				consultClassList:[],
				// 推荐咨询列表
				consultList:[],
				listQuery:{
					page:1,
					limit:10,
				},
				isLoad:false,
			};
		},
		onLoad() {
			this.getSwiperList();
			this.getClassList();
		},
		onShow() {
			this.isLoad = false;
			this.listQuery.page = 1;
			this.consultList = [];
			this.getConsultList();
		},
		onReachBottom() {
			this.getConsultList();
		},
		methods:{
			// 获取轮播图
			async getSwiperList(){
				let data = {
					banner_type:2,
				};
				const res = await this.$api.getBannerList(data);
				if(res.code == 1){
					this.swiperList = res.data;
				}
			},
			// 获取分类
			async getClassList(){
				let data = {
					type:'news',
				};
				const res = await this.$api.getCategoryList(data);
				if(res.code == 1){
					this.consultClassList = res.data;
				}
			},
			// 获取推荐咨询列表
			async getConsultList(){
				if(this.isLoad) return;
				this.isLoad = true;
				const res = await this.$api.getHotNewsList(this.listQuery);
				if(res.code == 1){
					if(res.data.data.length > 0){
						this.consultList = this.consultList.concat(res.data.data);
						this.listQuery.page++;
						this.isLoad = false;
					}else{
						this.isLoad = false;
					}
				}
			},
			// 点击每项分类
			handleConsultClassItem(index){
				let url = '/pages/growup/consultCenter/allConsult/allConsult?classList=1';
				this.$u.route({
					url:url,
					params:{
						hotIndex:index,
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.consult-center-content{
		.goods-class-body{
			margin: 0 26rpx;
			/deep/ .u-grid-item-box{
				padding: 0 !important;
				margin-bottom: 34rpx;
			}
			image{
				width: 95rpx;
				height: 95rpx;
				display: block;
			}
		}
		
	}
</style>
