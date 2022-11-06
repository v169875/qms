<template>
	<!-- 我的视频 ==视频主页 -->
	<view class="mine-video-content">
		<top-navbar 
      :title="title" 
      :isMineBlock="isAuthor" 
      :isBlackUser="true" 
      :is_black="mineVideoInfo.is_black"
      @onIsBlock="handleBlockUser"
    ></top-navbar>
		<!-- 顶部背景图 -->
		<view class="mine-video-top-bg" :style="{'background':`url(${mineVideoInfo.background_image_format == '' ? mineVideoInfo.avatar_format : mineVideoInfo.background_image_format}) no-repeat center center / cover`}"></view>
		<!-- 用户信息 -->
		<view class="p-l-38 p-r-32 usre-top-info">
			<view class=""></view>
			<view class="flex col-center user-avatar-row">
				<view class="user-avatar">
					<u-avatar size="130" :src="mineVideoInfo.avatar_format"></u-avatar>
				</view>
				<view class="flex col-center row-center m-t-20 text-center user-right u-flex-1">
					<view class="right-item">
						<view>获赞</view>
						<view>{{mineVideoInfo.total_like || 0}}</view>
					</view>
					<view class="center-line"></view>
					<view class="right-item" @tap="handleGoPage('attention')">
						<view>关注</view>
						<view>{{mineVideoInfo.total_follow || 0}}</view>
					</view>
					<view class="center-line"></view>
					<view class="right-item" @tap="handleGoPage('fens')">
						<view>粉丝</view>
						<view>{{mineVideoInfo.total_fans || 0}}</view>
					</view>
				</view>
			</view>
			<view class="text-666" @tap="handleEditShow('backgroundImg')" v-if="isAuthor">修改背景</view>
			<view class="m-t-22 m-b-26 flex col-center row-between">
        <view class=" font-36 text-black text-bold">{{mineVideoInfo.nickname || '暂无'}}</view>
		
        <view class="font-26 text-333 go-store-btn" v-if="mineVideoInfo.is_school == 1" @tap="handleGoSchoolDetail()">进入商家</view>
      </view>
			<view class="font-28 flex col-center row-between m-b-28">
				<view class="text-333 flex col-center u-flex-1">
					<u-icon name="map-fill" color="#999999" size="36"></u-icon>
					<view class="hidden_one m-l-14" style="width: 85%;">{{mineVideoInfo.address || '暂无'}}</view>
				</view>
				<view class="text-666" @tap="handleEditShow('address')" v-if="isAuthor">修改</view>
			</view>
			<view class="font-28 flex col-center row-between m-b-32">
				<view class="text-333 flex col-center u-flex-1">
					<view class="hidden_two m-l-14" style="width: 90%;">个性签名：{{mineVideoInfo.sign || '暂无'}}</view>
				</view>
				<view class="text-666" @tap="handleEditShow('sign')" v-if="isAuthor">修改</view>
			</view>
		</view>
		<u-gap height="20" bg-color="#F5F5F5"></u-gap>
		<view class="works-title flex col-center p-l-38 p-r-32 m-t-28 m-b-28">
			<view class="font-30 text-333 text-bold">他的作品（{{mineVideoList.length}}）</view>
			<view class="font-30 text-333 m-l-44 m-r-32" @tap="handleGoPage('collect')" v-if="isAuthor">收藏视频</view>
			<view class="font-30 text-666" @tap="handleGoPage('footprint')" v-if="isAuthor">足迹</view>
		</view>
		<!-- 课程推荐 卡片 -->
		<view class="course-list">
			<block v-for="(item,index) in mineVideoList" :key="index">
				<course-card 
					:courseItem="item" 
					:rowNum="3" 
					:isShowPriceRow="false" 
					:isShowLookNum="true"
					:isShowPlayIcon="true"
					:isShowDelIcon="isAuthor"
          :videoIndex="index"
          :dataList="mineVideoList"
          :listQuery="listQuery"
          :isCourseCard="false"
          isCardType='isVideo'
          @onVideoDel="handleVideoDel"
					>
				</course-card>
			</block>
		</view>
    <!-- 修改地址和个性签名模态框 -->
    <u-modal v-model="editModalShow" :title="modalTitle" :show-cancel-button="true" @cancel="handleCancelEditModal" @confirm="handleConfirmEdit">
      <view class="modal-content m-t-20 m-b-30">
        <u-input type="textarea" v-model="editText" border :clearable="false" :auto-height="true" :placeholder="placeholderText"></u-input>
      </view>
    </u-modal>
    <!-- 删除视频模态框 -->
    <u-modal v-model="delVideoShow" content="是否删除该视频?" show-cancel-button @cancel="delItem = {}" @confirm="handleConfirmDel"></u-modal>
	</view>
</template>

<script>
  let app = getApp();
	// 课程卡片
	import courseCard from '@/components/course-card/course-card.vue'
	export default {
		components:{
			courseCard
		},
		data() {
			return {
				title:'视频主页',
				topBg:'/static/growup/active-center-item.png',
				userInfo:{},
        mineVideoInfo:{},
				mineVideoList:[],
        editModalShow:false,  //显示编辑模态框
        modalTitle:'',  //模态框标题
        placeholderText:'', //输入框占位符
        editText:'', //模态框输入内容
        editType:'',  //修改类型
        listQuery:{
          page:1,
          limit:20,
          user_id:'',  //主页用户id
        },
        isLoad:false,
        tabIndex:0,
        isAuthor:true,  //是否作者，默认作者其他人进入查看作者主页为false
        delItem:{},
        delVideoShow:false,
			};
		},
		onLoad(options) {
      if(options.user_id){
        this.listQuery.user_id = options.user_id * 1;
      };
      if(options.isAuthor){
        this.isAuthor = options.isAuthor == 'true';
        this.title = '作者主页';
      }
      this.getMineVideoList();
		},
    onShow() {
      this.getUserInfo();
    },
    onReachBottom() {
      this.getMineVideoList();
    },
		methods:{
      getUserInfo(){
        app.getUserInfo();
        uni.$off('userInfo');
        uni.$on('userInfo',info=>{
          this.userInfo = info;
          this.getMineVideoInfo();
        })
      },
      // 获取我的视频主页信息
      async getMineVideoInfo(){
        const res = await this.$api.videoUserInfo({user_id:this.listQuery.user_id});
        if(res.code == 1){
          this.mineVideoInfo = res.data;
        }
      },
      // 获取我的视频列表
      async getMineVideoList(){
        if(this.isLoad) return;
        this.isLoad = true;
        const res = await this.$api.myVideoList(this.listQuery);
        if(res.code == 1){
          if(res.data.data.length > 0){
            let videoList = res.data.data;
            videoList.map((item,index)=>{
              this.$set(item,'isplay',true); //是否播放音频
              this.$set(item,'isShowProgressBarTime',false); //是否显示进度条（默认这个即可）
              this.$set(item,'state','pause'); //初始状态标志（不改）
              this.$set(item,'isShowimage',false); //是否显示封面（默认这个即可）
              this.$set(item,'playIng',false); //播放（默认这个即可）
            })
            this.mineVideoList = this.mineVideoList.concat(res.data.data);
            this.listQuery.page++;
            this.isLoad = false;
          }else{
            this.isLoad = false;
          }
        }
      },
			// 根据字段跳转到相应页面
			handleGoPage(str){
        if(!this.isAuthor) return;  //不是作者本人不让跳转
				let url = '';
				switch(str){
					case 'attention':	//我的关注
						url = '/pages/mine/mineVideo/mineAttention/mineAttention';
						break;
          case 'fens':	//我的粉丝
          	url = '/pages/mine/mineVideo/mineFens/mineFens';
          	break;
          case 'collect':	//我的收藏
          	url = '/pages/mine/mineVideo/mineCollectVideo/mineCollectVideo';
            break;
					case 'footprint':	//我的足迹
						url = '/pages/mine/mineVideo/mineFootprint/mineFootprint';
            break;
				}
				this.$u.route({
					url:url,
				})
			},
      // 上传图片
      async setImgUpload(path){
      	let data = {
      		file:path,
      		name:'file',
      	}
      	const res = await this.$api.fileUpload(data);
      	if(res.code == 1){
          this.handleEditBackgroundImg(res.data.url);
      	}
      },
      // 修改背景图片
      async handleEditBackgroundImg(url){
        const res = await this.$api.profile({background_image:url});
        if(res.code == 1){
          this.getUserInfo();
        }
      },
      // 点击显示修改模态框
      handleEditShow(type){
        this.editType = type;
        switch(type){
          case 'backgroundImg': //修改背景
            uni.chooseImage({
              count:1,
              sizeType:['original','compressed'],
              sourceType:['album','camera'],
              success:(res)=>{
                this.setImgUpload(res.tempFilePaths[0])
              }
            })
            return;
            break;
          case 'address':  //修改地址
            this.modalTitle = '修改地址';
            this.placeholderText = '请输入地址信息';
            this.editText = this.mineVideoInfo.address;
            break;
          case 'sign':  //修改签名
            this.modalTitle = '修改签名';
            this.placeholderText = '请输入签名信息';
            this.editText = this.mineVideoInfo.sign;
            break;
        }
        this.editModalShow = !this.editModalShow;
      },
      // 模态框确认修改按钮
      async handleConfirmEdit(){
        let res = {};
        let data = {};
        switch(this.editType){
          case 'address': //修改地址
            data = {
              address:this.editText,
            };
            break;
          case 'sign':  //修改签名
            data = {
              sign:this.editText,
            };
            break;
        }
        res = await this.$api.profile(data);
        if(res.code == 1){
          this.$u.toast(res.msg);
          this.modalTitle = '';
          this.placeholderText = '';
          this.editText = '';
          this.getUserInfo();
        }
      },
      // 模态框取消按钮
      handleCancelEditModal(){
        this.modalTitle = '';
        this.placeholderText = '';
        this.editText = '';
      },
      // 点击进入机构详情
      handleGoSchoolDetail(){
        let params = {
        	school_id:this.mineVideoInfo.school_id,
        };
        this.$u.route({
        	url:'/pages/index/organizationDetail/organizationDetail',
        	params:params
        })
      },
      // 点击拉黑用户
      async handleBlockUser(){
        if(this.mineVideoInfo.is_black){
          this.$u.toast(`已拉黑`);
          return;
        }
        let data = {
          black_id:this.mineVideoInfo.id,
        };
        const res = await this.$api.blackStore(data);
        if(res.code == 1){
          this.$u.toast(res.msg);
          this.mineVideoInfo.is_black = !this.mineVideoInfo.is_black;
        }
      },
      // 点击显示删除模态框
      handleVideoDel(show,item){
        this.delVideoShow = show;
        this.delItem = item;
        console.log('kkkkk',item)
      },
      // 点击确认删除视频
      async handleConfirmDel(){
        const res = await this.$api.delMyVideo({video_id:this.delItem.id});
        if(res.code == 1){
          this.$u.toast(res.msg);
          this.delItem = {};
          this.delVideoShow = false;
          this.isLoad = false;
          this.listQuery.page = 1;
          this.mineVideoList = [];
          this.getMineVideoList();
        }
      }
		}
	}
</script>

<style lang="scss" scoped>
	.mine-video-content{
		.mine-video-top-bg{
			height: 352rpx;
		}
		.usre-top-info{
			background: $uni-bg-color;
			margin-top: -40rpx;
			display: inline-block;
			width: 100%;
			border-top-left-radius: 20rpx;
			border-top-right-radius: 20rpx;
			.user-avatar-row{
				margin-top: -36rpx;
				.user-avatar{
					border-radius: 50%;
					border: 10rpx solid #fff;
				}
				.user-right{
					.right-item{
						width: calc(100% / 3);
						>view:first-child{
							margin-bottom:6rpx;
							color: #666;
							font-size: 26rpx;
						}
						>view:last-child{
							font-size: 28rpx;
							color: $uni-text-color;
						}
					}
					.center-line{
						background: #BFBFBF;
						height: 45rpx;
						width: 1rpx;
					}
				}
			}
      .go-store-btn{
        background: #F2F2F2;
        border-radius: 6rpx;
        padding: 10rpx 20rpx;
      }
		}
    .modal-content{
      margin: 0 60rpx;
    }
	}
</style>
