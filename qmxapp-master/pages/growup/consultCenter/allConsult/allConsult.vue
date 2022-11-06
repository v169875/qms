<template>
	<!-- 全部咨询 -->
	<view class="all-consult-content">
		<top-navbar :title="title"></top-navbar>
		<u-gap height="30"></u-gap>
		<view class="p-l-50 p-r-50">
			<u-search 
				v-model="keyword" 
				placeholder="请输入搜索内容" 
				input-align="center" 
				:show-action="true" 
				:animation="true"
				@custom="handleSearchActive"
			></u-search>
		</view>
		<view class="top-tab p-l-80 p-r-80">
			<u-tabs-swiper 
				ref="uTabs" :list="tabsList" 
				:current="current" 
				@change="tabsChange"
				font-size="30"
				bar-width="50"
				bar-height="5"
				:is-scroll="false"
				inactive-color="#666666"
				active-color="#333333"
			  swiperWidth="750"
			></u-tabs-swiper>
		</view>

		<scroll-view 
			v-if="current == 1" 
			class="hot-active-tab flex col-center p-t-32 p-b-46 p-l-34" 
			scroll-x
			:scroll-into-view="hotScrollviewIndex"
			:scroll-with-animation="true"
			>
			<view
				class="text-666 font-26 m-r-20"
				:id="'hotIndex' + index"
				:class="{'active-hot-tab':hotIndex == index}" 
				v-for="(item,index) in consultClassList" 
				:key="index" @tap="handleChangeHotTab(index)">
				{{item.name}}
			</view>
		</scroll-view>
		<u-gap height="30" v-else></u-gap>
		<view class="user-avatar"></view>
		<view class="p-l-34 p-r-34">
			<block v-if="consultList.length > 0">
				<view class="" v-for="(item,index) in consultList" :key="index">
					<consult-center-item :consultItem="item"></consult-center-item>
				</view>
			</block>
			<view class="middleC" v-else>
				<u-empty text="暂无资讯" mode="list"></u-empty>
			</view>
			<u-gap height="30"></u-gap>
		</view>
	</view>
</template>

<script>
	import consultCenterItem from '@/components/consult-center-item/consult-center-item.vue'
	export default {
		components:{
			consultCenterItem
		},
		data() {
			return {
				title:'全部资讯',
				keyword:'',
				tabsList:[
					{name:'全部'},
					{name:'热点文章'},
					{name:'每日小知识'},
				],
				// 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
				current: 0, // tabs组件的current值，表示当前活动的tab选项
				swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
				ScrollHeight:0,
				consultList:[],
				consultClassList:[], //分类列表
				hotIndex:0, //热门分类下标
				hotScrollviewIndex:0,  //自动滚动到当前tab
				listQuery:{
					page:1,
					limit:10,
				},
				isLoad:false,
			};
		},
		watch:{
			swiperCurrent(newVal,oldVal){
				// console.log('rrrrr',newVal)
				// console.log('sssss',oldVal)
			}
		},
		onLoad(options) {
			console.log(options)
			if(options.classList){
				this.getClassList1()
				// this.getConsultList();
				if(options.hotIndex != 'all'){
					this.hotIndex = options.hotIndex * 1;
					this.hotScrollviewIndex = 'hotIndex' + this.hotIndex;
					this.current = 1;
					this.swiperCurrent = 1;
				}else{
					this.hotScrollviewIndex = 'hotIndex' + 0;
				}
			}
		},
		onShow() {
			this.resetList();
			// this.getConsultList();
		},
		onReady() {
			this.getElInfo();
		},
		onReachBottom() {
			this.getConsultList();
		},
		methods:{
			// 获取分类
			async getClassList(){
				let data = {
					type:'news',
				};
				const res = await this.$api.getCategoryList(data);
				console.log(res)
				if(res.code == 1){
					this.consultClassList = res.data;
				}
			},
      async getClassList1(){
        let data = {
          type:'news',
        };
        const res = await this.$api.getCategoryList(data);
        console.log(res)
        if(res.code == 1){
          this.consultClassList = res.data;
          this.getConsultList();
        }
      },
			// 获取咨询列表
			async getConsultList(){
				if(this.isLoad) return;
				this.isLoad = true;
				console.log(this.hotIndex,this.current,this.consultClassList)
				let data = {
					category_id: this.current == 1 ? this.consultClassList[this.hotIndex].id : null,
					keywords:this.keyword,
					...this.listQuery,
				};
				const res = await this.$api.getNewsList(data);
				if(res.code == 1){
					if(res.data.data.length > 0){
						this.consultList = this.consultList.concat(res.data.data);
						this.listQuery.page++;
						this.isLoad = false;
					}else{
						this.isLoad = false;
					}
				}
			},
			// 点击搜索
			handleSearchActive(){
				this.resetList();
				this.current = 0;
				this.getConsultList();
			},
			// 重置列表
			resetList(){
				this.listQuery.page = 1;
				this.isLoad = false;
				this.consultList = [];
			},
			// tabs通知swiper切换
			tabsChange(index) {
				console.log(index)
				this.resetList();
				this.current = index;
				this.getConsultList();
			},
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e) {
				let dx = e.detail.dx;
				this.$refs.uTabs.setDx(dx);
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
				this.$refs.uTabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
			},
			// scroll-view到底部加载更多
			onreachBottom() {
				// this.getClassGoodsList()
			},
			// 获取屏幕剩余高度
			getElInfo() {
				this.$u.getRect('.user-avatar').then(res => {
				  let windowHeight = this.$u.sys()
				  this.ScrollHeight = windowHeight.windowHeight - res.top + 'px'
				})
			},
			// 点击切换热门分类下标
			handleChangeHotTab(index){
				console.log('123',index)
				if(this.hotIndex == index) return;
				this.resetList();
				this.hotIndex = index;
				this.hotScrollviewIndex = `hotIndex${index}`;
				this.getConsultList();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.all-consult-content{
		.top-tab{
			border-bottom: 1px solid RGBA(245, 245, 245, 1);
			/deep/.u-scroll-bar{
				background:#3077FB !important;
				bottom:0 !important;
			}
		}
		.hot-active-tab{
			white-space: nowrap;
			view{
				display: inline-block;
				padding: 8rpx 26rpx;
				background: #F5F5F5;
				border-radius: 60rpx;
				letter-spacing: 2rpx;
			}
			.active-hot-tab{
				background: #3077FB;
				color: $uni-text-color-inverse;
			}
		}
	}
</style>
