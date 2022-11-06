<template>
	<!-- 新增收货人，编辑收货人共用页面 -->
	<view>
		<top-navbar :title="title" :isShowBorder="true"></top-navbar>
		<view class="public-form-body">
			<view class="form-item">
				<view class="form-item-label">您的姓名</view>
				<view class="form-item-content">
					<u-input v-model="form.real_name" :clearable="false" placeholder="请输入您的姓名"></u-input>
				</view>
			</view>
			<view class="form-item">
				<view class="form-item-label">联系电话</view>
				<view class="form-item-content">
					<u-input v-model="form.mobile" type="number" :clearable="false" maxlength="11" placeholder="请输入联系电话"></u-input>
				</view>
			</view>
			<view class="form-item">
				<view class="form-item-label">所在地区</view>
				<view class="form-item-content">
					<u-input v-model="form.address" :clearable="false" placeholder="请选择所在地区" @focus="handleFocus"></u-input>
				</view>
			</view>
			<view class="form-item">
				<view class="form-item-label">详细地址</view>
				<view class="form-item-content">
					<u-input v-model="form.detail" type="textarea" :clearable="false" height="140" :autoHeight="true" placeholder="请输入详细地址"></u-input>
				</view>
			</view>
			<view class="form-item flex col-center row-between">
				<view class="form-item-label" style="margin: 0;">是否默认</view>
				<u-switch v-model="form.is_default" active-value="1" inactive-value="0" size="30" @change="handleChangeSwitch"></u-switch>
			</view>
		</view>
		<u-gap height="100"></u-gap>
		<view class="dyan-btn">
			<view class="btn-1">
				<u-button :custom-style="customBtnStyle1" shape="circle" :hair-line="false" @click="handleSubmit()">{{btnText}}</u-button>
			</view>
		</view>
		<u-picker mode="region" v-model="regionShow" @cancel="handleRegionCancel" @confirm="handleRegionConfirm"></u-picker>
	</view>
</template>

<script>
	let app = getApp();
	export default {
		data() {
			return {
				title:'新增收货地址',
				// 添加收货地址表单
				form:{
					real_name:'', //收货人姓名
					mobile:'', //联系电话
					address:'',   //所在地区
					detail:'',  //详细地址
					is_default:false,  //是否默认地址
				},
				// 地区选择器
				regionShow:false,
				// 选择的地址
				selectAddress:{},
				customBtnStyle1:getApp().globalData.customStyle1,
				address_id:null, //地址详情id
				btnText:'', //按钮文字，判断是新增还是编辑
			};
		},
		onLoad(options) {
			if(options.address_id){
				this.address_id = options.address_id * 1;
				this.getAddressDetail(this.address_id);
				this.title = '编辑收货地址';
				this.btnText = '保存';
			}else{
				this.title = '新增收货地址';
				this.btnText = '新增收货地址';
			}
		},
		methods:{
			// 获取收货地址详情
			async getAddressDetail(id){
				let data = {
					id:id,
				};
				const res = await this.$api.getAddressDetail(data);
				if(res.code == 1){
					this.form = res.data;
					this.form.is_default = res.data.is_default == 1 ? true : false;
				}
			},
			// 点击切换默认地址
			handleChangeSwitch(val){
				
			},
			handleFocus(){
				this.regionShow = !this.regionShow;
			},
			// 取消地区选择框
			handleRegionCancel(e){
				
			},
			// 确定选择地区
			handleRegionConfirm(e){
				this.selectAddress = e;
				this.form.address = e.province.label + '-' + e.city.label + '-' + e.area.label;
			},
			// 提交按钮
			async handleSubmit(){
				let {
					real_name,
					mobile,
					address,
					detail
				} = this.form;
				let formData = Object.assign({},this.form);
				if(real_name == ''){
					this.$u.toast(`请输入收货人姓名`);
					return
				}
				if(mobile == ''){
					this.$u.toast(`请输入联系电话`);
					return
				}
				if(!this.$u.test.mobile(mobile)){
					this.$u.toast(`联系电话格式不正确`);
					return
				}
				if(address == ''){
					this.$u.toast(`请选择所在地区`);
					return
				}
				if(detail == ''){
					this.$u.toast(`请输入详细地址`);
					return
				}
				// 如果有收货地址id就是修改，否则就是新增地址
				if(this.address_id != null){
					this.editAddress(formData);
				}else{
					this.createAddress(formData);
				}
			},
			// 修改收货地址
			async editAddress(form){
				let data = {
					real_name:form.real_name,
					mobile:form.mobile,
					address:form.address,
					detail:form.detail,
					is_default:form.is_default,
					id:form.id,
				}
				const res = await this.$api.editAddress(data);
				if(res.code == 1){
					this.$u.toast(res.msg);
					setTimeout(()=>{
						this.$u.route({
							type:'back',
						})
					},500)
				}
			},
			// 添加收货地址
			async createAddress(form){
				let data = {
					real_name:form.real_name,
					mobile:form.mobile,
					address:form.address,
					detail:form.detail,
					is_default:form.is_default,
				}
				const res = await this.$api.addAddress(data);
				if(res.code == 1){
					this.$u.toast(res.msg);
					setTimeout(()=>{
						this.$u.route({
							type:'back',
						})
					},500)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.public-form-body{
		margin: 31rpx 34rpx 0 34rpx;
		.form-item{
			margin-bottom: 30rpx;
			.form-item-label{
				font-size: 30rpx;
				color: $uni-text-color;
				margin-bottom: 25rpx;
			}
			.form-item-content{
				background: rgba(153, 153, 153, .1);
				border-radius: 8rpx;
				padding:0 26rpx !important;
				/deep/.u-input{
				}
			}
		}
	}
</style>
