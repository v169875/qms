<template>
	<!-- 代理课程详情 -->
	<view class="agency-detail-content">
		<top-navbar :title="title"></top-navbar>
		<view class="p-l-34 p-r-34 m-b-36">
			<u-gap height="30"></u-gap>
			<u-swiper :list="swiperList" height="300"></u-swiper>
				<!-- <view class="font-28 text-333 hidden_one" style="width: 70%;">[所有机构通用] 100元代金券</view> -->
			<view class="hidden_two m-t-40 " style="height: 76rpx;">{{courseDetail.classes_name || '暂无'}}</view>
			<view class="main-color font-28 m-t-10">课程售价:{{courseDetail.classes_current_price || 0}}</view>
		</view>
		<view class="m-t-20 m-b-30 p-l-34 p-r-34">
			<u-parse :html="courseDetail.content_format" :tag-style="htmlStyle"></u-parse>
		</view>
		<u-gap height="60"></u-gap>
		<view class="dyan-btn" v-if="isAddAgency">
			<view class="btn-1">
				<u-button :custom-style="customBtnStyle1" shape="circle" :hair-line="false" @click="handleJoinAgency()">加入代理</u-button>
			</view>
		</view>
		<u-modal v-model="modalShow" content="是否确认加入代理?" show-cancel-button @confirm="handleConfirmCoin"></u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:'课程详情',
				isClickBtn:false,
				modalShow:false,
				customBtnStyle1:getApp().globalData.customStyle1,
				swiperList:[],
				htmlContent:`
					<p>文字介绍具体内容文字介绍具体内容文字介绍具体内容文字 介绍具体内容文字介绍具体内容文字介绍具体</p>
					<img src="/static/growup/active-center-item.png" alt=""/>
				`,
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
					`
				},
				classes_id:null,  //课程详情id
				courseDetail:{}, //课程详情
				isAddAgency:false, // 代理课程详情，是否加入，或者查看课程详情
			};
		},
		onLoad(options){
			if(options.classes_id){
				this.classes_id = options.classes_id * 1;
				this.getAgencyDetail(this.classes_id);
				this.isAddAgency = options.isAddAgency == 'true';
			}
		},
		methods:{
			// 显示确认加入代理模态框
			handleJoinAgency(){
				this.modalShow = !this.modalShow;
			},
			// 模态框内确认加入按钮
			async handleConfirmCoin(){
				if(this.isClickBtn) return this.$u.toast(`请勿频繁操作`);
				this.isClickBtn = true;
				let data = {
					classes_id:this.classes_id,
				};
				const res = await this.$api.agentClassesStore(data);
				if(res.code == 1){
					this.$u.toast(res.msg);
					setTimeout(()=>{
						this.$u.route({
							type:'back',
						})
					},500)
				}
			},
			// 获取代理课程详情
			async getAgencyDetail(classes_id){
				let data = {
					classes_id:classes_id,
				};
				const res = await this.$api.getClassesDetail(data);
				if(res.code == 1){
					this.courseDetail = res.data;
					this.swiperList.push({image:res.data.classes_cover_image_format});
				}
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
