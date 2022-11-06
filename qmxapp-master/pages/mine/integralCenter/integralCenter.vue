<template>
	<!-- 积分中心 -->
	<view class="integral-center-content">
		<top-navbar :title="title" :isShowBorder="true" :isShowAddress="true"></top-navbar>
		<u-gap height="34"></u-gap>
		<view class="m-l-32 m-r-32 p-l-34 p-t-34 p-b-44 p-r-34 top-integral-info radius-20 text-white">
			<view class="font-30 flex col-center row-between">
				<view class="flex col-center">
					<u-avatar size="70" :src="userInfo.avatar_format"></u-avatar>
					<view class="m-l-20">{{userInfo.nickname || '未登录'}}</view>
				</view>
				<view class="">可用积分: {{userInfo.score || 0}}</view>
			</view>
			<view class="flex col-center row-between m-t-42 p-l-50 p-r-50">
				<view class="flex-col row-center col-center" v-for="(item,index) in integralTopList" :key="index" @tap="handleTopItem(item.url)">
					<u-image width="47rpx" height="47rpx" :src="`/static/mine/integral/integral-top-icon${item.icon}.png`" mode="aspectFit"></u-image>
					<view class="m-t-16 font-28">{{item.title}}</view>
				</view>
			</view>
		</view>
		<u-gap height="34"></u-gap>
		<view class="m-l-32 m-r-32 tabs-row flex col-center">
			<u-tabs :list="tabList" :current="current" bar-height="6" bar-width="48" active-color="#3077FB" @change="handleTabChange"></u-tabs>
      <view class="m-l-40">做任务赚积分</view>
    </view>
		<view class="">
			<u-cell-group :border="false">
				<u-cell-item  :title="`${item.task_name}(${item.today_already_count}/${item.everyday_limit}次) /次赠送${item.give_score_amount}积分`" :title-style="titleStyle" :arrow="false" v-for="(item,index) in taskList" :key="index">
					<u-image class="m-r-10" width="54rpx" height="54rpx" slot="icon" :src="item.task_image_format" mode="aspectFit"></u-image>
					<view class="flex col-center row-right task-btn">
						<view class="main-bg-color text-white font-24 radius-10 text-center" :class="{'task-confirm':item.disabled}" @tap="handleConfirmTask(item)">{{item.disabled ? '已完成' : '待完成'}}</view>
					</view>
				</u-cell-item>
			</u-cell-group>
		</view>
		<navigator url="/pages/mine/integralCenter/integral">
		<view class="integral-bottom-img text-white flex-col row-center m-l-32 m-r-32 m-t-30 m-b-28 p-l-66">
			<view class="font-34 text-bold">积分兑好礼 ></view>
			<view class="font-26 m-t-36">精选好物限量兑换</view>
		</view>
		</navigator>
		<!-- 课程推荐 卡片 -->
<!-- 		<view class="course-list">
			<block v-for="(item,index) in courseList" :key="index">
				<course-card 
					:courseItem="item" 
					:rowNum="3" 
					:isShowPriceRow="false" 
					:isShowInteGral="true"
					isCardType="isIntegral"
					>
				</course-card>
			</block>
		</view> -->
	</view>
</template>

<script>
	let app = getApp();
	// 课程卡片
	import courseCard from '@/components/course-card/course-card.vue'
	export default {
		components:{
			courseCard
		},
		data() {
			return {
				title:'积分中心',
				avatar:'https://tse1-mm.cn.bing.net/th/id/R-C.d8011b5d28ee607bfa5e427d0ad03b99?rik=eCm54QsjFJ81gQ&riu=http%3a%2f%2fimg2.woyaogexing.com%2f2018%2f01%2f09%2fa03c1358f5fee520!400x400_big.jpg&ehk=Tchj3Y063MGOw03bLmMHcWVT36v4WTVbUFjWdm%2fmH30%3d&risl=&pid=ImgRaw&r=0&sres=1&sresct=1',
				integralTopList:[
					{icon:1,title:'历史记录',url:'/pages/mine/integralCenter/integralRecord/integralRecord',},
					{icon:2,title:'积分转盘',url:'/pages/mine/integralCenter/drawTurnplate/drawTurnplate',},
					{icon:3,title:'我的礼品',url:'/pages/mine/integralCenter/mineGift/mineGift',},
				],
				tabList: [{
					name: '积分任务'
				}],
				current: 0,
				titleStyle:{
					fontSize:'26rpx',
					color:'#333',
				},
				// 积分任务列表
				taskList:[],
				// 积分商品列表
				courseList:[],
				listQuery:{
					page:1,
					limit:10,
				},
				isLoad:false,
				userInfo:{},
				qrcode: '',
				fenxurl: ''
			};
		},
		onLoad() {
			this.getCourseList();
			this.getQrcode()
		},
		onShow() {
			this.getUserInfo();
			this.getTaskList();
		},
		onReachBottom() {
			this.getCourseList();
		},
		methods:{
			// 获取用户信息
			getUserInfo(){
				app.getUserInfo();
				uni.$on('userInfo',(data)=>{
					this.userInfo = data;
				})
			},
			// 获取积分任务列表
			async getTaskList(){
				const res = await this.$api.taskList();
				if(res.code == 1){
					this.taskList = res.data;
				}
			},
			// 切换tab
			handleTabChange(current){
				this.current = current;
			},
			// 获取积分商品列表
			async getCourseList(){
				if(this.isLoad) return;
				this.isLoad = true;
				const res = await this.$api.score_goods_goodsList(this.listQuery);
				if(res.code == 1){
					if(res.data.data.length > 0){
						this.courseList = this.courseList.concat(res.data.data);
						this.listQuery.page++;
						this.isLoad = false;
					}else{
						this.isLoad = false;
					}
				}
			},
			// 点击顶部模块跳转
			handleTopItem(url){
				this.$u.route({
					url:url
				})
			},
			// 点击完成任务
			handleConfirmTask(item){
				if(item.disabled) return this.$u.toast(`该任务已完成`);
        let url = '';
        let type = 'tab';
        let params = {};
				switch(item.id){
          case 1: //签到
            this.confirmTake(item.id);
            return;
            break;
          case 2: //邀请好友注册
            uni.navigateTo({
            	url: "./invitefriend/canvas-page?qrcode=" + this.qrcode + '&url=' + this.fenxurl
            })
            break;
          case 3: //购买课程/代金券
          case 4: //分享课程并购买
            url = '/pages/index/index';
            break;
          case 5: //发布视频
          case 6: //视频被点赞
            url = '/pages/videoShow/index';
            break;
        }
        this.$u.route({
          type,
          url,
          params,
        })
			},
      // 做任务事件
      async confirmTake(task_id){
        let data = {
          task_id,
        };
        const res = await this.$api.doTaskStore(data);
        if(res.code == 1){
          this.$u.toast(res.msg);
          this.getTaskList();
          this.getUserInfo();
        }
      },
			// 获取分享二维码
			async getQrcode() {
				const res = await this.$api.qrCodeYq();
				if(res.code == 1) {
					this.qrcode = res.data.qrCodeUrl
					this.fenxurl =  res.data.url
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.integral-center-content{
		.top-integral-info{
			background: url('../../../static/mine/integral/integral-center-top-bg.png') no-repeat center center / cover;
		}
		.tabs-row{
			/deep/ .u-tab-item{
				color: $uni-text-color !important;
			}
		}
		.task-btn{
			>view{
				width: 130rpx;
			}
			.task-confirm{
				background: #cddffb !important;
			}
		}
		.integral-bottom-img{
			height: 200rpx;
			background: url('../../../static/mine/integral/integral-bottom-img.png') no-repeat center center / cover;
		}
	}
</style>
