<template>
	<view class="lottery_container">
		<view class="grid_wrap">
			<view class="lottery_wrap">
				<ul class="lottery_grid">
					<li v-for="(item, index) in grid_info_arr" :class="{ active: current_index == index && index != 8 }" :key="index"
					 @click="luck_draw" :data-index="index">
						<image v-if="index != 8" class="grid_img" mode='aspectFit' :src="item.lottery_image_format" alt="">
							<!-- {{ index == 8 ? '立即抽奖' : index+1 }} -->
            <view class="" v-if="item.id == 9999" v-html="item.lottery_name"></view>
            <view class="draw-item font-20 m-t-10" v-else>
              <!-- <u-image width="90rpx" height="64rpx" :src="item.lottery_image_format" mode="aspectFill"></u-image> -->
              <view class="">{{item.lottery_name}}</view>
            </view>
					</li>
				</ul>
			</view>
			<view class="lottery_wrap_border">
				<ul v-for="(item, index) in 4" :key="index">
					<li v-for="(item, index) in 12" :key="index"></li>
				</ul>
			</view>
		</view>
		<!-- 抽奖完成弹出的窗口 -->
		<!-- <view class="lottery_finish_wrap">
			
		</view> -->
	</view>

</template>

<script>
	import LotteryDraw from './SJ-LotteryDraw.js';
	let grid_info = [{
			logo: "../../static/SJ-LotteryDraw/SJ-LotteryDraw.png",
			text: "手机"
		},
		{
			logo: "../../static/SJ-LotteryDraw/SJ-LotteryDraw.png",
			text: "零食包"
		},
		{
			logo: "../../static/SJ-LotteryDraw/SJ-LotteryDraw.png",
			text: "口红"
		},
		{
			logo: "../../static/SJ-LotteryDraw/SJ-LotteryDraw.png",
			text: "谢谢参与"
		},
		{
			logo: "../../static/SJ-LotteryDraw/SJ-LotteryDraw.png",
			text: "压缩饼干"
		},
		{
			logo: "../../static/SJ-LotteryDraw/SJ-LotteryDraw.png",
			text: "水杯"
		},
		{
			logo: "../../static/SJ-LotteryDraw/SJ-LotteryDraw.png",
			text: "QQ糖"
		},
		{
			logo: "../../static/SJ-LotteryDraw/SJ-LotteryDraw.png",
			text: "耳机"
		},
		{
			logo: "../../static/SJ-LotteryDraw/SJ-LotteryDraw.png",
			text: "谢谢参与"
		},
	];
	export default {
		data() {
			return {
				current_index: -1,
			};
		},
		props: {
			grid_info_arr: {
				type: Array,
				default: function() {
					return grid_info
				}
			},
      // 是否抽奖中
      isAlive:{
        type:Boolean,
        default:true,
      }
		},
		onLoad() {
      
		},
    mounted() {
      console.log('gggggggg',this.grid_info_arr)
    },
		methods: {
			luck_draw(event) {
				let index = event.currentTarget.dataset.index;
				let that = this;
				if (index == 8) {
          if(this.isAlive) return this.$u.toast(`正在抽奖中请稍后···`);
					// 点击抽奖之后知道获奖位置，修改父组件中lottery_draw_param的值
					this.$emit('get_winingIndex', function(res){
						console.log(res);
						let lottery_draw_param=res;
						let win = new LotteryDraw({
								domData: that.grid_info_arr,
								...lottery_draw_param
							},
							function(index, count) {
								that.current_index = index;
								console.log()
								if (lottery_draw_param.winingIndex == index && lottery_draw_param.totalCount == count) {
									that.$emit('luck_draw_finish', that.grid_info_arr[index])
									// console.log('抽到了')
								}
							}
						);
					});
					
				}
			}
		}
	};
</script>

<style scoped lang="scss">
	@import './SJ-LotteryDraw.css';
  .draw-item{
  }
</style>
