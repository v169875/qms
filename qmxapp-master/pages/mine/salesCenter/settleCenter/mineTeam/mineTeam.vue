<template>
	<!-- 我的团队 -->
	<view class="mine-team-content">
		<top-navbar :title="title" :isShowBorder="true"></top-navbar>
		<view class="team-list p-l-34">
			<block v-if="teamList.length > 0">
				<view class="team-item flex col-center p-t-30 p-b-30 p-r-34" v-for="(item,index) in teamList" :key="index">
					<u-avatar size="82" :src="item.avatar"></u-avatar>
					<view class="u-flex-1 text-333 font-26 m-l-20">
						<view class="flex col-center row-between">
							<view class="font-28">用户名称</view>
							<view class="">推广金额：0.00元</view>
						</view>
						<view class="flex col-center row-between m-t-6">
							<view class="">注册时间：2020-05-02</view>
							<view class="">推广订单：12312</view>
						</view>
					</view>
				</view>
			</block>
			<view class="middleC" v-else>
				<u-empty text="暂无团队成员" mode="list"></u-empty>
			</view>
			<u-gap height="30"></u-gap>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:'我的团队',
				teamObj:{
					avatar:'https://tse1-mm.cn.bing.net/th/id/R-C.d8011b5d28ee607bfa5e427d0ad03b99?rik=eCm54QsjFJ81gQ&riu=http%3a%2f%2fimg2.woyaogexing.com%2f2018%2f01%2f09%2fa03c1358f5fee520!400x400_big.jpg&ehk=Tchj3Y063MGOw03bLmMHcWVT36v4WTVbUFjWdm%2fmH30%3d&risl=&pid=ImgRaw&r=0&sres=1&sresct=1',
				},
				teamList:[],
			};
		},
		onLoad() {
			this.getMineTeamList();
		},
		onReachBottom() {
			this.getMineTeamList();
		},
		methods:{
			getMineTeamList(){
				for(let i = 0; i < 10 ; i++){
					this.teamList.push(this.teamObj)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.mine-team-content{
		.team-list{
			.team-item{
				border-bottom: 1px solid rgba(153, 153, 153, .1);
			}
		}
	}
</style>
