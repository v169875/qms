<template>
	<!-- 个人资料 -->
	<view class="mine-info-content">
		<top-navbar :title="title"></top-navbar>
		<u-cell-group>
			<u-cell-item title="修改头像" :arrow="false" :title-style="titleStyle" @click="handleCellItem(1)">
				<u-avatar size="72" :src="userInfo.avatar_format"></u-avatar>
			</u-cell-item>
			<u-cell-item title="修改昵称" :arrow="false" :title-style="titleStyle" :value="userInfo.nickname || '暂未设置'"
				@click="handleCellItem(2)"></u-cell-item>
			<u-cell-item title="设置性别" :arrow="false" :title-style="titleStyle">
				<view class="flex col-center row-right">
					<view class="sex-radio flex col-center m-l-40" v-for="(item,index) in sexList" :key="index"
						@tap="handleChangeSex(item,index)">
						<image v-if="item.val == sexVal" src="/static/mine/sex-active.png" mode="aspectFit"></image>
						<view v-else class="not-sex round"></view>
						<view class="m-l-20">{{item.title}}</view>
					</view>
				</view>
			</u-cell-item>
			<u-cell-item title="绑定微信" :arrow="false" :title-style="titleStyle"
				:value="userInfo.wechat_openid == '' ? '未绑定' : '已绑定'" @click="handleCellItem(4)"></u-cell-item>
			<u-cell-item title="绑定支付宝" :arrow="false" :title-style="titleStyle"
				:value="userInfo.alipay_account || '暂未设置'" @click="handleCellItem(5)"></u-cell-item>
			<u-cell-item title="支付宝真实姓名" :arrow="false" :title-style="titleStyle"
				:value="userInfo.alipay_real_name || '暂未设置'" @click="handleCellItem(6)"></u-cell-item>
			<!-- <u-cell-item title="电话号码" :arrow="false" :title-style="titleStyle" :value="userInfo.alipay_real_name || '暂无'" @click="handleCellItem(6)"></u-cell-item> -->
			<u-cell-item title="宝贝名称" :arrow="false" :title-style="titleStyle" :value="userInfo.baby_name || '暂未设置'"
				@click="handleCellItem(7)"></u-cell-item>
			<u-cell-item title="宝贝年龄" :arrow="false" :title-style="titleStyle">
				<view class="uni-list-cell-db">
					<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
						<view class="uni-input">{{date}}</view>
					</picker>
				</view>
			</u-cell-item>

			<u-cell-item title="宝贝性别" :arrow="false" :title-style="titleStyle">
				<view class="flex col-center row-right">
					<view class="sex-radio flex col-center m-l-40" v-for="(item,index) in baosexList" :key="index"
						@tap="handleChangeSexbao(item,index)">
						<image v-if="item.val == sexbaoVal" src="/static/mine/sex-active.png" mode="aspectFit"></image>
						<view v-else class="not-sex round"></view>
						<view class="m-l-20">{{item.title}}</view>
					</view>
				</view>
			</u-cell-item>

		</u-cell-group>
		<u-gap height="100"></u-gap>
		<view class="dyan-btn">
			<view class="btn-1">
				<u-button :custom-style="customBtnStyle1" shape="circle" :hair-line="false"
					@click="handleConfirmSave()">保存</u-button>
			</view>
		</view>
		<!-- 修改信息弹窗 -->
		<u-popup class="edit-popup" v-model="editPopupShow" mode="center" width="620rpx" border-radius="15">
			<u-gap height="48"></u-gap>
			<view class="flex col-center row-between p-l-40 p-r-40">
				<u-icon name="close" color="#666666" size="28" style="visibility: hidden;"></u-icon>
				<view class="font-30">{{popupTitle}}</view>
				<u-icon name="close" color="#000" size="28" @tap="handleEditClose()"></u-icon>
			</view>
			<u-gap height="70"></u-gap>
			<view class="edit-input">
				<u-input v-model="popupVal" :type="inputType" border :placeholder="popupPlaceholderText"
					placeholder-style="text-align: center" :clearable="false"></u-input>
			</view>
			<u-gap height="50"></u-gap>
			<view class="edit-bottom flex col-center row-between">
				<view class="edit-btn gray-btn radius-50" @tap="handleEditClose()">取消</view>
				<view class="edit-btn main-bg-color radius-50" @tap="handleEditConfirm()">确定</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	let app = getApp();
	export default {
		data() {

			const currentDate = this.getDate({
				format: true
			})
			return {
				title: '个人资料',
				titleStyle: {
					fontSize: '28rpx',
					color: '#000',
				},
				userInfo: {},
				sexList: [{
						val: 0,
						title: '女生'
					},
					{
						val: 1,
						title: '男生'
					},
				],
				baosexList: [{
						val: '0',
						title: '女生'
					},
					{
						val: '1',
						title: '男生'
					},
				],
				date: currentDate,
				sexVal: 1,
				sexbaoVal:'1',
				cellIndex: null, //每项下标
				customBtnStyle1: getApp().globalData.customStyle1,
				editPopupShow: false, //修改信息弹窗
				popupTitle: '', //弹窗标题
				popupVal: '', //弹窗输入框
				inputType: 'text', //弹窗类型
				popupPlaceholderText: '', //输入框占位符
				// 部分需要提交的参数
				submitForm: {
					avatar: '',
				}
			};
		},

		onShow() {
			this.getUserInfo();
		},
		created() {
			uni.$off('uAvatarCropper');
			// 监听从裁剪页发布的事件，获得裁剪结果
			uni.$on('uAvatarCropper', path => {
				// 上传图片
				this.setImgUpload(path);
			})
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		onUnload() {},
		methods: {
			// 上传图片
			async setImgUpload(path) {
				let data = {
					file: path,
					name: 'file',
				}
				const res = await this.$api.fileUpload(data);
				if (res.code == 1) {
					this.userInfo.avatar_format = res.data.fullurl;
					this.submitForm.avatar = res.data.url;
				}
			},
			// 日期
			bindDateChange: function(e) {
				this.date = e.detail.value
			},
			// 日期方法
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			// 获取用户信息
			getUserInfo() {
				app.getUserInfo();
				uni.$on('userInfo', (data) => {
					this.userInfo = data;
					this.sexVal = data.gender;
					this.sexbaoVal = data.baby_gender;
					if(data.baby_birth_date){
						console.log(data.baby_birth_date)
						this.date = data.baby_birth_date
					}
				})
			},
			// 切换性别
			handleChangeSex(item, index) {
				this.sexVal = item.val;
			},
			// 宝贝切换性别
			handleChangeSexbao(item, index) {
				this.sexbaoVal = item.val;
			},
			// 点击每项
			handleCellItem(index) {
				this.cellIndex = index;
				switch (index) {
					case 1: //修改头像
						this.$u.route({
							// 关于此路径，请见下方"注意事项"
							url: '/uview-ui/components/u-avatar-cropper/u-avatar-cropper',
							// 内部已设置以下默认参数值，可不传这些参数
							params: {
								// 输出图片宽度，高等于宽，单位px
								destWidth: 300,
								// 裁剪框宽度，高等于宽，单位px
								rectWidth: 200,
								// 输出的图片类型，如果'png'类型发现裁剪的图片太大，改成"jpg"即可
								fileType: 'jpg',
							}
						})
						return;
						break;
					case 2: //修改昵称
						this.popupTitle = '修改昵称';
						this.inputType = 'text';
						this.popupPlaceholderText = '请输入昵称';
						this.popupVal = this.userInfo.nickname;
						break;
					case 4: //绑定微信
						// this.popupTitle = '绑定微信';
						// this.inputType = 'text';
						// this.popupPlaceholderText = '请输入绑定微信';
						if (this.userInfo.wechat_openid != '') {
							this.$u.toast(`已绑定微信`);
							return;
						}
						this.handleWechatLogin();
						return
						break;
					case 5: //绑定支付宝
						this.popupTitle = '绑定支付宝';
						this.inputType = 'text';
						this.popupPlaceholderText = '请输入绑定支付宝';
						this.popupVal = this.userInfo.alipay_account;
						break;
					case 6: //支付宝真实姓名
						this.popupTitle = '支付宝真实姓名';
						this.inputType = 'text';
						this.popupPlaceholderText = '请输入支付宝真实姓名';
						this.popupVal = this.userInfo.alipay_real_name;
						break;
					case 7: //宝贝名称
						this.popupTitle = '宝贝名称';
						this.inputType = 'text';
						this.popupPlaceholderText = '请输入宝贝名称';
						this.popupVal = this.userInfo.baby_name;
						break;
					case 8: //宝贝年龄
						this.popupTitle = '宝贝年龄';
						this.inputType = 'number';
						this.popupPlaceholderText = '请输入宝贝年龄';
						this.popupVal = this.userInfo.baby_age;
						break;
					case 9: //宝宝性别
						this.popupTitle = '宝宝性别';
						this.inputType = 'text';
						this.popupPlaceholderText = '请输入宝宝性别';
						this.popupVal = this.userInfo.baby_gender;
						break;
				}
				this.editPopupShow = true;
			},
			// 关闭弹窗
			handleEditClose() {
				this.editPopupShow = false;
				this.popupVal = '';
				this.popupTitle = '';
				this.inputType = 'text';
				this.popupPlaceholderText = '';
			},
			// 弹窗内确认
			handleEditConfirm() {
				if (this.popupVal == '') {
					this.$u.toast(this.popupPlaceholderText);
					return;
				}
				switch (this.cellIndex) {
					case 2: // 修改昵称
						this.userInfo.nickname = this.popupVal;
						break;
					case 4: //	绑定微信
						this.userInfo.nickname = this.popupVal;
						break;
					case 5: //	绑定支付宝
						this.userInfo.alipay_account = this.popupVal;
						break;
					case 6: //	支付宝真实姓名
						this.userInfo.alipay_real_name = this.popupVal;
						break;
					case 7: //	宝贝名称
						this.userInfo.baby_name = this.popupVal;
						break;
					case 8: //	宝贝				
						this.userInfo.baby_age = this.popupVal;
						break;
					case 9: //	宝贝性别
						this.userInfo.baby_gender = this.popupVal;
						break;
				}
				this.editPopupShow = false;
				this.popupVal = '';
				this.popupTitle = '';
				this.inputType = 'text';
				this.popupPlaceholderText = '';
			},
			// 保存
			async handleConfirmSave() {
				let data = {
					avatar: this.submitForm.avatar == '' ? this.userInfo.avatar : this.submitForm.avatar,
					nickname: this.userInfo.nickname,
					gender: this.sexVal,
					alipay_account: this.userInfo.alipay_account,
					alipay_real_name: this.userInfo.alipay_real_name,
					baby_name: this.userInfo.baby_name,
					baby_age: this.userInfo.baby_age,
					baby_gender: this.userInfo.baby_gender,
          baby_sex: this.sexbaoVal,
          baby_birth_date:this.date
        }
				const res = await this.$api.profile(data);
				if (res.code == 1) {
					this.$u.toast(res.msg);
					setTimeout(() => {
						this.$u.route({
							type: 'back',
						})
					}, 500)
				}
			},
      // 跳转微信获取openid
      handleWechatLogin(){
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
                      //console.log('微信回调',loginRes)
        							this.weixinLoginFun(loginRes);
        						}
        					});
        				},
        				fail:(error)=> {
        					console.log(error)
        				}
        			});
        		}
        	}
        });
      },
      // 微信登陆
      async weixinLoginFun(loginData){
      	const res = await this.$api.wechatApp({loginData});
      	if(res.code == 1){
          if(res.data.userinfo.user_id == this.userInfo.id){
            this.$u.toast(`绑定成功`);
          }else{
            this.$u.toast(`绑定失败，此微信已绑定过启明星图账号`);
          }
          this.getUserInfo();
        }
      },
		}
	}
</script>

<style lang="scss" scoped>
	.mine-info-content {
		.sex-radio {
			image {
				width: 30rpx;
				height: 30rpx;
			}

			.not-sex {
				width: 30rpx;
				height: 30rpx;
				border: 1px solid #999;
			}
		}

		.edit-popup {
			.edit-popup-title {
				padding: 0 42rpx;
				// margin-top: 48rpx;
				margin-bottom: 61rpx;

				.title {
					margin-left: 30rpx;
				}

				>image {
					width: 30rpx;
					height: 30rpx;
					display: block;
				}
			}

			.edit-input {
				margin: 0 40rpx 0rpx 40rpx;
			}

			.edit-bottom {
				margin: 0 40rpx 47rpx 40rpx;

				>view {
					width: calc(100% / 2 - 50rpx);
				}

				.gray-btn {
					background: #999 !important;
				}

				.edit-btn {
					padding: 18rpx 0;
					text-align: center;
					color: $uni-text-color-inverse;
				}
			}
		}
	}
</style>
