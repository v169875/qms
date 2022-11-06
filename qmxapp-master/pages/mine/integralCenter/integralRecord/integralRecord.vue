<template>
	<!-- 积分记录 -->
	<view class="integral-record-content">
		<top-navbar :title="title" :isShowBorder="true"></top-navbar>
		<u-gap height="30"></u-gap>
		<view class="p-l-38 p-r-36 flex col-center row-between">
			<view class="font-26 text-666 rela flex col-center record-top-row u-flex-1">
				<view class="select-row-type flex row-center col-center" @tap="selectTypeShow = !selectTypeShow">
					<text class="m-r-6">{{nowDate == '' ? '全部' : nowDate}}</text>
					<u-icon name="arrow-down-fill" color="#999999" size="15"></u-icon>
				</view>
<!-- 				<view class="abso left-select" v-if="selectTypeShow" :class="{'animation-slide-top':selectTypeShow}">
					<view class="" v-for="(item,index) in selectTypeList" :key="index" @tap="handleChangeSelectType(index)">
						{{item.title}}
					</view>
				</view> -->
			</view>
			<view class="font-27 text-666 text-right">累计赚取：{{add_score || 0}}  累计花费：{{sub_score || 0}}</view>
		</view>
		<u-gap height="30"></u-gap>
		<view class="m-l-30 m-r-30 record-list">
			<block v-if="recordList.length > 0">
				<view class="record-item m-b-34 p-30 flex col-center row-between" v-for="(item,index) in recordList" :key="index">
					<view class="">
						<view class="text-333 font-30 hidden_one">{{item.memo}}</view>
						<view class="text-666 font-28 m-t-22">{{item.createtime_format}}</view>
					</view>
					<!-- gray-color 灰色数字  red-color 红色数字 -->
					<view class="font-34 red-color text-bold">{{item.amount}}</view>
				</view>
			</block>
			<view class="middleC" v-else>
				<u-empty text="暂无记录" mode="list"></u-empty>
			</view>
			<u-gap height="30"></u-gap>
		</view>
    <u-picker mode="time" v-model="selectTypeShow" :params="dateParams" @confirm="handleConfirmDate"></u-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:'积分记录',
				selectTypeList:[
					{type:1,title:'每日签到'},
					{type:2,title:'购买课程'},
					{type:3,title:'分享课程并购买成功'},
				],
				selectTypeIdx:null,
				selectTypeTitle:'',
				selectTypeShow:false,
				selectVal:null,
				recordList:[],
        // nowDate: new Date().toISOString().slice(0,7),  //获取当前月份
        nowDate:'',
        dateParams: {
          year: true,
          month: true,
          day: false,
          hour: false,
          minute: false,
          second: false
        },
        listQuery:{
          page:1,
          limit:15,
        },
        isLoad:false,
        add_score:0,  //赚取的积分
        sub_score:0, //花费的积分
			};
		},
		onLoad() {
			this.getRecordList();
		},
		onReachBottom() {
			this.getRecordList();
		},
		methods:{
      // 获取积分记录
			async getRecordList(){
        if(this.isLoad) return;
        this.isLoad = true;
        let data = {
          ...this.listQuery,
          year:this.nowDate.split('-')[0],
          month:this.nowDate.split('-')[1],
        }
				const res = await this.$api.scoreList(data);
        if(res.code == 1){
          this.add_score = res.data.add_score;
          this.sub_score = res.data.sub_score;
          if(res.data.score_list.data.length > 0){
            this.recordList = this.recordList.concat(res.data.score_list.data);
            this.listQuery.page++;
            this.isLoad = false;
          }else{
            this.isLoad = false;
          }
        }
			},
      // 点击确认月份
      handleConfirmDate(e){
        this.nowDate = e.year + '-' + e.month;
        this.isLoad = false;
        this.listQuery.page = 1;
        this.recordList = [];
        this.getRecordList();
      },
      // 暂时废弃没用
			handleChangeSelectType(idx){
				if(this.selectTypeIdx == idx) return;
				this.selectTypeIdx = idx;
				this.selectTypeShow = false;
				this.selectTypeTitle = this.selectTypeList[idx].title;
				this.selectVal = this.selectTypeList[idx].type;
			},
		}
	}
</script>

<style lang="scss" scoped>
	.integral-record-content{
		.record-top-row{
			.left-select{
				border: 1px solid rgba(153, 153, 153, .1);
				left: 0;
				top: 100%;
				background: $uni-bg-color;
				padding: 0rpx 10rpx;
				text-align: center;
				width: 300rpx;
				z-index: 9999;
				border-radius: 10rpx;
				>view{
					padding: 20rpx 0;
				}
				& >view:not(:last-child){
					border-bottom: 1px solid rgba(153, 153, 153, .1);
				}
			}
			.select-row-type{
				border: 1px solid #666;
				padding: 10rpx 16rpx;
				border-radius: 6rpx;
				// width: 240rpx;
			}
		}
		.record-list{
			.record-item{
				box-shadow: 0rpx 0rpx 14rpx 0rpx rgba(48, 119, 251, 0.1);
				border-radius: 20rpx;
				.red-color{
					color: red;
				}
				.gray-color{
					color: #666;
				}
			}
		}
	}
</style>
