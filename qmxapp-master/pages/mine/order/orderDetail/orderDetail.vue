<template>
	<!-- 订单详情 -->
	<view class="order-detail-content">
		<top-navbar :title="title"></top-navbar>
		<u-gap height="59"></u-gap>
    <!-- 订单正常状态显示 -->
		<view class="font-34 text-bold text-center blue-color" v-if="orderDetail.is_refund == 0 && orderDetail.status != 6">{{orderDetail.status | orderStatusType(1,order_class)}}</view>
		<!-- 订单退款状态显示 -->
    <view class="font-34 text-bold text-center blue-color" v-else>{{orderDetail.is_refund | orderRefundType(orderDetail.status)}}</view>
		<u-gap height="50"></u-gap>
		<view class="order-module-card goods-card">
			<view class="flex col-center row-between text-333 font-28">
				<view class="">购买人：{{orderDetail.real_name || '暂无'}}</view>
				<view class="">{{orderDetail.phone || '--'}}</view>
			</view>
			<view class="p-t-22 p-b-24 flex col-center" v-if="orderDetail.school">
				<u-image width="64rpx" height="64rpx" border-radius="8" mode="aspectFit" :src="orderDetail.school.school_cover_image_format"></u-image>
				<view class="m-l-20 text-bold">{{orderDetail.school.school_name}}</view>
			</view>
			<template v-if="orderDetail.order_type == 2">
				<view class="" v-if="orderDetail.classes_info">
					<view v-for="(item,index) in orderDetail.classes_info" class="flex u-row-between m-b-10">
						<u-image width="138rpx" height="138rpx" border-radius="10" :src="item.classes_info.classes_cover_image_format" mode="aspectFit"></u-image>
						<view class="hidden_two goods-title font-30 m-l-12">
							<view>{{item.classes_info.classes_name || '暂无'}}</view>
							<view class="u-font-24">共{{item.num}}次，可用{{item.can_num}}次</view>
						</view>
						<!-- <view class="blue-btn" v-if="orderDetail.status == 2" @tap="hexiao(index)">核销</view> -->
					</view>
					<view class="text-right">
						<text class="text-333 font-26">付款金额：</text>
						<text class="text-333 font-27 text-bold blue-color">
							<text>￥</text>
							<text class="font-37">{{orderDetail.total_price || 0}}</text>
						</text>
					</view>
				</view>
			</template>
			<template v-else>
				<view class="flex col-center" v-if="orderDetail.classes_info">
					<u-image width="138rpx" height="138rpx" border-radius="10" :src="JSON.parse(orderDetail.classes_info).classes_cover_image_format" mode="aspectFit"></u-image>
					<view class="u-flex-1 m-l-34">
						<view class="hidden_two goods-title font-30">{{JSON.parse(orderDetail.classes_info).classes_name || '暂无'}}</view>
						<view class="text-right">
							<text class="text-333 font-26">付款金额：</text>
							<text class="text-333 font-27 text-bold blue-color">
								<text>￥</text>
								<text class="font-37">{{orderDetail.total_price || 0}}</text>
							</text>
						</view>
					</view>
				</view>
			</template>
		</view>
		<template v-if="orderDetail.order_type == 2">
			<view v-if="orderDetail.status == 2">
				<view class="order-module-card sheet-card m-t-30 p-t-38 p-b-48 flex col-center row-center">
					<view class="sheet-item flex col-center row-center flex-col text-333 font-26">
						<view class="p-b-14">核销二维码</view>
						<!-- <view class="p-b-14"> (共{{orderDetail.total_num || 0}}次还可以{{orderDetail.can_num || 0}}次）</view> -->
						<view class="p-b-14">{{orderDetail.qrcode}}</view>
						<u-image width="200rpx" height="200rpx" border-radius="4" :src="orderDetail.qrcode_img" mode="aspectFit"></u-image>
					</view>
					<!-- <view class="center-line"></view> -->
					<!-- <view class="sheet-item flex col-center row-center flex-col text-333 font-26">
						<view class="p-b-14">核销码</view>
						<view class="p-b-14"> (共{{hexiaoInfo.total_num || 0}}次还可以{{hexiaoInfo.can_num || 0}}次）</view>
						<view class="flex col-center" style="min-height: 100rpx;">
							<view class="sheet-num flex row-center">{{hexiaoInfo.qrcode || 0}}</view>
						</view>
					</view> -->
				</view>
			</view>
		</template>
		<template v-else>
			<view class="order-module-card sheet-card m-t-30 p-t-38 p-b-48 flex col-center row-center" v-if="orderDetail.status == 2">
				<view class="sheet-item flex col-center row-center flex-col text-333 font-26">
					<view class="p-b-14">核销二维码</view>
					<view class="p-b-14"> (共{{orderDetail.total_num || 0}}次还可以{{orderDetail.can_num || 0}}次）</view>
					<u-image width="100rpx" height="100rpx" border-radius="4" :src="orderDetail.qrcode_img" mode="aspectFit"></u-image>
				</view>
				<view class="center-line"></view>
				<view class="sheet-item flex col-center row-center flex-col text-333 font-26">
					<view class="p-b-14">核销码</view>
					<view class="p-b-14"> (共{{orderDetail.total_num || 0}}次还可以{{orderDetail.can_num || 0}}次）</view>
					<view class="flex col-center" style="min-height: 100rpx;">
						<view class="sheet-num flex row-center">{{orderDetail.qrcode || 0}}</view>
					</view>
				</view>
			</view>
		</template>
		<u-gap height="30"></u-gap>
		<view class="order-module-card order-info-card p-t-34 p-b-34 p-l-30 p-r-30">
			<view class="order-info-row">
				<view class="">订单编号：</view>
				<view class="">{{orderDetail.out_trade_no || '--'}}</view>
			</view>
			<view class="order-info-row">
				<view class="">订单状态：</view>
        <!-- 正常订单显示 -->
				<view class="" v-if="orderDetail.is_refund == 0 && orderDetail.status != 6">
          <!-- 拼团订单显示 -->
          <text v-if="order_class == 2">（{{orderDetail.join_count + '/' + JSON.parse(orderDetail.classes_info).group_people}}人拼团）</text>
          <text>{{orderDetail.status | orderStatusType(2,order_class)}}</text>
        </view>
        <!-- 退款订单显示 -->
        <view class="" v-else>{{orderDetail.is_refund | orderRefundType(orderDetail.status)}}</view>
			</view>
			<view class="order-info-row">
				<view class="">下单时间：</view>
				<view class="">{{orderDetail.createtime_format || '--'}}</view>
			</view>
			<view class="order-info-row">
				<view class="">付款时间：</view>
				<view class="">{{orderDetail.pay_time_format || '--'}}</view>
			</view>
			<view class="order-info-row">
				<view class="">支付方式：</view>
				<view class="">{{orderDetail.pay_way == 'alipay' || orderDetail.pay_way == 'alipay_h5' ? '支付宝支付' : orderDetail.pay_way == 'wechat'  || orderDetail.pay_way == 'wechat_h5' ? '微信支付' : '其他支付'}}</view>
			</view>
			<view class="order-info-row" v-if="orderDetail.status > 2 && orderDetail.status < 8">
				<view class="">完成时间：</view>
				<view class="">{{orderDetail.success_time_format || '--'}}</view>
			</view>
      <view class="order-info-row" v-if="orderDetail.address">
        <view class="">收货地址：</view>
        <view class="">{{orderDetail.address || '--'}}</view>
      </view>
		</view>
		<u-gap height="147"></u-gap>
		<view class="order-detail-bottom flex col-center row-between p-l-22 p-r-34 p-t-14 p-b-16" v-if="orderDetail.status == 2 || orderDetail.status == 8">
			<view class="flex col-center font-20">
			  <view class="left-index" @tap="handleRouteIndex()">
			  	<image src="/static/mine/index-order-icon.png" mode="aspectFit"></image>
			  	<view class="m-t-4">首页</view>
			  </view>
			  <view class="left-index m-l-30" v-if="orderDetail.status == 8" @tap="handleShareOrder()">
			  	<image src="/static/mine/share-order-icon.png" mode="aspectFit"></image>
			  	<view class="m-t-4">分享</view>
			  </view>
			</view>
			<view class="flex col-center right-btn text-white font-28">
        <block v-if="userInfo.id == orderDetail.user_id">
          <view class="gray-btn" @tap="showPop()">申请退款</view>
          <view class="blue-btn m-l-30" @tap="handleRouteBack()">返回订单</view>
        </block>
				<block v-else>
          <view class="blue-btn m-l-30" @tap="handleShowJoinGroup()" v-if="orderDetail.status == 8">参与拼团</view>
          <view class="blue-btn-disabled m-l-30" v-else>拼团已结束</view>
        </block>
			</view>
		</view>
    <!-- 共用模态框 -->
    <u-modal v-model="orderModalShow" :content="modalContent" :show-cancel-button="true" @cancel="handleCancelModal" @confirm="handleConfirmModal"></u-modal>
    <!-- 显示退款日期模态框 -->
    <u-modal v-model="orderRefundShow" :content-style="contentStyle" @confirm="handleConfirmRefund">
      <rich-text :nodes="refundModalContent"></rich-text>
    </u-modal>
    <!-- 参与拼团弹窗 -->
    <u-popup class="join-group-popup" v-model="joinGroupShow" mode="center" width="86%" border-radius="20" closeable>
      <u-gap height="30"></u-gap>
      <view class="text-center font-30 text-333 text-bold">参与拼团</view>
      <u-gap height="30"></u-gap>
      <view class="p-l-40 p-r-40 m-t-50">
        <view class="flex col-center row-between m-t-38">
        	<view class="">参与人姓名:</view>
        	<view class="font-26 text-666 flex col-center">
        		<u-input v-model="joinForm.real_name" type="text" placeholder="请输入参与人姓名" :clearable="false" :custom-style="customStyle" :border="true"></u-input>
        	</view>
        </view>
        <view class="flex col-center row-between m-t-38">
        	<view class="">参与人手机号:</view>
        	<view class="font-26 text-666 flex col-center">
        		<u-input v-model="joinForm.phone" type="number" maxlength="11" placeholder="请输入参与人手机号" :clearable="false" :custom-style="customStyle" :border="true"></u-input>
        	</view>
        </view>
        <view class="flex col-center row-between m-t-38 cash-type-row ">
        	<view class="">支付方式:</view>
        	<view class="font-26 text-666 rela">
        		<view class="select-cash-type flex row-center col-center" @tap="showPayType = !showPayType">
        			<text class="m-r-6">{{payTypeIdx != null ? payTypeTitle : '选择支付方式'}}</text>
        			<u-icon name="arrow-down-fill" color="#999999" size="15"></u-icon>
        		</view>
        		<view class="abso cash-item" v-if="showPayType" :class="{'animation-slide-top':showPayType}">
        			<view class="" v-for="(item,index) in payTypeList" :key="index" @tap="handleChangePayType(index)">
        				{{item.title}}
        			</view>
        		</view>
        	</view>
        </view>
        <view class="flex row-between m-t-38">
        	<view class="">备注:</view>
        	<view class="font-26 text-666 flex col-center">
        		<u-input v-model="joinForm.remark" type="textarea" :auto-height="true" placeholder="请输入备注" :clearable="false" :custom-style="customStyle" :border="true"></u-input>
        	</view>
        </view>
      </view>
      <u-gap height="30"></u-gap>
      <view class="dyan-btn">
      	<view class="btn-1">
      		<u-button :custom-style="customBtnStyle1" shape="circle" :hair-line="false" @tap="handleJoinGroup()">确认参团</u-button>
      	</view>
      </view>
      <u-gap height="30"></u-gap>
    </u-popup>
		
		 <u-popup class="join-group-popup" v-model="hexiaoShow" mode="center" width="86%" border-radius="20" @close="closePop">
			 <view class="order-module-card sheet-card m-t-30 p-t-38 p-b-48 flex col-center row-center">
			 	<view class="sheet-item flex col-center row-center flex-col text-333 font-26">
			 		<view class="p-b-14">核销二维码</view>
			 		<view class="p-b-14"> (共{{hexiaoInfo.total_num || 0}}次还可以{{hexiaoInfo.can_num || 0}}次）</view>
			 		<u-image width="100rpx" height="100rpx" border-radius="4" :src="hexiaoInfo.qrCodeUrl" mode="aspectFit"></u-image>
			 	</view>
			 	<view class="center-line"></view>
			 	<view class="sheet-item flex col-center row-center flex-col text-333 font-26">
			 		<view class="p-b-14">核销码</view>
			 		<view class="p-b-14"> (共{{hexiaoInfo.total_num || 0}}次还可以{{hexiaoInfo.can_num || 0}}次）</view>
			 		<view class="flex col-center" style="min-height: 100rpx;">
			 			<view class="sheet-num flex row-center">{{hexiaoInfo.qrcode || 0}}</view>
			 		</view>
			 	</view>
			 </view>
		</u-popup>
		<!-- 退款 -->
		<uni-popup ref="popup" type="center">
			<view class="pop-box">
				<view class="u-font-xl">选择退款课程</view>
				<picker @change="bindPickerChange" :value="index" :range="array" range-key="name">
					<view class="uni-input" v-if="array.length > 0">{{array[index].name}}</view>
				</picker>
				<view class="u-flex btns">
					<view @click="closepop">取消</view>
					<view @click="surepop">确定</view>
				</view>
			</view>
		</uni-popup>
  </view>
</template>

<script>
  let app = getApp();
	export default {
		data() {
			return {
				title:'订单详情',
				orderDetail:{}, //订单列表传来的订单详情
        order_id:null, //订单id
        orderModalShow:false, //模态框共用
        modalContent:'', //模态框内容共用
        orderRefundShow:false,  //退款日期模态框显示
        //退款日期模态框显示
        refundModalContent: `
          <p style="color:#333;margin-top:20px;margin-bottom:10px;font-size:16px;font-weight:bold;">操作成功</p>
          <p style="font-size:13px;color:#666666;">系统已收到你的退款申请</p>
          <p style="font-size:13px;color:#666666;margin-bottom:15px;">预计1~3个工作日内审核完毕</p>
        `,
        contentStyle:{
          textAlign:'center',
        },
        userInfo:{},
        joinGroupShow:false, //参与拼团弹窗
				hexiaoShow: false, // 核销二维码弹出
				hexiaoInfo: {}, // 核销商品信息
        joinForm:{
          real_name:'', //参与人姓名
          phone:'',  //参与人手机号
          remark:'', //备注
        },
        customStyle:{
        	width:'300rpx',
        },
        payTypeList:[
        	{title:'微信支付'},
        	{title:'支付宝支付'},
        ],
        payTypeIdx:null,
        payTypeTitle:'',
        showPayType:false,
        customBtnStyle1:getApp().globalData.customStyle1,
        location:{},  //用户位置信息
				index: 0,
				array: [{name: '全部',id: ''}]
			};
		},
		onLoad(options) {
			if(options.order_id){
        this.order_id = options.order_id * 1;
        if(options.order_class){
          this.order_class = options.order_class * 1;
          this.getOrderDetail(this.order_id,this.order_class);
        }
			}
      let userInfo = uni.getStorageSync('userInfo');
      if(userInfo){
        this.userInfo = userInfo;
      }
      let location = uni.getStorageSync('location');
      if(location){
        this.location = location;
      }
		},
    filters:{
      // 订单正常状态 1=待付款,2=待完成,3=待评价,4=已完成,5=已失效,6=退款/售后,7=已取消
      orderStatusType(status,type,order_class){  //type == 1顶部显示, ==2 底部显示当前状态
        let str = '';
        if(type == 1){
          switch(status){
            case 2: //  待完成
              str = '课程购买成功'
              break;
						case 3: //  待评价
						  str = '待评价'
						  break;
            case 4: //  已完成
              str = '课程已上完'
              break;
            case 5: //  已失效
              str = '课程已失效'
              break;
            case 8: //  拼团中
              // order_class == 1是普通订单， ==2是拼团订单
              if(order_class == 1){
                str = '订单状态错误'
              }else if(order_class == 2){
                str = '拼团中'
              }
              break;
          }
        }else if(type == 2){
          // order_class == 1是普通订单， ==2是拼团订单
          if(order_class == 1){
            switch(status){
              case 2: //  待完成
                str = '待完成'
                break;
							case 3: //  待评价
							  str = '待评价'
							  break;
              case 4: //  已完成
                str = '已完成'
                break;
              case 5: //  已失效
                str = '已失效'
                break;
            }
          }else if(order_class == 2){
            switch(status){
              case 2: // 已成团 
                str = '已成团'
                break;
							case 3: //  待评价
							  str = '待评价'
							  break;
              case 4: //  已完成
                str = '已完成'
                break;
              case 5: //  已失效
                str = '已失效'
                break;
              case 8: //  拼团中
                str = '拼团中'
                break;
            }
          }
        }
        return str;
      },
      // 订单退款状态 0=无退款,1=退款待审核,2=同意退款,3=拒绝退款
      orderRefundType(refund,status){
        let str = '';
        console.log('uuuuuuu',refund,status)
        switch(refund){
          case 0: //无退款，或者自动退款完成
            if(status == 6){
              str = '自动退款';
            }
            break;
          case 1: //  退款待审核
            str = '退款待审核'
            break;
          case 2: //  同意退款
            str = '同意退款'
            break;
          case 3: //  拒绝退款
            str = '拒绝退款'
            break;
            
        }
        return str;
      },
    },
    
    methods:{
      // 获取订单详情
      async getOrderDetail(order_id,order_class){
        let res = {};
        // order_class == 1是普通订单， ==2是拼团订单
        if(order_class == 1){
          res = await this.$api.classes_order_getOrderDetail({order_id});
        }else if(order_class == 2){
          res = await this.$api.classes_group_order_getOrderDetail({order_id});
        }else{
          this.$u.toast(`系统错误`);
          setTimeout(()=>{
            this.$u.route({
              type:'back',
            })
          },500)
          return;
        }
        if(res.code == 1){
          this.orderDetail = res.data;
					this.hexiaoInfo = res.data
          // let qrcodeInfo = {
          //   qrcode:this.orderDetail.qrcode,  //二维码数据
          //   qrcode_type:2, //二维码类型  1==代金券核销，2==体验/课程核销，3==拼团订单核销
          // };
          let qrcodeType = 2;  //2==普通订单核销，3==拼团订单核销
          if(this.order_class == 2){
            qrcodeType = 3;
          };
          let qrcodeInfo = `${this.orderDetail.qrcode},${qrcodeType}`
          this.handleCreateQrcode(qrcodeInfo);
        }
      },
			bindPickerChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.detail.value)
				this.index = e.detail.value
			},
			showPop() {
				this.$refs.popup.open('center')
				this.array = [{name: '全部',id: ''}]
				 this.orderDetail.classes_info.forEach(i => {
					this.array.push({
						name: i.classes_info.classes_name,
						id: i.classes_id
					})
				})
			},
			open() {
				// console.log('open');
			},
			close() {
				this.show = false
				// console.log('close');
			},
			closepop() {
				this.$refs.popup.close()
			},
			async surepop() {
				console.log(this.array[this.index])
				if(this.index == 0) {
					this.handleConfirmModal()
				} else {
					let data = {
						 order_id:this.order_id,
						 classes_info_id: this.array[this.index].id
					}
					let res = await this.$api.refundOneOrder(data);
					if(res.code == 1){
					  // this.$u.toast(res.msg);
					  this.orderRefundShow = true;
					}
				}
			},
      // 创建二维码
      async handleCreateQrcode(qrcodeInfo){
        let data = {
          open_link:qrcodeInfo,
          image_type:'base64',
        };
        const res = await this.$api.createQrcode(data);
        if(res.code == 1){
          this.$set(this.orderDetail,'qrcode_img',res.data);
        }
      },
      // 点击显示申请退款模态框
      handleShowRefund(){
				
        this.orderModalShow = !this.orderModalShow;
        this.modalContent = '是否确认退款？';
      },
      // 点击取消模态框
      handleCancelModal(){
        setTimeout(()=>{
          this.modalContent = '';
        },150)
      },
      // 点击确认模态框
      async handleConfirmModal(){
        let data = {
          order_id:this.order_id,
        };
        let res = {};
        // order_class == 1是普通订单， ==2是拼团订单
        if(this.order_class == 1){
          res = await this.$api.classes_order_refundOrder(data);
        }else if(this.order_class == 2){
          res = await this.$api.classes_group_order_refundOrder(data);
        }else{
          this.$u.toast(`系统错误`);
          setTimeout(()=>{
            this.$u.route({
              type:'back',
            })
          },500)
          return;
        }
        if(res.code == 1){
          // this.$u.toast(res.msg);
          this.orderRefundShow = true;
        }
      },
      // 点击确认退款日期模态框
      handleConfirmRefund(){
        this.handleRouteBack();
      },
      // 返回上一页
      handleRouteBack(){
        this.$u.route({
          type:'back',
        })
      },
      // 跳转至首页
      handleRouteIndex(){
        this.$u.route({
          type:'tab',
          url:'/pages/index/index',
        })
      },
      // 点击显示参与拼团弹窗
      handleShowJoinGroup(){
        this.joinGroupShow = !this.joinGroupShow;
      },
			// 关闭弹窗
			closePop() {
				console.log('关闭')
				this.getOrderDetail(this.order_id,this.order_class);
			},
			hexiao(index) {
				console.log(index)
				this.hexiaoInfo = this.orderDetail.classes_info[index]
				this.hexiaoShow = !this.hexiaoShow;
			},
      // 点击切换支付方式
      handleChangePayType(index){
        if(this.payTypeIdx == index) return;
        this.payTypeIdx = index;
        this.showPayType = !this.showPayType;
        this.payTypeTitle = this.payTypeList[index].title;
      },
      // 确认参团
      async handleJoinGroup(){
        if(this.payTypeIdx == null){
        	this.$u.toast(`请选择支付方式`);
        	return
        }
        if(this.joinForm.real_name == ''){
        	this.$u.toast(`请填写姓名`);
        	return
        }
        if(this.joinForm.phone == ''){
        	this.$u.toast(`请填写手机号`);
        	return
        }
        if(!this.$u.test.mobile(this.joinForm.phone)){
        	this.$u.toast(`手机号格式错误`);
        	return
        }
        let data = {
          pid:this.orderDetail.id,
          city:this.location.allAddress,
          memo:this.joinForm.remark,
          real_name:this.joinForm.real_name,
          phone:this.joinForm.phone,
          pay_way:app.checkPayType(this.payTypeIdx),
        };
        const res = await this.$api.classes_group_order_joinSubmitOrder(data);
        if(res.code == 1){
          this.classecOrderSendPay(res.data.order_id);
        }
      },
      // 拼团订单发起支付
      async classecOrderSendPay(order_id){
        let data = {
          classes_group_order_id:order_id
        };
        const res = await this.$api.classes_group_order_sendPay(data);
        if(res.code == 1){
          if(this.payTypeIdx == 0){
            this.wxPay(res.data.pay_info);
          }else{
            this.aliPay(res.data.pay_info);
          }
        }
      },
      // 微信支付
      wxPay(orderInfo) {
      	uni.requestPayment({
      		provider: 'wxpay',
      		timeStamp: orderInfo.timestamp,
      		nonceStr: orderInfo.noncestr,
      		package: orderInfo.package,
      		signType: "MD5",
      		paySign: orderInfo.sign,
          orderInfo:{
      			"appid": orderInfo.appid,
      			"partnerid": orderInfo.partnerid,
      			"noncestr": orderInfo.noncestr,
      			"package": orderInfo.package,
      			"prepayid": orderInfo.prepayid,
      			"timestamp": orderInfo.timestamp,
      			"sign": orderInfo.sign
      		}, //微信、支付宝订单数据
      		success: (res)=> {
      			uni.showModal({
      				title: '支付成功',
              content: '支付成功', //JSON.stringify(res)
      				showCancel:false,
      				success:async (res) => {
                this.$u.route({
                  type:'redirect',
                  url:'/pages/index/organizationDetail/courseDetail/orderConfirm/paySuccess',
                  params:{
                    is_group:true,
                  }
                })
      				}
      			})
      		},
      		fail: function(err) {
      			uni.showModal({
      				title: '支付失败',
      				content: '订单支付失败',  // +JSON.stringify(err)
      				showCancel: false,
      				success: (res) => {
      
      				}
      			})
      		}
      	})
      },
      // 阿里支付
      aliPay(orderInfo) {
      	uni.requestPayment({
      		provider: 'alipay',
      		orderInfo: orderInfo, //微信、支付宝订单数据
      		success: (res)=> {
      			console.log('支付成功回调',res)
      			uni.showToast({
      				title: '支付成功',
      				icon: '支付成功',
      				showCancel:false,
      				success:async (res) => {
      					this.$u.route({
      					  type:'redirect',
      					  url:'/pages/index/organizationDetail/courseDetail/orderConfirm/paySuccess',
                  params:{
                    is_group:true,
                  }
      					})
      				}
      			})
      		},
      		fail: function(err) {
      			uni.showModal({
      				title: '支付失败',
      				content: '订单支付失败',  //+ JSON.stringify(err)
      				showCancel: false,
      				success: (res) => {
      
      				}
      			})
      		}
      	})
      },
      // 点击分享订单
      handleShareOrder(){
        console.log('yyyyy',)
        let data = {
          shareType:'groupOrder',
          shareId:this.userInfo.id,
          goodsId:this.orderDetail.id,
          order_class:this.order_class,
        };
        let encrypt = this.AES.encrypt(JSON.stringify(data),'1234567891234567','1234567891234567');
        let shareStr = '启明星图拼团订单分享，复制此链接到启明星图App，' + JSON.parse(this.orderDetail.classes_info).classes_name + '#' + encrypt + '#';
        uni.setClipboardData({
        	data: shareStr,
        	success: () => { //复制成功的回调函数
            uni.showToast({
              icon:'none',
              title:'复制分享链接成功！',
              duration:2000,
            })
        	}
        });
      }
    }
	}
</script>
<style>
	page{
		background: #F6F6F6;
	}
</style>
<style lang="scss" scoped>
	.order-detail-content{
		.blue-color{
			color: #3077FB;
		}
		.order-module-card{
			background: $uni-bg-color;
			border-radius: 20rpx;
		}
		.goods-card{
			padding: 32rpx 28rpx;
			margin: 0 34rpx;
			.goods-title{
				// line-height: 44rpx;
        // height: 88rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				padding-bottom: 20rpx;
				align-items: flex-end;
			}
		}
		.sheet-card{
			margin: 0 34rpx;
			.center-line{
				height: 133rpx;
				width: 1rpx;
				background: #999;
			}
			.sheet-item{
				width: calc(100% / 2);
			}
			.u-image{
				margin: 0 auto;
			}
			.sheet-num{
				
				padding: 15rpx;
				background: #F5F5F5;
				width: 200rpx;
				margin: 0 auto;
			}
		}
		.order-info-card{
			margin: 0 34rpx;
      .order-info-row:not(:last-child){
        margin-bottom: 40rpx;
      }
			.order-info-row{
				font-size: 28rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				>view:first-child{
					color: $uni-text-color;
				}
				>view:last-child{
					color: #666;
				}
			}
		}
		.order-detail-bottom{
			position: fixed;
			bottom: 0;
			width: 100%;
			background: $uni-bg-color;
			.left-index{
				color: #3077FB;
				text-align: center;
        width: 92rpx;
				image{
					width: 45rpx;
					height: 45rpx;
					display: block;
					margin: 0 auto;
				}
			}
			.right-btn{
				>view{
					padding: 13rpx 30rpx;
					border-radius: 10rpx;
				}
				.gray-btn{
					background: #999999;
				}
				.blue-btn{
					background: #3077FB;
				}
        .blue-btn-disabled{
        	background: #9bb9fb;
        }
			}
		}
    .join-group-popup{
      .cash-type-row{
      	/deep/ .u-input{
      		border: 1px solid #666 !important;
      	}
      	.cash-item{
      		left: 0;
      		background: $uni-bg-color;
      		padding: 8rpx 10rpx;
      		width: 220rpx;
      		z-index: 9999;
      		border-radius:10rpx;
      		>view{
      			margin: 20rpx 0;
      		}
      	}
      	.select-cash-type{
      		border: 1px solid #666;
      		padding: 8rpx 16rpx;
      		border-radius: 6rpx;
      		width: 240rpx;
      	}
      }
    }
	}
	.blue-btn {
		padding: 13rpx 50rpx 16rpx;
		border-radius: 10rpx;
		background: #3077FB;
		align-self: center;
		color: #F5F5F5;
	}
	.pop-box {
		width: 500rpx;
		border-radius: 20rpx;
		background-color: #fff;
		padding: 26px 100rpx 0;
		font-weight: 500;
		text-align: center;
		color: #303133;
		view {
			margin-bottom: 20rpx;
		}
		.btns {
			view {
				width: 50%;
				text-align: center;
				height: 55px;
				line-height: 55px;
				font-size: 17px;
				box-sizing: border-box;
				cursor: pointer;
				text-align: center;
				border-radius: 2px;
			}
			view:last-child {
				color: rgb(41, 121, 255);
			}
		}
	}
	.u-row-between {
		justify-content: space-between;
	}
</style>
