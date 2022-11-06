<template>
	<!-- 视频单项 -->
	<view class="video-layout">
		<video
			v-if="isplay"
			:id="`myVideo${index}`"
			:style="{ height: height, width: '100%' }"
			:src="src"
			controls
			objectFit="contain"
			:enable-progress-gesture="enableProgressGesture"
			x5-video-player-type="h5"
			x-webkit-airplay="allow"
			webkit-playsinline="true"
			@error="videoErrorCallback"
			@play="play"
			@pause="pause"
		>
			<!-- #ifdef APP-PLUS -->
			<cover-view :style="{ transform: 'translateX(' + moveX + 'px)' }" />
			<!-- #endif -->
			<!-- 不使用弹窗提示，视频内部提示可使用cover-view自定义播放提示样式 -->
		</video>
		<view v-if="!isplay" class="image" :style="{ height: height, width: '100%' }" @click="beforePlay">
			<image mode="aspectFill" :src="poster" />
			<view class="play" />
		</view>
	</view>
</template>
<script>
// enable-progress-gesture 手势滑动在非app页面开启后，视频轮播会存在与轮播图，滑动事件同时触发的情况
export default {
	props: {
		moveX: { type: [Number, String], default: 0 }, // 轮播图兼容滑动兼容-单独使用可不传
		index: { type: [Number, String], default: 0 }, // 下标索引
		height: { type: String, default: '750rpx' }, // 视频高度
		borderRadius: { type: Number, default: 0 }, // 圆角值，单位rpx
		videoSize: { type: [Number, String], default: 10 }, // 视频大小
		ignoreTip: { type: Boolean, default: true }, // 播放环境提示
		// #ifdef APP-PLUS
		enableProgressGesture: { type: Boolean, default: true }, // 手势滑动
		// #endif
		// #ifndef APP-PLUS
		enableProgressGesture: { type: Boolean, default: false }, // 手势滑动
		// #endif
		src: {
			// 播放地址
			type: String,
			default: 'https://bjetxgzv.cdn.bspapp.com/VKCEYUGU-uni-app-doc/360e4b20-4f4b-11eb-8a36-ebb87efcf8c0.mp4'
		},
		poster: {
			// 封面
			type: String,
			default: 'https://img1.baidu.com/it/u=1601695551,235775011&fm=26&fmt=auto'
		}
	},
	data() {
		return {
			//   videoContext: null, // 视频实例
			isplay: false, // 播放状态
			isTip: true // 是否提示
		};
	},
	watch: {
		ignoreTip: {
			handler(v) {
				this.isTip = v;
			},
			immediate: true
		}
	},
	onReady() {
		// this.videoContext = uni.createVideoContext('myVideo')
	},
	methods: {
		videoErrorCallback: function(e) {
			console.log('视频错误信息:');
			console.log(e.target.errMsg);
		},
		play() {
			console.log('播放');
			this.$emit('play', true);
		},
		pause() {
			console.log('暂停');
			this.isplay = false;
			this.$emit('play', false);
		},
		startPlay() {
			// 开始播放
			this.isplay = true;
			this.$nextTick(() => {
				const id = `myVideo${this.index}`;
				//一定要加this,不然微信小程序有问题（需要需要触发两次才能play）
				const video = uni.createVideoContext(id,this);
				video.play();
			});
		},
		pausePlay() {
			//暂停播放
			const id = `myVideo${this.index}`;
			//一定要加this
			const video = uni.createVideoContext(id,this);
			video.pause();
			this.isplay = false;
		},
		beforePlay() {
			// 播放前拦截
			this.isplay = true; // 拦截前显示播放视频
			if (!this.isTip) return this.startPlay(); // 不提示直接播放
			// https://uniapp.dcloud.io/api/system/network?id=getnetworktype
			uni.getNetworkType({
				success: res => {
					const networkType = res.networkType;
					if (networkType === 'wifi' || networkType === 'ethernet') {
						this.startPlay();
					} else {
						uni.showModal({
							title: '提示',
							content: `当前为移动网络，播放视频需消耗${this.videoSize}M流量，是否继续播放？`,
							success: res => {
								if (res.confirm) {
									this.startPlay();
									this.isTip = false;
								} else {
									this.isplay = false;
								}
							}
						});
					}
				}
			});
		}
	}
};
</script>
<style lang="scss" scoped>
.video-layout {
	display: flex;
	align-items: center;
	height: 300rpx;
	// video{
	//     width: 100%;
	//     height: 100%;
	//     /deep/.uni-video-container{
	//         width: auto;
	//         height: auto;
	//     }
	// }
	.image {
		position: relative;
		width: 100%;
		height: 100%;
		/deep/uni-image {
			width: 100%;
			height: 100%;
		}
		.play {
			position: absolute;
			left: 50%;
			top: 50%;
			width: 80rpx;
			height: 80rpx;
			transform: translate(-50%, -50%);
			// background-image: url('@/static/play.png');
			background-image: url('https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fbpic.588ku.com%2Felement_pic%2F20%2F07%2F01%2F215e4e632b7438794f5b75fe8ad35388.jpg%21%2Ffw%2F253%2Fquality%2F90%2Funsharp%2Ftrue%2Fcompress%2Ftrue&refer=http%3A%2F%2Fbpic.588ku.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1661933376&t=47385c16830ca399e0873f50474fbeeb');
			background-size: contain;
			background-repeat: no-repeat;
			background-color: rgba($color: #000000, $alpha: 0.1);
			border-radius: 50%;
		}
	}
}
</style>

