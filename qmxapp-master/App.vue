<script>
  //#ifdef APP-PLUS
  import {initJypush} from 'utils/jiguang.js'
  //#endif
	export default {
		globalData:{
			// 按钮颜色实心
			customStyle1:{
				background: '#3077FB',
				color:'#fff',
				borderColor:'#3077FB',
			},
			// 按钮颜色实心
			customStyle2:{
				background: '#F6F5FA',
				color:'#464D8F',
				borderColor:'#464D8F',
			},
			// 使用方法  html
			// <view class="dyan-btn">
			// 	<view class="btn-1">
			// 		<u-button :custom-style="customBtnStyle1" shape="circle" :hair-line="false">支付</u-button>
			// 	</view>
			// </view>
			// 使用方法 js
			// customBtnStyle1:getApp().globalData.customStyle1,
		},
		onLaunch: function() {
			// #ifdef APP-PLUS
				// 锁定屏幕方向
				plus.screen.lockOrientation('portrait-primary');
        // 极光推送
        this.setPermissions()
        initJypush();
        // // 极光推送-init
        // skJGPush.initJPushService()
        
        // // 极光推送-打开debug
        // skJGPush.openDebug()
        
        // // 极光推送-获取rid
        // skJGPush.getRegistrationID(result => {
        // 	console.log('【业务getRegistrationID】', result)
        // 	// 设置别名
        // 	skJGPush.setAlias({
        // 		'alias': result,
        // 		'sequence': 1
        // 	})
        // 	uni.setStorageSync('skJGRegistrationID', result);
        // })
        
        // // 极光推送-通知事件回调
        // skJGPush.addNotificationListener(result => {
        // 	console.log('【业务addNotificationListener】', result)
        // })
        
        // // 极光推送-标签别名事件回调
        // skJGPush.addTagAliasListener(result => {
        // 	console.log('【业务addTagAliasListener】', result)
        // })
			// #endif
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
      this.getDecrypt();
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods:{
      // 解密分享信息
      getDecrypt(){
        let token = uni.getStorageSync('token');
        if(token){
          uni.getClipboardData({
          	success:(res)=> {
              // 如果剪切板第一条为启明星图，就不执行以下操作
              if(res.data == '启明星图') return;
              // 截取加密信息
              let getBetweenStr = (originStr, beginStr, endStr) => (originStr.match(new RegExp(`${beginStr}(\\S*)${endStr}`)) || [, ""])[1];
              // 截取到的字符串
              let sliceData = getBetweenStr(res.data,'#','#');
              // 如果没截取到加密信息,证明剪切板里没有分享的加密链接，不执行下面所有操作
              if(sliceData == '') return;
              try{
                let decrypt = JSON.parse(this.AES.decrypt(sliceData,'1234567891234567','1234567891234567'));
                // 判断是不是自己分享的
                if(decrypt.shareId != uni.getStorageSync('userInfo').id){
                  let url = '';
                  let params = {};
                  // 判断分享的类型
                  switch(decrypt.shareType){
                    case 'video':  //分享的视频
                      this.getVideoDetail(decrypt.goodsId);
                      return
                      break;
                    case 'course':  //分享的课程
                      url = '/pages/index/organizationDetail/courseDetail/courseDetail';
                      params = {
                        classes_id:decrypt.goodsId,
                        shareId:decrypt.shareId,
                      };
                      break;
                    case 'store':  //分享的机构/店铺
                      url = '/pages/index/organizationDetail/organizationDetail';
                      params = {
                        school_id:decrypt.goodsId,
                      };
                      break;
                    case 'coupon':  //分享的代金券
                      url = '/pages/index/organizationDetail/voucherDetail/voucherDetail';
                      params = {
                        shareId:decrypt.shareId,
                      };
                      break;
                    case 'groupOrder': //分享的拼团订单
                      url = '/pages/mine/order/orderDetail/orderDetail';
                      params = {
                        order_id:decrypt.goodsId,
                        order_class:decrypt.order_class,
                      };
                      break;
                  }
                  // 修改第一条剪切板信息，以免下次进入还跳
                  uni.setClipboardData({
                  	data: '启明星图',
                  	success: () => { //复制成功的回调函数
                      uni.hideToast();
                    }
                  });
                  this.$u.route({
                    url,
                    params,
                  });
                }else{
                  return;
                  console.log('是我自己分享的',decrypt)
                }
              }catch(err){
                this.$u.toast('此分享链接无效')
                // 修改第一条剪切板信息，以免下次进入还跳
                uni.setClipboardData({
                	data: '启明星图',
                	success: () => { //复制成功的回调函数
                    
                	}
                });
                console.log('此分享链接无效',);
              }
          	},
          	fail:(res)=> {
          		// 内容获取失败
          	},
          });
        }else{
          console.log('11111111',token)
        }
        // decrypt = AES.AES.decrypt(encrypt,'1234567891234567','1234567891234567')
      },
      // 获取视频详情
      async getVideoDetail(id){
        let data = {
          video_id:id,
        };
        const res = await this.$api.videoDetail(data);
        if(res.code == 1){
          let videoList = [];
          let detail = res.data;
          let url = '';
          let params = {};
          this.$set(detail,'isplay',true); //是否播放音频
          this.$set(detail,'isShowProgressBarTime',false); //是否显示进度条（默认这个即可）
          this.$set(detail,'state','pause'); //初始状态标志（不改）
          this.$set(detail,'isShowimage',false); //是否显示封面（默认这个即可）
          this.$set(detail,'playIng',false); //播放（默认这个即可）
          videoList.push(detail);
          uni.setStorageSync("List",videoList);
          uni.setStorageSync("dataList",videoList);
					// #ifdef APP-PLUS
						url = '/pages/mine/mineVideo/mineVideoList/mineVideoList';
					// #endif
         // #ifdef H5
					url = '/pages/mine/mineVideo/mineVideoListH5/mineVideoList';
         // #endif
          params = {
            option:0,
            index:0,
            isShareVideo:true,  //分享视频，进入视频详情后不执行其他操作
          };
          // 修改第一条剪切板信息，以免下次进入还跳
          uni.setClipboardData({
          	data: '启明星图',
          	success: () => { //复制成功的回调函数
              
          	}
          });
          this.$u.route({
            url,
            params,
          });
        }
      },
			// 获取用户信息方法定义一次，多处共用
			async getUserInfo(){
				const res = await this.$api.userInfo();
				if(res.code == 1){
					let userInfo = res.data;
					uni.setStorageSync('userInfo',userInfo);
					uni.$emit('userInfo',userInfo);
				}
			},
      //	检测支付方式
      checkPayType(index){
      	let str = '';
      	switch(index){
      		case 0: 	// 微信 
            str = 'wechat';
      			break;
      		case 1: 	//	支付宝
      			str = 'alipay';
      			break;
      	}
      	return str
      },
      
      /**
       * 设置手机通知权限
       */
      setPermissions() {
      	// #ifdef APP-PLUS  
      	if (plus.os.name == 'Android') { // 判断是Android
      		var main = plus.android.runtimeMainActivity();
      		var pkName = main.getPackageName();
      		var uid = main.getApplicationInfo().plusGetAttribute("uid");
      		var NotificationManagerCompat = plus.android.importClass(
      			"android.support.v4.app.NotificationManagerCompat");
      		//android.support.v4升级为androidx
      		if (NotificationManagerCompat == null) {
      			NotificationManagerCompat = plus.android.importClass(
      			"androidx.core.app.NotificationManagerCompat");
      		}
      		var areNotificationsEnabled = NotificationManagerCompat.from(main).areNotificationsEnabled();
      		// 未开通‘允许通知’权限，则弹窗提醒开通，并点击确认后，跳转到系统设置页面进行设置  
      		if (!areNotificationsEnabled) {
      			uni.showModal({
      				title: '通知权限开启提醒',
      				content: '您还没有开启通知权限，无法接受到消息通知，请前往设置！',
      				showCancel: false,
      				confirmText: '去设置',
      				success: function(res) {
      					if (res.confirm) {
      						var Intent = plus.android.importClass('android.content.Intent');
      						var Build = plus.android.importClass("android.os.Build");
      						//android 8.0引导  
      						if (Build.VERSION.SDK_INT >= 26) {
      							var intent = new Intent('android.settings.APP_NOTIFICATION_SETTINGS');
      							intent.putExtra('android.provider.extra.APP_PACKAGE', pkName);
      						} else if (Build.VERSION.SDK_INT >= 21) { //android 5.0-7.0  
      							var intent = new Intent('android.settings.APP_NOTIFICATION_SETTINGS');
      							intent.putExtra("app_package", pkName);
      							intent.putExtra("app_uid", uid);
      						} else { //(<21)其他--跳转到该应用管理的详情页  
      							intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
      							var uri = Uri.fromParts("package", mainActivity.getPackageName(),
      							null);
      							intent.setData(uri);
      						}
      						// 跳转到该应用的系统通知设置页  
      						main.startActivity(intent);
      					}
      				}
      			});
      		}
      	} else if (plus.os.name == 'iOS') { // 判断是ISO IOS通知暂时不行
      		// var isOn = undefined;
      		// var types = 0;
      		// var app = plus.ios.invoke('UIApplication', 'sharedApplication');
      		// var settings = plus.ios.invoke(app, 'currentUserNotificationSettings');
      		// if (settings) {
      		// 	types = settings.plusGetAttribute('types');
      		// 	plus.ios.deleteObject(settings);
      		// } else {
      		// 	types = plus.ios.invoke(app, 'enabledRemoteNotificationTypes');
      		// }
      		// plus.ios.deleteObject(app);
      		// isOn = (0 != types);
      		// if (isOn == false) {
      		// 	uni.showModal({
      		// 		title: '通知权限开启提醒',
      		// 		content: '您还没有开启通知权限，无法接受到消息通知，请前往设置！',
      		// 		showCancel: false,
      		// 		confirmText: '去设置',
      		// 		success: function(res) {
      		// 			if (res.confirm) {
      		// 				var app = plus.ios.invoke('UIApplication', 'sharedApplication');
      		// 				var setting = plus.ios.invoke('NSURL', 'URLWithString:', 'app-settings:');
      		// 				plus.ios.invoke(app, 'openURL:', setting);
      		// 				plus.ios.deleteObject(setting);
      		// 				plus.ios.deleteObject(app);
      		// 			}
      		// 		}
      		// 	});
      		// }
      	}
      	// #endif  
      }
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "uview-ui/index.scss";
	@import 'colorui/animation.css';
	@import "colorui/main.scss";
	@import "colorui/common.scss";
	/*坑：解决iphoneX等大屏手机底部小黑条挡住tab的解决方法：安全区域距离底部边界距离env() 跟 constant() 需要同时存在，而且顺序不能换。*/
	/* #ifdef H5 */
	body {
	  padding-bottom: constant(safe-area-inset-bottom);
	  /* 兼容 iOS < 11.2 */
	  padding-bottom: env(safe-area-inset-bottom);
	  /* 兼容 iOS >= 11.2 */
	}
	/* #endif */
	scroll-view,view{
		box-sizing: border-box;
	}
	.uni-status-bar {
		position: sticky;
		top: 0;
		width: 100%;
		height: var(--status-bar-height);
	}
	.hidden_two {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		display: -moz-box;
		-moz-line-clamp: 2;
		-moz-box-orient: vertical;
		word-wrap: break-word;
		word-break: break-all;
		white-space: normal;
	}
	.hidden_one {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		display: -moz-box;
		-moz-line-clamp: 1;
		-moz-box-orient: vertical;
		word-wrap: break-word;
		word-break: break-all;
		white-space: normal;
	}
	.middleC {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}
	.main-color{
		color: #3077FB;
	}
	.main-bg-color{
		background: #3077FB;
	}
	.card-module{
		background: #ffffff;
		border-radius: 20rpx;
		overflow: hidden;
		margin: 0 34rpx;
	}
	.course-list{
		padding: 0 34rpx;
		display: flex;
		flex-wrap: wrap;
		// justify-content: space-between;
	}
	.dyan-btn{
		width: 100%;
		>view{
			padding: 0 34rpx;
		}
		.btn-1{
			margin-bottom: 33rpx;
			/deep/.u-default-hover{
				color: #fff !important;
				background: #4597fb !important;
				border-color: #4597fb !important;
			}
		}
		.btn-2{
			/deep/.u-default-plain-hover{
				color: #fff !important;
				background: rgba(145, 149, 195, 0.3) !important;
				border-color: rgba(145, 149, 195, 0.3) !important;
			}
		}
	}
	.u-tabbar{
		/deep/ .u-tabbar__content{
			box-shadow: 0rpx 0rpx 32rpx -14rpx #999;
			.u-tabbar__content__item{
				.u-tabbar__content__item__button{
					top: 12rpx !important;
				}
				.u-tabbar__content__item__text{
					font-size: 20rpx;
          bottom: 8rpx;
				}
			}
		}
	}
	.text-through{
		text-decoration:line-through;
	}
	.comment-list{
		padding-left: 30rpx;
	}
	// 带底部图标的中间标题
	.activity-title{
		position: relative;
	}
	.activity-title::after{
		content: '';
		display: block;
		position: absolute;
		left: 50%;
		bottom: -4rpx;
		transform: translateX(-50%);
		width: 87rpx;
		height: 16rpx;
		border-radius: 30rpx;
		background: linear-gradient(to bottom, rgba(0,0,0,0),#6096FC);
	}
</style>
