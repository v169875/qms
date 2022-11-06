<template>
  <view>
    <top-navbar title="商家后台"></top-navbar>
    <web-view :src="src">
      <cover-view>123456</cover-view>
    </web-view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        src: 'https://h.fqqmx.com/',
      };
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
        wv.setStyle({ //设置web-view距离顶部的距离以及自己的高度，单位为px
          top: 80, //此处是距离顶部的高度，应该是你页面的头部
          height: height - 80, //webview的高度
        	scalable: false, //webview的页面是否可以缩放，双指放大缩小,
        })
      }, 500); //如页面初始化调用需要写延迟
      // #endif
    }
  }
</script>

<style lang="scss" scoped>

</style>
