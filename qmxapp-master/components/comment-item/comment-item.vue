<template>
	<!-- 评论组件 -->
	<view class="comment-item-content p-r-34 p-b-30">
		<!-- 上 -->
		<view class="comment-top flex col-center">
			<!-- 头像 -->
			<view class="">
				<u-avatar :src="commentItem.user.avatar_format" size="80" ></u-avatar>
			</view>
			<!-- 名称，时间，评分 -->
			<view class="m-l-22 u-flex-1">
				<view class="flex col-center row-between">
					<view class="font-30 text-333 text-bold">{{commentItem.user.nickname}}</view>
					<u-rate :count="5" disabled v-model="commentItem.score" active-icon="star-fill" inactive-icon="star" active-color="#F6D350" inactive-color="#999999"></u-rate>
				</view>
				<view class="text-999 font-22 m-t-6">{{commentItem.createtime_format}}</view>
			</view>
		</view>
		<!-- 下 -->
		<view class="comment-bottom m-t-34">
			<!-- 文字内容 -->
			<view class="">
				{{commentItem.content || ''}}
			</view>
			<!-- 图片内容 -->
			<view class="flex flex-wrap comment-img m-t-24">
				<u-image v-for="(imgItem,imgIndex) in commentItem.images_format" width="calc(100% / 4 - 24rpx)" height="150rpx" :src="imgItem" mode="aspectFill" @tap="handlePreView(imgIndex)"></u-image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"comment-item",
		props:{
			// 每条评论
			commentItem:{
				type:Object,
				default:()=>{}
			}
		},
		data() {
			return {
				rateVal:'2.5',
			};
		},
    methods:{
      // 预览图片
      handlePreView(index){
        uni.previewImage({
        	current: index,
        	urls: this.commentItem.images_format,
        });
      }
    }
	}
</script>

<style lang="scss" scoped>
	.comment-item-content{
		border-bottom: 1px solid rgba(153, 153, 153, .1);
		.comment-img{
			& .u-image:not(:last-child){
				margin-right: 32rpx;
			}
		}
	}
</style>