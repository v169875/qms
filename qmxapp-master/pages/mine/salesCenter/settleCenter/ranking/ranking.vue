<template>
	<!-- 达人排行榜 -->
	<view class="ranking-content">
		<view class="ranking-top">
			<top-navbar :title="title" :background="navbarBg" titleColor="#fff" backColor="#fff"></top-navbar>
			<u-gap height="20"></u-gap>
			<view class="ranking-user flex-col col-center">
				<view class="p-6 ranking-user-avatar flex col-center row-center">
					<u-avatar size="112" :src="userInfo.avatar_format"></u-avatar>
				</view>
				<view class="flex col-center row-center text-white m-t-26">
					<view class="">用户名称</view>
					<view class="ranking-line m-l-40 m-r-40"></view>
					<view class="">暂未上榜</view>
				</view>
			</view>
		</view>
		<view class="user-avatar"></view>
		<view class="ranking-list m-l-34 m-r-34 p-l-20 p-r-20" :style="{'min-height':ScrollHeight}">
			<u-cell-group :border="false">
				<block v-if="rankingList.length > 0">
					<u-cell-item :title="item.nickname || '未填写'" :title-style="titleStyle" :value-style="valueStyle" :arrow="false" :value="item.total_in_money || 0" v-for="(item,index) in rankingList" :key="index">
						<view class="ranking-icon flex col-center" slot="icon">
							<view class="ranking-left-icon text-center font-22">
								<view>{{index + 1}}</view>
							</view>
							<u-avatar class="m-l-30 m-r-18" size="51" :src="item.avatar_format" mode="square"></u-avatar>
						</view>
					</u-cell-item>
				</block>
				<view class="middleC" v-else>
					<u-gap height="60"></u-gap>
					<u-empty text="排行榜空荡荡的" mode="list"></u-empty>
					<u-gap height="60"></u-gap>
				</view>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:'达人排行榜',
				navbarBg:{
					background:'rgba(255,255,255,0)'
				},
				titleStyle:{
					color:'#333',
					fontSize:'24rpx',
				},
				valueStyle:{
					color:'#333',
					fontSize:'28rpx',
				},
				userInfo:{},
				rankingList:[],
				listQuery:{
					page:1,
					limit:10,
				},
				isLoad:false,
				ScrollHeight:0,
			};
		},
		onShow() {
			let userInfo = uni.getStorageSync('userInfo');
			if(userInfo){
				this.userInfo = userInfo;
				this.rankingList = [];
				this.listQuery.page = 1;
				this.isLoad = false;
				this.getRankingList();
			}
		},
		onReachBottom() {
			this.getRankingList();
		},
		onReady() {
			this.getElInfo();
		},
		methods:{
			// 获取达人排行榜
			async getRankingList(){
				// for(let i = 0; i < 20; i++){
				// 	this.rankingList.push(this.rankingObj);
				// }
				if(this.isLoad) return;
				this.isLoad = true;
				const res = await this.$api.ranking(this.listQuery);
				if(res.code == 1){
					if(res.data.data.length > 0){
						this.rankingList = this.rankingList.concat(res.data.data);
						this.listQuery.page++;
						this.isLoad = false;
					}else{
						this.isLoad = false;
					}
				}
			},
			// 获取屏幕剩余高度
			getElInfo() {
				this.$u.getRect('.user-avatar').then(res => {
				  let windowHeight = this.$u.sys()
				  this.ScrollHeight = windowHeight.windowHeight - res.top + 'px'
				})
			},
		}
	}
</script>
<style>
	page{
		background: #F5F5F5;
	}
</style>
<style lang="scss" scoped>
	.ranking-content{
		.ranking-top{
			height: 485rpx;
			background: url('/static/mine/sales/ranking-top-bg.png') no-repeat center center / cover;
			.ranking-user{
				.ranking-user-avatar{
					border: 1px solid #fff;
					border-radius: 50%;
				}
				.ranking-line{
					height: 33rpx;
					width: 1rpx;
					background: $uni-bg-color;
				}
			}
		}
		.ranking-list{
			background: $uni-bg-color;
			border-radius: 10rpx;
			overflow: hidden;
			margin-top: -100rpx;
			position: relative;
			/deep/ .u-cell_title{
				width: 40% !important;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 1;
				-webkit-box-orient: vertical;
				display: -moz-box;
				-moz-line-clamp: 1;
				-moz-box-orient: vertical;
				word-wrap: break-word;
				word-break: break-all;
				white-space: normal;
			}
			/deep/ .ranking-icon{
				.ranking-left-icon{
					width: 45rpx;
					height: 62rpx;
					color: #DD9648;
					padding-bottom: 10rpx;
					background: url('/static/mine/sales/ranking-icon.png') no-repeat center center /cover;
					>view{
						margin-top: -2rpx;
					}
				}
			}
		}
	}
</style>
