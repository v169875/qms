<template>
	<view class="content body-color">
		<top-navbar :title="title"></top-navbar>
		<view class="title flex flex-d">
			<view class="title-all">全部<span>{{carList.length}}</span></view>
			<view @click="editCar">编辑</view>
		</view>
		<view class="car-list" v-if="carList.length > 0">
			<view v-for="(item,index) in carList" class="car-list-item boxsizing flex flex-d">
				<view class="flex flex-c">
					<uni-icons @click="chooseItem(item.id)" :type="item.checked?'checkbox-filled':'circle'"
						:color="item.checked?'#3077FB':'#8B8B8B'" size="22"></uni-icons>
					<image class="goods-img" :src="item.classes.classes_cover_image_format"></image>
				</view>
				<view class="car-list-item-txt">
					<view class="car-list-item-name">{{item.classes.classes_name}}</view>
					<view class="car-list-item-js">{{item.classes.classes_desc}}</view>
					<view class="goods-price"><span>￥</span>{{item.classes.classes_current_price}}</view>
				</view>
				<view class="del-icon" v-if="isEdit" @click="delCart(item.id)">
					<uni-icons type="minus-filled" color="#3077FB" size="28"></uni-icons>
				</view>
				<view class="car-list-item-btns flex flex-c" v-else>
					<u-number-box v-model="item.num" :longPress="false" :asyncChange="true" @change="valChange($event,item.id)" integer></u-number-box>
				</view>
			</view>
			<u-loadmore :status="isMore? 'loadmore':'nomore'" />
		</view>
		<view v-else class="no-goods white-color border-r margin-20">
			<u-empty mode="car" icon="http://cdn.uviewui.com/uview/empty/car.png">
			</u-empty>
		</view>
		<view class="choose-all boxsizing flex flex-c flex-d" v-if="isEdit">
			<view class="flex flex-c">
				<!-- <uni-icons :type="chooseAll?'checkbox-filled':'circle'" :color="chooseAll?'#F63E32':'#8B8B8B'" size="22"
					@click="chooseAllclick"></uni-icons>
				<span class="f-24">全选</span> -->
			</view>
			<view class="go-js f-28" @click="clearCar">清空购物车</view>
		</view>
		<view class="choose-all boxsizing flex flex-c flex-d" v-else>
			<view class="flex flex-c">
				<uni-icons :type="chooseAll?'checkbox-filled':'circle'" :color="chooseAll?'#3077FB':'#8B8B8B'" size="22"
					@click="chooseAllclick"></uni-icons>
				<span class="f-24">全选</span>
			</view>
			<view>合计：￥<text style="font-weight: bold;font-size: 34rpx;">{{totalPrice}}</text></view>
			<view class="go-js f-28" @click="goPay">去结算({{numAll}})</view>
		</view>
		<!-- 询问弹出层 -->
		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog type="info" cancelText="取消" confirmText="确定" title="提示" :content="content"
				@confirm="dialogConfirm" @close="dialogClose"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '购物车',
				carList: [],
				chooseAll: false,
				isEdit: false,
				isClick: false,
				content: '是否要删除该商品',
				id: null,
				isMore: true,
				page: 1,
				page_size: null,
				total: null,
			}
		},
		onLoad() {
			// this.getCartLists()
		},
		onShow() {
			this.getCartLists()
		},
		// 触底的事件
		onReachBottom() {
			// 判断是否还有下一页数据
			if (this.page * this.page_size >= this.total) {
				this.isMore = false
				return
			}
			this.page += 1
			this.getCartLists()
		},
		computed: {
			totalPrice: function() {
				let num = 0
				this.carList.forEach(item => {
					if (item.checked) {
						num += item.classes.classes_current_price * item.num
					}
				})
				this.chooseAll = this.carList.every(item => {
					return item.checked == true
				})
				return num.toFixed(2)
			},
			numAll: function() {
				let numall = 0
				this.carList.forEach(item => {
					if (item.checked) numall++
				})
				return numall
			}
		},
		methods: {
			async getCartLists() {
				let data = {
					page: this.page
				};
				const res = await this.$api.getCartList(data);
				console.log(res)
				if(res.code == 1) {
					this.total = res.data.total
					this.page_size = res.data.per_page
					this.carList = res.data.data.map(item=>{
						item.checked = false
						return item
					})
					this.isMore = this.page * res.data.per_page >= this.total ? false:true
				}
			},
			async updateCartList(id,num) {
				let data = {
					id,
					num
				};
				// const res = await this.$api.updateCartList(data);
				console.log(data)
			},
			stopinput() {

			},
			async valChange(e, id) {
				console.log('当前值为: ' + e.value, id)
				let data = {
					id,
					num: e.value
				};
				const res = await this.$api.updateCartList(data);
				console.log(res)
				this.carList = this.carList.map(item => {
					if (item.id == id) item.num = e.value
					return item
				})
			},
			chooseAllclick() {
				this.chooseAll = !this.chooseAll
				this.carList.forEach(item => {
					item.checked = this.chooseAll
				})
			},
			chooseItem(id) {
				this.carList.forEach(item => {
					if (item.id == id) item.checked = !item.checked
				})
			},
			isChooseAll() {

			},
			// 去支付
			goPay() {
				let url = '/pages/index/organizationDetail/courseDetail/orderConfirmMore/orderConfirm';
				let classesid = ''
				let num = ''
				let cart_id = ''
				this.carList.forEach(item=>{
					if(item.checked) {
						 classesid = classesid + ',' + item.classes_id
						 num = num + ',' + item.num
						 cart_id = cart_id + ',' + item.id
					}
				})
				classesid = classesid.substr(1)
				num = num.substr(1)
				cart_id = cart_id.substr(1)
				let params = {
					classes_id: classesid,
					num,
					cart_id
				}
				console.log(params)
				if(classesid == '') return
				this.$u.route({
					url,
					params,
				})
			},
			// 删除购物车
			delCart(id) {
				this.id = id
				this.$refs.alertDialog.open()
			},
			// 编辑购物车
			editCar() {
				this.isEdit = !this.isEdit
			},
			// 清空购物车
			clearCar() {
				this.id = null
				this.$refs.alertDialog.open()
			},
			// 点击确定
			dialogConfirm() {
				console.log(this.id)
			},
			// 点击取消
			dialogClose() {
				this.$refs.alertDialog.close()
			},
		}
	}
</script>

<style>
	page {
		background: #F3F3F3;
	}
</style>
<style lang="scss" scoped>
	@import "./index.scss";
</style>
