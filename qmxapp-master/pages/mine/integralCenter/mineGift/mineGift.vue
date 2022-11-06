<template>
	<!-- 我的礼品 -->
	<view class="mine-gift-content">
		<top-navbar :title="title" :isShowBorder="true"></top-navbar>
		<u-gap height="30"></u-gap>
		<view class="gift-list p-l-34">
			<block v-if="mineGiftList.length > 0">
				<view class="gift-item p-b-24 m-b-20 flex col-center" v-for="(item,index) in mineGiftList" :key="index">
					<u-image 
            width="152rpx" 
            height="152rpx" 
            border-radius="10"
            :src="item.order_type == 1 ? item.goods.cover_image_format : item.lottery_goods_image_format" 
            mode="aspectFill"
          ></u-image>
					<view class="u-flex-1 m-l-36 m-r-36">
						<view class="font-28 text-black text-bold flex col-center">
							<view class="hidden_one u-flex-1" style="">{{item.order_type == 1 ? item.goods.goods_name : item.lottery_name || ''}}</view>
							<view class="font-26 main-color m-l-12">{{item.order_type | orderType}}</view>
						</view>
						<view class="m-t-18 m-b-20">
							<text class="font-24 text-666">兑换时间：{{item.createtime_format}}</text>
						</view>
						<view class="font-26 text-333 flex col-center row-between" @tap="handleCopy(item.express_number)">
              <view class="">{{item.status | orderStatus}}</view>
              <view class="font-24" v-if="item.express_number">{{item.express_name + ':' + item.express_number}}</view>
            </view>
					</view>
				</view>
			</block>
			<view class="middleC" v-else>
				<u-empty text="暂无礼品" mode="list"></u-empty>
			</view>
			<u-gap height="30"></u-gap>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:'我的礼品',
				mineGiftList:[],
        listQuery:{
          page:1,
          limit:15,
        },
        isLoad:false,
			};
		},
		onLoad() {
			this.getMineGiftList();
		},
		onReachBottom() {
			this.getMineGiftList();
		},
    filters:{
      orderType(type){
        let str = '';
        switch(type){
          case 1:
            str = '积分兑换';
            break;
          case 2:
            str = '转盘抽奖';
            break;
        }
        return str;
      },
      orderStatus(type){
        let str = '';
        switch(type){
          case 1:
            str = '待发货';
            break;
          case 2:
            str = '待收货';
            break;
        }
        return str;
      }
    },
		methods:{
			// 获取我的礼品列表
			async getMineGiftList(){
        if(this.isLoad) return;
        this.isLoad = true;
				const res = await this.$api.score_goods_getOrderList(this.listQuery);
        if(res.code == 1){
          if(res.data.data.length > 0){
            this.mineGiftList = this.mineGiftList.concat(res.data.data);
            this.listQuery.page++;
            this.isLoad = false;
          }else{
            this.isLoad = false;
          }
        }
			},
      handleCopy(content){
        uni.setClipboardData({
        	data: content,
        	success: () => { //复制成功的回调函数
        		this.$u.toast(`复制快递单号成功`);
        	}
        });
      }
		}
	}
</script>

<style lang="scss" scoped>
	.mine-gift-content{
		.gift-list{
			.gift-item{
				border-bottom: 1px solid rgba(153, 153, 153, .1);
			}
		}
	}
</style>
