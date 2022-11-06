<template>
	<view class="demo">
		<top-navbar title="邀请好友"></top-navbar>
		<view style="position: relative;">
			<image class="top-img" :style="{ width: canvasW + 'px', height: canvasH + 'px' }" :src="fImg" v-if="fImg != ''"></image>
			<canvas :style="{ width: canvasW + 'px', height: canvasH + 'px' }" canvas-id="myCanvas" id="myCanvas"></canvas>
		</view>
		<button class="btn" type="primary" v-if="isShow" @click="saveImage">保存图片到相册</button>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				title: '邀请好友',
				canvasW:0, // 画布宽
				canvasH:0, // 画布高
				SystemInfo:{}, // 设备信息
				goodsImg: {}, // 商品主图信息
				title:'', // 商品标题
				isShow:false ,
				url: '',
				fImg: ''
			}
		},
		async onLoad(e) {
			uni.setClipboardData({
				data: e.url,
				success: () => { //复制成功的回调函数
					uni.showToast({
						icon: 'none',
						title: '复制分享链接成功！',
						duration: 2000,
					})
				}
			});
			let _this = this
			// 获取设备信息，主要获取宽度，赋值给canvasW 也就是宽度：100%
			this.SystemInfo = await this.getSystemInfo();
			let statusBarHeight = uni.getWindowInfo()
			console.log(statusBarHeight)
			// 获取商品主图，二维码信息，APP端会返回图片的本地路径（H5端只能返回原路径）
			let goodsImgUrl = '/static/add/hb.png'  // 主图本地路径，也可以用网络地址
			let qrCodeImgUrl = e.qrcode
			this.goodsImg = await this.getImageInfo(goodsImgUrl);
			this.qrCOdeImg = await this.getImageInfo(qrCodeImgUrl);
			console.log(this.goodsImg,this.qrCOdeImg,this.SystemInfo)
			// this.title = e.name
			this.canvasW = this.SystemInfo.windowWidth; // 画布宽度
			this.canvasH =  1220 / 750 * this.SystemInfo.windowWidth; //this.goodsImg.height + this.ewmW + 10;  // 画布高度 = 主图高度+二维码高度 + 文字图片的间距（大概50）
			console.log(this.canvasW)
			// 如果主图，二维码图片，设备信息都获取成功，开始绘制海报，这里需要用setTimeout延时绘制，否则可能会出现图片不显示。
			if(this.goodsImg.errMsg == 'getImageInfo:ok' && this.SystemInfo.errMsg == 'getSystemInfo:ok'){
				console.log('读取图片信息成功')
				uni.showToast({
					icon:'loading',
					mask:true,
					duration:10000,
					title: '海报绘制中',
				});
				setTimeout(()=>{
					var ctx = uni.createCanvasContext('myCanvas', this);
					// 1.填充背景色，白色
					ctx.setFillStyle('#fff'); // 默认白色
					ctx.fillRect(0, 0, this.canvasW, this.canvasH) // fillRect(x,y,宽度，高度)
					
					// 2.绘制商品主图，二维码
					ctx.drawImage(this.goodsImg.path, 20, 20, this.canvasW-40, this.canvasH - 40) // drawImage(图片路径,x,y,绘制图像的宽度，绘制图像的高度)
					ctx.drawImage(this.qrCOdeImg.path, this.canvasW / 2 - 82, this.canvasH/2-123, 160, 123) // drawImage(图片路径,x,y,绘制图像的宽度，绘制图像的高度)
					// 3.绘制商品标题，多余文字自动换行
					ctx.setFontSize(30); // setFontSize() 设置字体字号
					ctx.setFillStyle('#333'); // setFillStyle() 设置字体颜色
					ctx.setTextAlign('center');
					/* str 这段代码是我百度找的，参考别人的。canvas不能自动换行，需要自行计算 */
					// let _strlineW = 0;
					// let _strLastIndex = 0; //每次开始截取的字符串的索引
					let _strHeight = this.canvasW +40; //绘制字体距离canvas顶部的初始高度
					ctx.fillText(this.title, this.canvasW/2, _strHeight)
					// let _num = 1;
					// for (let i = 0; i < this.title.length; i++) {
					// 	_strlineW += ctx.measureText(this.title[i]).width;
					// 	if (_strlineW > this.canvasW-155) {
					// 		if(_num == 2 && 2){
					// 			//文字换行数量大于二进行省略号处理
					// 			ctx.fillText(this.title.substring(_strLastIndex, i-5)+'...', 10, _strHeight);
					// 			_strlineW = 0;
					// 			_strLastIndex = i;
					// 			_num++;
					// 			break;
					// 		}else{
					// 			ctx.fillText(this.title.substring(_strLastIndex, i), 10, _strHeight);
					// 			_strlineW = 0;
					// 			_strHeight += 20;
					// 			_strLastIndex = i;
					// 			_num++;
					// 		}
					// 	}else if (i == this.title.length - 1) {
					// 		ctx.fillText(this.title.substring(_strLastIndex, i + 1), 10, _strHeight);
					// 		_strlineW = 0;
					// 	}
					// }
					
					
					// 4、商品价格
					
					// 5、邀请信息
					
					// draw方法 把以上内容画到 canvas 中
					ctx.draw(true,(ret)=>{						 
						this.isShow = true  // 显示按钮-保存图片到相册
						uni.showToast({
							icon:'success',
							mask:true,
							title: '绘制完成',
						});
						uni.canvasToTempFilePath({ // 保存canvas为图片
							canvasId: 'myCanvas',
							quality: 1,
							complete: function(res) {
								// 在H5平台下，tempFilePath 为 base64, // 图片提示跨域 H5保存base64失败，APP端正常输出临时路径
								console.log('123',res.tempFilePath)								
								uni.setStorageSync('filePath',res.tempFilePath)  //保存临时文件路径到缓存
								_this.fImg = res.tempFilePath
							} ,
						},_this)
					});
				},1500)
			} else {
				console.log('读取图片信息失败')
			}
		},
		
		methods: {
			// 获取图片信息
			getImageInfo(image) {
				return new Promise((req, rej) => {
					uni.getImageInfo({
						src: image,
						success: function(res) {
							// console.log(res)
							req(res)
						},
					});
				})
			},
			
			// 获取设备信息
			getSystemInfo(){
				return new Promise((req, rej) => {
					uni.getSystemInfo({
					    success: function (res) {
					        req(res)
					    }
					});
				})
			},
			
			// 保存图片到相册
			saveImage() {
				let filePath = uni.getStorageSync('filePath')	//从缓存中读取临时文件路径
				// #ifdef H5
				var ua = window.navigator.userAgent.toLowerCase();
				uni.saveImageToPhotosAlbum({
					filePath: filePath,
					success(res) {
						if (ua.match(/MicroMessenger/i) == 'micromessenger') {
							uni.showToast({
								icon:'none',
								mask:true,
								title: '请长按图片保存',
							});
						} else {
							uni.showToast({
								icon:'success',
								mask:true,
								title: '保存到相册了',
							});
						}
					},
					fail(res) {
						uni.showToast({
							icon:'none',
							mask:true,
							title: '保存图片失败，请返回重试',
						});
						console.log(res.errMsg)
					}
				})
				// #endif
				// #ifdef APP-PLUS
				uni.saveImageToPhotosAlbum({
					filePath: filePath,
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
				})
				// #endif
			}
			
		}
	}
</script>

<style scoped>
	.btn{
		margin-left: 10px;
		margin-right: 10px;
		margin-bottom: 10px;
		width: 94%;
	}
	.top-img {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
	}
</style>