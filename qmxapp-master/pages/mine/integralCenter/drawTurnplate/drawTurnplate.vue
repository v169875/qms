<template>
  <!-- 积分轮盘 -->
  <view class="draw-content">
    <top-navbar :background="navbarBackground" backColor="#fff"></top-navbar>
    <image class="draw-bg" :src="$config.isImg('img/back.png')" mode=""></image>
    <view class="draw-logo" :style="`background:url(${$config.isImg('img/lottery.png')}) no-repeat center center / contain`">
      <view class="draw-num">
        今天还剩余{{today_can_draw_count}}次抽奖机会
      </view>
    </view>
    <u-gap height="10"></u-gap>
    <!-- 抽奖模块 -->
    <view class="flex row-center draw-body">
      <LotteryDraw 
        v-if="lotteryList.length > 0" 
        :grid_info_arr="lotteryList"
        :isAlive="isAlive"
        @get_winingIndex='get_winingIndex' 
        @luck_draw_finish='luck_draw_finish'
      ></LotteryDraw>
    </view>
    <view class="draw-bottom-btn" @tap="handleMineGift()">我的奖品</view>
  </view>
</template>

<script>
  // 抽奖组件
  import LotteryDraw from '@/components/SJ-LotteryDraw/SJ-LotteryDraw.vue';
  export default {
    components: {
      LotteryDraw
    },
    data() {
      return {
        navbarBackground:{
          background:'rgba(255,255,255,.0)'
        },
        today_can_draw_count:0, //剩余抽奖次数
        one_draw_score:10, // 抽奖一次消耗的积分
        lottery_draw_param:{
          startIndex: 0, //开始抽奖位置，从0开始
          totalCount: 4, //一共要转的圈数
          winingIndex: 2, //中奖的位置，从0开始
          speed: 50 //抽奖动画的速度 [数字越大越慢,默认100]
        },
        lotteryList:[], //抽奖列表
        isAlive:false, //是否正在抽奖
      };
    },
    onShow() {
      this.getDrawLoteryList();
    },
    methods:{
      // 获取抽奖列表
      async getDrawLoteryList(){
        this.lotteryList = [];
        const res = await this.$api.getLotteryList();
        if(res.code == 1){
          this.lotteryList = res.data.lottery_list;
          this.today_can_draw_count = res.data.today_can_draw_count;
          this.one_draw_score = res.data.one_draw_score;
          let lastDraw = {
            "id": 9999,
            "lottery_name": "立即</br>抽奖",
            "lottery_image": "/uploads/20220525/20681e277cec2f57800979865eedf5e6.jpg",
            "lottery_image_format": `${this.$config.isImg('uploads/20220525/20681e277cec2f57800979865eedf5e6.jpg')}`
          }
          this.lotteryList.push(lastDraw);
        }
      },
      // 修改获奖位置（可以在这里获取后台的数据
      async get_winingIndex(callback){
        const res = await this.$api.lotteryStore();
        if(res.code == 1){
          this.isAlive = true;
          let winData = res.data;
          // this.lottery_draw_param.winingIndex= this.lottery_draw_param.winingIndex;
          //props修改在小程序和APP端不成功，所以在这里使用回调函数传参，
          let winIdx = this.lotteryList.findIndex((item,index)=>{
            return item.id == winData.id
          })
          this.lottery_draw_param.winingIndex = winIdx;
          this.lottery_draw_param.startIndex = winIdx;
          this.today_can_draw_count--;
          callback(this.lottery_draw_param);
        }
      },
      // 抽奖完成
      luck_draw_finish(param){
        this.isAlive = false;
        this.$u.toast(param.lottery_name);
        // this.getDrawLoteryList();
          // console.log(`抽到第${param+1}个方格的奖品`)
      },
      // 跳转我的奖品
      handleMineGift(){
        this.$u.route({
          url:'/pages/mine/integralCenter/mineGift/mineGift',
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .draw-content{
    position: relative;
    height: 100vh;
    .draw-bg{
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      height: 100%;
      width: 100%;
      z-index: -1;
    }
    .draw-logo{
      height: 470rpx;
      margin: 0 90rpx;
      position: relative;
      .draw-num{
        width: 100%;
        text-align: center;
        position: absolute;
        bottom: 52rpx;
        color: #fff;
        left: 50%;
        transform: translateX(-50%);
      }
    }
    .draw-body{
      
    }
    .draw-bottom-btn{
      margin: 80rpx 111rpx 0 111rpx;
      background: #fff;
      border-radius: 60rpx;
      padding: 21rpx 0;
      text-align: center;
      color: #3077FB;
      font-size: 30rpx;
      font-weight: bold;
      letter-spacing: 2rpx;
    }
  }
</style>
