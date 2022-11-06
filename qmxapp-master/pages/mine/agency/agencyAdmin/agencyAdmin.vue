<template>
	<!-- 选品库 -->
	<view>
		<top-navbar :title="title"></top-navbar>
		<u-swiper :list="bannerList" height="320" border-radius="0" name="image_format"></u-swiper>
		<u-gap height="30"></u-gap>
		<view class="course-list">
			<block v-for="(item,index) in courseList" :key="index">
				<course-card 
					:courseItem="item" 
					:rowNum="3"
					:isOldPrice="false"
					:isSell="false"
					isCardType="isAgency"
					:isAddAgency="true"
					>
				</course-card>
			</block>
		</view>
		<u-gap height="30"></u-gap>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:'选品库',
				bannerList:[],
				listQuery:{
					page:1,
					limit:10,
				},
				isLoad:false,
				// 课程列表
				courseList:[],
			};
		},
		onShow() {
			this.courseList = [];
			this.listQuery.page = 1;
			this.isLoad = false;
			this.getAgencyList();
			this.getAgencyBannerList();
		},
		onReachBottom() {
			this.getAgencyList();
		},
		methods:{
			// 获取选品库轮播图
			async getAgencyBannerList(){
				let data = {
					banner_type:3,
				};
				const res = await this.$api.getBannerList(data);
				if(res.code == 1){
					this.bannerList = res.data;
				}
			},
			// 获取课程列表
			async getAgencyList(){
				if(this.isLoad) return;
				this.isLoad = true;
				const res = await this.$api.get_agent_agentClassesList(this.listQuery);
				if(res.code == 1){
					if(res.data.data.length > 0){
						this.courseList = this.courseList.concat(res.data.data);
						this.listQuery.page++;
						this.isLoad = false;
					}else{
						this.isLoad = false;
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
