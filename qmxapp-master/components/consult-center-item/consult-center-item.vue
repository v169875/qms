<template>
	<!-- 咨询中心列表item -->
	<view class="consult-item m-b-44 flex col-center" @tap="handleConsultDetail(consultItem.id)">
		<!-- 左 -->
		<view class="u-flex-1 m-r-34">
			<view class="hidden_two font-28 text-333 consult-title">{{consultItem.title}}</view>
			<view class="m-t-24 text-666">
				<text>{{consultItem.source || '未知'}}</text>
				<text class="m-l-40">{{consultItem.views || 0}}阅读</text>
			</view>
		</view>
		<!-- 右 -->
		<u-image width="200rpx" height="140rpx" border-radius="10" :src="consultItem.cover_image_format" mode="aspectFill"></u-image>
	</view>
</template>

<script>
	export default {
		name:"consult-center-item",
		props:{
			consultItem:{
				type:Object,
				default:()=>{}
			}
		},
		mounted() {
		},
		data() {
			return {
				
			};
		},
		methods:{
			handleConsultDetail(id){
				this.$u.route({
					url:'/pages/growup/consultCenter/consultDetail/consultDetail',
					params:{
						news_id:id,
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.consult-list{
		.consult-item{
			.consult-title{
				height: 76rpx;
			}
		}
	}
</style>