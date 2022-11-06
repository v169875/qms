<template>
  <view class="index-content">
    <top-navbar :isBack="true" :isShequ="true" :location="userLocation"></top-navbar>
    <!-- 轮播图 -->
<!--    &lt;!&ndash; 弹窗 &ndash;&gt;-->
<!--    <view v-if="isMask">-->
<!--      <view v-if="index==1">-->
<!--        <popup type="1" @close="closeMask()"></popup>-->
<!--      </view>-->
<!--      <view v-else-if="index==4">-->
<!--        <popup type="4" :version="version" :content="desc" @close="closeMask()" :forceUpdate="forceUpdate"-->
<!--               @eventClick="update()">-->
<!--        </popup>-->
<!--      </view>-->
<!--      <view v-else-if="index==2 && firstPop">-->
<!--        <popup type="2" :money="money" @close="closeMask()"></popup>-->
<!--      </view>-->
<!--      <view v-else-if="index==3">-->
<!--        <popup type="3" :title="title" :content="content" @close="closeMask()"></popup>-->
<!--      </view>-->
<!--      <view v-else-if="index==5">-->
<!--        <popup type="5" :version="version" :content="desc" @close="closeMask()" @eventClick="update()"></popup>-->
<!--      </view>-->
<!--    </view>-->

<!--    &lt;!&ndash; 结束 &ndash;&gt;-->
    <view class="m-r-34 m-l-34">
      <u-swiper :list="swiperList" height="262" name="image_format" @click="handleSwiperItem"></u-swiper>
    </view>
    <!-- 分类 -->
    <!--    		<view class="goods-class-body flex flex-wrap m-t-34">
          <u-grid :border="false" :col="5">
            <u-grid-item v-for="(item,index) in goodsClassList" :key="index"
              @tap="handleGoodsClassItem(item,index)">
              <image :src="item.image_format" mode="aspectFit"></image>
              <view class="goods-class-title">{{item.name}}</view>
            </u-grid-item>
          </u-grid>
        </view>-->
    <!-- 分类 -->
<!--    <swiper :indicator-dots="true">-->
<!--      <swiper-item v-for="(page, index) in pages" :key="index">-->
<!--        <view class="goods-class-body flex flex-wrap m-t-34">-->
<!--          <u-grid :border="false" :col="5">-->
<!--            <u-grid-item v-for="(item,index) in  page" :key="index" @tap="handleGoodsClassItem(item,index)">-->
<!--              <image :src="item.image_format" mode="aspectFit"></image>-->
<!--              <view class="goods-class-title">{{item.name}}</view>-->
<!--            </u-grid-item>-->
<!--          </u-grid>-->
<!--        </view>-->
<!--      </swiper-item>-->
<!--    </swiper>-->
    <!-- 分类结束 -->
    <!-- 点击图片跳转到社区服务板块  开始 -->
<!--    <navigator url="/pages/index/shequ">-->
<!--      <center>-->
<!--        <image src="https://oss.fqqmx.com/uploads/guanggaotu.png"-->
<!--               style="width: 90%; height: 160rpx; border-radius: 30px 30px 30px 30px;"></image>-->
<!--      </center>-->
<!--    </navigator>-->
    <!-- 点击图片跳转到社区服务板块  结束 -->
<!--    <u-gap height="20" bg-color="#F5F5F5"></u-gap>-->
<!--    <view class="p-l-34 p-r-34 m-t-28 m-b-30 flex col-center row-between sort-class-row">-->
<!--      <view class="flex col-center row-center class-title rela" v-for="(sortItem,sortIndex) in sortClass"-->
<!--            :key="sortIndex" @tap="handleShowSortSelect(sortIndex)">-->
<!--        <view class="m-r-14 hidden_one">{{sortItem.title}}</view>-->
<!--        <u-icon name="arrow-down-fill" color="#666666" size="28"></u-icon>-->
<!--        &lt;!&ndash; 分类排序显示 &ndash;&gt;-->
<!--        <scroll-view class="abso left-select flex" style="height:340dp;" v-if="classSortShow && sortIndex == 0"-->
<!--                     :class="{'animation-slide-top':classSortShow}">-->
<!--          <view class="">-->
<!--            <view class="select-ptype u-flex-1" @tap.stop="handleSelectClassPidx(99999)">-->
<!--              全部分类-->
<!--            </view>-->
<!--            <view class="select-ptype u-flex-1"-->
<!--                  :class="{'main-color':classPidx == null ? 0 : classPidx == index}"-->
<!--                  v-for="(item,index) in selectClass" :key="index" @tap.stop="handleSelectClassPidx(index)">-->
<!--              {{item.name}}-->
<!--            </view>-->
<!--          </view>-->

<!--          <scroll-view class="flex-col children-scroll" height="200rpx" v-if="classPidx != null">-->
<!--            <view class="select-ptype hidden_one"-->
<!--                  :class="{'main-color':(classCidx == cindex && selectClass[classPidx == null ? 0 : classPidx].id == submitSort.pid)}"-->
<!--                  style="margin: 0 auto;" scroll-y-->
<!--                  v-for="(citem,cindex) in selectClass[classPidx == null ? 0 : classPidx].childlist"-->
<!--                  :key="cindex" @tap.stop="handleSelectClassCidx(classPidx,citem,cindex)">-->
<!--              {{citem.name}}-->
<!--            </view>-->
<!--          </scroll-view>-->
<!--        </scroll-view>-->
<!--        &lt;!&ndash; 距离排序 &ndash;&gt;-->
<!--        <scroll-view class="abso new-scroll-select" v-if="distanceSortShow && sortIndex == 1"-->
<!--                     :class="{'animation-slide-top':distanceSortShow}">-->
<!--          <view class="select-ptype u-flex-1" :class="{'main-color':distanceIdx == index}"-->
<!--                v-for="(item,index) in distanceSortList" :key="index"-->
<!--                @tap.stop="handleChangeDistanceSort(index,item)">-->
<!--            {{item.title}}-->
<!--          </view>-->
<!--        </scroll-view>-->
<!--        &lt;!&ndash; 距离排序 &ndash;&gt;-->
<!--        <scroll-view class="abso new-scroll-select" v-if="typeSortShow && sortIndex == 2"-->
<!--                     :class="{'animation-slide-top':typeSortShow}">-->
<!--          <view class="select-ptype u-flex-1" :class="{'main-color':typeSortIdx == index}"-->
<!--                v-for="(item,index) in typeSortList" :key="index" @tap.stop="handleChangeTypeSort(index,item)">-->
<!--            {{item.title}}-->
<!--          </view>-->
<!--        </scroll-view>-->
<!--      </view>-->
<!--    </view>-->
    <view class="school-list p-l-26 p-r-26">
      <block v-if="schoolList.length > 0">
        <view class="school-item p-t-28 p-b-28 p-r-34 flex col-center" v-for="(item,index) in schoolList"
              :key="index" @tap="handleOrganizationDetail(item)">
          <u-image width="180" height="180" border-radius="10" :src="item.school_cover_image_format"
                   mode="widthFix"></u-image>
          <!-- 右半边 -->
          <view class="u-flex-1 m-l-30">
            <!-- 标题 -->
            <view class="text-black text-bold font-28">{{item.school_name}}</view>
            <!-- 评分 -->
            <view class="flex col-center row-between">
              <view class="flex col-center m-t-6 m-b-10">
                <u-rate :count="5" v-model="item.score" active-color="#F6D350" active-icon="star-fill"
                        inactive-icon="star-fill" disabled></u-rate>
                <view class="m-l-14">{{item.score}}分</view>
              </view>
              <view class="text-666">{{item.km || 0}}km</view>
            </view>
            <!-- 简介 -->
            <view class="text-666 font-26 hidden_one m-b-10">{{item.school_desc}}</view>
            <view class="text-666 font-26 hidden_one m-b-10">{{item.address_detail}}</view>
            <!-- 价格以及副标题 -->
            <view class="flex col-center">
              <!-- <view class="font-28">￥{{item.price}}</view> -->
              <!-- <view class="font-24 hidden_one">{{item.subtitle}}</view> -->
            </view>
          </view>
        </view>
        <!--  #ifdef H5 -->
        <view style="height: 75upx;"></view>
        <!--  #endif -->
      </block>
      <view class="" v-else>
        <u-gap height="200"></u-gap>
        <u-empty text="暂无课程" mode="list"></u-empty>
      </view>
      <!-- 购物车图标 -->
           <image class="car-icon" src="../../static/add/car.png" @click="jumpCar"></image>
    </view>
    <u-gap height="100"></u-gap>
    <!-- <u-tabbar v-model="current" icon-size="54" :border-top="false" inactive-color="#999" active-color="#3077FB" :list="tabbarList"></u-tabbar> -->
  </view>
</template>
<script>
import {
  tabbar
} from '@/utils/tabBar.js'
import QQMapWX from "@/utils/qqmap-wx-jssdk.min.js"
import popup from "@/components/ge-popup.vue"
export default {
  components: {
    popup
  },
  data() {
    return {
      appVersionInfo: null, // app版本信息
      firstPop: true,
      current: 0,
      isMask: true, //是否显示弹窗
      index: 2, //显示第几个弹窗
      money: 99.99, //红包金额
      title: '公告',
      content: '公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容',
      version: '1.0',
      desc: '1.更新内容更新内容 <br/> 2.更新内容更新内容 <br/>2.更新内容更新内容',
      forceUpdate: false,
      downloadUrl: '',
      tabbarList: tabbar,
      swiperList: [],
      selectClass: [], // 筛选分类
      goodsClassList: [],
      // 排序分类
      sortClass: [{
        id: 1,
        title: '全部分类'
      },
        {
          id: 2,
          title: '距离最近'
        },
        {
          id: 3,
          title: '全部类型'
        },
      ],
      // 距离排序显示
      distanceSortList: [{
        id: 1,
        title: '距离最近'
      },
        {
          id: 2,
          title: '好评最多'
        },
        {
          id: 3,
          title: '热度最高'
        },
      ],
      // 类型排序显示
      typeSortList: [{
        id: 1,
        title: '普通店铺'
      },
        {
          id: 2,
          title: '优质店铺'
        },
      ],
      // 类型排序下标
      typeSortIdx: null,
      // 分类排序弹窗显示
      classSortShow: false,
      // 分类排序父id
      classPidx: null,
      // 子分类排序id
      classCidx: null,
      // 距离排序弹窗显示
      distanceSortShow: false,
      // 距离排序下标
      distanceIdx: 0,
      //提交分类排序参数
      submitSort: {},
      // 类型排序弹窗显示
      typeSortShow: false,
      // 分类一，二级分类列表
      classSortList: [],
      // 学校列表
      schoolList: [],
      // 用户当前定位
      // userLocation:{
      // 	lng:'113.621156578391',
      // 	lat:'34.7105659372237',
      // 	citys:'郑州市',
      //       allAddress:'河南省/郑州市/二七区',
      // },
      userLocation: {
        lng: '',
        lat: '',
        citys: '',
        allAddress: '',
        street:''
      },
      listQuery: {
        page: 1,
        limit: 10,
        sort: '',
        is_hot_switch: '',
      },
      isLoad: false, //列表加载下一页
      goodsSortId: null, //分类排序id
      qqMap: new QQMapWX({
        key: 'AVTBZ-QKXCO-EB4WM-SSBJB-BICRF-XPFP3',
        vm: this
      })
    };
  },
  computed: {
    pages() {
      const pages = []
      this.goodsClassList.forEach((item, index) => {
        const page = Math.floor(index / 10)
        if (!pages[page]) {
          pages[page] = []
        }
        pages[page].push(item)
      })
      return pages
    }
  },
  onLoad() {},
  created() {
    this.initPop();
    this.init();

  },
  onShow() {
    // #ifdef APP-PLUS
    this.initUpdate();
    //#endif
    // uni.hideTabBar();
    uni.$on('location', data => {
      // console.log('接受通讯..............................')
      // console.log(data)
      this.userLocation = data;
      this.schoolList = [];
      this.listQuery.page = 1;
      this.isLoad = false;
      this.classPidx = null;
      this.classCidx = null;
      this.typeSortIdx = null;
      this.sortClass = this.$options.data().sortClass;
      this.listQuery = this.$options.data().listQuery;
      this.submitSort = this.$options.data().submitSort;
      this.distanceIdx = 0;
      this.classSortShow = false;
      this.distanceSortShow = false;
      this.typeSortShow = false;
      this.goodsSortId = null;
      this.getSchooStorelList(this.userLocation);
    })
  },
  onHide() {
    // this.classSortShow = false;
  },
  onReachBottom() {
    this.getSchooStorelList(this.userLocation);
  },
  methods: {
    // 判断是否有新版本，有新版本就弹窗更新
    async initUpdate() {
      // 获取当前版本信息
      plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) => {
        this.appVersionInfo = wgtinfo
      })
      let client_type = 'ios'
      if (plus.os.name == 'Android') {
        client_type = 'android'
      }
      console.log(client_type)
      const versionRes = await this.$api.latestVersion({
        client_type: client_type
      });
      if (this.appVersionInfo && versionRes.data && this.appVersionInfo.version != versionRes.data
          .newversion) {
        this.index = 4
        this.version = versionRes.data.newversion
        this.desc = versionRes.data.content
        this.forceUpdate = !!versionRes.data.enforce
        this.downloadUrl = versionRes.data.downloadurl
        this.isMask = true;
      }
    },

    // 判断当前登录用户是否是第一次弹窗
    initPop() {
      const userInfo = uni.getStorageSync('userInfo');
      const firstPopKey = 'first_pop_' + userInfo.id;
      const popFlag = uni.getStorageSync(firstPopKey);
      if (!popFlag) {
        uni.setStorageSync(firstPopKey, 1);
      } else {
        this.firstPop = false
      }
    },
    closeMask() { //关闭弹窗
      this.isMask = false;
    },
    update() {
      // 安卓直接下载文件打开
      if (plus.os.name == 'Android') {
        uni.showLoading({
          title: '安装包下载中……',
          mask: true
        })
        const _this = this
        console.log(this.downloadUrl)
        uni.downloadFile({
          url: this.downloadUrl,//文件的下载路径
          success(res) {
            //保存到本地
            uni.saveFile({
              tempFilePath: res.tempFilePath,//文件的临时路径
              success: function(res) {
                const savedFilePath = res.savedFilePath;
                // 打开文件
                uni.openDocument({
                  filePath: savedFilePath,
                  success: function(res) {
                    uni.hideLoading()
                  },
                  fail: function(res) {},
                  complete: function(res) {
                    uni.hideLoading()
                  },
                });
              },
              fail: function(err) {	}
            });
          },
          fail(res) {}
        })
      } else {
        // ios 跳转到 todo
        plus.runtime.launchApplication({
          action: this.downloadUrl
        }, function(e) {
          console.log('Open system default browser failed: ' + e.message);
        });
      }
    },
    // 初始化数据
    init() {
      // console.log('查看地址信息', this.userLocation)
      this.schoolList = [];
      this.listQuery.page = 1;
      this.isLoad = false;
      this.classPidx = null;
      this.classCidx = null;
      this.typeSortIdx = null;
      this.sortClass = this.$options.data().sortClass;
      this.listQuery = this.$options.data().listQuery;
      this.submitSort = this.$options.data().submitSort;
      this.distanceIdx = 0;
      this.classSortShow = false;
      this.distanceSortShow = false;
      this.typeSortShow = false;
      this.goodsSortId = null;
      this.getIndexBannerList(); //真
      this.getGoodsClassList(); //真
      // start 电脑调试后期删除
      // this.getSchooStorelList(this.userLocation);
      // uni.setStorageSync('location',this.userLocation);  //多处接口需要用到当前城市，存入当前城市
      // end
      uni.$off('location');
      uni.$on('location', data => {
        this.userLocation = data;
      })
      if (this.userLocation.citys) {
        this.getSchooStorelList(this.userLocation);
      } else {
        this.judgeUserPermission(); //本地
      }
    },
    // 检测系统定位是否开启
    async judgeUserPermission() {
      // #ifdef H5
      this.getLocationH5();
      // #endif
      // #ifdef APP-PLUS
      if (uni.getSystemInfoSync().platform == 'android') {
        return await new Promise((resolve, reject) => {
          var context = plus.android.importClass("android.content.Context");
          var locationManager = plus.android.importClass("android.location.LocationManager");
          var main = plus.android.runtimeMainActivity();
          var mainSvr = main.getSystemService(context.LOCATION_SERVICE);
          if (!mainSvr.isProviderEnabled(locationManager.GPS_PROVIDER)) {
            uni.showModal({
              title: '提示',
              content: '请打开定位服务功能，并检查您的权限设定',
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  uni.hideLoading()
                  var Intent = plus.android.importClass(
                      "android.content.Intent");
                  var Settings = plus.android.importClass(
                      "android.provider.Settings");
                  var intent = new Intent(Settings
                      .ACTION_LOCATION_SOURCE_SETTINGS);
                  main.startActivity(intent); //打开系统设置GPS服务页面
                }
              }
            })
          } else {

            // console.log('GPS已开启');
            this.getLocationFun();
            resolve()
          }
        })
      } else if (uni.getSystemInfoSync().platform == 'ios') {
        return await new Promise((resolve, reject) => {
          var cllocationManger = plus.ios.import("CLLocationManager");
          var enable = cllocationManger.locationServicesEnabled();
          var status = cllocationManger.authorizationStatus();
          if (enable && status != 2) {
            // console.log("手机系统的定位已经打开");
            this.getLocationFun();
            resolve()
          } else {
            // console.log("手机系统的定位没有打开");
            uni.hideLoading()
            //废除单选项提醒
            //plus.nativeUI.confirm("定位权限没有开启，是否去开启？", function(e) {
            //if (e.index == 0) {
            //	var UIApplication = plus.ios.import("UIApplication");
            //var application2 = UIApplication.sharedApplication();
            //var NSURL2 = plus.ios.import("NSURL");
            //var setting2 = NSURL2.URLWithString("app-settings:");
            //application2.openURL(setting2);

            //plus.ios.deleteObject(setting2);
            //plus.ios.deleteObject(NSURL2);
            //plus.ios.deleteObject(application2);
            //}
            //}, {
            //"buttons": ["去开启"],
            //"verticalAlign": "center"
            //});
            //采用多选项弹窗形式提醒，废除单选项提醒
            uni.showModal({
              title: '您尚未开启定位服务，现在要去开启吗？',
              content: '或稍后去“设置->隐私->定位服务“中开启',
              confirmText: "现在就去", //这块是确定按钮的文字
              cancelText: "稍后开启", //这块是取消的文字
              success(res) {
                if (res.confirm) {
                  // 点击现在就去后跳转设置页面
                  var UIApplication = plus.ios.import("UIApplication");
                  var application2 = UIApplication.sharedApplication();
                  var NSURL2 = plus.ios.import("NSURL");
                  var setting2 = NSURL2.URLWithString("app-settings:");
                  application2.openURL(setting2);
                  plus.ios.deleteObject(setting2);
                  plus.ios.deleteObject(NSURL2);
                  plus.ios.deleteObject(application2);
                }
              }
            });
            // reject()
          }
          plus.ios.deleteObject(cllocationManger);
        })
      }
      // #endif
    },
    // h5 获取经纬度
    async getLocationH5() {
      // console.log('h5')
      uni.showLoading({
        title: '定位中'
      })
      let _this = this
      uni.getLocation({
        type: 'gcj02',
        success: async ress => {
          // console.log(ress)
          let data = {
            longitude: ress.longitude,
            latitude: ress.latitude
          }
          const res = await this.$api.reverseGeocoder(data);
          // console.log(res)
          if (res.code == 1) {
            var addressList = [];
            addressList.push(res.data.province, res.data.city, res.data.district);
            var addressSlice = []; //用于保留切割后的省市区
            // 只保留省市区  不用于首页定位
            if (addressList.length > 3) {
              addressSlice = addressList.slice(0, 3)
            } else {
              addressSlice = addressList;
            }
            let allAddress = addressSlice.join('/'); //斜杠拼接省市区
            //注意 首页定位专用 因为存在直辖市， 当所在地区为普通省市时，addressList.length == 3，city = addressList[1];当所在地区为直辖市时addressList.length == 2，city = addressList[0];
            let city = addressList.length >= 3 ? addressList[1] : addressList[0];
            let location = {
              lng: ress.longitude,
              lat: ress.latitude,
              citys: city,
              allAddress: allAddress,
              street: ''
            };
            _this.userLocation.lng = ress.longitude;
            _this.userLocation.lat = ress.latitude;
            _this.userLocation.citys = city;
            _this.userLocation.allAddress = allAddress;
            _this.userLocation.street = res.data.detail;
            // uni.setStorageSync('allAddress',allAddress);  //省市区拼接存入本地，用于购买代金券
            // console.log('存入了地址1111111', _this.userLocation)
            _this.getSchooStorelList(_this.userLocation);
          } else {
            // _this.getLocationH5();
          }
        },
        fail: function(error) {
          // console.log('执行', error)
          uni.showToast({
            title: '获取地址失败!',
            icon: 'none'
          });
        }
      });
    },
    // 获取经纬度，以及位置信息
    // getLocationFun() {
    //   uni.getLocation({
    //     type: 'wgs84',
    //     geocode: true, //设置该参数为true可直接获取经纬度及城市信息
    //     success: (dingRes) => {
    //       uni.request({
    //         url: `http://api.map.baidu.com/geocoder?location=${dingRes.latitude},${dingRes.longitude}&output=json`,
    //         success: (res) => {
    //           // uni.showModal({
    //           // 	content: JSON.stringify(res)
    //           // })
    //           if (res.data.status == 'OK') {
    //             var addressList = [];
    //             addressList.push(res.data.result.addressComponent
    //                 .province, res
    //                 .data.result.addressComponent.city, res.data
    //                 .result
    //                 .addressComponent.district);
    //             // var address = res.data.result.addressComponent.province + res.data.result.addressComponent.city + res.data.result.addressComponent.district; // 转换后的地理位置
    //             // var reg = /.+?(省|市|自治区|自治州|县|区)/g;
    //             // var addressList = address.match(reg).toString().split(",");
    //             var addressSlice = []; //用于保留切割后的省市区
    //             // 只保留省市区  不用于首页定位
    //             if (addressList.length > 3) {
    //               addressSlice = addressList.slice(0, 3)
    //             } else {
    //               addressSlice = addressList;
    //             }
    //             let allAddress = addressSlice.join('/'); //斜杠拼接省市区
    //             //注意 首页定位专用 因为存在直辖市， 当所在地区为普通省市时，addressList.length == 3，city = addressList[1];当所在地区为直辖市时addressList.length == 2，city = addressList[0];
    //             let city = addressList.length >= 3 ? addressList[1] :
    //                 addressList[0];
    //             let location = {
    //               lng: dingRes.longitude,
    //               lat: dingRes.latitude,
    //               citys: city,
    //               allAddress: allAddress,
    //             };
    //             this.userLocation.lng = dingRes.longitude;
    //             this.userLocation.lat = dingRes.latitude;
    //             this.userLocation.citys = city;
    //             this.userLocation.allAddress = allAddress;
    //             // uni.setStorageSync('allAddress',allAddress);  //省市区拼接存入本地，用于购买代金券
    //             // console.log('存入了地址1111111', this.userLocation)
    //             this.getSchooStorelList(this.userLocation);
    //           } else {
    //             this.getLocationFun();
    //             // uni.request({
    //             //   url:`http://api.map.baidu.com/geocoder?location=${dingRes.latitude},${dingRes.longitude}&output=json`,
    //             //   success:(res)=>{
    //
    //             //   }
    //             // })
    //
    //
    //             // // 创建地图坐标对象
    //             // var point = new plus.maps.Point(dingRes.longitude, dingRes.latitude);
    //             // //静态方法，反向地理编码
    //             // plus.maps.Map.reverseGeocode(point, {},(event)=>{
    //             //   var address = event.address; // 转换后的地理位置
    //             //   var point = event.coord; // 转换后的坐标信息
    //             //   var coordType = event.coordType; // 转换后的坐标系类型
    //             //   var reg = /.+?(省|市|自治区|自治州|县|区)/g;
    //             //   var addressList = address.match(reg).toString().split(",");
    //             //   var addressSlice = [];  //用于保留切割后的省市区
    //             //   // 只保留省市区  不用于首页定位
    //             //   if(addressList.length > 3){
    //             //     addressSlice = addressList.slice(0,3)
    //             //   }else{
    //             //     addressSlice = addressList;
    //             //   }
    //             //   let allAddress = addressSlice.join('/');  //斜杠拼接省市区
    //             //   //注意 首页定位专用 因为存在直辖市， 当所在地区为普通省市时，addressList.length == 3，city = addressList[1];当所在地区为直辖市时addressList.length == 2，city = addressList[0];
    //             //   let city = addressList.length == 3?addressList[1]:addressList[0];
    //             //   let location = {
    //             //     lng:dingRes.longitude,
    //             //     lat:dingRes.latitude,
    //             //     citys:city,
    //             //     allAddress:allAddress,
    //             //   }
    //             //     console.log('存入了地址222222',location)
    //             //     this.userLocation.lng = dingRes.longitude;
    //             //     this.userLocation.lat = dingRes.latitude;
    //             //     this.userLocation.citys = city;
    //             //     this.userLocation.allAddress = allAddress;
    //             //     // uni.setStorageSync('allAddress',allAddress);  //省市区拼接存入本地，用于购买代金券
    //             //     this.getSchooStorelList(this.userLocation);
    //             //   },
    //             //   function(e) {
    //             //       console.log("失败回调",e);
    //             //   }
    //             // );
    //           }
    //         },
    //       })
    //
    //     },
    //     fail: () => {
    //       uni.showToast({
    //         title: '获取地址失败!',
    //         icon: 'none'
    //       });
    //     }
    //   });
    // },
    getLocationFun() {
      uni.getLocation({
        type: 'gcj02',
        geocode: true, //设置该参数为true可直接获取经纬度及城市信息
        success: (dingRes) => {
          console.log(dingRes)
          // key为腾讯地图应用key，如失效或次数不满足业务需求，请重新申请企业应用
          uni.request({
            url:`https://apis.map.qq.com/ws/geocoder/v1/?location=${dingRes.latitude},${dingRes.longitude}&get_poi=0&key=YNRBZ-Y7MC3-EQN3T-3NFRH-B2NBK-O7FAM`,
            success: (res) => {
              console.log(res)
              if (res.data.status === 0) {
                var addressList = [];
                addressList.push(res.data.result.address_component.province, res.data.result.address_component.city, res.data.result.address_component.district);
                var addressSlice = []; //用于保留切割后的省市区
                // 只保留省市区  不用于首页定位
                if (addressList.length > 3) {
                  addressSlice = addressList.slice(0, 3)
                } else {
                  addressSlice = addressList;
                }
                let allAddress = addressSlice.join('/'); //斜杠拼接省市区
                //注意 首页定位专用 因为存在直辖市， 当所在地区为普通省市时，addressList.length == 3，city = addressList[1];当所在地区为直辖市时addressList.length == 2，city = addressList[0];
                let city = addressList.length >= 3 ? addressList[1] : addressList[0];
                this.userLocation.lng = dingRes.longitude;
                this.userLocation.lat = dingRes.latitude;
                this.userLocation.citys = city;
                this.userLocation.allAddress = allAddress;
                if (res.data.result.address_reference && res.data.result.address_reference.landmark_l2 && res.data.result.address_reference.landmark_l2.title) {
                  this.userLocation.street = res.data.result.address_reference.landmark_l2.title
                } else {
                  this.userLocation.street = res.data.result.formatted_addresses.recommend
                }
                this.getSchooStorelList(this.userLocation);
              } else {
                this.getLocationFun();
              }
            },
          })

        },
        fail: () => {
          uni.showToast({
            title: '获取地址失败!',
            icon: 'none'
          });
        }
      });
    },
    // 获取首页分类
    async getGoodsClassList() {
      let data = {
        type: 'school',
      }
      const res = await this.$api.getCategoryList(data);
      if (res.code == 1) {
        this.selectClass = res.data;
        this.goodsClassList = JSON.parse(JSON.stringify(res.data));
        // let unData = {
        //   id: 99999,
        //   name: "全部分类",
        //   pid: 0,
        //   spacer: "",
        //   type: "school",
        // };
        // this.selectClass.unshift(unData);
      }
    },
    // 获取首页轮播图
    async getIndexBannerList() {
      let data = {
        banner_type: 1,
      };
      const res = await this.$api.getBannerList(data);
      if (res.code == 1) {
        this.swiperList = res.data;
      }
    },
    // 获取店铺列表
    async getSchooStorelList(data) {
      uni.setStorageSync('location', data); //多处接口需要用到当前城市，存入当前城市
      // console.log('地址信息', data)
      if (this.isLoad) return;
      this.isLoad = true;
      let newData = {
        category_id: this.submitSort.pid ? this.submitSort.pid : null,
        son_category_id: this.submitSort.id ? this.submitSort.id : null,
        ...data,
        ...this.listQuery,
      };
      const res = await this.$api.getShequList(newData);
      if (res.code == 1) {
        if (res.data.data.length > 0) {
          this.schoolList = this.schoolList.concat(res.data.data);
          this.listQuery.page++;
          this.isLoad = false;
        } else {
          this.isLoad = false;
        }
      }
    },
    // 点击banner跳转机构id
    /*handleSwiperItem(e){
      if(this.swiperList[e].school_id != 0){
        let params = {
          school_id:this.swiperList[e].school_id,
        };
        this.$u.route({
          url:'/pages/index/organizationDetail/organizationDetail',
          params:params
        })
      }
    },*/ //跳转代金券id和机构id只能保留一个，暂时保留跳转代金券id
    // 点击banner跳转代金券id
    handleSwiperItem(a) {
      if(this.swiperList[a].jump_url){
        this.$u.route({
          url: this.swiperList[a].jump_url,
        })
      } else {
        if (this.swiperList[a].d_coupon_id != 0) {
          let params = {
            d_coupon_id: this.swiperList[a].d_coupon_id,
          };
          this.$u.route({
            url: '/pages/index/organizationDetail/voucherDetail/voucherDetail',
            params: params
          })
        }
      }
    },
    // 点击分类进入分类搜索
    handleGoodsClassItem(item, index) {
      this.$u.route({
        url: '/pages/index/storeSearch/storeSearch',
        params: {
          // tabsList:JSON.stringify(this.goodsClassList),
          cate_id: item.id,
        }
      })
    },
    // 点击机构详情
    handleOrganizationDetail(item) {
      let params = {
        school_id: item.id,
      };
      this.$u.route({
        url: '/pages/index/organizationDetail/organizationDetail',
        params: params
      })
    },
    // 点击代金券详情
    /*handleOrganizationDetail(item){
      let params = {
        d_coupon_id:item.id,
      };
      this.$u.route({
        url:'/pages/index/organizationDetail/voucherDetail/voucherDetail',
        params:params
      })
    },*/
    // 点击显示排序弹窗
    handleShowSortSelect(index) {
      switch (index) {
        case 0: //分类排序
          this.classSortShow = !this.classSortShow;
          this.distanceSortShow = false;
          this.typeSortShow = false;
          break;
        case 1: //距离排序
          this.classSortShow = false;
          this.distanceSortShow = !this.distanceSortShow;
          this.typeSortShow = false;
          break;
        case 2: //类型排序
          this.classSortShow = false;
          this.distanceSortShow = false;
          this.typeSortShow = !this.typeSortShow;
          break;
      }
    },
    // 分类父id选择
    handleSelectClassPidx(index) {
      if (this.classPidx == index) return;
      this.classPidx = index;
      if (index == 99999) {
        this.classPidx = null;
        this.classCidx = null;
        this.goodsSortId = null;
        this.submitSort.pid = null;
        this.submitSort.id = null;
        this.schoolList = [];
        this.isLoad = false;
        this.listQuery = this.$options.data().listQuery;
        this.sortClass[0].title = '全部分类';
        this.getSchooStorelList(this.userLocation);
        this.classSortShow = false;
      }
    },

    // 分类子id选择
    handleSelectClassCidx(pidx, item, index) {
      if (this.classPidx == null) {
        this.$u.toast(`请先选择主分类`);
        return;
      }
      // 如果选择的父分类，子分类和上次选择的相同不执行下面所有操作
      if ((this.classPidx == pidx && this.classCidx == index) && (this.selectClass[this
          .classPidx].childlist[this
          .classCidx].id == this.goodsSortId)) return;
      this.classCidx = index;
      this.goodsSortId = item.id;
      this.schoolList = [];
      this.listQuery.page = 1;
      this.isLoad = false;
      this.submitSort = item;
      this.sortClass[0].title = item.name;
      this.getSchooStorelList(this.userLocation);
      this.classSortShow = false;
    },
    // 点击切换距离排序
    handleChangeDistanceSort(index, item) {
      if (this.distanceIdx == index) return;
      this.distanceIdx = index;
      this.listQuery.sort = item.id;
      this.schoolList = [];
      this.listQuery.page = 1;
      this.isLoad = false;
      this.sortClass[1].title = item.title;
      this.getSchooStorelList(this.userLocation);
      this.distanceSortShow = false;
    },
    // 点击切换类型排序
    handleChangeTypeSort(index, item) {
      if (this.typeSortIdx == index) return;
      this.typeSortIdx = index;
      this.listQuery.is_hot_switch = item.id;
      this.schoolList = [];
      this.listQuery.page = 1;
      this.isLoad = false;
      this.sortClass[2].title = item.title;
      this.getSchooStorelList(this.userLocation);
      this.typeSortShow = false;
    },
    // 跳转购物车
    jumpCar() {
      uni.navigateTo({
        url: "/pages/carPage/index"
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.index-content {
  swiper {
    height: 400rpx;
  }

  .goods-class-body {
    margin: 0 26rpx;

    /deep/ .u-grid-item-box {
      padding: 0 !important;
      margin-bottom: 34rpx;
    }

    image {
      width: 97rpx;
      height: 97rpx;
      display: block;
    }
  }

  .sort-class-row {
    .class-title {
      width: 212rpx;
      text-align: center;
      padding: 6rpx 12rpx;
      // border: 1px solid #666;
      border-radius: 10rpx;
    }

    .new-scroll-select {
      border: 1px solid rgba(153, 153, 153, .1);
      left: 0;
      top: 120%;
      background: $uni-bg-color;
      // padding: 0rpx 30rpx;
      text-align: center;
      z-index: 9999;
      border-radius: 10rpx;

      .select-ptype {
        // padding: 10rpx 0;
        line-height: 60rpx;
        width: 150rpx;
      }
    }

    .left-select {
      border: 1px solid rgba(153, 153, 153, .1);
      left: 0;
      top: 120%;
      background: $uni-bg-color;
      // padding: 0rpx 30rpx;
      text-align: center;
      width: 300rpx;
      z-index: 9999;
      border-radius: 10rpx;

      .select-ptype {
        // padding: 10rpx 0;
        line-height: 60rpx;
        width: 150rpx;
      }

      & .select-ptype:not(:last-child) {
        // border-bottom: 1px solid rgba(153, 153, 153, .1);
      }

      /deep/ .uni-scroll-view-content {
        display: flex;
        justify-content: space-between;

        .children-scroll {
          .uni-scroll-view-content {
            flex-direction: column !important;
            justify-content: flex-start !important;
          }
        }

      }
    }
  }

  .school-list {
    .school-item {
      border-bottom: 1px solid rgba(102, 102, 102, .1);
    }
  }

  .car-icon {
    width: 85rpx;
    height: 85rpx;
    position: fixed;
    right: 50rpx;
    bottom: 200rpx;
  }
}
</style>
