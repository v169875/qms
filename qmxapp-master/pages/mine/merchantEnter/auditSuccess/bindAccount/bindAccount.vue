<template>
	<!-- 绑定企业账号 -->
	<view class="bind-account-content">
		<top-navbar :title="title" :isShowBorder="true"></top-navbar>
		<u-cell-group>
			<u-cell-item :arrow="false">
				<view class="u-flex-1" slot="title">
					<u-input v-model="form.mobile" type="number" maxlength="11" :clearable="false" placeholder="请输入手机号"></u-input>
				</view>
			</u-cell-item>
			<u-cell-item :arrow="false">
				<view class="u-flex-1" slot="title">
					<u-input v-model="form.password" type="password" maxlength="12" :clearable="false" placeholder="请输入登录密码"></u-input>
				</view>
			</u-cell-item>
			<u-cell-item :arrow="false">
				<view class="u-flex-1" slot="title">
					<u-input v-model="form.confirm_password" type="password" maxlength="12" :clearable="false" placeholder="请确认登录密码"></u-input>
				</view>
			</u-cell-item>
		</u-cell-group>
		<u-gap height="130"></u-gap>
		<view class="dyan-btn">
			<view class="btn-1">
				<u-button :custom-style="customBtnStyle1" shape="circle" :hair-line="false" @click="handleBindSubmit()">立即绑定</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:'绑定企业账号',
				form:{
					mobile:'',
					password:'',
					confirm_password:'',
				},
				isClickBtn:false,
				customBtnStyle1:getApp().globalData.customStyle1,
			};
		},
    created() {
		  const userinfo =	uni.getStorageSync('userInfo');
		  this.form.mobile = userinfo.mobile
    },
    methods:{
			// 关闭当前页并返回我的页面
			handleBindSubmit(){
				if(this.isClickBtn) return this.$u.toast(`请勿频繁操作`);
				this.isClickBtn = true;
				let {mobile,password,confirm_password} = this.form;
				let formData = Object.assign({},this.form);
				if(mobile == ''){
					this.$u.toast(`请输入手机号`);
					this.isClickBtn = false;
					return
				}
				if (!this.$u.test.mobile(mobile)) {
					this.$u.toast('手机号格式不正确');
					this.isClickBtn = false;
					return
				}
				if(password == ''){
					this.$u.toast(`请输入登录密码`);
					this.isClickBtn = false;
					return
				}
				if(password.length < 6){
					this.$u.toast(`密码长度在6-12位之间`);
					this.isClickBtn = false;
					return
				}
				if(confirm_password == ''){
					this.$u.toast(`请输入确认密码`);
					this.isClickBtn = false;
					return
				}
				if(password !== confirm_password){
					this.$u.toast(`两次密码输入不一致`);
					this.isClickBtn = false;
					return
				}
				this.bindAuditAccount(formData);
			},
			// 绑定企业账号
			async bindAuditAccount(form){
				const res = await this.$api.auditPassBindCompanyMobile(form);
				if(res.code == 1){
					this.$u.toast(res.msg);
					setTimeout(()=>{
						this.$u.route({
							type:'tab',
							url:'/pages/mine/index',
						})
					},500)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.bind-account-content{
		/deep/ .u-cell_title{
			width: 100% !important;
		}
	}
</style>
