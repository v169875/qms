<template>
	<view class="login-content">
		<u-gap height="60"></u-gap>
		<view class="logo-row">
			<image src="/static/logo.png" mode="aspectFit"></image>
		</view>


		<view class="login-form">
			<view class="form-item">
				<view class="flex col-center">
					<view class="m-r-10">+86</view>
					<u-input v-model="loginForm.phone" :clearable="false" maxlength="11" type="number"
						placeholder="请输入手机号"></u-input>
				</view>
			</view>
			<view class="form-item flex col-center row-between">
				<view class="flex col-center u-flex-1">
					<u-input v-model="loginForm.code" :clearable="false" maxlength="4" type="number"
						placeholder="请输入验证码"></u-input>
				</view>
				<view class="get-code font-26" v-if="btn.showText==true" @click="getCode()">{{btn.btnText}}</view>
				<view class="get-code font-26" v-else>{{btn.btnTime}}s重新发送</view>
			</view>
			<view class="form-item">
				<view class="flex col-center">
					<u-input v-model="loginForm.shareCode" :clearable="false" maxlength="11" placeholder="请输入邀请码">
					</u-input>
				</view>
			</view>
			<view class="publie-btn m-t-76">
				<u-button shape="circle" class="fill-btn m-b-47 font-28" @tap="handleLogin()" :loading="loading">手机号登录</u-button>
				<u-gap height="28"></u-gap>
				<!--<view class="plain-btn font-28" @tap="handleWechatLogin()">微信一键快捷登录</view>-->
			</view>
		</view>
		<!-- 微信登录绑定手机号 -->
		<u-popup v-model="bindMobileShow" mode="center" width="80%" border-radius="10" :mask-close-able="false">
			<u-gap height="46"></u-gap>
			<view class="flex col-center row-between p-l-40 p-r-40">
				<u-icon name="close" color="#666666" size="28" style="visibility: hidden;"></u-icon>
				<view class="">请输入绑定手机号</view>
				<u-icon name="close" color="#666666" size="28" style="visibility: hidden;"
					@tap="handleCloseBindPopup()"></u-icon>
			</view>
			<u-gap height="36"></u-gap>
			<view class="login-form p-l-40 p-r-40">
				<view class="form-item">
					<view class="flex col-center">
						<u-input v-model="bindForm.bind_mobile" :clearable="false" maxlength="11" type="number"
							placeholder="请输入手机号"></u-input>
					</view>
				</view>
				<view class="form-item flex col-center row-between">
					<view class="flex col-center u-flex-1">
						<u-input v-model="bindForm.bind_code" :clearable="false" maxlength="4" type="number"
							placeholder="请输入验证码"></u-input>
					</view>
					<view class="get-code font-26" v-if="btn.showText==true" @click="getCode()">{{btn.btnText}}</view>
					<view class="get-code font-26" v-else>{{btn.btnTime}}s重新发送</view>
				</view>
				<view class="publie-btn m-t-76">
					<view class="fill-btn font-28" @tap="handleBindMobile()">绑定手机号登录</view>
				</view>
				<u-gap height="30"></u-gap>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		bindJiguangUser
	} from 'utils/jiguang.js'
	export default {
		data() {
			return {
				loading: false,
				loadingText: '正在登录',
				// 手机号
				loginForm: {
					phone: '',
					// 验证码
					code: '',
					// 邀请码：
					shareCode: '',
				},
				// 微信绑定手机号
				bindForm: {
					bind_mobile: '',
					// 验证码
					bind_code: '',
				},
				btn: {
					btnText: '获取验证码',
					btnTime: 60,
					showText: true,
				},
				bindMobileShow: false,
				// 是否token过期重新登录
				isToken: true, //false为token过期
				bindToken: '', //微信登录返回token
			};
		},
		onLoad(options) {
			if (options.code) {
				this.loginForm.shareCode = options.code
			}
			if (options.isToken) {
				this.isToken = options.isToken;
				return
			}
			if (this.isToken) {
				let token = uni.getStorageSync('token');
				if (token) {
					this.$u.route({
						type: 'tab',
						url: '/pages/index/index',
					})
				}
			}
		},
		methods: {
			// 点击每项
			handleCellItem(index) {
				let url = '';
				let params = {};
				switch (index) {
					case 1: // 安全中心
						url = '/pages/mine/sysSetting/safeCenter/safeCenter';
						break;
					case 3: // 检查更新

						break;
					case 4: // 关于我们
					case 5: // 用户协议
					case 8: // 首页登陆公告
					case 6: // 隐私政策
						url = '/pages/login/agreement';
						params = {
							agreType: index
						}
						break;
				};
				this.$u.route({
					url: url,
					params: params,
				})
			},
			// 登录按钮
			async handleLogin() {
				if (this.loginForm.phone == '') {
					this.$u.toast('请输入手机号');
					return
				}
				if (!this.$u.test.mobile(this.loginForm.phone)) {
					this.$u.toast('手机号格式不正确');
					return
				}
				if (this.loginForm.code == '') {
					this.$u.toast('请输入验证码');
					return
				}
				let loginData = {
					mobile: this.loginForm.phone,
					captcha: this.loginForm.code,
					invite_code: this.loginForm.shareCode,
				}
				this.loading = true
				// 登录
				const result = await this.$api.mobileLogin(loginData);
				// console.log(result)
				this.loading = false
				if (result.code == 1) {
					this.$u.toast('登录成功');
					uni.setStorageSync('token', result.data.userinfo.token);
					// 获取用户信息
					const userRes = await this.$api.userInfo();
					if (userRes.code == 1) {
						uni.setStorageSync('userInfo', userRes.data);
						console.log('这是我的用户信息', userRes)
						// #ifdef APP-PLUS
						// const userAlias = uni.getStorageSync('regs_id');
						if (plus.os.name == 'Android') {
							bindJiguangUser(userRes.data.id);
						} else { //ios推送暂时不行

						}
						// #endif
						setTimeout(() => {
							uni.switchTab({
								url: '/pages/index/index'
							})
						}, 500)
					}
				}
			},
			// 获取验证码
			async getCode() {
				let res = {};
				if (this.bindMobileShow) {
					if (this.bindForm.bind_mobile == '') {
						this.$u.toast('请输入手机号');
						return
					}
					if (!this.$u.test.mobile(this.bindForm.bind_mobile)) {
						this.$u.toast('手机号格式不正确');
						return
					}
					res = await this.$api.sendCode({
						mobile: this.bindForm.bind_mobile,
						event: 'bind_mobile',
					})
				} else {
					if (this.loginForm.phone == '') {
						this.$u.toast('请输入手机号');
						return
					}
					if (!this.$u.test.mobile(this.loginForm.phone)) {
						this.$u.toast('手机号格式不正确');
						return
					}
					res = await this.$api.sendCode({
						mobile: this.loginForm.phone,
						event: 'mobile_login',
					})
				}
				if (res.code == 1) {
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
			// 微信登录
			handleWechatLogin() {
				uni.getProvider({
					service: 'oauth',
					success: (res) => {
						if (~res.provider.indexOf('weixin')) {
							uni.login({
								provider: 'weixin',
								success: (loginRes) => {
									uni.getUserInfo({
										provider: 'weixin',
										success: (infoRes) => {
											this.weixinLoginFun(loginRes);
										}
									});
								},
								fail: (error) => {
									console.log('kkkkkk', error)
								}
							});
						}
					}
				});
			},
			// 微信登陆
			async weixinLoginFun(loginData) {
				const res = await this.$api.wechatApp({
					loginData
				});
				if (res.code == 1) {
					if (res.data.binding == 0) { //==0是未绑定，1是已绑定直接跳转
						this.bindMobileShow = true;
						this.bindToken = res.data.userinfo.token;
					} else if (res.data.binding == 1) {
						uni.setStorageSync('token', res.data.userinfo.token);
						// 获取用户信息
						const userRes = await this.$api.userInfo();
						if (userRes.code == 1) {
							uni.setStorageSync('userInfo', userRes.data);
							setTimeout(() => {
								uni.switchTab({
									url: '/pages/index/index'
								})
							}, 500)
						}
					}
					// this.$u.toast(`授权成功!`);
					// let indexPath = '/pages/index/index';
					// app.getUserInfo();
					// setTimeout(() => {
					// 	app.pageNavigateTo(indexPath,'tab');
					// }, 2000)
					// uni.setStorageSync('userinfo', result.data.userinfo)
				}
			},
			// 关闭绑定手机号弹窗
			handleCloseBindPopup() {
				this.bindMobileShow = false;
				this.loginForm = this.$options.data().loginForm;
			},
			// 点击绑定手机号
			async handleBindMobile() {
				if (this.bindForm.bind_mobile == '') {
					this.$u.toast('请输入手机号');
					return
				}
				if (!this.$u.test.mobile(this.bindForm.bind_mobile)) {
					this.$u.toast('手机号格式不正确');
					return
				}
				if (this.bindForm.bind_code == '') {
					this.$u.toast('请输入验证码');
					return
				}
				uni.setStorageSync('token', this.bindToken);
				const res = await this.$api.bindMobile(this.bindForm);
				if (res.code == 1) {
					//绑定的token与其他接口使用的token不一样，绑定成功后重新赋值token,
					uni.setStorageSync('token', res.data.userinfo.token);
					// 获取用户信息
					const userRes = await this.$api.userInfo();
					if (userRes.code == 1) {
						uni.setStorageSync('userInfo', userRes.data);
						this.bindToken = '';
						this.bindMobileShow = false;
						this.loginForm = this.$options.data().loginForm;
						// #ifdef APP-PLUS
						// const userAlias = uni.getStorageSync('regs_id');
						if (plus.os.name == 'Android') {
							bindJiguangUser(userRes.data.id);
							console.log('这是用户id', userRes)
						} else { //ios推送暂时不行

						}
						// #endif
						setTimeout(() => {
							uni.switchTab({
								url: '/pages/index/index'
							})
						}, 500)
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.login-content {
		.logo-row {
			text-align: center;

			image {
				margin-left: 40rpx;
				width: 343rpx;
				height: 343rpx;
			}
		}

		.login-form {
			padding: 0 65rpx;

			.form-item {
				margin-bottom: 20rpx;
				padding-bottom: 10rpx;
				border-bottom: 1px solid #DDDDDD;

				image {
					width: 28rpx;
					height: 46rpx;
					margin-left: 41rpx;
					margin-right: 28rpx;
				}

				.get-code {
					text-align: center;
					color: #3077FB;
					border: 1px solid #3077FB;
					padding: 10rpx 26rpx;
					border-radius: 60rpx;
				}
			}

			.agre-row {
				color: #888888;
				font-size: 22rpx;

				.agre-text {
					line-height: 40rpx;

					.agre-title {
						color: #4B5298;
					}
				}
			}
		}

		.publie-btn {
			>view {
				border-radius: 60rpx;
				padding: 19rpx 0;
				text-align: center;
			}

			.fill-btn {
				background: $uni-bg-color-main;
				color: $uni-text-color-inverse;
			}

			.plain-btn {
				border: 1px solid #3077FB;
				color: #3077FB;
			}
		}
	}
</style>
