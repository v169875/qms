<template>
	<!-- 添加课程 -->
	<view class="create-course-content">
		<top-navbar :title="title" :isShowBorder="true"></top-navbar>
		<view class="create-course-title p-t-34 p-b-34">
			宝贝的课程信息
		</view>
		<view class="create-input-row">
			<u-input v-model="courseForm.name" :clearable="false" placeholder="填写课程名称"></u-input>
		</view>
		<view class="school-type-row flex col-center p-l-34 p-r-34 m-t-34 m-b-34">
			<view class="p-t-20 p-b-20 text-center font-28 main-color radius-8" :class="schoolIdx == index ? 'active-school-item' : ''" v-for="(item,index) in schoolType" :key="index" @tap="handleChangeSchoolType(index)">
				{{item}}
			</view>
		</view>
		<view class="create-input-row flex col-center row-between" @tap="handleSelectTime('day')">
			<!-- <u-input v-model="courseForm.startDay" :clearable="false" placeholder="开始日期"></u-input> -->
			<view class="p-t-14 p-b-14" :class="courseForm.startDay == '' ? 'text-999' : 'text-333'">
				{{courseForm.startDay == '' ? '开始日期' : courseForm.startDay}}
			</view>
			<image class="calendar-img" src="/static/growup/calendar-icon.png" mode="aspectFit"></image>
		</view>
		<view class="school-time-row m-t-34 m-b-10 flex col-center">
			<view class="create-input-row school-time-item flex col-center row-between" @tap="handleSelectTime('time1')">
				<!-- <u-input v-model="courseForm.startTime" :clearable="false" placeholder="上课时间"></u-input> -->
				<view class="p-t-14 p-b-14" :class="courseForm.startTime == '' ? 'text-999' : 'text-333'">
					{{courseForm.startTime == '' ? '上课时间' : courseForm.startTime}}
				</view>
				<view>选择</view>
			</view>
			<view class="create-input-row school-time-item flex col-center row-between" @tap="handleSelectTime('time2')">
				<!-- <u-input v-model="courseForm.endTime" :clearable="false" placeholder="下课时间"></u-input> -->
				<view class="p-t-14 p-b-14" :class="courseForm.endTime == '' ? 'text-999' : 'text-333'">
					{{courseForm.endTime == '' ? '下课时间' : courseForm.endTime}}
				</view>
				<view>选择</view>
			</view>
		</view>
		<view class="create-course-title flex col-center row-between" style="min-height: 70rpx;">
			<view class="">接送提醒</view>
			<u-switch v-model="remindSwitch" size="30" @change="handleChangeRemind"></u-switch>
		</view>
		<view class="create-course-title bottom-form-item flex col-center row-between">
			<view class="">接送人</view>
			<view class="" style="width: 60%;">
				<u-input v-model="courseForm.pickName" :clearable="false" input-align="right" placeholder="设置接送人名称"></u-input>
			</view>
		</view>
		<view class="create-course-title bottom-form-item flex col-center row-between" @tap="handleSelectTime('all')">
			<view class="">提醒时间</view>
			<view class="" style="width: 60%;">
				<view class="p-t-14 p-b-14 text-right" :class="courseForm.remindTime == '' ? 'text-999' : 'text-333'">
					{{courseForm.remindTime == '' ? '设置提醒时间>' : courseForm.remindTime}}
				</view>
				<!-- <u-input v-model="courseForm.remindTime" :clearable="false"disabled input-align="right" placeholder="设置提醒时间>"></u-input> -->
			</view>
		</view>
		<view class="create-course-title p-t-16 p-b-30">
			上课地址（选填）
		</view>
		<view class="create-input-row flex col-center row-between" @tap="handleChooseAddress()">
			<view class="p-t-14 p-b-14" :class="courseForm.address == '' ? 'text-999' : 'text-333'">
				{{courseForm.address == '' ? '选择上课地址' : courseForm.address}}
			</view>
			<image class="location-img" src="/static/growup/location-icon.png" mode="aspectFit"></image>
		</view>
		<view class="create-course-title m-t-20 flex col-center row-between">
			<view class="">上课老师（选填）</view>
			<view class="" style="width: 60%;">
				<u-input v-model="courseForm.teacherName" :clearable="false" input-align="right" placeholder="填写名称"></u-input>
			</view>
		</view>
		<view class="create-course-title m-t-20 flex col-center row-between">
			<view class="">联系方式（选填）</view>
			<view class="" style="width: 60%;">
				<u-input v-model="courseForm.mobile" type="number" maxlength="11" :clearable="false" input-align="right" placeholder="填写联系方式"></u-input>
			</view>
		</view>
		<u-gap height="50"></u-gap>
		<view class="dyan-btn">
			<view class="btn-1">
				<u-button :custom-style="customBtnStyle1" shape="circle" :hair-line="false" @click="handleSubmitCourse()">添加</u-button>
			</view>
		</view>
		<u-gap height="30"></u-gap>
		<u-picker mode="time" v-model="timeShow" :params="timeParams" @confirm="handleConfirmTime"></u-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:'添加课程',
				customBtnStyle1:getApp().globalData.customStyle1,
				schoolType:['单次上课','循环上课'], //上课次数类型
				schoolIdx:0,  //上课次数类型下标
				remindSwitch:false,  //提醒开关
				courseForm:{
					name:'',  //课程名称
					startDay:'', //开始日期
					startTime:'', //上课时间
					endTime:'', //下课时间
					pickName:'', //接送人名称
					remindTime:'', //设置提醒时间
					address:'',  //上课地点
					teacherName:'', //上课老师
					mobile:'', //联系方式
				},
				timeShow:false, //时间选择器显示
				timeParams: {
					year: true,
					month: true,
					day: true,
					hour: false,
					minute: false,
					second: false
				},
				timeType:'day',
			};
		},
		methods:{
			// 点击切换上课次数
			handleChangeSchoolType(index){
				if(this.schoolIdx == index) return;
				this.schoolIdx = index;
			},
			// 点击开启关闭提醒
			handleChangeRemind(val){
				
			},
			// 选择地址
			handleChooseAddress() {
				uni.chooseLocation({
					success: (res) => {
						this.courseForm.address = res.address;
						// console.log('位置名称：',res);
						// console.log('详细地址：' + res.address);
						// console.log('纬度：' + res.latitude);
						// console.log('经度：' + res.longitude);	
					}
				});
			},
			// 点击显示日期，和时间
			handleSelectTime(type){
				this.timeType = type;
				switch(type){
					case 'day':
						this.timeParams = {
							year: true,
							month: true,
							day: true,
							hour: false,
							minute: false,
							second: false
						}
						break;
					case 'time1':
						this.timeParams = {
							year: false,
							month: false,
							day: false,
							hour: true,
							minute: true,
							second: true
						}
						break;
					case 'time2':
						if(this.courseForm.startTime == ''){
							this.$u.toast(`请先选择上课时间`);
							return
						}
						this.timeParams = {
							year: false,
							month: false,
							day: false,
							hour: true,
							minute: true,
							second: true
						}
						break;
					case 'all':
						this.timeParams = {
							year: true,
							month: true,
							day: true,
							hour: true,
							minute: true,
							second: true
						}
						break;
				}
				this.timeShow = !this.timeShow;	
			},
			// 点击确认时间
			handleConfirmTime(params){
				switch(this.timeType){
					case 'day':		//开始日期
						this.courseForm.startDay = params.year + '-' + params.month + '-' + params.day;
						break;
					case 'time1':	//上课时间
						this.courseForm.startTime = params.hour + ':' + params.minute + ':' + params.second;
						break;
					case 'time2':	//下课时间
						let endTime = params.hour + ':' + params.minute + ':' + params.second;
						// 判断下课时间不能早于上课时间
						if(this.countDown(endTime) < this.countDown(this.courseForm.startTime)){
							this.$u.toast(`下课时间不能早于上课时间`);
							return;
						}
						this.courseForm.endTime = endTime;
						break;
					case 'all':		//提醒时间
						this.courseForm.remindTime = params.year + '-' + params.month + '-' + params.day + ' ' + params.hour + ':' + params.minute + ':' + params.second;
						break;
				}

			},
			// 时分秒转换为时间戳，判断两个时间戳
			countDown(time) {
				var s = 0;
				var hour = time.split(':')[0];
				var min = time.split(':')[1];
				var sec = time.split(':')[2];
				s = Number(hour * 3600) + Number(min * 60) + Number(sec);
				return s;
			},
			// 点击确认添加课程
			handleSubmitCourse(){
				let {
					name,
					startDay,
					startTime,
					endTime,
					pickName,
					remindTime,
					teacherName,
					mobile,
				} = this.courseForm;
				let formData = Object.assign({},this.courseForm);
				if(name == ''){
					this.$u.toast(`请填写课程名称`);
					return
				}
				if(startDay == ''){
					this.$u.toast(`请选择开始日期`);
					return
				}
				if(startTime == ''){
					this.$u.toast(`请选择上课时间`);
					return
				}
				if(endTime == ''){
					this.$u.toast(`请选择下课时间`);
					return
				}
				if(pickName == ''){
					this.$u.toast(`请设置接送人名称`);
					return
				}
				if(remindTime == ''){
					this.$u.toast(`请设置提醒时间`);
					return
				}
				if(mobile != ''){
					if(!this.$u.test.mobile(mobile)){
						this.$u.toast(`手机号格式错误`);
						return
					}
				}
				this.confirmCreateCourse(formData);
			},
			// 确认添加课程
			async confirmCreateCourse(form){
				let data = {
					class_name:form.name,
					class_type:this.schoolIdx == 0 ? 1 : 2,
					start_time:form.startDay,
					start_hour:form.startTime,
					end_hour:form.endTime,
					is_remind:this.remindSwitch ? 1 : 0,
					driver_real_name:form.pickName,
					remind_time:form.remindTime,
					class_address:form.address,
					class_teacher:form.teacherName,
					class_teacher_phone:form.mobile
				}
				const res = await this.$api.classStore(data);
				if(res.code == 1){
					this.$u.toast(res.msg);
					setTimeout(()=>{
						this.$u.route({
							type:'back',
						})
					},300)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.create-course-content{
		/deep/ .input-placeholder{
			color: #999 !important;
		}
		.create-course-title{
			font-size: 28rpx;
			color: #333;
			padding: 0rpx 34rpx 0rpx 34rpx;
		}
		.bottom-form-item{
			// padding-top: 16rpx;
			// padding-bottom: 16rpx;
		}
		.create-input-row{
			margin: 0 34rpx;
			padding:0 30rpx;
			border-radius: 8rpx;
			background: #F8F8F8;
			.calendar-img{
				width: 36rpx;
				height: 36rpx;
			}
			.location-img{
				width: 50rpx;
				height: 50rpx;
			}
		}
		.school-type-row{
			>view{
				width: calc(100% / 2 - 15rpx);
				border: 1px solid #3077FB;
			}
			& >view:last-child{
				margin-left: 30rpx;
			}
			.active-school-item{
				background: #3077FB !important;
				color: $uni-text-color-inverse !important;
			}
		}
		.school-time-row{
			margin: 0 34rpx;
			.school-time-item{
				// padding: 0 !important;
				margin: 0 !important;
			}
			>view{
				width: calc(100% / 2 - 15rpx);
			}
			& >view:last-child{
				margin-left: 30rpx !important;
			}
		}
	}
</style>
