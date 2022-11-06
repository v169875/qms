<template>
  <!-- 机构详情 -->
  <view class="organization-detail-content">
    <top-navbar :title="title"></top-navbar>
    <u-gap height="30"></u-gap>
    <view class="top-info p-l-34 p-r-34">
      <view class="flex col-center row-between">
        <view class="flex col-center">
          <view class="font-32 text-333 text-bold hidden_one" style="max-width: 65%;">
            {{schoolDetail.school_name || ''}}
          </view>
          <view class="m-l-18 text-white font-22 main-bg-color brand" @tap="handleBrandIntr()">品牌介绍</view>
        </view>
        <view class="font-22 attention-tag"
              :class="schoolDetail.is_favorite ? 'text-white main-bg-color ' : 'main-color'" @tap="handleFocus()">
          {{schoolDetail.is_favorite ? '已关注' : '关注'}}
        </view>
      </view>
      <!-- 轮播图片 -->
      <view class="rate-row flex col-center row-between m-t-20">
        <u-rate :count="5" v-model="schoolDetail.score" active-color="#F6D350" active-icon="star-fill"
                inactive-icon="star-fill" disabled></u-rate>
        <image src="/static/index/organization-share-icon.png" mode="aspectFit" @tap="handleShareShow()">
        </image>
      </view>
      <u-gap height="30"></u-gap>
      <u-gap height="34"></u-gap>

      <!-- 轮播视频加图片 -->

      <view>
        <my-swiper :list="bannerList" :height="height">
        </my-swiper>
      </view>

      <view class="voucher-top-title m-b-22">该商家支持{{schoolDetail.school_kongzhi || ''}}张代金券抵扣</view>
      <view class="voucher-row flex col-center row-between" @tap="handleVoucherDetail()">
        <!-- 左 -->
        <view class="flex col-center">
          <view class="voucher-icon p-l-20 p-r-20 flex col-center row-center">
            <!-- 						<view class="flex col-center">
              <view class="" style="font-size: 18rpx;vertical-align: bottom;">￥</view>
              <view class="text-bold">{{voucherDetail.deduction_price || 0}}</view>
              <view class="">
                123456
              </view>
            </view> -->
            <view class="" style="font-size: 19rpx;">
              ￥{{voucherDetail.deduction_price || 0}}
            </view>
            <view class="voucher-line"></view>
            <view class="" style="font-size: 19rpx;">代金券</view>
            <image src="/static/index/voucher-bg-icon.png" mode="widthFix"></image>
          </view>
          <view class="m-l-20">
            <view class="font-30 text-333">{{voucherDetail.deduction_price || 0}}元代金券</view>
            <view class="main-color text-bold font-30">￥{{voucherDetail.sell_price || 0}}/张</view>
          </view>
        </view>
        <!-- 右 -->
        <view class="main-bg-color text-white p-12 font-24 radius-6">点击查看</view>
      </view>
      <view class="font-24 text-999 m-t-22 m-b-36">
				代金券使用规则：{{schoolDetail.d_coupon_desc || voucherDetail.desc || ''}}
        <br>
        <view @click="phone">联系电话：{{schoolDetail.phone || ''}}</view>
        <br>
        <view @click="navigationTo">地址：{{schoolDetail.address_detail || ''}}</view>
      </view>

    </view>
    <u-gap height="20" bg-color="#F5F5F5"></u-gap>
    <view class="font-28 text-333 text-bold text-center m-t-34 m-b-42 activity-title">好物推荐</view>
    <!-- 代卖课程 卡片 -->
    <view class="course-list">
      <block v-for="(item,index) in agencyCourseList" :key="index">
        <course-card :courseItem="item" :isShowVipTag="item.is_t_coupon == 1 ? true : false"
                     :isShowFree="item.is_t_coupon == 1 && item.is_free"></course-card>
      </block>
      <!-- 机构课程 -->
      <block v-for="(item,index) in courseList" :key="index">
        <course-card :courseItem="item" :isShowVipTag="item.is_t_coupon == 1 ? true : false"
                     :isShowFree="item.is_t_coupon == 1 && item.is_free"></course-card>
      </block>
    </view>
    <!-- 没有代卖课程和机构课程时显示暂无 -->
    <view class="" v-if="agencyCourseList.length <= 0 && courseList.length <= 0">
      <u-gap height="40"></u-gap>
      <view class="" style="margin: 0 auto;">
        <u-empty text="暂无商品" mode="list"></u-empty>
      </view>
      <u-gap height="40"></u-gap>
    </view>
    <u-gap height="20" bg-color="#F5F5F5"></u-gap>
    <view class="font-28 text-333 text-bold text-center m-t-34 m-b-42 activity-title">作品（{{mineVideoList.length}}）
    </view>

    <!-- 课程推荐 卡片 -->
    <view class="course-list">
      <block v-for="(item,index) in mineVideoList" :key="index">
        <course-card :courseItem="item" :rowNum="3" :isShowPriceRow="false" :isShowLookNum="true"
                     :isShowPlayIcon="true" :isShowDelIcon="true" :videoIndex="index" :dataList="mineVideoList"
                     :listQuery="videoListQuery" :isCourseCard="false" isCardType='isVideo'>
        </course-card>
      </block>
    </view>

    <view class="" v-if="mineVideoList <= 0">
      <u-gap height="40"></u-gap>
      <view class="" style="margin: 0 auto;">
        <u-empty text="暂无作品" mode="list"></u-empty>
      </view>
      <u-gap height="40"></u-gap>
    </view>
    <!-- 分享弹窗 -->
    <share-popup ref="sharePopup" :shareNum="2" shareType="store" @onShareType="handleShareInfo"
                 :cover_image="cover_image" :qrCode="qrCode" :head="head"></share-popup>
    <u-tabbar v-model="current" icon-size="54" :border-top="false" inactive-color="#999" active-color="#3077FB"
              :list="organTabBar" @change="handleChangeTab"></u-tabbar>
    <!-- <u-skeleton :loading="false" :animation="true" bgColor="#FFF"></u-skeleton> -->
  </view>
</template>

<script>
// 分享弹窗
import sharePopup from '@/components/share-popup/share-popup.vue'
// 课程卡片
import courseCard from '@/components/course-card/course-card.vue'
//轮播视频
import MySwiper from '@/components/my-swiper/index.vue';
import {
  pathToBase64,
} from 'image-tools'

export default {
  components: {
			sharePopup,
			courseCard,
      MySwiper
  },
  data() {
    return {
      autoplay: false,
      bannerList: [],
      height: 200,
      // 视频轮播加图片
      head: '',
      cover_image: '',
      share_id: 0, //分享人id
      qrCode: '', // 分享商品二维码
      title: '商家详情',
      rateVal: '3.5',
      swiperList: [],

      schoolDetail: {}, // 机构详情
      agencyCourseList: [], //代卖课程
      courseList: [], //课程推荐
      organTabBar: [{
        iconPath: "/static/tabbar/index.png",
        selectedIconPath: "/static/tabbar/index-active.png",
        text: '首页',
        customIcon: false,
        pagePath: '/pages/index/organizationDetail/organizationDetail'
      },
        {
          iconPath: "order",
          selectedIconPath: "order",
          text: '订单',
          customIcon: false,
          pagePath: '/pages/mine/order/order' //因为不是tab页，所以无法通过uview组件跳转，跳转路径写在下方 handleChangeTab中
        }
      ],
      current: 0,
      // 机构id
      school_id: null,
      location: {},
      userInfo: {},
      // 代理课程查询
      agentQuery: {
        page: 1,
        limit: 10,
      },
      agentIsLoad: false,
      isNotAgent: false, //没有代理课程了
      // 我的课程查询
      courseQuery: {
        page: 1,
        limit: 10,
      },
      courseIsLoad: false,
      isNotCourse: false, //没有我的课程了
      // 视频列表查询
      videoListQuery: {
        page: 1,
        limit: 20,
        user_id: '',
      },
      videoIsload: false, //是否加载更多作品
      videoIsNot: false, //是否还有更多视频
      // 优惠券详情
      voucherDetail: {},
      mineVideoList: [], //作品列表
    };
  },

  onLoad(options) {
    if (options.school_id) {
      let location = uni.getStorageSync('location');
      // console.log(location)
      if (location) {
        this.location = location;
        this.school_id = options.school_id * 1;
        this.getOrganSchoolDetail(this.school_id);
        this.getAgentCourseList(this.school_id);
        // this.getCourseList(this.school_id);
        this.getVoucherDetail();
        console.log(this.school_id)
        this.getqrCode(this.school_id)
      };
      let userInfo = uni.getStorageSync('userInfo');
      if (userInfo) {
        this.userInfo = userInfo;
        this.pathToBase64(userInfo.avatar_format, 'head')
      }
    }
  },
  //导航
  openMap(longitude, latitude, name) {
    uni.openLocation({
      longitude: Number(longitude),
      latitude: Number(latitude),
      name: name,
      scale: 12,
      success: function() {
        console.log('success');
      }
    });
  },
  //结束
  onReachBottom() {
    if (!this.isNotAgent) {
      this.getAgentCourseList(this.school_id);
    }
    if (this.isNotAgent && !this.isNotCourse) {
      this.getCourseList(this.school_id);
    }
    if (this.isNotAgent && this.isNotCourse && !this.videoIsNot) {
      this.getMineVideoList();
    }
  },
  methods: {
    async getqrCode(classid) {
      let data = {
        school_id: classid
      };
      const res = await this.$api.organizationQrCode(data);
      console.log(res)
      if (res.code == 1) {
        this.pathToBase64(res.data.qrCodeUrl, 'qrCode')
      }
    },
    pathToBase64(url, name) {
      let imageStr
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
    //商家地址一键导航（驾驶模式）
    //name,latitude,longitude可用参数${this.}
    //name可用参数this.schoolDetail.school_name（调用参数name）
    //latitude可用参数this.schoolDetail.lat（调用参数lat）
    //longitude可用参数this.schoolDetail.lng（调用参数lng）
    // 导航
    navigationTo(item) {
      //打开第三方地图
      const latitude = Number(this.schoolDetail.lat)
      const longitude = Number(this.schoolDetail.lng)
      if (plus.os.name == 'Android') {
        uni.openLocation({
          latitude: latitude,
          longitude: longitude,
          name: this.schoolDetail.school_name,
          scale: 12,
          success() {
            console.log('success')
          }
        })
      } else { // ios默认打开高德地图
        this.iosOpenMap(this.schoolDetail.lat, this.schoolDetail.lng, this.schoolDetail.school_name)
      }
    },
    iosOpenMap(latitude, longitude, name) {
      let url = ''
      plus.nativeUI.actionSheet({
        title: "选择地图应用",
        cancel: "取消",
        buttons: [{
          title: "高德地图"
        }]
      }, function(e) {
        switch (e.index) {
          case 1:
            url =
                `iosamap://viewMap?sourceApplication=applicationName&poiname=${name}&lat=${latitude}&lon=${longitude}&dev=0`;
            break;
          default:
            break;
        }
        if (url != "") {
          url = encodeURI(url);
          plus.runtime.openURL(url, function(e) {
            plus.nativeUI.alert("本机未安装高德地图，请先下载安装高德地图。");
          });
        }
      })
    },
    //点击事件，拨打电话
    //参数说明:phone是商家电话，可用this.schoolDetail.来调用
    phone() {
      uni.makePhoneCall({
        phoneNumber: this.schoolDetail.phone
      });
    },
    // 点击分享机构
    handleShareShow() {
      this.$refs.sharePopup.handleShowSharePopup(true, 'isOrganization', this.schoolDetail);
    },
    // 获取机构详情
    async getOrganSchoolDetail(school_id) {
      this.swiperList = [];
      this.bannerList = [];
      const res = await this.$api.getSchoolDetail({
        school_id
      });
      if (res.data.school_video_image_format) {
        this.bannerList.push(
            {
              poster:res.data.school_cover_image_format,
              src:res.data.school_video_image_format,
              type:"video",
            }
        )
      }
      for (let index=0; index < res.data.images_format.length; index++) {
        this.bannerList.push(
            {
              src:res.data.images_format[index],
              type:"image",
            }
        )
      }

      if (res.code == 1) {
        this.schoolDetail = res.data;
        this.cover_image = res.data.school_cover_image_format
        if (res.data.school_cover_image_format) {
          this.pathToBase64(res.data.school_cover_image_format, 'cover_image')
        }
        this.swiperList = res.data.images_format;
        this.videoListQuery.user_id = res.data.user_id;
        // this.getMineVideoList();
      }
    },
    // 获取代金券配置
    async getVoucherDetail() {
      const res = await this.$api.getDcoupnConfig();
      if (res.code == 1) {
        this.voucherDetail = res.data;
      }
    },
    // 获取代卖课程列表
    async getAgentCourseList(school_id) {
      if (this.agentIsLoad) return;
      this.agentIsLoad = true;
      let data = {
        school_id: school_id,
        ...this.agentQuery,
      };
      const res = await this.$api.getAgentClassesList(data);
      if (res.code == 1) {
        if (res.data.data.length > 0) {
          // 如果数据不足证明可以加载，我的课程接口了
          if (res.data.data.length < 10) {
            this.isNotAgent = true;
            this.getCourseList(this.school_id);
          }
          this.agencyCourseList = this.agencyCourseList.concat(res.data.data);
          this.agentQuery.page++;
          this.agentIsLoad = false;
        } else {
          this.agentIsLoad = false;
          this.isNotAgent = true;
          this.getCourseList(this.school_id);
        }
      }
    },
    // 获取推荐课程列表
    async getCourseList(school_id) {
      if (this.courseIsLoad) return;
      this.courseIsLoad = true;
      let data = {
        ...this.location,
        ...this.courseQuery,
        school_id: school_id,
      };
      const res = await this.$api.getClassesList(data);
      if (res.code == 1) {
        if (res.data.data.length > 0) {
          if (res.data.data.length < 10) {
            this.isNotCourse = true;
            // 没有数据了可以加载我的视频了
            this.getMineVideoList();
            console.log('没有更多课程了，加载视频', res.data.data.length);
          }
          this.courseList = res.data.data;
          this.courseQuery.page++;
          this.courseIsLoad = false;
        } else {
          this.courseIsLoad = false;
          this.isNotCourse = true;
          this.getMineVideoList();
        }
      }
    },
    // 获取作品列表
    async getMineVideoList() {
      if (this.videoIsload) return;
      this.videoIsload = true;
      const res = await this.$api.myVideoList(this.videoListQuery);
      if (res.code == 1) {
        if (res.data.data.length > 0) {
          let videoList = res.data.data;
          videoList.map((item, index) => {
            this.$set(item, 'isplay', true); //是否播放音频
            this.$set(item, 'isShowProgressBarTime', false); //是否显示进度条（默认这个即可）
            this.$set(item, 'state', 'pause'); //初始状态标志（不改）
            this.$set(item, 'isShowimage', false); //是否显示封面（默认这个即可）
            this.$set(item, 'playIng', false); //播放（默认这个即可）
          })
          this.mineVideoList = this.mineVideoList.concat(res.data.data);
          this.videoListQuery.page++;
          this.videoIsload = false;
        } else {
          this.videoIsload = false;
        }
      }
    },
    // 点击跳转订单页
    handleChangeTab(index) {
      if (index == 1) {
        this.$u.route({
          url: '/pages/mine/order/order',
          params: {
            order_class: 1,
          }
        })
      }
    },
    // 跳转到代金券详情页
    handleVoucherDetail() {
      this.$u.route({
        url: '/pages/index/organizationDetail/voucherDetail/voucherDetail',
        params: {
          school_id: this.school_id,
        }
      })
    },
    // 点击跳转到品牌介绍
    handleBrandIntr() {
      this.$u.route({
        url: '/pages/index/organizationDetail/brandIntr/brandIntr',
        params: {
          school_id: this.school_id,
        }
      })
    },
    // 点击关注
    async handleFocus() {
      if (!this.schoolDetail.is_favorite) {
        let data = {
          school_id: this.school_id
        };
        const res = await this.$api.favoriteStore(data);
        if (res.code == 1) {
          this.$u.toast(res.msg);
          this.schoolDetail.is_favorite = !this.schoolDetail.is_favorite;
        }
      } else {
        let data = {
          school_id: this.school_id,
        };
        const res = await this.$api.delFavorite(data);
        if (res.code == 1) {
          this.$u.toast(res.msg);
          this.schoolDetail.is_favorite = !this.schoolDetail.is_favorite;
        }
      }
    },
    // 点击分享回调
    handleShareInfo(shareType) {
      let data = {
        shareType,
        shareId: this.userInfo.id,
        goodsId: this.school_id,
      }
      let encrypt = this.AES.encrypt(JSON.stringify(data), '1234567891234567', '1234567891234567');
      let shareStr = '启明星图机构分享，复制此链接到启明星图App，' + this.schoolDetail.school_name + '#' + encrypt + '#';
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
  },
  //跳转导航


  //结束
}
</script>

<style lang="scss" scoped>
.organization-detail-content {
  .top-info {
    .brand {
      padding: 4rpx 14rpx;
      border-radius: 6rpx;
    }

    .attention-tag {
      padding: 4rpx 36rpx;
      border-radius: 6rpx;
      border: 1px solid #3077FB;
    }

    .rate-row {
      image {
        width: 37rpx;
        height: 37rpx;
        display: block;
      }
    }

    .voucher-row {
      .voucher-icon {
        // min-width: 100rpx;
        // vertical-align:text-bottom;
        // height: 100rpx;
        position: relative;

        // background: url('/static/index/voucher-bg-icon.png') no-repeat center center / cover;
        >view {
          background: linear-gradient(to bottom, #FFEACD, #EDB288);
          -webkit-background-clip: text;
          color: transparent;
        }

        >image {
          width: 100%;
          height: 100%;
          position: absolute;
          z-index: -1;
        }

        .voucher-line {
          height: 46rpx;
          width: 1rpx;
          background: linear-gradient(to bottom, #FFEACD, #EDB288);
          margin: 0 10rpx;
        }
      }
    }
  }

  .u-tabbar {
    /deep/ .u-icon {
      .u-icon__icon {
        font-size: 48rpx !important;
      }
    }
  }
}
</style>
