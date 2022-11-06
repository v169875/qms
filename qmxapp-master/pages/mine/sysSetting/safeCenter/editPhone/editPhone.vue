<template>
	<!-- 更换手机号 -->
	<view class="edit-phone-content">
		<top-navbar :title="title" :isShowBorder="true"></top-navbar>
		<u-cell-group>
			<u-cell-item title="旧手机号" :title-style="titleStyle" :arrow="false">
				<u-input type="number" v-model="userInfo.mobile" maxlength="11" :clearable="false" disabled placeholder="请输入旧手机号"></u-input>
			</u-cell-item>
			<u-cell-item title="新手机号" :title-style="titleStyle" :arrow="false">
				<u-input type="number" v-model="editForm.newPhone" maxlength="11" :clearable="false" placeholder="请输入新手机号"></u-input>
			</u-cell-item>
			<u-cell-item title="验证码" :title-style="titleStyle" :arrow="false">
				<view class="flex col-center">
					<u-input type="number" v-model="editForm.code" maxlength="4" :clearable="false" placeholder="请输入验证码"></u-input>
					<view class="get-code font-26 text-black" v-if="btn.showText==true" @click="getCode()">{{btn.btnText}}</view>
					<view class="get-code font-26 text-black" v-else>{{btn.btnTime}}s重新发送</view>
				</view>
			</u-cell-item>
		</u-cell-group>
		<u-gap height="170"></u-gap>
		<view class="dyan-btn">
			<view class="btn-1">
				<u-button :custom-style="customBtnStyle1" shape="circle" :hair-line="false" @click="handleUpdatePhone()">完成</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	let app = getApp();
	export default {
		data() {
			return {
				title:'更换手机号',
				titleStyle:{
					fontSize:'28rpx',
					color:'#000',
					width:'240rpx',
				},
				editForm:{
					newPhone:'',
					code:'',
				},
				btn: {
					btnText: '获取验证码',
					btnTime: 60,
					showText: true,
				},
				customBtnStyle1:getApp().globalData.customStyle1,
				userInfo:{},
			};
		},
		onLoad() {
			this.getUserInfo();
		},
		methods:{
			// 获取用户信息
			getUserInfo(){
				app.getUserInfo();
				uni.$on('userInfo',(data)=>{
					this.userInfo = data;
				})
			},
			// 获取验证码
			async getCode() {
				if (this.editForm.newPhone == '') {
					this.$u.toast('请输入旧手机号');
					return
				}
				if (!this.$u.test.mobile(this.editForm.newPhone)) {
					this.$u.toast('手机号格式不正确');
					return
				}
				let res = await this.$api.sendCode({
					mobile: this.editForm.newPhone,
					event:'change_mobile'
				})
				if (res.code == 200) {
					let {
						btn
					} = this
					btn.showText = false
					this.$u.toast(res.msg);
					var time = setInterval(() => {
						btn.btnTime--
						if (btn.btnTime <= 0) {
							clearInterval(time)
							btn.btnText = "重新获取"
							btn.btnTime = 60,
							btn.showText = true
						}
					}, 1000)
				}
			},
			// 确认更换手机号
			async handleUpdatePhone(){
				if(this.editForm.newPhone == ''){
					this.$u.toast(`请输入新手机号`);
					return;
				}
				if(this.editForm.code == ''){
					this.$u.toast(`请输入验证码`);
					return;
				}
				let mobileData = {
					mobile: this.editForm.newPhone,
					captcha:this.editForm.code,
				}
				const result = await this.$api.changeMobile(mobileData);
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
	.edit-phone-content{
		.get-code{
			text-align: center;
		}
	}
</style>
