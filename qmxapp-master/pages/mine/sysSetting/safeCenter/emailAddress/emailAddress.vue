<template>
	<!-- 邮箱地址 -->
	<view class="email-address-content">
		<top-navbar :title="title" :isShowBorder="true"></top-navbar>
		<u-cell-group>
<!-- 			<u-cell-item title="旧邮箱" :title-style="titleStyle" :arrow="false">
				<u-input v-model="editForm.oldEmail" :clearable="false" input-align="right" placeholder="请输入旧邮箱"></u-input>
			</u-cell-item> -->
			<u-cell-item title="邮箱" :title-style="titleStyle" :arrow="false">
				<u-input v-model="userInfo.email" :clearable="false" input-align="right" placeholder="请输入邮箱"></u-input>
			</u-cell-item>
		</u-cell-group>
		<u-gap height="170"></u-gap>
		<view class="dyan-btn">
			<view class="btn-1">
				<u-button :custom-style="customBtnStyle1" shape="circle" :hair-line="false" @click="handleUpdateEmail()">完成</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	let app = getApp();
	export default {
		data() {
			return {
				title:'邮箱地址',
				editForm:{
					oldEmail:'',
					newEmail:'',
				},
				titleStyle:{
					fontSize:'28rpx',
					color:'#000',
					width:'240rpx',
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
			// 确认更换邮箱地址
			async handleUpdateEmail(){
				// if(this.editForm.oldEmail == ''){
				// 	this.$u.toast(`请输入旧邮箱`);
				// 	return
				// }
				// if(!this.$u.test.email(this.editForm.oldEmail)){
				// 	this.$u.toast(`旧邮箱格式不正确`);
				// 	return
				// }
				if(this.userInfo.email == ''){
					this.$u.toast(`请输入邮箱`);
					return
				}
				if(!this.$u.test.email(this.userInfo.email)){
					this.$u.toast(`邮箱格式不正确`);
					return
				}
				// if(this.editForm.oldEmail == this.editForm.newEmail){
				// 	this.$u.toast(`新旧邮箱不能一样`);
				// 	return
				// }
				let data = {
					email:this.userInfo.email,
					gender:this.userInfo.gender,  //修改个人信息必填字段
				}
				const res = await this.$api.profile(data);
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
	.email-address-content{
		
	}
</style>
