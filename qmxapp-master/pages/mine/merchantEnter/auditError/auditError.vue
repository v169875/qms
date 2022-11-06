<template>
	<!-- 审核失败 -->
	<view>
		<top-navbar :title="title" :isShowBorder="true"></top-navbar>
		<u-gap height="63"></u-gap>
		<u-image style="margin: 0 auto;" width="116rpx" height="116rpx" src="/static/mine/audit-error-icon.png" mode="aspectFit"></u-image>
		<u-gap height="41"></u-gap>
		<view class="font-30 text-center text-bold">审核不通过</view>
		<u-gap height="30"></u-gap>
		<view class="font-28 text-center m-b-40">请重新填写或上传所需资料</view>
		<u-gap height="20" bg-color="#F5F5F5"></u-gap>
		<u-cell-group :border="false">
			<u-cell-item title="店铺/机构名称：" :value="mineStoreDetail.school_name || '未填写'" :arrow="false"></u-cell-item>
			<u-cell-item title="企业名称：" :value="mineStoreDetail.company_name || '未填写'" :arrow="false"></u-cell-item>
      <u-cell-item title="企业简介：" :value="mineStoreDetail.school_desc || '未填写'" :arrow="false"></u-cell-item>
      <u-cell-item title="统一社会信用号码：" :value="mineStoreDetail.business_license_number || '未填写'" :arrow="false"></u-cell-item>
			<u-cell-item title="行业类别：" v-if="mineStoreDetail.category" :value="mineStoreDetail.category.name + ':' + mineStoreDetail.son_category.join(',') || '未填写'" :arrow="false"></u-cell-item>
			<u-cell-item title="联系人：" :value="mineStoreDetail.real_name || '未填写'" :arrow="false"></u-cell-item>
			<u-cell-item title="联系电话：" :value="mineStoreDetail.phone || '未填写'" :arrow="false"></u-cell-item>
			<u-cell-item title="企业证件：" :arrow="false" :use-label-slot="true" :border-bottom="false">
				<view class="" slot="label">
					<u-image width="156rpx" height="156rpx" :src="mineStoreDetail.business_license_image_format" mode="aspectFill" @tap="handleCheckImg()"></u-image>
				</view>
			</u-cell-item>
		</u-cell-group>
		<u-gap height="40"></u-gap>
		<view class="dyan-btn">
			<view class="btn-1">
				<u-button :custom-style="customBtnStyle1" shape="circle" :hair-line="false" @click="handleAnewSubmit()">重新提交</u-button>
			</view>
		</view>
		<u-gap height="30"></u-gap>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:'审核失败',
				business_img:'/static/growup/course-img.png',
				customBtnStyle1:getApp().globalData.customStyle1,
				mineStoreDetail:{}, //我的店铺信息
			};
		},
		onLoad() {
			this.getMineStoreInfo();
		},
		methods:{
			// 获取我的店铺信息
			async getMineStoreInfo(){
				const res = await this.$api.getMeSchoolDetail();
				if(res.code == 1){
					this.mineStoreDetail = res.data;
				}
			},
			// 点击查看图片
			handleCheckImg(){
				let imgList = [];
				imgList.push(this.business_img);
				uni.previewImage({
					current:0, //预览图片的下标
					urls: imgList//预览图片的地址，必须要数组形式，如果不是数组形式就转换成数组形式就可以
				})
			},
			// 重新提交
			handleAnewSubmit(){
				this.$u.route({
					url:'/pages/mine/merchantEnter/merchantEnter',
					params:{
						isEdit:true,
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
