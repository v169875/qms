<template>
	<view class="pagehb">
		<top-navbar :title="title"></top-navbar>
		<!-- <view id="pagehb" class="m-b-10">
			<image mode="widthFix" class="hb-pic" src="../../../../static/add/hb.png"></image>
			<image class="qrcode" :src="qrcode" crossOrigin="anonymous"></image>
		</view>
		<u-button text="保存图片" type="primary" shape="circle" @tap="canvasImage.generateImage">保存图片</u-button> -->
		<canvas-page :imgUrl="qrcode"></canvas-page>
	</view>
</template>

<script>
	import canvasPage from './canvas-page.vue'
	import html2canvas from 'html2canvas';
	import {
		pathToBase64,
		base64ToPath
	} from 'image-tools'
	export default {
		components: {
			canvasPage
		},
		data() {
			return {
				title: '邀请好友',
				qrcode: '',
				finnis: null
			};
		},
		onLoad() {
			this.getQrcode()
		},
		methods:{
			async getQrcode() {
				const res = await this.$api.qrCodeYq();
				if(res.code == 1) {
					this.qrcode = res.data.qrCodeUrl
					uni.setClipboardData({
						data: res.data.url,
						success: () => { //复制成功的回调函数
							uni.showToast({
								icon: 'none',
								title: '复制分享链接成功！',
								duration: 2000,
							})
						}
					});
				}
			},
			loadBase64Url() {
				const imageStr = this.posterUrl;
				base64ToPath(imageStr)
					.then(path => {
						this.saveImage(path);
					})
					.catch(error => {
						console.error('临时路径转换出错了：', error);
					});
			},
			// 保存图片到手机相册
			saveImage(filePath) {
				uni.saveImageToPhotosAlbum({
					filePath, // 需要临时文件路径，base64无法保存
					success: () => {
						this._showToast('保存图片成功');
					},
					fail: () => {
						this._showToast('保存失败，请重试');
					}
				});
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
				ownerFun.callMethod('_showLoading','正在生成图片') // 生成图片的 loading 提示
				setTimeout(() => {
					const dom = document.getElementById('pagehb') // 需要生成图片内容的 dom 节点
					html2canvas(dom, {
						width: dom.clientWidth, //dom 原始宽度
						height: dom.clientHeight,
						scrollY: 0, // html2canvas默认绘制视图内的页面，需要把scrollY，scrollX设置为0
						scrollX: 0,
						useCORS: true, //支持跨域
						// scale: 2, // 设置生成图片的像素比例，默认是1，如果生成的图片模糊的话可以开启该配置项
					}).then((canvas) => {
						// 生成成功
						// html2canvas 生成成功的图片链接需要转成 base64位的url
						ownerFun.callMethod('receiveRenderData', canvas.toDataURL('image/png'))
					}).catch(err => {
						// 生成失败 弹出提示弹窗
						console.log(err)
						ownerFun.callMethod('_errAlert',`【生成图片失败，请重试】${err}`)
					})
				}, 300)
			}
		}
	}
</script>

<style scoped>
	.none {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
	}
	.hb-pic {
		width: 100%;
	}
	.qrcode {
		width: 300rpx;
		height: 300rpx;
		position: absolute;
		top: calc(50% - 300rpx);
		left: calc(50% - 150rpx);
		z-index: 999;
	}
	.img-finish {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
	}
</style>