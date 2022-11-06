<template>
	<!-- 系统设置 -->
	<view>
    <view v-if="isMask">
      <view v-if="index==4">
        <popup type="4" :version="version" :content="desc" @close="closeMask()" :forceUpdate="forceUpdate"
               @eventClick="update()">
        </popup>
      </view>
    </view>
		<top-navbar :title="title"></top-navbar>
		<u-cell-group>
			<u-cell-item title="安全中心" :title-style="titleStyle" @click="handleCellItem(1)"></u-cell-item>
			<u-cell-item title="消息通知" :arrow="false" :title-style="titleStyle">
				<u-switch v-model="switchChecked" size="30"></u-switch>
			</u-cell-item>
			<u-cell-item title="检查更新" :title-style="titleStyle" @click="handleCellItem(3)"></u-cell-item>
			<u-cell-item title="关于我们" :title-style="titleStyle" @click="handleCellItem(4)"></u-cell-item>
			<u-cell-item title="用户协议" :title-style="titleStyle" @click="handleCellItem(5)"></u-cell-item>
			<u-cell-item title="隐私政策" :title-style="titleStyle" @click="handleCellItem(6)"></u-cell-item>
		</u-cell-group>
		<u-gap height="160"></u-gap>
		<view class="dyan-btn">
			<view class="btn-1">
				<u-button :custom-style="customBtnStyle1" shape="circle" :hair-line="false" @click="handleLogOut()">退出登录</u-button>
			</view>
		</view>
		<u-modal v-model="logoutModal" content="是否退出登录？" show-cancel-button @confirm="handleConfirmLogout()"></u-modal>
	</view>
</template>

<script>
import popup from "@/components/ge-popup.vue"
	export default {
    components: {
      popup
    },
		data() {
			return {
        isMask: true, //是否显示弹窗
        index: 2, //显示第几个弹窗
        content: '公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容',
        version: '1.0',
        desc: '1.更新内容更新内容 <br/> 2.更新内容更新内容 <br/>2.更新内容更新内容',
        forceUpdate: false,
        downloadUrl: '',
				title:'系统设置',
				titleStyle:{
					fontSize:'28rpx',
					color:'#000',
				},
				customBtnStyle1:getApp().globalData.customStyle1,
				switchChecked:false,
				logoutModal:false, //退出登录模态框显示
			};
		},
		methods:{
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
        } else {
          this.$u.toast('已经是最新版本了~');
        }
      },
      update() {
        // 安卓直接下载文件打开
        if (plus.os.name == 'Android') {
          uni.showLoading({
            title: '安装包下载中……',
            mask: true
          })
          const _this = this
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
      closeMask() { //关闭弹窗
        this.isMask = false;
      },
			// 点击每项
			handleCellItem(index){
				let url = '';
        let params = {};
				switch(index){
					case 1: // 安全中心
						url = '/pages/mine/sysSetting/safeCenter/safeCenter';
						break;
					case 3: // 检查更新
            // #ifdef APP-PLUS
            this.initUpdate();
            //#endif
						break;
					case 4: // 关于我们
					case 5: // 用户协议
					case 6: // 隐私政策
						url = '/pages/login/agreement';
            params = {
              agreType:index
            }
						break;
				};
				this.$u.route({
					url:url,
          params:params,
				})
			},
			// 退出登录
			handleLogOut(){
				this.logoutModal = true;
			},
			// 确认退出登录
			async handleConfirmLogout(){
				const res = await this.$api.logout();
				if(res.code == 1){
					// uni.clearStorageSync();
          // 不能全部清除，保留  regs_id
          uni.removeStorageSync('dataList');
          uni.removeStorageSync('List');
          uni.removeStorageSync('nowImage');
          uni.removeStorageSync('likeImage');
          uni.removeStorageSync('nowTimeEmojiList');
          uni.removeStorageSync('location');
          uni.removeStorageSync('allAddress');
          uni.removeStorageSync('token');
          uni.removeStorageSync('userInfo');
          uni.removeStorageSync('user');
          uni.removeStorageSync('videoID');
          uni.removeStorageSync('skJGRegistrationID');
					this.$u.toast(res.msg);
					setTimeout(()=>{
						this.$u.route({
							url:'/pages/login/login',
						})
					},500);
				}
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
