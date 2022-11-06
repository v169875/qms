<template>
	<!-- 积分中心的商品详情 -->
	<view class="integral-goods-detail-content">
		<top-navbar :title="title"></top-navbar>
		<view class="p-l-34 p-r-34 m-b-36">
			<u-gap height="30"></u-gap>
			<u-swiper :list="goodsInfo.images_format" height="480"></u-swiper>
				<!-- <view class="font-28 text-333 hidden_one" style="width: 70%;">[所有机构通用] 100元代金券</view> -->
			<view class="hidden_two m-t-40 ">{{goodsInfo.goods_name || ''}}</view>
			<view class="main-color font-28 m-t-10">积分:{{goodsInfo.price || 0}}</view>
		</view>
		<view class="m-t-20 m-b-30 p-l-34 p-r-34">
			<u-parse :html="goodsInfo.content_format" :tag-style="htmlStyle"></u-parse>
		</view>
		<u-gap height="60"></u-gap>
		<view class="dyan-btn">
			<view class="btn-1">
				<u-button :custom-style="customBtnStyle1" shape="circle" :hair-line="false" @click="handleCoin()">立即兑换</u-button>
			</view>
		</view>
		<u-modal v-model="modalShow" content="是否确认兑换?" show-cancel-button @confirm="handleConfirmCoin"></u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:'商品详情',
				isClickBtn:false,
				modalShow:false,
				customBtnStyle1:getApp().globalData.customStyle1,
        goodsInfo:{}, //商品详情
        isDefalt:{}, //默认地址
				htmlStyle:{
					p:`
						margin: 26rpx 0;
						line-height: 46rpx;
						letter-spacing: 2rpx;
						color:#666;
					`,
					img:`
						border-radius: 10rpx;
						width:100%;
					`
				},
			};
		},
    onLoad(options) {
      if(options.goods_id){
        this.getGoodsDetail(options.goods_id);
        this.getTakeAddress();
      }
    },
		methods:{
			// 显示确认兑换模态框
			handleCoin(){
				this.modalShow = !this.modalShow;
			},
			// 模态框内确认兑换
			async handleConfirmCoin(){
				if(this.isClickBtn) return this.$u.toast(`请勿频繁操作`);
				this.isClickBtn = true;
        if(!this.isDefalt.id) return this.$u.toast(`请先添加默认地址`);
        let data = {
          address_id:this.isDefalt.id,
          goods_id:this.goodsInfo.id,
        };
        const res = await this.$api.score_goods_submitOrder(data);
        if(res.code == 1){
          this.$u.toast(res.msg);
          setTimeout(()=>{
          	this.$u.route({
          		type:'back',
          	})
          },500)
        }
			},
      // 获取积分商品详情
      async getGoodsDetail(goods_id){
        let data = {
          goods_id,
        };
        const res = await this.$api.score_goods_goodsDetail(data);
        if(res.code == 1){
          this.goodsInfo = res.data;
        }
      },
      // 获取默认地址
      async getTakeAddress(){
        const res = await this.$api.getAddressList();
        if(res.code == 1){
          res.data.map((item)=>{
            if(item.is_default == 1){
              this.isDefalt = item;
            }
          })
        }
      }
		}
	}
</script>

<style lang="scss" scoped>
	.integral-goods-detail-content{
		
	}
</style>
