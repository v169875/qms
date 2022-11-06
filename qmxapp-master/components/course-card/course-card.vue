<template>
	<!-- 课程卡片 -->
	<view 
		:style="{'--row':rowNum}"
		class="course-card-content m-b-30"
		:class="rowNum == 1 ? 'card-row-one' : rowNum == 2 ? 'card-row-two' : 'card-row-three'"
		@tap="handleCourseDetail()"
		>
		<view class="course-image" :style="{'width':width,'height':height}">
			<u-image v-if="isCourseCard" :width="width" :height="height" border-radius="10" :src="courseItem.classes_cover_image_format || courseItem.cover_image_format || courseItem.classes.classes_cover_image_format" mode="aspectFill"></u-image>
      <u-image v-else :width="width" :height="height" border-radius="10" :src="courseItem.video_cover_image_format || courseItem.video.video_cover_image_format" mode="aspectFill"></u-image>
			<!-- 右上角删除代理课程图标，判断显示 -->
			<view class="del-agency-icon" v-if="isShowDelAgencyIcon" @tap.stop="handleDelAgency(courseItem)">
				<u-icon name="minus-circle-fill" color="#3077FB" size="32"></u-icon>
			</view>
			<!-- 右上角删除图标，判断显示 -->
			<view class="del-icon" v-if="isShowDelIcon" @tap.stop="handleDelVideo(courseItem)">
				<image src="/static/index/del-icon.png" mode="aspectFit"></image>
			</view>
			<!-- 右下角播放图标，判断显示 -->
			<view class="play-icon" v-if="isShowPlayIcon">
				<image src="/static/index/play-icon.png" mode="aspectFit"></image>
			</view>
		</view>
		<view v-if="isCourseCard" class="hidden_two course-title font-28 text-333 m-t-24">
			{{ courseItem.classes_name || courseItem.goods_name || courseItem.classes.classes_name}}
		</view>
    <view v-else class="hidden_two course-title font-28 text-333 m-t-24">
    	{{courseItem.video_title || courseItem.video.video_title}}
    </view>
		<!-- 显示新价格，旧价格 -->
		<view class="flex row-between col-center coures-card-bottom m-t-14" v-if="isShowPriceRow">
      <!-- 正常课程显示 -->
      <block v-if="courseItem.is_group == 0">
        <!-- 显示价格不显示免费 -->
        <view class="price" v-if="isShowPriceRow && !isShowFree">
        	<text class="font-30 new-price">￥{{courseItem.classes_current_price || courseItem.classes.classes_current_price}}</text>
        	<text class="font-24 m-l-4 old-price" v-if="isOldPrice">￥{{courseItem.classes_original_price}}</text>
        </view>
        <view class="price" v-if="isShowFree">
        	<text class="font-28 new-price">体验卡免费</text>
        </view>
      </block>
			<!-- 拼团课程显示 -->
      <block v-if="courseItem.is_group == 1">
        <!-- 显示价格不显示免费 -->
        <view class="price" v-if="isShowPriceRow">
        	<text class="font-30 new-price">￥{{courseItem.classes_group_price || 0}}</text>
        </view>

      </block>
			<view class="num">
				<text class="font-26" v-if="isSell">已售:{{courseItem.sales}}</text>
			</view>
		</view>
		<!-- 显示积分 -->
		<view class="flex row-between col-center coures-card-bottom m-t-14" v-if="isShowInteGral">
			<view class="price">
				<text class="font-30 new-price">{{courseItem.price}}积分</text>
			</view>
		</view>
		<!-- 左上角会员体验课标签 ，判断显示 -->
		<view class="course-tag font-20" v-if="isShowVipTag">会员体验课</view>
		<view class="course-tag font-20" v-if="courseItem.is_group == 1">拼团</view>
		<!-- 左上角查看人数，判断显示 -->
		<view class="look-tag flex col-center" v-if="isShowLookNum">
			<image src="/static/index/look-icon.png" mode="aspectFit"></image>
			<view class="text-white font-20 m-l-4">{{courseItem.views || 0}}</view>
		</view>

	</view>
</template>

<script>
	export default {
		// 根据 rowNum 判断一行显示1个或者2个3个
		name:"course-card",
		props:{
			// 图片宽度
			width:{
				type:String,
				default:'100%',
			},
			// 图片高度
			height:{
				type:String,
				default:'320rpx',
			},
			// 一行展示几个，最少一个，最多三个
			rowNum:{
				type:Number || String,
				default:2,
			},
			// 卡片类型，根据类型进入不同的详情页
			isCardType:{
				type:String,
				default:'isCourse'
			},
			// 课程信息
			courseItem:{
				type:Object,
				default:()=>{}
			},
			// 是否显示价格行
			isShowPriceRow:{
				type:Boolean,
				default:true,
			},
			// 是否显示会员体验标签
			isShowVipTag:{
				type:Boolean,
				default:false,
			},
			// 是否显示左上角查看人数
			isShowLookNum:{
				type:Boolean,
				default:false,
			},
			// 是否显示播放图标
			isShowPlayIcon:{
				type:Boolean,
				default:false,
			},
			// 是否显示删除图标
			isShowDelIcon:{
				type:Boolean,
				default:false,
			},
			// 是否显示积分
			isShowInteGral:{
				type:Boolean,
				default:false,
			},
			// 是否显示原价
			isOldPrice:{
				type:Boolean,
				default:true,
			},
			// 是否显示已出售
			isSell:{
				type:Boolean,
				default:true,
			},
			// 代理课程详情，是否加入，或者查看课程详情
			isAddAgency:{
				type:Boolean,
				default:false,
			},
			// 是否显示解除代理图标
			isShowDelAgencyIcon:{
				type:Boolean,
				default:false,
			},
      // 视频下标
      videoIndex:{
        type:Number,
        default:0,
      },
      // 视频列表
      dataList:{
        type:Array,
        default:()=>[],
      },
      // 分页查询参数
      listQuery:{
        type:Object,
        default:()=>{},
      },
      // 是否课程卡片
      isCourseCard:{
        type:Boolean,
        default:true,
      },
      // 是否显示体验卡免费
      isShowFree:{
        type:Boolean,
        default:false,
      }
		},
		data() {
			return {
				
			};
		},
		methods:{
			// 点击进入不同的详情
			handleCourseDetail(){
				let url = '';
				let params = {};
				switch(this.isCardType){
					case 'isCourse':	//课程详情
						url = '/pages/index/organizationDetail/courseDetail/courseDetail';
						params = {
							classes_id:this.courseItem.id,
						}
						break;
          case 'isMineClasses':  //我的选品课程详情
            url = '/pages/index/organizationDetail/courseDetail/courseDetail';
            params = {
            	classes_id:this.courseItem.classes_id,
            }
            break;
					case 'isIntegral':	//积分商品详情
						url = '/pages/mine/integralCenter/integralGoodsDetail/integralGoodsDetail';
            params = {
              goods_id:this.courseItem.id,
            }
						break;
					case 'isAgency':	//代理课程详情
						url = '/pages/mine/agency/agencyAdmin/agencyDetail';
						params = {
							classes_id:this.courseItem.id,
							isAddAgency:this.isAddAgency,
						}
						break;
          case 'isVideo':	//视频详情
           //  uni.setStorageSync('dataList',this.videoList);
          	// url = '/pages/mine/mineVideo/mineVideoList/mineVideoList';
          	// params = {
           //    // videoId:this.courseItem.id,
           //    videoIndex:this.videoIndex,
          	// }
          	this.toPreviewVideo(this.videoIndex);
            return;
            break;
				}
				this.$u.route({
					url:url,
					params:params,
				})
			},
      // 跳转预览视频
      toPreviewVideo(index){
        let list = []
        let videoNumber = 54;//（请输入 6 的倍数，来控制 DOM 节点的总视频数量）
        let dotNumber = videoNumber/2;
        let inf = (index+1) - dotNumber;
        console.log('点击了第'+(index+1)+'个视频.');
        let beforeLocation = 0;
        let afterLocation = 0;
        let location = 0;
        if(inf <= 0){
        	beforeLocation = 0;
        	location = index;
        	for(let i=0;i<=index;i++){
        		list.push(this.dataList[i]);
        	}
        } else {
        	beforeLocation = inf;
        	location = index - inf;
        	for(let i=inf;i<=index;i++){
        		list.push(this.dataList[i]);
        	}
        }
        let onf = this.dataList.length - (index+1)
        console.log('下方视频数：'+onf);
        if(onf <= dotNumber){
        	if(onf !== 0){
        		afterLocation = this.dataList.length - 1;
        		for(let i=index+1;i<this.dataList.length;i++){
        			list.push(this.dataList[i]);
        		}
        	} else {
        		afterLocation = this.dataList.length - 1;
        	}
        } else {
        	afterLocation = index+dotNumber;
        	for(let i=index+1;i<=index+dotNumber;i++){
        		list.push(this.dataList[i]);
        	}
        }
        console.log('总视频数：'+list.length);
        console.log('\n\n第一个视频下标：'+beforeLocation+'.\n'+'最后一个视频下标：'+afterLocation+'.\n\n');
        uni.setStorageSync("List",this.dataList);
        uni.setStorageSync("dataList",list);
				// #ifdef APP-PLUS
					uni.navigateTo({
						url: '/pages/mine/mineVideo/mineVideoList/mineVideoList?option='+location+'&listQuery='+JSON.stringify(this.listQuery)+'&index='+index,
						animationType: 'zoom-out'
					})
				// #endif
        // #ifdef H5
					uni.navigateTo({
						url: '/pages/mine/mineVideo/mineVideoListH5/mineVideoList?option='+location+'&listQuery='+JSON.stringify(this.listQuery)+'&index='+index,
						animationType: 'zoom-out'
					})
        // #endif
      },
			// 点击显示解除代理课程弹窗
			handleDelAgency(item){
				this.$emit('agencyItem',true,item);
			},
      // 点击显示删除视频弹窗
      handleDelVideo(item){
        this.$emit('onVideoDel',true,item);
      },
		}
	}
</script>

<style lang="scss" scoped>
	.course-card-content{
		// overflow: hidden;
		border-radius: 10rpx;
		position: relative;
		.course-image{
			position: relative;
			.del-agency-icon{
				position: absolute;
				top: -10rpx;
				right: -10rpx;
			}
			.del-icon{
				position: absolute;
				top: 8rpx;
				right: 8rpx;
				>image{
					width: 22rpx;
					height: 24rpx;
				}
			}
			.play-icon{
				position: absolute;
				bottom: 12rpx;
				right: 17rpx;
				>image{
					width: 28rpx;
					height: 28rpx;
				}
			}
		}
		.coures-card-bottom{
			.price{
				.new-price{
					color: #3077FB;
				}
				.old-price{
					color: #999999;
					text-decoration:line-through;
				}
			}
			.num{
				color: #666666;
			}
		}
		.course-tag{
			color: $uni-text-color-inverse;
			background: #3077FB;
			border-bottom-right-radius: 10rpx;
			padding: 12rpx;
			position: absolute;
			top: 0;
			left: 0;
		}
		.look-tag{
			position: absolute;
			top: 10rpx;
			left:11rpx;
			>image{
				width: 24rpx;
				height: 18rpx;
			}
		}
	}
	.card-row-one{
		width: calc(100% / var(--row));
    margin-left: 0 !important;
    margin-right: 0 !important;
		box-shadow: 0rpx 0rpx 18rpx 4rpx rgba(8, 54, 140, 0.12);
		.course-title{
			padding: 0 25rpx;
		}
		.coures-card-bottom{
			padding: 0 25rpx 30rpx 25rpx;
		}
	}
	.card-row-two{
		width: calc(100% / var(--row) - 15rpx);
	}
  .card-row-two:nth-child(even){
    margin-left: 15rpx !important;
  }
  .card-row-two:nth-child(odd){
    margin-right: 15rpx !important;
  }
	.card-row-three{
		width: calc(100% / var(--row) - 22rpx);
		.course-title{
			height: 76rpx;
		}
	}
  .card-row-three:nth-child(3n-1){
    margin-right: 30rpx !important;
    margin-left: 30rpx !important;
  }

</style>