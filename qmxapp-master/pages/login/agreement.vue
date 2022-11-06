<template>
  <!-- 关于我们，用户协议，隐私政策，商家入驻协议 -->
  <view class="agreement-content">
    <top-navbar :title="title" :isShowBorder="true"></top-navbar>
    <view class="p-30">
      <u-parse :html="aboutDetail"></u-parse>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        title:'',
        agreType:1,
        aboutDetail:'', //协议详情
      };
    },
    onLoad(options) {
      if(options.agreType){
        this.agreType = options.agreType * 1;
        this.getAgreDetail(this.agreType);
      }
    },
    methods:{
      // 获取协议详情
      async getAgreDetail(type){
        const res = await this.$api.about();
        if(res.code == 1){
          switch(type){
            case 4: //关于我们
              this.aboutDetail = res.data.about;
              this.title = '关于我们';
              break;
            case 5: //隐私协议
              this.aboutDetail = res.data.user_service;
              this.title = '用户协议';
              break;
            case 6: //用户协议
              this.aboutDetail = res.data.private_protocol;
              this.title = '隐私协议';
              break;
            case 7: //商户入驻协议
              this.aboutDetail = res.data.school_protocol;
              this.title = '商户入驻协议';
              break;
			  case 8: //首页登陆页面标题
			    this.aboutDetail = res.data.denglu;
			    this.title = '登陆页面公告';
			    break;
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .agreement-content{
    
  }
</style>
