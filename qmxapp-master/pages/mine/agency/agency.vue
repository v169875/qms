<template>
	<!--  我的选品 -->
	<view>
		<top-navbar :title="title" :isShowBorder="true" :isAgency="true"></top-navbar>
		<u-gap height="30"></u-gap>
		<!-- 课程推荐 卡片 -->
		<view class="course-list" v-if="courseList.length > 0">
			<block v-for="(item,index) in courseList" :key="index">
				<course-card 
					:courseItem="item" 
					:rowNum="3"
					:isOldPrice="false"
					:isSell="false"
					isCardType="isMineClasses"
					:isAddAgency="false"
					:isShowDelAgencyIcon="true"
					@agencyItem="isShowDelAgency"
					>
				</course-card>
			</block>
		</view>
		<view class="middleC" v-else>
			<u-empty text="暂无代理课程" mode="list"></u-empty>
		</view>
		<u-gap height="30"></u-gap>
		<u-modal 
			v-model="showDelModal" 
			content="是否解除该商品代理？"
			show-cancel-button
			@cancel="delAgencyItem = {}"
			@confirm="handleConfirmDelAgency"></u-modal>
	</view>
</template>

<script>
	// 课程卡片
	import courseCard from '@/components/course-card/course-card.vue'
	export default {
		components:{
			courseCard
		},
		data() {
			return {
				title:'我的选品',
				courseList:[], //课程列表
				listQuery:{
					page:1,
					limit:10,
				},
				isLoad:false,
				showDelModal:false,
				delAgencyItem:{}, //需要解除代理的数据
			};
		},
		onShow() {
			this.resetList();
			this.getMyAgentCourseList();
		},
		onReachBottom() {
			this.getMyAgentCourseList();
		},
		methods:{
			// 获取我的代理课程列表
			async getMyAgentCourseList(){
				if(this.isLoad) return;
				this.isLoad = true;
				const res = await this.$api.getMyAgentClassesList(this.listQuery);
				if(res.code == 1){
					if(res.data.data.length > 0){
						this.courseList = this.courseList.concat(res.data.data);
						this.listQuery.page++;
						this.isLoad = false;
					}else{
						this.isLoad = false;
					}
				}
			},
			// 重置数组
			resetList(){
				this.listQuery.page = 1;
				this.courseList = [];
				this.isLoad = false;
			},
			// 显示解除代理弹窗
			isShowDelAgency(show,item){
				this.showDelModal = show;
				this.delAgencyItem = item;
			},
			// 点击确认解除代理
			async handleConfirmDelAgency(){
				let data = {
					agent_classes_id:this.delAgencyItem.id,
				};
				const res = await this.$api.cancelClasses(data);
				if(res.code == 1){
					this.$u.toast(res.msg);
					this.resetList();
					this.getMyAgentCourseList();
				}
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
