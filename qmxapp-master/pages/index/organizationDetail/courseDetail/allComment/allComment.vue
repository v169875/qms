<template>
	<view class="all-comment-content">
		<top-navbar :title="title"></top-navbar>
		<u-gap height="30"></u-gap>
		<view class="common-sort flex col-center text-999">
			<view :class="{'active-comment-sort':sortIdx == 0}" @tap="handleChangeSort(0)">按时间排序</view>
			<view class="m-l-16 m-r-16"></view>
			<view :class="{'active-comment-sort':sortIdx == 1}" @tap="handleChangeSort(1)">按默认排序</view>
		</view>
		<u-gap height="30"></u-gap>
		<view class="comment-list">
			<block v-for="(item,index) in commentList" :key="index">
				<comment-item :commentItem="item"></comment-item>
			</block>
		</view>
		<u-gap height="30"></u-gap>
	</view>
</template>

<script>
	import commentItem from '@/components/comment-item/comment-item.vue'
	export default {
		components:{
			commentItem
		},
		data() {
			return {
				title:'全部评论',
				sortIdx:0,
				classes_id:null, //课程详情
				commentList:[], //评论列表
				listQuery:{
					page:1,
					limit:15,
				},
				isLoad:false,
			};
		},
		onLoad(options) {
			if(options.classes_id){
				this.classes_id = options.classes_id * 1;
				this.getAllCommentList(this.classes_id);
			}
		},
		onReachBottom() {
			this.getAllCommentList(this.classes_id);
		},
		methods:{
			// 点击切换排序
			handleChangeSort(idx){
				if(this.sortIdx == idx) return;
				this.sortIdx = idx;
				this.commentList = [];
				this.listQuery.page = 1;
				this.isLoad = false;
				this.getAllCommentList(this.classes_id);
			},
			// 获取全部评论
			async getAllCommentList(classes_id){
				if(this.isLoad) return;
				this.isLoad = true;
				let data = {
					classes_id:classes_id,
					...this.listQuery,
					sort:this.sortIdx == 0 ? 1 : 2,
				};
				const res = await this.$api.getClassesOrderComment(data);
				if(res.code == 1){
					if(res.data.data.length > 0){
						this.commentList = this.commentList.concat(res.data.data);
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
	.all-comment-content{
		.common-sort{
			padding: 0 34rpx;
			>view:nth-child(2){
				height: 26rpx;
				width: 2rpx;
				background: #294D7D;
			}
			.active-comment-sort{
				color: #294D7D !important;
			}
		}
	}
</style>
