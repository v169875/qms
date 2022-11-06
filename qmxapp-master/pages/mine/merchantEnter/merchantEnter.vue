<template>
	<!-- 商家入驻 -->
	<view class="merchant-enter-content">
		<top-navbar :title="title" :isShowBorder="true"></top-navbar>
		<view class="p-l-34">
			<u-form :model="enterForm" ref="uForm" label-position="top">
				<u-form-item label="店铺/机构名称：" prop="school_name">
					<u-input v-model="enterForm.school_name" :clearable="false" placeholder="请输入店铺/机构名称"/>
				</u-form-item>
        <u-form-item label="企业名称：" prop="company_name">
        	<u-input v-model="enterForm.company_name" :clearable="false" placeholder="请输入企业名称"/>
        </u-form-item>
        <u-form-item label="商家介绍：" prop="school_introduce">
			<u-input v-model="enterForm.school_introduce" :clearable="false" maxlength="3000" placeholder="请输入商家介绍"/>
		</u-form-item>
        <u-form-item label="商家简介：(仅限50字)" prop="school_desc">
        	<u-input v-model="enterForm.school_desc" :clearable="false" maxlength="3000" placeholder="请输入商家简介"/>
        </u-form-item>
				<u-form-item label="企业营业执照统一社会信用号码：" prop="business_license_number">
					<u-input v-model="enterForm.business_license_number" :clearable="false" placeholder="请输入企业营业执照统一社会信用号码"/>
				</u-form-item>
				<u-form-item label="行业类别：" prop="classType">
					<u-input v-model="enterForm.classType" :clearable="false" disabled placeholder="请选择行业类别" @tap="handleShowSelectClass()"/>
				</u-form-item>
				<u-form-item label="联系人姓名：" prop="real_name">
					<u-input v-model="enterForm.real_name" :clearable="false" placeholder="请输入联系人姓名"/>
				</u-form-item>
				<u-form-item label="联系电话：" prop="phone">
					<u-input v-model="enterForm.phone" type="number" maxlength="11" :clearable="false" placeholder="请输入联系电话"/>
				</u-form-item>
				<u-form-item label="选择位置：" prop="city">
					<u-input v-model="enterForm.city" :clearable="false" disabled placeholder="请选择您的所在位置" @tap="handleChooseAddress()"/>
				</u-form-item>
				<u-form-item label="具体位置：" prop="address_detail">
					<u-input v-model="enterForm.address_detail" :clearable="false" placeholder="请补充你所在的具体位置"/>
				</u-form-item>
				<u-form-item label="请上传营业执照：" prop="business_license_image">
					<view class="img-box">
						<view class="img-itme flex" @click="handleFileUpload('business_license_image')">
							<view class="img-initial" style="width: 180rpx;" v-if="enterForm.business_license_image == ''">
								<u-icon name="plus" size="40"></u-icon>
								<!-- <view class="m-t-10"></view> -->
							</view>
							<image style="width: 180rpx;height: 180rpx;" class="photo" v-else :src="$config.isImg(enterForm.business_license_image)" mode="aspectFill">
							</image>
						</view>
					</view>
				</u-form-item>
				<u-form-item label="请上传身份证照：" prop="legal_bcard">
					<view class="img-box text-center text-999 u-flex-1 p-r-32">
						<view class="img-itme" @click="handleFileUpload('legal_zcard')">
							<view class="" v-if="enterForm.legal_zcard == ''">
								<view class="img-initial" style="height:180rpx;background:url('/static/mine/idcard-bg1.png') no-repeat center center / cover;"></view>
								<text>上传身份证正面</text>
							</view>
							<image class="photo" style="height: 250rpx;" v-else :src="$config.isImg(enterForm.legal_zcard)" mode="aspectFill"></image>
						</view>
						<view class="img-itme" @click="handleFileUpload('legal_bcard')">
							<view class="" v-if="enterForm.legal_bcard == ''">
								<view class="img-initial" style="height:180rpx;background: url('/static/mine/idcard-bg2.png') no-repeat center center / cover;"></view>
								<text>上传身份证反面</text>
							</view>
							<image class="photo" style="height: 250rpx;" v-else :src="$config.isImg(enterForm.legal_bcard)" mode="aspectFill"></image>
						</view>
					</view>
				</u-form-item>
				<u-form-item label="请上传门头照：(建议尺寸400*400)" prop="school_cover_image" :border-bottom="false">
					<view class="img-box">
						<view class="img-itme flex" @click="handleFileUpload('school_cover_image')">
							<view class="img-initial" style="width: 180rpx;" v-if="enterForm.school_cover_image == ''">
								<u-icon name="plus" size="40"></u-icon>
								<!-- <view class="m-t-10"></view> -->
							</view>
							<image style="width: 180rpx;height: 180rpx;" class="photo" v-else :src="$config.isImg(enterForm.school_cover_image)" mode="aspectFill">
							</image>
						</view>
					</view>
				</u-form-item>
			</u-form>
		</view>
		<view class="agre-row flex col-center row-center m-t-70 m-b-24">
			<image v-if="agreChoose" src="/static/mine/radio-active.png" mode="aspectFit" @tap="agreChoose = !agreChoose"></image>
			<view class="not-agre-radio" v-else @tap="agreChoose = !agreChoose"></view>
			<text class="m-l-12 text-999 font-24" @tap="handleAgre(7)">勾选同意商户协议《协议详情》</text>
		</view>
		<view class="dyan-btn">
			<view class="btn-1">
				<u-button :custom-style="customBtnStyle1" shape="circle" :hair-line="false" @click="handleSubmitForm()">立即提交</u-button>
			</view>
		</view>
		<u-gap height="68"></u-gap>
		<!-- 选择行业分类  			mode="mutil-column-auto" -->
		<u-select 
			v-model="classSelectShow" 
			:list="classSelectList"
			value-name="id"
			label-name="name"
			@confirm="handleConfirmClass"
		></u-select>
    <!-- 选择行业子分类 -->
    <u-popup class="son-select-popup" v-model="classSonShow" mode="center" width="70%" border-radius="20" @close="handleCloseSonSelect">
      <u-gap height="30"></u-gap>
      <view class="text-center text-bold">选择分类</view>
      <u-gap height="30"></u-gap>
      <scroll-view class="flex col-center row-center son-select-body" style="max-height:400px;">
        <u-checkbox-group @change="checkboxGroupChange">
          <u-checkbox 
            @change="checkboxChange" 
            v-model="item.checked" 
            v-for="(item, index) in sonCheckList" :key="index" 
            :name="item.name"
          >{{item.name}}</u-checkbox>
        </u-checkbox-group>
      </scroll-view>
      <u-gap height="100"></u-gap>
      <view class="dyan-btn">
      	<view class="btn-1">
      		<u-button :custom-style="customBtnStyle1" shape="circle" :hair-line="false" @click="handleSelectSon()">确认</u-button>
      	</view>
      </view>
    </u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
        sonCheckList: [],
        classSonShow:false,
        
				title:'商家入驻',
				customBtnStyle1:getApp().globalData.customStyle1,
				classSelectShow:false, //分类选择
				classSelectList: [],  //行业类别列表
				agreChoose:false, //是否选中协议
				isEdit:false,  //是否重新提交
				school_id:null,  //编辑用的id
				mineStoreDetail:{}, //我的店铺信息
				enterForm: {
					school_name: '', //店铺名称
          company_name:'', //企业名称  新增
		  school_introduce:'',//商家介绍   新增
          school_desc:'', //机构简介  新增
          son_category_ids:[], //  子分类id  新增
					business_license_number: '',	//统一信用代码
					classType:'',	//行业类别名称
					category_id:'',  //行业类别值
					real_name:'', //联系人姓名
					phone:'', //联系电话
					city:'', //所在地
					lng:'', //经度
					lat:'', //纬度
					address_detail:'', //具体位置
					business_license_image:'', //营业执照
					legal_zcard:'', //身份证人面像
					legal_bcard:'', //身份证国徽面
					school_cover_image:'', //门头照
				},
				formRules: {
					school_name: [
						{ 
							required: true, 
							message: '请输入店铺/机构名称', 
							// 可以单个或者同时写两个触发验证方式 
							trigger: ['change','blur'],
						}
					],
          company_name: [
          	{ 
          		required: true, 
          		message: '请输入企业名称', 
          		// 可以单个或者同时写两个触发验证方式 
          		trigger: ['change','blur'],
          	}
          ],
		  school_introduce: [
		  	{ 
		  		required: true, 
		  		message: '请输入商家介绍', 
		  		// 可以单个或者同时写两个触发验证方式 
		  		trigger: ['change','blur'],
		  	}
		  ],
          school_desc: [
          	{ 
          		required: true, 
          		message: '请输入企业简介', 
          		// 可以单个或者同时写两个触发验证方式 
          		trigger: ['change','blur'],
          	}
          ],
					business_license_number: [
						{
							required: true,
							message: '请输入企业营业执照统一社会信用号码', 
							trigger: ['change','blur'],
						}
					],
					classType: [
						{
							required: true,
							message: '请选择行业类别', 
							trigger: ['change','blur'],
						}
					],
					real_name: [
						{
							required: true,
							message: '请输入联系人姓名', 
							trigger: ['change','blur'],
						}
					],
					// 字段名称
					phone: [
						{
							required: true, 
							message: '请输入联系电话',
							trigger: ['change','blur'],
						},
						{
							// 自定义验证函数，见上说明
							validator: (rule, value, callback) => {
								// 上面有说，返回true表示校验通过，返回false表示不通过
								// this.$u.test.mobile()就是返回true或者false的
								return this.$u.test.mobile(value);
							},
							message: '电话号码不正确',
							// 触发器可以同时用blur和change
							trigger: ['change','blur'],
						}
					],
					city: [
						{
							required: true,
							message: '请选择您的所在位置', 
							trigger: ['change','blur'],
						}
					],
					address_detail: [
						{
							required: true,
							message: '请补充你所在的具体位置', 
							trigger: ['change','blur'],
						}
					],
					business_license_image: [
						{
							required: true,
							message: '请上传营业执照', 
							trigger: ['change','blur'],
						}
					],
					legal_bcard: [
						{
							required: true,
							message: '请上传身份证正反面',
							trigger: ['change','blur'],
						}
					],
					school_cover_image: [
						{
							required: true,
							message: '请上传门头照', 
							trigger: ['change','blur'],
						}
					]
				}
			};
		},
		onLoad(options) {
			this.getCateClassList();
			if(options.isEdit){
				this.isEdit = options.isEdit == 'true';
				this.getMineStoreInfo();
			}
		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.$refs.uForm.setRules(this.formRules);
		},
		methods:{
      // 选中某个复选框时，由checkbox时触发
      checkboxChange(e) {
        // console.log('选中某个复选框时',e);
      },
      // 点击显示选择父分类
      handleShowSelectClass(){
        this.classSelectShow = !this.classSelectShow;
        this.enterForm.son_category_ids = [];
      },
      // 选中任一checkbox时，由checkbox-group触发
      checkboxGroupChange(e) {
        // console.log('checkbox',e);
      },
      // 监测关闭选择子分类弹窗
      handleCloseSonSelect(){
        if(this.enterForm.son_category_ids.length <= 0){
          this.enterForm.classType = '';
        }
      },
      // 全选
      handleSelectSon() {
        this.sonCheckList.map(val => {
          if(val.checked){
            this.enterForm.classType = this.enterForm.classType + val.name + ',';
            this.enterForm.son_category_ids.push(val.id);
          }
        })
        this.classSonShow = false;
      },
			// 获取行业分类
			async getCateClassList(){
				let data = {
					type:'school',
				};
				const res = await this.$api.getCategoryList(data);
				if(res.code == 1){
					this.classSelectList = res.data;
          // this.classSelectList.map((item)=>{
          //   this.$set(item,'children',item.childlist);
          // })
				}
			},
			// 获取我的店铺信息
			async getMineStoreInfo(){
				const res = await this.$api.getMeSchoolDetail();
				if(res.code == 1){
					let mineStoreDetail = res.data;
					let idCardImg = mineStoreDetail.id_card_images.split(',');
					this.school_id = mineStoreDetail.id;  //单独保存店铺id
					this.enterForm = {
						school_name:mineStoreDetail.school_name, //店铺名称
						company_name:mineStoreDetail.company_name, //企业名称
						 school_introduce:mineStoreDetail.school_introduce, //商家介绍
            school_desc:mineStoreDetail.school_desc, //企业简介
            son_category_ids:mineStoreDetail.son_category_ids.split(','),
						business_license_number:mineStoreDetail.business_license_number,	//统一信用代码
						classType:mineStoreDetail.category.name + ':' + mineStoreDetail.son_category.join(','),
						category_id:mineStoreDetail.category_id,  //行业类别值
						real_name:mineStoreDetail.real_name, //联系人姓名
						phone:mineStoreDetail.phone, //联系电话
						city:mineStoreDetail.city, //所在地
						lng:mineStoreDetail.lng, //经度
						lat:mineStoreDetail.lat, //纬度
						address_detail:mineStoreDetail.address_detail, //具体位置
						business_license_image:mineStoreDetail.business_license_image, //营业执照
						legal_zcard:idCardImg[0], //身份证人面像
						legal_bcard:idCardImg[1], //身份证国徽面
						school_cover_image:mineStoreDetail.school_cover_image, //门头照
					}
				}
			},
			// 点击提交
			handleSubmitForm() {
				let {legal_zcard,legal_bcard} = this.enterForm;
				let formData = Object.assign({},this.enterForm);
				this.$refs.uForm.validate(valid => {
					if (valid) {
						if(legal_zcard == ''){
							this.$u.toast(`上传身份证正面`);
							return
						}
						if(legal_bcard == ''){
							this.$u.toast(`上传身份证反面`);
							return
						}
						if(!this.agreChoose){
							this.$u.toast(`请勾选商户协议`);
							return
						}
						this.handleAuthStore(formData);
						console.log('验证通过',formData);
					} else {
						console.log('验证失败');
					}
				});
			},
			// 提交审核
			async handleAuthStore(form){
				let data = {
					school_name:form.school_name,
					company_name:form.company_name,
					school_introduce:form.school_introduce,
          school_desc:form.school_desc,
          son_category_ids:form.son_category_ids.join(','),
					business_license_number:form.business_license_number,
					category_id:form.category_id,
					real_name:form.real_name,
					phone:form.phone,
					city:form.city,
					address_detail:form.address_detail,
					business_license_image:form.business_license_image,
					id_card_images:form.legal_zcard + ',' + form.legal_bcard,
					school_cover_image:form.school_cover_image,
					lng:form.lng,
					lat:form.lat,
				};
				let res = {};
				// isEdit == false,代表首次提交
				if(!this.isEdit){
          
					res = await this.$api.schoolStore(data);
				}else{ //否则就是被驳回重新提交
					data.school_id = this.school_id;
					res = await this.$api.rejectSchoolEditStore(data);
				}
				if(res.code == 1){
					this.$u.toast(res.msg);
					this.handleBack();
				}
			},
			// 点击选择分类
			handleConfirmClass(arr){
				this.enterForm.classType = arr[0].label + ':';
				this.enterForm.category_id = arr[0].value;
        this.classSelectList.filter((item)=>{
          if(item.id == arr[0].value){
            this.sonCheckList = item.childlist;
          }
        })
        this.sonCheckList.map((item)=>{
          this.$set(item,'checked',false);
        })
        this.classSonShow = true;
			},
			// 选择地址
			handleChooseAddress() {
				uni.chooseLocation({
					success: (res) => {
						var reg = /.+?(省|市|自治区|自治州|县|区)/g;
						var addressList = res.address.match(reg).toString().split(",");
						var addressSlice = [];
						// 只保留省市区
						if(addressList.length > 3){
							console.log('切割前',addressList)
							addressSlice = addressList.slice(0,3)
						}else{
							addressSlice = addressList;
						}
						console.log('切割后',addressSlice)
						this.enterForm.city = addressSlice.join('/');
						this.enterForm.lng = res.longitude;
						this.enterForm.lat = res.latitude;
						// console.log('全部信息',addressList)
						// console.log('位置名称：' + res.city);
						// console.log('详细地址：' + res.address);
						// console.log('纬度：' + res.latitude);
						// console.log('经度：' + res.longitude);	
					}
				});
			},
			// 点击上传
			handleFileUpload(type) {
				uni.chooseImage({
					count: 1,
					sourceType: ['album'], //从相册选择
					success:(res)=>{
						let paths = res.tempFilePaths
						paths.forEach(path => {
							this.setImgUpload(type,path)
						})
					}
				});
			},
			// 上传图片
			async setImgUpload(type,path){
				let data = {
					file:path,
					name:'file',
				}
				const res = await this.$api.fileUpload(data);
				if(res.code == 1){
					this.enterForm[type] = res.data.url;
					console.log('上传成功',this.enterForm[type]);
				}
			},
			// 关闭审核弹窗并返回我的页面
			handleBack(){
				this.$u.route({
					type:'tab',
					url:'/pages/mine/index',
				})
			},
      handleAgre(type){
        this.$u.route({
          url:'/pages/login/agreement',
          params:{
            agreType:type,
          }
        })
      }
		}
	}
</script>

<style lang="scss" scoped>
	.merchant-enter-content{
		.img-box {
			display: flex;
			justify-content: space-between;
		
			.img-itme {
				flex: 1;
				// height: 170rpx;
				border-radius: 20rpx;
				margin-right: 57rpx;
				position: relative;
		
				.img-initial {
					display: flex;
					height: 170rpx;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					font-size: 23rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #666666;
					background: #F8F8F8;
					border: 1px solid #DCDCDC;
					border-radius: 20rpx;
				}
		
				.photo {
					width: 100%;
					height: 100%;
					border-radius: 20rpx;
				}
		
				.download {
					width: 148rpx;
					height: 47rpx;
					border: 1px solid #4DA5FF;
					border-radius: 24rpx;
					font-size: 24rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #4DA5FF;
					text-align: center;
					line-height: 47rpx;
					position: absolute;
					bottom: 0rpx;
					left: 230rpx;
				}
			}
		
			.img-itme:nth-child(2) {
				margin-right: 0rpx;
			}
		}
		.agre-row{
			>image{
				width: 29rpx;
				height: 29rpx;
			}
			.not-agre-radio{
				width: 29rpx;
				height: 29rpx;
				border: 1px solid #999999;
				border-radius: 50%;
			}
		}
    .son-select-popup{
      .son-select-body{
        /deep/ .uni-scroll-view-content{
          width: auto;
          padding: 20rpx;
        }
      }
    }
	}
</style>
