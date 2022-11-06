// import {
// 	httpUrl,
// 	whiteList,
// 	LOGIN_PAGE
// } from './config.js'

// const get = (url, params) => {
// 	return new Promise((resolve, reject) => {
// 		let parameter1 = params ? '/' + params  : '' 
// 		uni.request({
// 			url: httpUrl + url + parameter1,
// 			data: params,
// 			header: {
// 				"Authori-zation":'Bearer ' + uni.getStorageSync('token'),
// 			},
// 			method: 'GET'
// 		}).then(response => {
// 			let [err, res] = response
// 			resolve(res.data)
// 		}).catch(error => {
// 			let [err, res] = error
// 			reject(err)
// 		})
// 	})
// }
import config from './config.js'
//不需要做登录验证的接口
// let whiteList = [

// ]
const get = (url, params, params2) => {
	// uni.showLoading({
	// 	title: '加载中...',
	// 	mask: true
	// })
	return new Promise((resolve, reject) => {
		let token = uni.getStorageSync('token')
		let url2 = ''
		let str = ''
		if (params2) {
			for (let key in params) {
				str += "&" + key + '=' + params[key]
			}
			str = '?' + str.substr(1)
			url2 = config.httpUrl + url + '/' + params2 + str
		} else {
			url2 = config.httpUrl + url + (params && (typeof params == 'string' || typeof params ==
				'number') ? '/' + params : '')
		}
		uni.request({
			url: url2,
			data: params,
			header: {
				'content-type': 'application/x-www-form-urlencoded', // , application/json
				'token':uni.getStorageSync('token') || ''
			},
			method: 'GET',
			timeout: 10000,
			success: (res) => {
				if (res.data.code == 1) {
					resolve(res.data);
				}else if(res.data.code == 401){
					uni.showToast({
						title:res.data.msg,
						icon:"none",
						duration:1500
					})
					setTimeout(()=>{
						uni.redirectTo({
							url: '/pages/login/login?isToken=' + false
						})
						return
					},1000)
				}else{
					uni.showToast({
						title:res.data.msg,
						icon:"none",
						duration:1500
					})
					// reject();
				} 
			},
			fail: (error) => {
				return uni.showToast({
					title:res.data.msg,
					icon:"none",
					duration:1500
				})
			},
			complete: () => {
				setTimeout(function () {
					uni.hideLoading();
				}, 500);
			}
		})
	}).catch(error => {
			let [err, res] = error
			uni.hideLoading()
			reject(err)
		})
}
const post = (url, params, params2) => {
	// uni.showLoading({
	// 	title: '加载中...',
	// 	mask: true
	// })
	return new Promise((resolve, reject) => {
		let token = uni.getStorageSync('token')
		uni.request({
			url: config.httpUrl + url + (params2 && (typeof params2 == 'string' || typeof params2 ==
				'number') ? '/' + params2 : ''),
			data: params,
			header: {
				// 'content-type': 'application/x-www-form-urlencoded', // , application/json
				'token':uni.getStorageSync('token') || ''
			},
			method: 'POST',
			timeout: 10000,
			success: (res) => {
				if (res.data.code == 1) {
					resolve(res.data);
				}else if(res.data.code == 401){
					console.log('res',res)
					uni.showToast({
						title:res.data.msg,
						icon:"none",
						duration:1500
					})
					setTimeout(()=>{
						uni.redirectTo({
							url: '/pages/login/login?isToken=' + false
						})
						return
					},1000)
				}else{
					uni.showToast({
						title:res.data.msg,
						icon:"none",
						duration:1500
					})
          uni.hideLoading();
				} 
			},
			fail: (error) => {
				return uni.showToast({
					title:res.data.msg,
					icon:"none",
					duration:1500
				})
			},
			complete: () => {
				setTimeout(function () {
					uni.hideLoading();
				}, 500);
			}
		})
	}).catch(error => {
		let [err, res] = error
		uni.hideLoading()
		reject(err)
	})
}
const uploadFile = (url, params) => {
	uni.showLoading({
		title: '上传中...',
		mask: true
	})
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: config.httpUrl + url,
			filePath: params.file,
			name: params.name,
			timeout:3000000,
			header:{
				'token':uni.getStorageSync('token') || ''
			}
		}).then(response => {
			
			let [err, res] = response
			res = JSON.parse(res.data)
			uni.hideLoading()
			resolve(res)
		}).catch(error => {
			
			let [err, res] = error
			uni.hideLoading()
			reject(err)
		}).finally(function(){
			uni.hideLoading()
		});
	})
}

const uploadFileMore = (url, params) => {
	let files = []
	params.files.forEach(res => {
		files.push({
			name: 'file[]',
			uri: res
		})
	})
	return new Promise((resolve, reject) => {
		uni.showLoading({
			title: '上传中...'
		})
		uni.uploadFile({
			url: config.httpUrl + url,
			files: files,
			formData: {
				type: params.type
			}
		}).then(response => {
			uni.hideLoading()
			let [err, res] = response
			res = JSON.parse(res.data)
			resolve(res)
		}).catch(error => {
			uni.hideLoading()
			let [err, res] = error
			reject(err)
		})
	})
}
/***********************************图片上传*****************************************/
// 图片上传
export const fileUpload = (params) => uploadFile('api/common/upload1', params)
/***********************************登录注册模块*****************************************/
// 获取验证码
export const sendCode = (params) => post('api/sms/send', params)
// 校验验证码
export const sendCheck = (params) => post('api/sms/check', params)
// 登录
export const mobileLogin = (params) => post('api/user/mobileLogin', params)
// 微信登录
export const wechatApp = (params) => post('api/login/wechatApp', params)
// 微信登录绑定手机号
export const bindMobile = (params) => post('api/login/bindMobile', params)
// 获取用户信息
export const userInfo = (params) => post('api/user/userInfo', params)
// 轮播图 轮播类型:1=首页轮播,2=资讯轮播,3=选品库轮播
export const getBannerList = (params) => post('api/banner/getBannerList', params)
// 修改个人信息
export const profile = (params) => post('api/user/profile', params)
// 修改手机号
export const changeMobile = (params) => post('api/user/changeMobile', params)
// 退出登录
export const logout = (params) => post('api/user/logout', params)
// 获取分类
export const getCategoryList = (params) => post('api/category/getCategoryList', params)
// 获取机构店铺列表
export const getSchoolList = (params) => post('api/school/getSchoolList', params)
// 获取社区店铺列表
export const getShequList = (params) => post('api/school/getShequList', params)
// 获取课程列表
export const getClassesList = (params) => post('api/school_classes/getClassesList', params)
// 添加搜索历史
export const searchStore = (params) => post('api/search/searchStore', params)
// 获取搜索历史
export const searchList = (params) => post('api/search/searchList', params)
// 清空搜索历史
export const delAllSearch = (params) => post('api/search/delAllSearch', params)
// 获取猜你喜欢 && 推荐课程
export const getHotClassesList = (params) => post('api/school_classes/getHotClassesList', params)
// 获取机构课程列表
export const getAgentClassesList = (params) => post('api/school_classes/getAgentClassesList', params)
// 获取机构详情
export const getSchoolDetail = (params) => post('api/school/getSchoolDetail', params)

// 获取机构代金券配置
export const getDcoupnConfig = (params) => post('api/dcoupon/getDcoupnConfig', params)
// 代金券购买发起支付
export const sendPay = (params) => post('api/dcoupon/sendPay', params)
// 课程增加浏览量
export const addClassesViews = (params) => post('api/school_classes/addClassesViews', params)
// 课程详情
export const getClassesDetail = (params) => post('api/school_classes/getClassesDetail', params)
// 获取评论列表
export const getClassesOrderComment = (params) => post('api/school_classes_comment/getClassesOrderComment', params)
// 点赞课程
export const addClassesLike = (params) => post('api/school_classes_like/addClassesLike', params)
// 取消点赞课程
export const subClassesLike = (params) => post('api/school_classes_like/subClassesLike', params)
// 获取活动列表
export const getActiveList = (params) => post('api/active/getActiveList', params)
// 活动详情
export const getActiveDetail = (params) => post('api/active/getActiveDetail', params)
// 获取体验卡配置列表
export const activeDcoupnConfig = (params) => post('api/tcoupon/getDcoupnConfig', params)
// 获取体验卡配置详情
export const getDcoupnConfigDetail = (params) => post('api/tcoupon/getDcoupnConfigDetail', params)
// 体验卡购买发起支付
export const tcoupon_sendPay = (params) => post('api/tcoupon/sendPay', params)


// 获取推荐资讯列表
export const getHotNewsList = (params) => post('api/news/getHotNewsList', params)
// 获取资讯列表
export const getNewsList = (params) => post('api/news/getNewsList', params)
// 资讯增加浏览量
export const addNewsViews = (params) => post('api/news/addNewsViews', params)
// 资讯详情
export const getNewsDetail = (params) => post('api/news/getNewsDetail', params)
// 积分商品列表
export const score_goods_goodsList = (params) => post('api/score_goods/goodsList', params)
// 关注&&收藏学校机构
export const favoriteStore = (params) => post('api/school_favorite/favoriteStore', params)
// 收藏列表
export const getFavoriteList = (params) => post('api/school_favorite/getFavoriteList', params)
// 删除收藏记录
export const delFavorite = (params) => post('api/school_favorite/delFavorite', params)
// 意见反馈
export const feedbackStore = (params) => post('api/feedback/feedbackStore', params)
// 获取积分任务列表
export const taskList = (params) => post('api/score_task/taskList', params)
// 添加收货地址
export const addAddress = (params) => post('api/address/addAddress', params)
// 获取收货列表
export const getAddressList = (params) => post('api/address/getAddressList', params)
// 获取收货地址详情
export const getAddressDetail = (params) => post('api/address/getAddressDetail', params)
// 修改收货地址
export const editAddress = (params) => post('api/address/editAddress', params)
// 删除收货地址
export const delAddress = (params) => post('api/address/delAddress', params)
// 设置默认地址
export const setDefaultAddress = (params) => post('api/address/setDefaultAddress', params)
// 选品库课程列表
export const get_agent_agentClassesList = (params) => post('api/agent_classes/getAgentClassesList', params)
// 加入代理选品库
export const agentClassesStore = (params) => post('api/agent_classes/agentClassesStore', params)
// 商家认证
export const schoolStore = (params) => post('api/school/schoolStore', params)
// 获取我的店铺信息
export const getMeSchoolDetail = (params) => post('api/school/getMeSchoolDetail', params)
// 驳回店铺资料重新提交
export const rejectSchoolEditStore = (params) => post('api/school/rejectSchoolEditStore', params)


// 商家初次审核通过绑定企业账号 
export const auditPassBindCompanyMobile = (params) => post('api/school/auditPassBindCompanyMobile', params)
// 我的代理课程列表
export const getMyAgentClassesList = (params) => post('api/agent_classes/getMyAgentClassesList', params)
// 点击确认解除代理
export const cancelClasses = (params) => post('api/agent_classes/cancelClasses', params)
// 资金页面参数
export const moneyPageParams = (params) => post('api/money/moneyPageParams', params)
// 提现接口
export const withdrawStore = (params) => post('api/withdraw/withdrawStore', params)
// 结算中心页面参数
export const bonus_moneyPageParams = (params) => post('api/bonus/moneyPageParams', params)
// 达人排行榜
export const ranking = (params) => post('api/bonus/ranking', params)
// 最近收支
export const moneyList = (params) => post('api/money/moneyList', params)
// 添加课程
export const classStore = (params) => post('api/timetable/classStore', params)
// 删除课程
export const delTimeTable = (params) => post('api/timetable/delTimeTable', params)
// 获取课程列表
export const getTimeTableList = (params) => post('api/timetable/getTimeTableList', params)
// 获取课程详情
export const getTimeTableDetail = (params) => post('api/timetable/getTimeTableDetail', params)
// 做任务
export const doTaskStore = (params) => post('api/score_task/doTaskStore', params)
// 积分明细
export const scoreList = (params) => post('api/score/scoreList', params)
// 获取积分商品详情
export const score_goods_goodsDetail = (params) => post('api/score_goods/goodsDetail', params)
// 积分兑换提交订单
export const score_goods_submitOrder = (params) => post('api/score_order/submitOrder', params)
// 积分兑换的礼品订单列表
export const score_goods_getOrderList = (params) => post('api/score_order/getOrderList', params)
// 抽奖转盘奖品列表
export const getLotteryList = (params) => post('api/score_lottery/getLotteryList', params)
// 抽奖
export const lotteryStore = (params) => post('api/score_lottery/lotteryStore', params)
// 我的代金券列表
export const getDcouponList = (params) => post('api/dcoupon/getDcouponList', params)
// 购买课程下单
export const classes_order_submitOrder = (params) => post('api/classes_order/submitOrder', params)
// 购买课程发起支付
export const classes_order_sendPay = (params) => post('api/classes_order/sendPay', params)
// 我的已选会员体验卡
export const tcoupon_getOrderList = (params) => post('api/tcoupon/getOrderList', params)
// 我的体验卡
export const getMyTcoupon = (params) => post('api/tcoupon/getMyTcoupon', params)
// 创建二维码
export const createQrcode = (params) => post('api/create_qrcode/createQrcode', params)
// 删除已使用优惠券
export const delUserDcoupon = (params) => post('api/dcoupon/delUserDcoupon', params)
// 获取订单列表
export const classes_order_getOrderList = (params) => post('api/classes_order/getOrderList', params)
// 取消订单
export const classes_order_cancelOrder = (params) => post('api/classes_order/cancelOrder', params)

// 申请退款
export const classes_order_refundOrder = (params) => post('api/classes_order/refundOrder', params)
// 订单详情
export const classes_order_getOrderDetail = (params) => post('api/classes_order/getOrderDetail', params)
// 订单评价
export const classes_order_classesOrderCommentStore = (params) => post('api/school_classes_comment/classesOrderCommentStore', params)
// 订单删除
export const classes_order_delOrder = (params) => post('api/classes_order/delOrder', params)
// 我的视频主页信息
export const videoUserInfo = (params) => post('api/video/videoUserInfo', params)

// 发布视频
export const videoStore = (params) => post('api/video/videoStore', params)
// 视频列表
export const videoList = (params) => post('api/video/videoList', params)
// 增加视频浏览量
export const addVideoViews = (params) => post('api/video/addVideoViews', params)
// 视频点赞评论点赞
export const addVideoLike = (params) => post('api/video_like/addVideoLike', params)
// 取消点赞
export const subVideoLike = (params) => post('api/video_like/subVideoLike', params)
// 发布评论
export const videoCommentStore = (params) => post('api/video_comment/videoCommentStore', params)
// 一级评论列表，包含五条二级评论
export const getVideoDetailCommentAndReply = (params) => post('api/video_comment/getVideoDetailCommentAndReply', params)

// 评论回复别人
export const videoCommentReplyStore = (params) => post('api/video_comment/videoCommentReplyStore', params)
// 二级评论列表
export const getVideoDetailCommentSubReply = (params) => post('api/video_comment/getVideoDetailCommentSubReply', params)
// 视频添加到收藏
export const video_favoriteStore = (params) => post('api/video_favorite/favoriteStore', params)
// 删除收藏的视频
export const video_delFavorite = (params) => post('api/video_favorite/delFavorite', params)
// 获取我的视频列表
export const myVideoList = (params) => post('api/video/myVideoList', params)
// 删除我的视频
export const delMyVideo = (params) => post('api/video/delVideo', params)

// 举报内容列表
export const reportList = (params) => post('api/video_report/reportList', params)
// 举报内容提交
export const reportStore = (params) => post('api/video_report/reportStore', params)
// 获取我的收藏列表
export const video_getFavoriteList = (params) => post('api/video_favorite/getFavoriteList', params)
// 添加视频到足迹
export const footprintStore = (params) => post('api/video_footprint/footprintStore', params)
// 我的足迹列表
export const getFootprintList = (params) => post('api/video_footprint/getFootprintList', params)
// 清空我的足迹
export const delAllFootprint = (params) => post('api/video_footprint/delAllFootprint', params)

// 获取站内消息列表
export const getSystemMessageList = (params) => post('api/system_message/getSystemMessageList', params)
// 推送列表
export const getNoticeList = (params) => post('api/notice/getNoticeList', params)
// 获取未读消息
// export const getNoticeList = (params) => post('api/notice/getNoticeList', params)

// 获取视频详情
export const videoDetail = (params) => post('api/video/videoDetail', params)
// 添加到拉黑
export const blackStore = (params) => post('api/video_blacklist/blackStore', params)
// 我的拉黑列表
export const getBlackList = (params) => post('api/video_blacklist/getBlackList', params)
// 解除拉黑
export const cancelBlack = (params) => post('api/video_blacklist/cancelBlack', params)

// 核销订单
export const schoolVerificationOrder = (params) => post('api/school/schoolVerificationOrder', params)
// 获取协议详情
export const about = (params) => post('api/about/about', params)
// 注销账号
export const delAccount = (params) => post('api/user/delAccount', params)
// 获取是否有未读消息
export const getSystemMessage = (params) => post('api/system_message/getSystemMessage', params)
// 消息更改为已读
export const updateStore = (params) => post('api/system_message/updateStore', params)
// 全部消息已读
export const updateAllStore = (params) => post('api/system_message/updateAllStore', params)
// 拼团订单提交
export const classes_group_order_submitOrder = (params) => post('api/classes_group_order/submitOrder', params)
// 拼团订单发起支付
export const classes_group_order_sendPay = (params) => post('api/classes_group_order/sendPay', params)
// 拼团订单列表
export const classes_group_order_getOrderList = (params) => post('api/classes_group_order/getOrderList', params)
// 拼团订单详情
export const classes_group_order_getOrderDetail = (params) => post('api/classes_group_order/getOrderDetail', params)
// 拼团订单退款
export const classes_group_order_refundOrder = (params) => post('api/classes_group_order/refundOrder', params)
// 拼团订单取消订单
export const classes_group_order_cancelOrder = (params) => post('api/classes_group_order/cancelOrder', params)
// 拼团订单删除订单
export const classes_group_order_delOrder = (params) => post('api/classes_group_order/delOrder', params)
// 课程参与拼团提交
export const classes_group_order_joinSubmitOrder = (params) => post('api/classes_group_order/joinSubmitOrder', params)
// 添加关注
export const followStore = (params) => post('api/video_fans/followStore', params)
// 获取我的关注
export const getFollowList = (params) => post('api/video_fans/getFollowList', params)
// 取消关注
export const cancelFollow = (params) => post('api/video_fans/cancelFollow', params)
// 获取我的粉丝列表
export const getFansList = (params) => post('api/video_fans/getFansList', params)
// 获取我的关注视频列表
export const myFollowVideoList = (params) => post('api/video/myFollowVideoList', params)
// 添加购物车
export const addcart = (params) => post('api/cart/addcart', params)
// 购物车列表
export const getCartList = (params) => post('api/cart/getlist', params)
// 修改购物车
export const updateCartList = (params) => post('api/cart/update', params)
// 分享商品二维码
export const qrCode = (params) => post('api/school_classes/qrCode', params)
// 分享机构二维码
export const organizationQrCode = (params) => post('api/school_classes/organizationQrCode', params)
// 生成订单
export const submitOrder = (params) => post('api/classes_order/submitOrder', params)
// 邀请二维码
export const qrCodeYq = (params) => post('api/user/qrCode', params)
// 获取物理地址
export const reverseGeocoder = (params) => post('api/login/reverseGeocoder', params)
// 单个课程申请退款
export const refundOneOrder = (params) => post('api/classes_order/refundOneOrder', params)
// 核销订单详情
export const schoolOrderGood = (params) => post('api/school/schoolOrderGood', params)
// 获取最新版本信息
export const latestVersion = (params) => post('api/common/latestVersion', params)