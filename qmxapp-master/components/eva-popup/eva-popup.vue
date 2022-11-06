<template>
	<!-- 课程评价，意见反馈 弹窗显示 -->
	<u-popup class="eva-popup" v-model="courseShow" z-index="99" mode="center" width="80%" border-radius="10" @close="handleCloseEvaPopup">
		<u-gap height="46"></u-gap>
		<view class="flex col-center row-between p-l-40 p-r-40">
			<u-icon name="close" color="#666666" size="28" style="visibility: hidden;"></u-icon>
			<view class="font-30">{{isType == 'eva' ? '课程评价' : '意见反馈'}}</view>
			<u-icon name="close" color="#666666" size="28" @tap="handleCloseEvaPopup()"></u-icon>
		</view>
		<u-gap height="36"></u-gap>
		<view class="flex m-l-44 m-r-44" v-if="isType == 'eva'">
			<view class="m-r-22">课程星级</view>
			<u-rate :count="5" v-model="rateVal" active-icon="star-fill" inactive-icon="star-fill" active-color="#F6D350" inactive-color="#999999"></u-rate>
		</view>
		<view class="m-l-44 m-r-44 m-t-30 m-b-26">
			<u-input 
				type="textarea" 
				v-model="rateContent" 
				:placeholder="isType == 'eva' ? '请填写下您精彩的评论...' : '请填写下您精彩的反馈...'"
				border
				border-color="#CCCCCC"
				height="170"
				:clearable="false"
				placeholder-style="color:#999999;font-size:26rpx;"
				></u-input>
		</view>
		<view class="m-l-44 m-r-44">
			<u-upload 
				ref="uUpload"
				:action="action" 
				:header="header"
				:auto-upload="true"
				width="140"
				height="140"
				max-count="9"
				:show-progress="false"
				:custom-btn="true"
				@on-success="handleUploadSuccess"
				@on-remove="handleRemoveImg"
			>
				<u-image class="m-10" width="140" height="140" max-count="9" slot="addBtn" src="/static/mine/upload-icon.png" mode="aspectFit"></u-image>
			</u-upload>
		</view>
		<view class="dyan-btn m-t-36">
			<view class="btn-1">
				<u-button 
					:custom-style="customBtnStyle1" 
					shape="circle" 
					:hair-line="false" 
					@click="handleConfirmEva()">
					{{isType == 'eva' ? '立即评价' : '提交'}}
				</u-button>
			</view>
		</view>
	</u-popup>
</template>

<script>
	import config from '@/utils/config.js';
	export default {
		name:"eva-popup",
		props:{
			isType:{
				type:String,
				default:'',
			}
		},
		data() {
			return {
				courseShow:false, //课程评价弹窗
				rateVal:0, //星级评价
				rateContent:'',	//评价内容
				placeholderText:'',  //输入框占位符内容
				action: config.httpUrl + 'api/common/upload1',  //图片上传路径
				header:{
					token:uni.getStorageSync('token'),
				},
				fileList: [],
				customBtnStyle1:getApp().globalData.customStyle1,
				popupInfo:{}, //订单评价提交参数，和输入的内容合并使用
			};
		},
		methods:{
			// 显示评价弹窗
			handleShowEvaPopup(show,item){
				this.courseShow = show;
				if(item){
					this.popupInfo = item;
          console.log(item)
				}
			},
			// 监听图片上传成功
			handleUploadSuccess(data, index, lists, name){
				this.fileList.push(data.data.url);
			},
			// 监听移除图片
			handleRemoveImg(index, lists, name){
				this.fileList.splice(index,1);
			},
			// 关闭评价弹窗
			handleCloseEvaPopup(show){
				this.courseShow = false;
				this.rateVal = 0;
				this.rateContent = '';
				this.fileList = [];
			},
			// 点击评价
			handleConfirmEva(){
				// 订单评价
				if(this.isType == 'eva'){
					if(this.rateVal == 0){
						this.$u.toast(`请点击评价分数`);
						return
					}
          if(this.rateContent == 0){
          	this.$u.toast(`请输入内容`);
          	return
          }
          this.handleCommentOrder();
				}else{
					// 意见反馈
					if(this.rateContent == ''){
						this.$u.toast(`请输入内容`);
						return
					}
					this.handleFeedBack(this.rateContent);
				}
				this.courseShow = false;
			},
			// 意见反馈事件
			async handleFeedBack(content){
				let data = {
					content:content,
					images:this.fileList.join(','),
				};
				const res = await this.$api.feedbackStore(data);
				if(res.code == 1){
					this.$u.toast(res.msg);
          this.rateContent = '';
          this.fileList = [];
				}
			},
      // 点击评论订单
      async handleCommentOrder(){
        let data = {
          classes_order_id:this.popupInfo.id,  //订单id
          comment_type:this.popupInfo.order_class,  // 1==课程订单 ，2==课程拼团订单
          score:this.rateVal,  //评分
          content:this.rateContent,  //评价内容
          images:this.fileList.join(','),
        };
        const res = await this.$api.classes_order_classesOrderCommentStore(data);
        if(res.code == 1){
          this.$u.toast(res.msg);
          this.rateVal = 0;
          this.rateContent = '';
          this.fileList = [];
          this.$emit('onRefresh',true);  //操作成功通知列表刷新
        }
      },
		}
	}
</script>

<style lang="scss" scoped>
	.eva-popup{
		.u-upload{
			// & /deep/>.u-list-item:first-child{
			// 	margin-left: 0 !important;
			// }
		}
		.dyan-btn{
			padding: 0 43rpx;
		}
	}
</style>