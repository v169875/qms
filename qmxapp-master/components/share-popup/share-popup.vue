<template>
	<!-- 分享弹窗显示 -->
	<view class="share-popup-content">
		<!-- 分享内容 -->
		<!-- <block v-if="isShowContent">
			<u-popup v-model="sharePopup" mode="center" width="85%" border-radius="20" @close="handleCloseSharePopup">
				
			</u-popup>
		</block> -->
		<!-- 底部分享到哪 -->
		<u-popup v-model="sharePopup" mode="bottom" border-radius="20" @close="handleCloseSharePopup">
			<view class="share-box">
				<image v-if="wxImg" :src="posterUrl" class="img-finish"></image>
				<view class="share-content" id="pagehb" ref="pagehb">
						<u-image width="100%" height="321rpx"
							:src="cover_image"
							mode="aspectFill" border-radius="10"></u-image>
					<view class="hidden_two m-t-20 m-b-20 font-30" v-if="popupType != 'isVoucher'">
						{{shareContent.d_name || shareContent.classes_name || ''}}
					</view>
					<view class="font-30 flex col-bottom row-between m-t-20 m-b-20" v-else>
						<view class="hidden_one" style="width: 75%;">[所有机构通用] {{shareContent.deduction_price || 0}}元代金券
						</view>
						<view class="main-color">￥{{shareContent.sell_price || 0}}</view>
					</view>
					<view class="share-price" v-if="popupType == 'isCourse'">
						<text class="main-color text-bold font-32">￥{{shareContent.classes_current_price}}</text>
						<!-- <text class="font-26 m-l-6">分享可赚{{shareContent.classes_current_price * shareContent.two_bonus_rate}}元</text> -->
					</view>
					<view class="content-title m-t-20 m-b-20">{{shareContentTitle}}</view>
					<view class="u-line-3">
						{{shareContent.desc || shareContent.classes_desc || shareContent.school_desc}}
					</view>
					<view class="pop-box-bottom" v-if="type == 'isCourse' || popupType == 'isOrganization'">
						<u-avatar size="180" :src="head"></u-avatar>
						<image class="erwei" :src="qrCode"></image>
					</view>
					<image class="img-pop-hb" v-if="image != ''" :src="image"></image>
				</view>
			</view>
			<view class="share-box-bottom">
				<u-gap height="20"></u-gap>
				<view class="flex col-center row-between p-l-40 p-r-40">
					<u-icon name="close" color="#666666" size="28" style="visibility: hidden;"></u-icon>
					<view class="font-30">分享到</view>
					<u-icon name="close" color="#666666" size="28" @tap="handleCloseSharePopup()"></u-icon>
				</view>
				<u-gap height="36"></u-gap>
				<view class="flex col-center row-center p-b-30 share-row">
					<view class="" v-for="(item,index) in shareList.slice(0,shareNum)" :key="index"
						@tap="handleShareItem(index)">
						<view class="share-img">
							<u-image width="70rpx" height="70rpx" :src="`/static/index/share/share-icon${item.icon}.png`"
								mode="aspectFit"></u-image>
						</view>
						<view class="text-center m-t-22">{{item.title}}</view>
					</view>
					<view v-if="type" @tap="canvasImage.generateImage">
						<view class="share-img">
							<u-image width="70rpx" height="70rpx" src="/static/add/xz.png" mode="aspectFit"></u-image>
						</view>
						<view class="text-center m-t-22">保存海报</view>
					</view>
				</view>
			</view>
		</u-popup>
		<!-- 海报 -->
		<view class="content" id="page" v-show="false">
			<view class="share-content">
				<u-image width="100%" height="321rpx"
					:src="shareContent.cover_image_format || shareContent.classes_cover_image_format" mode="aspectFill"
					border-radius="10"></u-image>
				<view class="hidden_two m-t-20 m-b-20 font-30" v-if="popupType != 'isVoucher'">
					{{shareContent.d_name || shareContent.classes_name || ''}}
				</view>
				<view class="font-30 flex col-bottom row-between m-t-20 m-b-20" v-else>
					<view class="hidden_one" style="width: 75%;">[所有机构通用] {{shareContent.deduction_price || 0}}元代金券
					</view>
					<view class="main-color">￥{{shareContent.sell_price || 0}}</view>
				</view>
				<view class="share-price" v-if="popupType == 'isCourse'">
					<text class="main-color text-bold font-32">￥{{shareContent.classes_current_price}}</text>
				</view>
				<view class="content-title m-t-20 m-b-20">{{shareContentTitle}}</view>
				<view class="u-line-3">
					{{shareContent.desc || shareContent.classes_desc}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import html2canvas from 'html2canvas';
	import {
		pathToBase64,
		base64ToPath
	} from 'image-tools'
	export default {
		name: "share-popup",
		props: {
			// 判断底部分享图标数量，最多四个
			shareNum: {
				type: Number,
				default: 2,
			},
			// 分享的类型 ||  course == 课程，store == 机构/店铺 ，coupon == 代金券
			shareType: {
				type: String,
				default: 'store',
			},
			head: {
				type: String
			},
			cover_image: {
				type: String
			},
			qrCode: {
				type: String
			}
		},
		data() {
			return {
				// 控制两个弹窗
				sharePopup: false,
				shareList: [{
						icon: 1,
						title: '微信'
					},
					{
						icon: 2,
						title: '朋友圈'
					},
					{
						icon: 3,
						title: '下载'
					},
					{
						icon: 4,
						title: '举报'
					},
				],
				// 分享内容标题
				shareContentTitle: '',
				// 是否显示分享内容
				isShowContent: false,
				popupType: '',
				shareContent: {}, //分享详情
				type: null,
				base64: '',
				image: '',
				posterUrl: '',
				wxImg: false
			};
		},
		methods: {
			// 显示分享
			handleShowSharePopup(show, type, content) {
				this.sharePopup = show;
				if (content) {
					this.shareContent = content;
					// console.log('cccccc', this.shareContent)
				}
				switch (type) {
					case 'isNotContent': //不显示内容
						this.shareContentTitle = '';
						this.isShowContent = false;
						break;
						return
					case 'isCourse': //课程分享
						this.type = 'isCourse'
						this.shareContentTitle = '课程介绍：';
						// console.log(this.$props.head)
						break;
					case 'isOrganization': //机构分享
            this.type = 'isOrganization'
						this.shareContentTitle = '机构介绍：';
						break;
					case 'isVoucher': //代金券分享
						this.shareContentTitle = '代金券说明：';
						break;
				}
				this.popupType = type;
				this.isShowContent = true;
			},
			// 关闭分享
			handleCloseSharePopup() {
				this.sharePopup = false;
				this.shareContentTitle = '';
				this.isShowContent = false;
			},
			// 点击选择每项分享
			handleShareItem(index) {
				console.log('hhhhh', index)
				switch (index) {
					case 0: //微信
					case 1: //朋友圈
						this.$emit('onShareType', this.shareType);
						break;
				}
			},
			loadBase64Url() {
				const imageStr = this.posterUrl;
				base64ToPath(imageStr)
					.then(path => {
						console.log(path)
						this.saveImage(path);
					})
					.catch(error => {
						console.error('临时路径转换出错了：', error);
					});
			},
			// 保存图片到手机相册
			saveImage(filePath) {
				// #ifdef H5
				var ua = window.navigator.userAgent.toLowerCase();
				console.log('12345',filePath)
				uni.saveImageToPhotosAlbum({
					filePath, // 需要临时文件路径，base64无法保存
					success: () => {
						if (ua.match(/MicroMessenger/i) == 'micromessenger') {
							this.wxImg = true
							this._showToast('请长按图片保存');
						} else {
							this.wxImg = true
							console.log(false, filePath)
						}
					},
					fail: () => {
						this._showToast('保存失败，请重试');
					}
				});
				// #endif
				// #ifdef APP-PLUS
				uni.saveImageToPhotosAlbum({
					filePath, // 需要临时文件路径，base64无法保存
					success(res) {
						uni.showToast({
							icon:'success',
							mask:true,
							title: '保存到相册了',
						});
					},
					fail(res) {
						uni.showToast({
							icon:'none',
							mask:true,
							title: '保存图片失败，请返回重试',
						});
						console.log(res.errMsg)
					}
				});
				// #endif
				
			},
			// 将图片转为base 64 位url
			turnBase64Image(img, key) {
				uni.getImageInfo({
					src: img,
					success: image => {
						pathToBase64(image.path)
							.then(base64 => {
								this[key] = base64;
							})
							.catch(error => {
								console.log('转换失败：', error);
							});
					},
					fail: err => {
						console.log('将本地图片转为base 64报错:', err);
					}
				});
			},
			// 获取生成的base64 图片路径
			receiveRenderData(val) {
				// console.log('receiveRenderData',val)
				this.posterUrl = val.replace(/[] /g, ''); // 去除base64位中的空格
				this.loadBase64Url()
			},
			// 显示loading
			_showLoading(str) {
				this.posterUrl = '';
				uni.showLoading({
					title: str
				})
			},
			// 隐藏loading
			_hideLoading() {
				uni.hideLoading();
			},
			// 报错alert
			_errAlert(content) {
				uni.showModal({
					title: '提示',
					content: content
				});
			},
			// 提示弹窗
			_showToast(msg) {
				uni.showToast({
					title: msg,
					icon: 'none'
				});
			}
		}
	}
</script>

<!-- // 在这里新增一个 script 节点 用于在页面中使用dom -->
<script lang="renderjs" module="canvasImage">
	import html2canvas from 'html2canvas'
	import {
		pathToBase64,
		base64ToPath
	} from 'image-tools'
	export default {
		methods: {
			// 生成图片需要调用的方法
			generateImage(e, ownerFun) {
				ownerFun.callMethod('_showLoading', '正在生成图片') // 生成图片的 loading 提示
				setTimeout(() => {
					const dom = document.getElementById('pagehb') // 需要生成图片内容的 dom 节点
					// const dom = this.$refs.pagehb
					html2canvas(dom, {
						width: dom.clientWidth, //dom 原始宽度
						height: dom.clientHeight,
						scrollY: 0, // html2canvas默认绘制视图内的页面，需要把scrollY，scrollX设置为0
						scrollX: 0,
						useCORS: true, //支持跨域
						allowTaint: true,
						// scale: 2, // 设置生成图片的像素比例，默认是1，如果生成的图片模糊的话可以开启该配置项
					}).then((canvas) => {
						// 生成成功
						console.log('generateImage',canvas)
						ownerFun.callMethod('_hideLoading', '正在生成图片') // 生成图片的 loading 提示
						// html2canvas 生成成功的图片链接需要转成 base64位的url
						ownerFun.callMethod('receiveRenderData', canvas.toDataURL('image/png'))
					}).catch(err => {
						// 生成失败 弹出提示弹窗
						console.log(err)
						ownerFun.callMethod('_errAlert', `【生成图片失败，请重试】${err}`)
					})
				}, 300)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.share-popup-content {
		.share-content {
			position: relative;
			padding: 36rpx;

			.share-price {
				>text:last-child {
					color: #FF0000;
				}
			}
		}

		.share-row {
			>view {
				width: calc(100% / 4 - 30rpx);

				.share-img {
					.u-image {
						margin: 0 auto;
					}
				}
			}
		}
	}

	.pop-box-bottom {
		display: flex;
		padding: 10rpx;
		justify-content: space-between;
		align-items: center;

		.erwei {
			width: 200rpx;
			height: 200rpx;
		}
	}

	.img-pop-hb {
		width: 100%;
		height: 100%;
		position: absolute;
	}
	
	.u-drawer__scroll-view {
		position: relative;
	}

	.img-finish {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 99999;
	}
	/deep/ .u-drawer {
		top: -120rpx
	}
	.share-box {
		width: 85%;
		position: relative;
		    height: auto;
		    border-radius: 20rpx;
		    overflow: hidden;
				margin: 0 auto 50rpx;
				background: #fff;
	}
	/deep/ .u-drawer-bottom {
		background-color: transparent;
	}
	.share-box-bottom {
		background: #fff;
		border-radius: 20rpx 20rpx 0 0;
	}
	.imgs-pop {
		 width: 100%;
		 height: 322rpx;
		 border-radius: 20rpx;
	}
</style>
