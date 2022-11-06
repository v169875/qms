<template>
  <!-- 我的核销 -->
  <view>
    <top-navbar :title="title" :isShowBorder="true"></top-navbar>
    <u-cell-group :border="false">
      <u-cell-item title="核销类型:" :title-style="titleStyle" :value="verifiList[verifiIndex].label" @click="handleCellItem(0)"></u-cell-item>
			<!-- <u-cell-item v-show="verifiIndex==1" title="核销数量:" :arrow="false" :title-style="titleStyle">
			  <u-input v-model="num" type="number" :clearable="false" placeholder="请输入核销数量" inputAlign="right"></u-input>
			</u-cell-item> -->
      <u-cell-item title="核销码核销:" :arrow="false" :title-style="titleStyle">
        <u-input v-model="verifiValue" :clearable="false" placeholder="请输入核销码" inputAlign="right"></u-input>
      </u-cell-item>
      <u-cell-item title="扫码核销:" :title-style="titleStyle" value="点击即可扫码核销" @click="handleCellItem(2)"></u-cell-item>
    </u-cell-group>
    <u-gap height="200"></u-gap>
    <u-select v-model="selectVerifShow" :list="verifiList" @confirm="handleVerifiSelect"></u-select>
    <view class="dyan-btn">
    	<view class="btn-1">
    		<u-button :custom-style="customBtnStyle1" shape="circle" :hair-line="false" @click="handleVerifiCation()">确认核销</u-button>
    	</view>
    </view>
		<u-popup class="join-group-popup" v-model="hexiaoShow" mode="center" width="86%" border-radius="20"
			@close="closePop">
			<view class="order-module-card sheet-card ">
				<view class="pop-title">订单编号：{{hexiaoInfo.out_trade_no}}</view>
				<view v-for="(item,index) in hexiaoInfo.list" class="car-list-item boxsizing flex">
					<view class="pop-icon">
						<uni-icons @click="chooseItem(item.id)" :type="item.checked?'checkbox-filled':'circle'"
							:color="item.checked?'#3077FB':'#8B8B8B'" size="20"></uni-icons>
					</view>
					<image class="goods-img" :src="item.classes_cover_image_format"></image>
					<view class="car-list-item-txt u-font-26">
						<view class="car-list-item-name">{{item.classes_name}}</view>
						<view class="goods-price">可核销次数：{{item.can_num}}</view>
					</view>
					<view class="car-list-item-btns flex flex-c">
						<u-number-box v-model="item.num" :longPress="false" :asyncChange="true" :min="0" :max="item.can_num" integer></u-number-box>
					</view>
				</view>
				<u-button :custom-style="customBtnStyle1" shape="circle" :hair-line="false" @click="orderHexiao()">确认核销</u-button>
			</view>
		</u-popup>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        title:'我的核销',
        titleStyle:{
        	fontSize:'28rpx',
        	color:'#000',
        },
        verifiList:[
          {
            value: '1',
            label: '代金券',
          },
          {
            value: '2',
            label: '体验/课程',
          },
          {
            value: '3',
            label: '拼团订单',
          },
        ],
        verifiIndex:0,
        verifiValue:'', //核销码
        selectVerifShow:false, 
        customBtnStyle1:getApp().globalData.customStyle1,
				num: 1, // 核销数量
				hexiaoShow: false,
				hexiaoInfo: {},
				qrcodeInfo: null
      };
    },
    methods:{
      // 点击扫码核销
      handleCellItem(index){
        switch(index){
          case 0:
            this.selectVerifShow = !this.selectVerifShow;
            break;
          case 2:
						// #ifndef H5
            uni.scanCode({
            	success:(res)=>{
                let qrcodeInfo = res.result.split(',');
                if(qrcodeInfo[1] != '1' || qrcodeInfo[1] != '2' || qrcodeInfo[1] != '3'){
									if(this.verifiIndex == 1) {
										this.qrcodeInfo = qrcodeInfo
										this.hexiao(qrcodeInfo);
									} else {
										switch(qrcodeInfo[1]){
										  case '1': //代金券核销
										  case '2': //体验/课程订单核销
										  case '3': //拼团订单核销
										    this.handleCouponVerification(qrcodeInfo);
										    break;
										}
									}
                }else{
                  this.$u.toast(`二维码不正确`)
                }
            	}
            });
						// #endif
						// #ifdef H5
						uni.navigateTo({
							url: "./h5Qrcode?verifiIndex="+this.verifiIndex
						})
						// #endif
            break;
        }
      },
      // 点击切换核销类型
      handleVerifiSelect(e){
        this.verifiIndex = (e[0].value * 1) - 1;
				console.log(this.verifiIndex)
      },
      // 核销订单
      async handleCouponVerification(qrcodeInfo){
        uni.showLoading({
          title:'订单核销中，请稍后···',
          mask: true
        })
        let data = {
          verification_qrcode:qrcodeInfo[0],
          verification_type:qrcodeInfo[1],
					// num: this.num
        };
        const res = await this.$api.schoolVerificationOrder(data);
        if(res.code == 1){
          this.$u.toast(res.msg);
          this.verifiValue = '';
          uni.hideLoading();
        }
      },
      // 点击确认核销
      handleVerifiCation(){
        if(this.verifiValue == ''){
          this.$u.toast(`请输入核销码`);
          return;
        };
        let qrcodeInfo = [this.verifiValue,this.verifiIndex + 1];
				this.qrcodeInfo = qrcodeInfo
        if(this.verifiIndex == 1) {
					this.hexiao(qrcodeInfo);
				} else {
					this.handleCouponVerification(qrcodeInfo);
				}
      },
			// 关闭弹窗
			closePop() {
				console.log('关闭')
			},
			chooseItem(id) {
				this.hexiaoInfo.list.forEach(item=>{
					if(item.id == id) item.checked = !item.checked
				})
			},
			// 查询核销
			async hexiao(qrcodeInfo) {
				uni.showLoading({
					title: '订单查询中，请稍后···',
					mask: true
				})
				let data = {
					verification_qrcode: qrcodeInfo[0],
					verification_type: qrcodeInfo[1],
					// num: this.num
				};
				const res = await this.$api.schoolOrderGood(data);
				if (res.code == 1) {
					let list = res.data.list.map(item=>{
						item.checked = false
						item.num = 0
						return item
					})
					this.hexiaoInfo = {
						list,
						...res.data
					}
				}
				this.hexiaoShow = true;
			},
			// 订单核销
			async orderHexiao() {
				uni.showLoading({
					title: '订单核销中，请稍后···',
					mask: true
				})
				let ids = []
				this.hexiaoInfo.list.forEach(item=>{
					if(item.checked) {
						ids.push({
							id: item.id,
							num: item.num
						})
					}
				})
				let data = {
					verification_qrcode: this.qrcodeInfo[0],
					verification_type: this.qrcodeInfo[1],
					ids
					// num: this.num
				};
				console.log(data)
				const res = await this.$api.schoolVerificationOrder(data);
				if(res.code == 1){
				  this.$u.toast(res.msg);
				  this.verifiValue = '';
				  uni.hideLoading();
					this.hexiaoShow = false;
				}
			}
    }
  }
</script>

<style lang="scss" scoped>
	.order-module-card {
		/deep/ .u-btn {
			background: rgb(48, 119, 251);
			color: rgb(255, 255, 255);
			border-color: rgb(48, 119, 251);
		}
		padding: 20rpx;
		.pop-icon {
			align-self: center;
		}
		.pop-title {
			font-size: 26rpx;
			font-weight: 500;
			margin-bottom: 20rpx;
		}
		.goods-img {
			width: 152rpx;
			height: 152rpx;
			border-radius: 10rpx;
			margin: 0 10rpx;
		}
		.car-list-item {
			margin: 20rpx 0;
		}
		.car-list-item-txt {
			display: flex;
			flex-direction: column;
			.goods-price {
				margin-top: 30rpx;
			}
		}
		.car-list-item-btns {
			align-self: flex-end;
		}
	}
</style>
