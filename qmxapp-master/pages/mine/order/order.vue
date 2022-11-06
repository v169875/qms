<template>
	<!-- 全部订单 -->
	<view class="mine-order-content">
		<top-navbar :title="title"></top-navbar>
		<view>
			<u-tabs-swiper 
				ref="uTabs" :list="tabsList" 
				:current="current" 
				@change="tabsChange"
				font-size="28"
				bar-width="42"
				bar-height="4"
				inactive-color="#333333"
				active-color="#3077FB"
			  swiperWidth="750"
			></u-tabs-swiper>
		</view>
		<view class="user-avatar"></view>
		<swiper class="order-swiper" :style="'height:' + ScrollHeight" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
			<!-- 订单卡片 -->
			<swiper-item class="order-swiper-item" v-for="(swiperItem,swiperIndex) in orderList" :key="swiperIndex">
				<scroll-view class="order-scroll-view" style="width: 100%;height: 100%;" scroll-y @scrolltolower="onreachBottom">
					<u-gap height="25"></u-gap>
					<block v-for="(item,idnex) in swiperItem" :key="item.id">
						<order-card 
							:orderItem="item"
              :orderClass="order_class"
							@onEvaluate="handleEvaluate"
              @onRefresh="handleRefresh"
						></order-card>
					</block>
					<u-gap height="25"></u-gap>
					<view class="middleC" v-if="swiperItem.length <= 0">
						<u-empty text="暂无订单" mode="order"></u-empty>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
		<!-- 评价弹窗 -->
		<eva-popup ref="evaPopup" isType="eva" @onRefresh="handleRefresh"></eva-popup>
	</view>
</template>

<script>
	import orderCard from '@/components/order-card/order-card.vue';
	import evaPopup from '@/components/eva-popup/eva-popup.vue';
	export default {
		components:{
			orderCard,
			evaPopup
		},
		data() {
			return {
				title:'全部订单',
				tabsList:[
					{name: '待付款'},
					{name: '待完成'},
					{name: '待评价'},
					{name: '已完成'},
					{name: '已失效'},
					{name: '退款/售后'},
				],
				// 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
				current: 0, // tabs组件的current值，表示当前活动的tab选项
				swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
				ScrollHeight:0,
				orderList:[[],[],[],[],[],[]],
        listQuery:{
          page:1,
          limit:15,
          status:1, //1=待付款,2=待完成,3=待评价,4=已完成,5=已失效,6=退款/售后,7=已取消
        },
        isLoad:false,
        order_class:1, // 1==课程订单 ，2==课程拼团订单
			};
		},
    onLoad(options) {
      if(options.order_class){
        this.order_class = options.order_class * 1;
        // 如果是拼团订单执行下面操作
        if(this.order_class == 2){
          this.orderList.push([]);
          this.tabsList[1].name = '已成团';
          this.tabsList.push({name:'拼团中'});
        }
      }
    },
		onShow() {
      this.orderList[this.swiperCurrent].splice(0);
      this.listQuery.page = 1;
      this.isLoad = false;
			this.getOrderList(this.swiperCurrent);
		},
		onReady() {
			this.getElInfo();
		},
    watch:{
      swiperCurrent(newVal,oldVal){
        this.orderList[newVal].splice(0);
        this.listQuery.page = 1;
        this.isLoad = false;
        this.getOrderList(newVal);
      }
    },
		methods:{
      // 订单卡片操作后，回调刷新列表
      handleRefresh(refresh){
        if(refresh){
          this.orderList[this.swiperCurrent].splice(0);
          this.listQuery.page = 1;
          this.isLoad = false;
          this.getOrderList(this.swiperCurrent);
        }
      },
      // 获取订单列表
			async getOrderList(current){
        if(this.isLoad) return;
        this.isLoad = true;
        switch(current){
          case 0: // 待付款
            this.listQuery.status = 1;
            break;
          case 1: // 待完成
            this.listQuery.status = 2;
            break;
          case 2: //  待评价
            this.listQuery.status = 3;
            break;
          case 3: //  已完成
            this.listQuery.status = 4;
            break;
          case 4: //  已失效
            this.listQuery.status = 5;
            break;
          case 5: //  退款/售后
            this.listQuery.status = 6;
            break;
          case 6: //  拼团中
            this.listQuery.status = 8;
            break;
        }
        let res = {};
        // order_class == 1是我的订单列表，==2是拼团订单列表
        if(this.order_class == 1){
          res = await this.$api.classes_order_getOrderList(this.listQuery);
        }else if(this.order_class == 2){
          res = await this.$api.classes_group_order_getOrderList(this.listQuery);
        }else{
          this.$u.toast(`系统错误`);
          setTimeout(()=>{
            this.$u.route({
              type:'back',
            })
          },500)
          return;
        }
        if(res.code == 1){
          if(res.data.data.length > 0){
            let result = this.orderList[current].concat(res.data.data);
            this.$set(this.orderList,current,result);
            this.listQuery.page++;
            this.isLoad = false;
          }else{
            if(this.listQuery.page == 1){
            	if(res.data.data.length <= 0){
            		this.orderList[current].splice(0);
            	}
            }
            this.isLoad = false;
          }
        }
			},
			// tabs通知swiper切换
			tabsChange(index) {
				this.swiperCurrent = index;
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
				// this.getOrderList(this.current);
			},
			// 获取屏幕剩余高度
			getElInfo() {
				this.$u.getRect('.user-avatar').then(res => {
				  let windowHeight = this.$u.sys()
				  this.ScrollHeight = windowHeight.windowHeight - res.top + 'px'
				})
			},
			// 点击显示评价弹窗
			handleEvaluate(show,item){
				this.$refs.evaPopup.handleShowEvaPopup(show,item);
			},
		}
	}
</script>

<style lang="scss" scoped>
	.mine-order-content{
    .u-tabs{
      /deep/ scroll-view ::-webkit-scrollbar {
        display: none !important;  
        width: 0 !important;  
        height: 0 !important;  
        -webkit-appearance: none;  
        background: transparent;  
      }
    }
	}
</style>
