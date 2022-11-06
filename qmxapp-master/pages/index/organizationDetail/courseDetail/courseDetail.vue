<template>
  <!-- 课程详情 -->
  <view class="course-detail-content">
    <top-navbar :title="title"></top-navbar>
    <view class="p-l-34 p-r-34 m-b-36">
      <u-gap height="30"></u-gap>
      <u-swiper :list="swiperList" height="350"></u-swiper>

      <!-- <view class="font-28 text-333 hidden_one" style="width: 70%;">[所有机构通用] 100元代金券</view> -->
      <view class="hidden_two m-t-40 ">{{courseDetail.classes_name || ''}}</view>
      <view class="main-color font-28 m-t-10 text-right">报名:{{courseDetail.sales || 0}}</view>
      <view class="flex col-center row-between course-detail-price-row m-t-10">
        <!-- 正常课程显示 -->
        <block v-if="courseDetail.is_group == 0">
          <!-- 付费显示 -->
          <view class="flex col-center" v-if="courseDetail.is_t_coupon == 0 && !courseDetail.is_free">
            <view class="font-30 main-color">￥{{courseDetail.classes_current_price || 0}}/{{courseDetail.company || ''}}</view>
            <view class="font-26 text-999 text-through m-l-18">
              原价：￥{{courseDetail.classes_original_price || 0}}/{{courseDetail.company || ''}}</view>
          </view>
          <!-- 免费显示 -->
          <view class="flex col-center" v-if="courseDetail.is_t_coupon == 1 && courseDetail.is_free">
            <view class="font-30 main-color">体验卡免费</view>
          </view>
        </block>
        <!-- 拼团课程显示 -->
        <block v-if="courseDetail.is_group == 1">
          <view class="flex col-center" v-if="courseDetail.is_t_coupon == 0 && !courseDetail.is_free">
            <view class="font-30 main-color">￥{{courseDetail.classes_group_price || 0}}</view>
          </view>
        </block>
        <view class="flex col-center top-right font-28 text-666">
          <view class="flex col-center">
            <image src="/static/index/course-detail-icon1.png" mode="aspectFit"></image>
            <view class="">{{courseDetail.views || 0}}</view>
          </view>
          <view class="m-l-32 flex col-center" @tap="handleLike()">
            <!-- <image src="/static/index/course-detail-icon2.png" mode="aspectFit"></image> -->
            <u-icon :name="courseDetail.is_like ? 'heart-fill' : 'heart'" color="#999" size="36"></u-icon>
            <view class="m-l-12">{{courseDetail.like || 0}}</view>
          </view>
        </view>
      </view>
    </view>
    <u-gap height="20" bg-color="#F5F5F5"></u-gap>
    <view class="m-t-20 m-b-30 p-l-34 p-r-34">
      <view>
              <img  :src="courseDetail.schoolInfo.school_cover_image_format" style="height: 60rpx;  vertical-align:middle; border-radius: 5px 5px 5px 5px;" mode="widthFix">
<!--        <u-image :src="courseDetail.schoolInfo.school_cover_image_format" shape="circle" width="90rpx" height="90rpx"  vertical-align:middle;></u-image>-->
         <text   space='ensp' class="font-30 text-bold"  style="text-align: center; text-indent:30px;"> {{' '}} {{courseDetail.schoolInfo.school_name}}</text>
        <button   class="font-23 text-bold"  style="  display: inline-block;text-align: center;  float:right;border-radius: 15rpx;"
                  @tap="handleStore()">进店逛逛</button>
      </view>
      <br>
      <view  class="font-28 text-bold">商品简介</view>
      <br>
      <u-parse :html="courseDetail.classes_desc":tag-style="htmlStyle"></u-parse>
      <br>
      <view class="font-28 text-bold">商品介绍</view>
      <u-parse :html="courseDetail.content_format" :tag-style="htmlStyle"></u-parse>
    </view>
    <u-gap height="20" bg-color="#F5F5F5"></u-gap>
    <u-cell-group>
      <u-cell-item :title="`全部评论${allCommentNum}条`" :title-style="titleStyle" value="查看全部"
                   @click="handleAllComment()"></u-cell-item>
    </u-cell-group>
    <u-gap height="30"></u-gap>
    <view class="comment-list">
      <block v-for="(item,index) in commentList" :key="index">
        <comment-item :commentItem="item"></comment-item>
      </block>
    </view>
    <u-gap height="130"></u-gap>
    <view class="flex col-center row-between detail-bottom">
      <view class="flex col-center">
        <view class="m-r-40" v-for="(item,index) in bottomIcon" :key="index" @tap="handleShareShow(index)">
          <image :src="`/static/index/detail-bottom-icon${item.icon}.png`" mode="aspectFit"></image>
          <view class="m-t-6 text-666 font-24">{{item.title}}</view>
        </view>
      </view>
      <view class="main-color text-white buy-voucher-btn radius-50 font-24 text-center"
            v-if="courseDetail.is_group == 1" style="border: 1px solid #3077FB;" @tap="handlePayCourse('group')">
        拼团购买</view>
      <view class="main-bg-color text-white buy-voucher-btn radius-50 font-24 text-center"
            v-if="courseDetail.is_group == 0" style="border: 1px solid #3077FB;" @tap="addCar()">加入购物车</view>
      <view class="main-bg-color text-white buy-voucher-btn radius-50 font-24 text-center"
            v-if="courseDetail.is_group == 0" style="border: 1px solid #3077FB;" @tap="handlePayCourse('own')">购买产品
      </view>
    </view>
    <!-- 分享弹窗 -->
    <share-popup ref="sharePopup" :shareNum="2" shareType="course" :head="head" :qrCode="qrCode" :cover_image="cover_image"
                 @onShareType="handleShareInfo"></share-popup>
  </view>
</template>

<script>
// 分享弹窗
import sharePopup from '@/components/share-popup/share-popup.vue'
// 评论
import commentItem from '@/components/comment-item/comment-item.vue'
import {
  pathToBase64,
  base64ToPath
} from 'image-tools'
import UImage from "../../../../uview-ui/components/u-image/u-image";
export default {
  components: {
    UImage,
    sharePopup,
    commentItem
  },
  data() {
    return {
      title: '商品详情',
      classes_id: null, //详情id
      swiperList: [],
      courseDetail: {
        schoolInfo: {}
      }, //课程详情
      commentList: [], //评论列表
      allCommentNum: 0, //全部评论数
      htmlStyle: {
        p: `
						margin: 26rpx 0;
						line-height: 46rpx;
						letter-spacing: 2rpx;
						color:#666;
					`,
        img: `
						border-radius: 10rpx;
						width:100%;
					`
      },
      titleStyle: {
        fontSize: '30rpx',
        color: '#333',
        fontWeight: 'bold',
      },
      bottomIcon: [{
        icon: 1,
        title: '咨询客服'
      },
        {
          icon: 2,
          title: '分享课程'
        },
      ],
      userInfo: {},
      head: '',
      cover_image: '',
      share_id: 0, //分享人id
      qrCode: '', // 分享商品二维码
    };
  },
  onLoad(options) {
    if (options.classes_id) {
      this.classes_id = options.classes_id * 1;
      this.getCourseDetail(this.classes_id);
      this.getCourseCommentList(this.classes_id);
      this.getqrCode(this.classes_id)
    }
    if (options.shareId) {
      this.share_id = options.shareId * 1;
    }
    let userInfo = uni.getStorageSync('userInfo');
    if (userInfo) {
      this.userInfo = userInfo;
      this.pathToBase64(userInfo.avatar_format,'head')
    }
  },
  onShow() {
    this.handleAddViews();
  },
  methods: {
    handleStore(){
      let params = {
        school_id:this.courseDetail.schoolInfo.id
      };
      this.$u.route({
        url:'/pages/index/organizationDetail/organizationDetail',
        params:params
      })
    },
    async getqrCode(classid) {
      let data = {
        classes_id: classid
      };
      const res = await this.$api.qrCode(data);
      if (res.code == 1) {
        this.pathToBase64(res.data.qrCodeUrl,'qrCode')
      }
    },
    // 点击分享机构
    handleShareShow(index) {
      console.log(this.courseDetail)
      switch (index) {
        case 0: //咨询客服
          this.$u.route({
            url: '/pages/message/serveDialog/serveDialog',
          })
          break;
        case 1: //分享课程
          this.$refs.sharePopup.handleShowSharePopup(true, 'isCourse', this.courseDetail);
          break;
      }
    },
    // 点赞课程
    async handleLike() {
      let res = {};
      let data = {
        like_id: this.classes_id,
      }
      if (this.courseDetail.is_like) {
        res = await this.$api.subClassesLike(data);
      } else {
        res = await this.$api.addClassesLike(data);
      }
      if (res.code == 1) {
        this.$u.toast(res.msg);
        this.courseDetail.is_like = !this.courseDetail.is_like;
      }
    },
    // 查看全部评论
    handleAllComment() {
      this.$u.route({
        url: '/pages/index/organizationDetail/courseDetail/allComment/allComment',
        params: {
          classes_id: this.classes_id,
        }
      })
    },
    // 点击加入购物车
    async addCar() {
      let data = {
        classes_id: this.classes_id,
        num: 1
      };
      const res = await this.$api.addcart(data);
      console.log(res)
      if (res.code == 1) {
        uni.showToast({
          title: res.msg,
          icon: 'success'
        })
      }
    },
    // 点击购买课程
    handlePayCourse(type) {
      let url = '/pages/index/organizationDetail/courseDetail/orderConfirm/orderConfirm';
      let params = {};
      switch (type) {
        case 'group': //拼团购买
          params = {
            classes_id: this.classes_id,
            share_id: this.share_id,
            is_group: true,
          }
          break;
        case 'own': //自己购买
          params = {
            classes_id: this.classes_id,
            share_id: this.share_id,
          }
          break;
      }
      this.$u.route({
        url,
        params,
      })
    },
    // 获取课程详情
    async getCourseDetail(classes_id) {
      let data = {
        classes_id: classes_id,
      };

      const res = await this.$api.getClassesDetail(data);
      if (res.code == 1) {
        this.courseDetail = res.data;
        console.log(res.data)
        if(res.data.cover_image_format || res.data.classes_cover_image_format) {
          this.pathToBase64(res.data.cover_image_format || res.data.classes_cover_image_format,'cover_image')
        }
        this.swiperList = res.data.images_format; //去掉.push 如果加.push成了二维数组
      }
    },
    // 获取评论列表
    async getCourseCommentList(classes_id) {
      let data = {
        classes_id: classes_id,
        page: 1,
        limit: 5, //详情页不用显示那么多
        sort: 1,
      }
      const res = await this.$api.getClassesOrderComment(data);
      if (res.code == 1) {
        this.commentList = res.data.data;
        this.allCommentNum = res.data.total;
      }
    },
    // 增加浏览量
    async handleAddViews() {
      let data = {
        classes_id: this.classes_id,
      };
      const res = await this.$api.addClassesViews(data);
      if (res.code == 1) {

      }
    },
    pathToBase64(url,name) {
      let imageStr
      console.log(url)
      uni.downloadFile({
        url: url,
        success: (res) => {
          pathToBase64(res.tempFilePath)
              .then(path => {
                this[name] = path
              })
              .catch(error => {
                console.error('临时路径转换出错了：', error);
              });
        }
      });
    },
    // 点击分享回调
    handleShareInfo(shareType) {
      let data = {
        shareType,
        shareId: this.userInfo.id,
        goodsId: this.classes_id,
      }
      let encrypt = this.AES.encrypt(JSON.stringify(data), '1234567891234567', '1234567891234567');
      let shareStr = '启明星图课程分享，复制此链接到启明星图App，' + this.courseDetail.classes_name + '#' + encrypt + '#';
      uni.setClipboardData({
        data: shareStr,
        success: () => { //复制成功的回调函数
          uni.showToast({
            icon: 'none',
            title: '复制分享链接成功！',
            duration: 2000,
          })
        }
      });
    },
  }
}
</script>

<style lang="scss" scoped>
.course-detail-content {
  .course-detail-price-row {
    .top-right {
      image {
        width: 41rpx;
        height: 28rpx;
        margin-right: 13rpx;
      }
    }
  }

.custom-style {
  color: #ff0000;
  width: 200rpx;
}
  .detail-bottom {
    box-shadow: 0rpx 0rpx 32rpx -14rpx #999;
    background: $uni-bg-color;
    position: fixed;
    width: 100%;
    bottom: 0;
    left: 0;
    padding: 20rpx 34rpx 16rpx 36rpx;
    z-index: 999;

    image {
      width: 34rpx;
      height: 34rpx;
      display: block;
      margin: 0 auto;
    }

    .buy-voucher-btn {
      padding: 10rpx 24rpx;
    }
  }
}
</style>
