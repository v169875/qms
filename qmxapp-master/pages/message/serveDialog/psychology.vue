<template>
    <view  class="navbar-title">
      <top-navbar title="联系客服" ></top-navbar>
      <view class="content">
        <p>
          <view class="header_s"><strong>启明星图公众号</strong></view>
          <view class="header_x">关注【启明星图】官方公众号,</view>
          <view class="header_x">即可联系客服进行投诉或反馈,</view>
        </p>
  
        <p><image src="https://oss.fqqmx.com/921663815706_.pic.jpg" style="width: 560rpx;height: 560rpx;" ></image></p>
  
        <view class="middle">
          <view  class="middle_l"   type="default" @click="copy()">复制并关注</view>
          <view class="middle_r"><a href="tel:0558-5666020"  style="text-decoration:none;color: rgb(160,200,223);">联系客服</a></view>
          <!-- <view  class="middle_r"   @click="call_phone">联系客服</view> -->
  
        </view>
        <view class="box">
          <view class="under">
            点击上述按钮后，前往微信，点击右上角的<br><text>【+】</text>，选择<text>【添加朋友】</text>，选择<text>【公众</text> <br>  <text> 号】</text> ，再输入窗内粘贴文本，在搜索中<br>选择<text>【启明星图】</text>，点击关注即可。
          </view>
  
        </view>
  
      </view>
  
    </view>
  </template>
  
  <script>
  export default {
    data() {
      return {};
    },
    methods:{
      // call_phone() {
      // 	uni.makePhoneCall({
      // 		// 手机号
      // 		phoneNumber: '0558-5666020',
      // 		// 成功回调
      // 		// success: (res) => {
      // 		// 	console.log('调用成功!')
      // 		// },
      // 		// // 失败回调
      // 		// fail: (res) => {
      // 		// 	console.log('调用失败!')
      // 		// 	this.call_phone();
      // 		// 	//重复调用一次
      // 		// }
      // 	});
      // },
      copy() {
        uni.setClipboardData({
          data: 'qmxtczy',
          success: () => {
            uni.showToast({
              icon: 'none',
              title: '复制成功'
            });
            // window.location.href = "weixin://"
            plus.runtime.openURL("weixin://");
          },
        });
  
      },
    },
    onLoad() {
      // #ifdef APP-PLUS
      var height = 0; //定义动态的高度变量，如高度为定值，可以直接写
      uni.getSystemInfo({
        //成功获取的回调函数，返回值为系统信息
        success: (sysinfo) => {
          height = sysinfo.windowHeight; //自行修改，自己需要的高度 此处如底部有其他内容，可以直接---(-50)这种
        },
        complete: () => {}
      });
      var currentWebview = this.$scope.$getAppWebview(); //获取当前web-view
      setTimeout(function() {
        var wv = currentWebview.children()[0];
        //   wv.setStyle({ //设置web-view距离顶部的距离以及自己的高度，单位为px
        //     top: 80, //此处是距离顶部的高度，应该是你页面的头部
        //     height: height - 80, //webview的高度
        //   	scalable: false, //webview的页面是否可以缩放，双指放大缩小,
        //   })
      }, 500); //如页面初始化调用需要写延迟
      // #endif
    }
  }
  </script>
  
  <style lang="scss" scoped>
  
  p{
    text-align: center;
    .header_s{
      font-size: 50rpx;
      color: #000000;
      margin-top: 80rpx;
    }
  
    .header_x{
      font-size: 30rpx;
      margin-top: 15rpx;
    }
  }
  
  .navbar-title{
    .middle{
      display: flex;
      justify-content: space-between;
      .middle_l{
        height: 100rpx;
        line-height:100rpx;
        margin-left: 50rpx;
        font-size: 35rpx;
        text-align: center;
        width: 40%;
        color: rgb(160,200,223);
        border:2rpx solid;
        border-radius:60rpx;
  
      }
      .middle_r{
        height: 100rpx;
        line-height:100rpx;
        margin-right: 50rpx;
        font-size: 35rpx;
        text-align: center;
        width: 40%;
        color: rgb(160,200,223);
        border:2rpx solid;
        border-radius:60rpx;
      }
    }
    .box{
		position: relative;
      margin: auto;
      padding: 10px;
      border-radius:15rpx;
      margin-top: 40rpx;
      background-color: rgb(247,247,247);
      width: 600rpx;
      height: 200rpx;
      .under{
		  position: absolute;
        font-size: 30rpx;
        text-align: center;
        text{
          color: rgb(160,200,223);
        }
      }
    }

  }
  </style>
  