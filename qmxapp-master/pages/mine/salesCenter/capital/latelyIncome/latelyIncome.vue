<template>
	<!-- 最近收支 -->
	<view class="lately-income-content">
		<top-navbar :title="title" :isShowBorder="true"></top-navbar>
		<u-gap height="46"></u-gap>
		<view class="flex income-tab">
			<view class="text-center main-color font-28" :class="{'active-income-tab':incomeIdx == index}" v-for="(item,index) in incomeTabs" :key="index" @tap="handleChangeTabs(index)">
				{{item}}
			</view>
		</view>
		<view class="p-l-34 m-t-30 income-list">
			<block v-if="cashList.length > 0">
				<view class="flex col-center row-between income-item text-333" v-for="(item,index) in cashList" :key="index">
					<!-- 左 -->
					<view class="u-flex-1">
						<view class="font-30 hidden_one">{{item.amount}}元</view>
						<view class="m-t-26 font-26">{{item.createtime_format}}</view>
					</view>
					<!-- 右 -->
					<view class="font-28 hidden_two text-right" style="width: 55%;">{{item.memo}}</view>
				</view>
			</block>
			<view class="middleC" v-else>
				<u-empty :text="incomeIdx == 0 ? '暂无收入' : '暂无支出'" mode="list"></u-empty>
			</view>
			<u-gap height="30"></u-gap>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:'最近收支',
				incomeTabs:['收入','支出'],
				incomeIdx:0,
				cashObj:{
					money:'10',
					time:'2022-4-10',
				},
				cashList:[],
				listQuery:{
					page:1,
					limit:15,
				},
				isLoad:false,
			};
		},
		onShow() {
			this.resetList();
			this.getCashList();
		},
		onReachBottom() {
			this.getCashList();
		},
		methods:{
			// 切换tab
			handleChangeTabs(idx){
				if(this.incomeIdx == idx) return;
				this.incomeIdx = idx;
				this.resetList();
				this.getCashList();
			},
			// 重置列表
			resetList(){
				this.cashList = [];
				this.listQuery.page = 1;
				this.isLoad = false;
			},
			// 获取收支列表
			async getCashList(){
				// for(let i = 0;i < 10; i++){
				// 	this.cashList.push(this.cashObj);
				// }
				if(this.isLoad) return;
				this.isLoad = true;
				let data = {
					...this.listQuery,
					type:this.incomeIdx == 0 ? 1 : 2,
				};
				const res = await this.$api.moneyList(data);
				if(res.code == 1){
					if(res.data.data.length > 0){
						this.cashList = this.cashList.concat(res.data.data);
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
	.lately-income-content{
		.income-tab{
			padding: 0 137rpx;
			>view{
				width: calc(100% / 2);
				border: 1px solid #3077FB;
				padding: 16rpx 0;
			}
			>view:first-child{
				border-top-left-radius: 35rpx;
				border-bottom-left-radius: 35rpx;
			}
			>view:last-child{
				border-top-right-radius: 35rpx;
				border-bottom-right-radius: 35rpx;
			}
			.active-income-tab{
				background: #3077FB;
				color: #fff !important;
			}
		}
		.income-list{
			.income-item{
				border-bottom: 1px solid rgba(153, 153, 153, .1);
				padding: 35rpx 35rpx 35rpx 0;
			}
		}
	}
</style>
