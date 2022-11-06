<template>
	<!-- 共用顶部导航栏 -->
	<u-navbar 
		class="top-nav-bar"
		:is-back="isBack"
		:back-icon-color="backColor"
		:title="title" 
		:is-fixed="isFixed" 
		:title-color="titleColor" 
		:background="background" 
		:border-bottom="isShowBorder"
		:height="navbarHeight"
	>
		<view class="slot-wrap">
			<view class="index-top flex col-center row-between" v-if="isIndex">
				<view class="flex col-center" @tap="handleSelectAddress()">
					<u-icon name="map-fill" color="#666666" size="36"></u-icon>
					<view class="address" v-if="location && location.street">{{ (location.street.length > 6 ? location.street.slice(0,6) + '...' : location.street)}}</view>
          <view class="address" v-else-if="location && location.citys">{{ (location.citys.length > 6 ? location.citys.slice(0,6) + '...' : location.citys)}}</view>
          <view class="address" v-else>定位失败</view>
				</view>
				<view class="flex col-center index-search m-l-30 p-r-10 u-flex-1">
					<u-search v-if="isIndex" bg-color="rgba(0,0,0,0)" placeholder="请输入搜索内容" v-model="keyword" disabled :show-action="false" @click="handleGoPage('search')"></u-search>
					<view class="search-text">搜索</view>
				</view>
			</view>
		</view>
		<!-- 社区搜索页 -->
		
			
				<view class="index-top flex col-center row-between" v-if="isShequ">
					<view class="flex col-center" @tap="handleSelectAddress()">
						<u-icon name="map-fill" color="#666666" size="36"></u-icon>
						<view class="address" v-if="location && location.street">{{ (location.street.length > 6 ? location.street.slice(0,6) + '...' : location.street)}}</view>
			  <view class="address" v-else-if="location && location.citys">{{ (location.citys.length > 6 ? location.citys.slice(0,6) + '...' : location.citys)}}</view>
			  <view class="address" v-else>定位失败</view>
					</view>
					<view class="flex col-center index-search m-l-30 p-r-10 u-flex-1">
						<u-search v-if="isShequ" bg-color="rgba(0,0,0,0)" placeholder="请输入搜索内容" v-model="keyword" disabled :show-action="false" @click="handleGoPage('shequ')"></u-search>
						<view class="search-text">搜索</view>
					</view>
				</view>
			
		
		<view class="slot-right font-28 text-333 p-r-32 flex col-center row-right" slot="right">
			<view class="" v-if="isMineBlock" @tap="handleGoPage('mineBlock')">我的拉黑</view>
			<view class="" v-if="!isMineBlock && isBlackUser" @tap="handleGoPage('isBlack')">{{is_black ? '已拉黑' : '拉黑用户'}}</view>
			<view class="" v-if="isShowFootPrint" @tap="handleGoPage('footPrint')">清空足迹</view>
			<view class="" v-if="isAgency" @tap="handleGoPage('isAgency')">选品库</view>
			<view class="" v-if="allMsg" @tap="handleGoPage('isAllMsg')">全部已读</view>
			<!-- <image class="address-icon" v-if="isShowAddress" src="/static/mine/integral/address-icon.png" mode="aspectFit" @tap="handleGoPage('address')"></image> -->
      <view class="" v-if="isShowAddress" @tap="handleGoPage('address')">收货地址</view>
    </view>
<!-- 	
		<view class="index-top flex col-center row-between" v-if="isShequ">
			<view class="flex col-center" @tap="handleSelectAddress()">
				<u-icon name="map-fill" color="#666666" size="36"></u-icon>
        <view class="address" v-if="location && location.street">{{ (location.street.length > 6 ? location.street.slice(0,6) + '...' : location.street)}}</view>
        <view class="address" v-else-if="location && location.citys">{{ (location.citys.length > 6 ? location.citys.slice(0,6) + '...' : location.citys)}}</view>
        <view class="address" v-else>定位失败</view>
			</view>
			<view class="flex col-center index-search m-l-30 p-r-10 u-flex-1">
				<u-search v-if="isShequ" bg-color="rgba(0,0,0,0)" placeholder="请输入搜索内容" v-model="keyword" disabled :show-action="false" @click="handleGoPage('shequ')"></u-search>
				<view class="search-text">搜索</view>
			</view>
		</view> -->
	
	</u-navbar>
</template>

<script>
	let app = getApp();
	export default {
		name:"top-navbar",
		props:{
			// 导航栏标题
			title:{
				type:String,
				default:''
			},
			// 导航栏高度
			navbarHeight:{
				type:Number,
				default:44,
			},
			// 背景颜色
			background:{
				type:Object,
				default:()=>{}
			},
			// 标题颜色
			titleColor:{
				type:String,
				default:'',
			},
			// 是否固定在顶部
			isFixed:{
				type:Boolean,
				default:true,
			},
			// 是否返回
			isBack:{
				type:Boolean,
				default:true
			},
			// 返回的图标颜色
			backColor:{
				type:String,
				default:'#333'
			},
			// 是否显示下边框
			isShowBorder:{
				type:Boolean,
				default:false,
			},
			// 是否首页
			isIndex:{
				type:Boolean,
				default:false
			},
			isShequ:{
				type:Boolean,
				default:false
			},
			// 当前定位城市
			location:{
				type:Object,
				default:()=>{},
			},
			// 是否显示我的拉黑
			isMineBlock:{
				type:Boolean,
				default:false
			},
			// 是否显示清空足迹
			isShowFootPrint:{
				type:Boolean,
				default:false
			},
			// 是否显示地址图标
			isShowAddress:{
				type:Boolean,
				default:false
			},
			// 是否显示选品库
			isAgency:{
				type:Boolean,
				default:false
			},
      // 是否显示已拉黑文字
      isBlackUser:{
        type:Boolean,
        default:false,
      },
      // 是否以拉黑用户
      is_black:{
        type:Boolean,
        default:false,
      },
      // 是否显示全部已读
      allMsg:{
        type:Boolean,
        default:false,
      },
		},
		data() {
			return {
				keyword:'',
			};
		},
		methods:{
      // 点击切换城市
      handleSelectAddress(){
        this.$u.route({
          url:'/pages/index/selectAddress/selectAddress',
        })
      },
			// 顶部栏共用跳转
			handleGoPage(str){
				let url = '';
				let type = 'to';
				let params = {};
				switch(str){
					case 'search': // 点击进入搜素页
						url = '/pages/index/search/search';
						break;
						case 'shequ': // 点击进入搜素页
							url = '/pages/index/search/shequsearch';
							break;
					case 'mineBlock': // 点击进入我的拉黑
						url = '/pages/mine/mineVideo/mineBlack/mineBlack';
						break;
					case 'footPrint': // 清空足迹
						this.$emit('onClearFootPrint',true);
						break;
						return
					case 'address': // 点击进入地址管理
						url = '/pages/mine/integralCenter/takeAddress/takeAddress';
						break;
					case 'isAgency': // 点击选品库
						url = '/pages/mine/agency/agencyAdmin/agencyAdmin';
						break;
          case 'isBlack':
            this.$emit('onIsBlock',true);
            return;
            break;
          case 'isAllMsg':
            this.$emit('onAllMsg',true);
            break;
				}
				this.$u.route({
					type:type,
					url:url,
					params:params,
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.top-nav-bar{
		.slot-wrap{
			flex: 1;
			.index-top{
				margin-left: 35rpx;
				color: #666;
				.address{
					margin-left: 11rpx;
				}
				.index-search{
					background: #F5F5F5;
					border-radius: 60rpx;
					.search-text{
						padding: 6rpx 24rpx;
						background: #78A7FF;
						color: $uni-text-color-inverse;
						border-radius: 60rpx;
					}
				}
			}
		}
		.slot-right{
			.address-icon{
				width: 33rpx;
				height: 37rpx;
			}
		}
	}
</style>
