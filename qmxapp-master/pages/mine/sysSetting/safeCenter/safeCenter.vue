<template>
	<!-- 安全中心 -->
	<view>
		<top-navbar :title="title"></top-navbar>
		<u-cell-group>
			<!-- <u-cell-item title="修改密码" :title-style="titleStyle" @click="handleCellItem()"></u-cell-item> -->
			<u-cell-item title="更换手机号" :title-style="titleStyle" @click="handleCellItem(1)"></u-cell-item>
			<u-cell-item title="邮箱地址" :title-style="titleStyle" @click="handleCellItem(2)"></u-cell-item>
			<u-cell-item title="注销账号" :title-style="titleStyle" @click="handleCellItem(3)"></u-cell-item>
		</u-cell-group>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:'安全中心',
				titleStyle:{
					fontSize:'28rpx',
					color:'#000',
				},
			};
		},
		methods:{
			handleCellItem(type){
				let url = '';
				switch(type){
					case 1:	// 更换手机号
						url = '/pages/mine/sysSetting/safeCenter/editPhone/editPhone';
						break;
					case 2:	// 邮箱地址
						url = '/pages/mine/sysSetting/safeCenter/emailAddress/emailAddress';
						break;
					case 3:	// 注销账号
						url = '/pages/mine/sysSetting/safeCenter/logoutAccount/logoutAccount';
						break;
				}
				this.$u.route({
					url:url,
				})
			}
		}
	}
</script>

<style lang="scss">

</style>
