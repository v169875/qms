<template>
	<!-- 收货地址 -->
	<view class="take-content">
		<top-navbar :title="title" :isShowBorder="true"></top-navbar>
		<view class="take-header font-28">请选择收货地址</view>
		<block v-for="(item,index) in takeAddressList" :key="index">
			<view class="module-card address-item radius-10">
				<view class="user-name font-26">
					<text>{{item.real_name}}</text>
					<text>{{item.mobile}}</text>
				</view>
				<view class="address-detail hidden_two">地址：{{item.address + '    ' +  item.detail}}</view>
				<view class="address-default flex row-between col-center">
					<view class="flex col-center" @tap="handleChangeDefault(item.id)">
						<view class="default-radio m-r-10 radius-50">
							<image v-show="item.is_default == 1" src="/static/mine/sex-active.png" mode="aspectFit"></image>
						</view>
						<text class="left-text">默认地址</text>
					</view>
					<view class="">
						<text class="right-text font-24" @tap="handleCreateAddress(item.id)">编辑</text>
						<text class="right-text font-24 m-l-44" @tap="handleDelAddress(item.id)">删除</text>
					</view>
				</view>
			</view>
		</block>
		<u-empty text="暂未添加收货地址" :show="takeAddressList.length <= 0" mode="list"></u-empty>
		<u-gap height="50"></u-gap>
		<view class="dyan-btn">
			<view class="btn-1">
				<u-button :custom-style="customBtnStyle1" shape="circle" :hair-line="false" @click="handleCreateAddress(null)">新增收货地址</u-button>
			</view>
		</view>
		<u-modal v-model="delModalShow" content="是否删除该地址?" show-cancel-button @cancel="takeAddressId = null" @confirm="handleConfirmDel"></u-modal>
	</view>
</template>

<script>
	let app = getApp();
	export default {
		data() {
			return {
				title:'收货地址',
				customBtnStyle1:getApp().globalData.customStyle1,
				// 收货地址列表
				takeAddressList:[],
				// 删除地址模态框
				delModalShow:false,
				// 收货地址id
				takeAddressId:null,
			};
		},
		onShow() {
			this.getAddressList();
		},
		methods:{
			// 获取收货地址列表
			async getAddressList(){
				const res = await this.$api.getAddressList();
				if(res.code == 1){
					this.takeAddressList = res.data;
				}
			},

			// 切换默认地址
			async handleChangeDefault(id){
				let data = {
					id:id,
				};
				const res = await this.$api.setDefaultAddress(data);
				if(res.code == 1){
					this.$u.toast(res.msg);
					this.getAddressList();
				}
			},
			// 删除地址
			handleDelAddress(id){
				this.takeAddressId = id;
				this.delModalShow =	!this.delModalShow;
			},
			// 确认删除该地址
			async handleConfirmDel(){
				let data = {
					id:this.takeAddressId,
				};
				const res = await this.$api.delAddress(data);
				if(res.code == 1){
					this.$u.toast(res.msg);
					this.takeAddressId = null;
					this.getAddressList();
				}
			},
			// 点击新增收货地址 或者编辑收货地址
			handleCreateAddress(id){
				let url = '/pages/mine/integralCenter/takeAddress/createAddress';
				let params = {};
				if(id != null){
					params = {
						address_id:id,
					}
				}
				this.$u.route({
					url:url,
					params:params,
				})
			}
		}
	}
</script>
<style>
	page{
		background: #FAFAFA;
	}
</style>
<style lang="scss" scoped>
	.take-content{
		color: $uni-text-color;
		.take-header{
			margin: 43rpx 30rpx 22rpx 30rpx;
		}
		.address-item{
			margin: 26rpx 30rpx 0 30rpx;
			padding: 40rpx 35rpx 35rpx 38rpx;
			background: $uni-bg-color;
			.user-name{
				>text:first-child{
					margin-right: 30rpx;
				}
			}
			.address-detail{
				margin: 23rpx 0;
				word-break:break-all;
			}
			.address-default{
				.default-radio{
					width: 25rpx;
					height: 25rpx;
					border: 1px solid #DDDDDD;
					>image{
						width: 25rpx;
						height: 25rpx;
						display: block;
						margin-top: -5rpx;
					}
				}
				.left-text{
					color: #999;
					font-size: 20rpx !important;
				}
				.right-text{
					color: #FA3D1D;
					font-size: 24rpx !important;
				}
			}
		}
		// 是否隐藏底部按钮背景色
		.public-bottom-btn{
			// background: transparent !important;
		}
	}
</style>
