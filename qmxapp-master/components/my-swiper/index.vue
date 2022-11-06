<template> 
	<view class="swiperContent">    
		<swiper  
			@transition='transition'
            @change="change"  
            @animationfinish="animationfinish"
            :indicator-dots="indicatorDots"
            :indicator-active-color="indicatorActiveColor"
            :indicator-color="indicatorColor"
            :autoplay="autoplay && !videoPlaySataus"
            :current="activeCurrent"
            :interval="interval"
            :vertical="vertical"
            :style="{'height':swiperHeight+'px'}"
            class="z-screen-swiper">  
			<swiper-item 
                class="z-swiper-item"   
                v-for="(item,index) in swiperList"
                :key="index" 
                @tap="clickItem(index)">  
                <view class="swiper-box" :style="{'backgroundColor':`${bgColorItem}`}"> 
                    <view class="swiper-content"> 
                        <slot :row='item' :index='index'>  
                            <image v-if="item[fileType]==='image'"  :src="item[imageKey]" mode='scaleToFill'>   
							<template v-else-if="item[fileType]==='video'"> 
								<!-- :style="{'height':fullScreen ? '':'100%' }" 解决非全屏video显示问题 -->
								<zVideo
								:ignoreTip='false'
								:ref='`video_${index}`'
								:index='index'
								:src="item[videoKey]"
								:poster="item.poster"
								:moveX='moveX' 
								:initial-time="item.currentTime || 0 "
								@play="stopSwiperAuto"
								:height="swiperHeight+'px'"
								></zVideo>
							</template>
                        </slot> 
                    </view>

                </view>
			</swiper-item> 
		</swiper>
        <!-- indicatorDots 原生指示器开启时不显示下面自定义指示器 
             vertical为true 垂直方向 只写了支持右侧定位
        -->
        <div 
             v-if="!indicatorDots && list.length>1"
            :class="['dot',vertical ? 'verticalDot':`${indicatorPos}`]"
            > 
            <slot :list='list' :total='list.length' :activeIndex='activeCurrent' name="dot">
                <!-- 指示器自定义-返回列表数据list 数组长度total 选中项索引activeIndex --> 
                <template v-if="mode==='number'">
                    <div>
                        {{activeCurrent+1}}/{{list.length}}
                    </div>
                </template>
                <template v-else> 
                    <div   
                        v-for="(item,index) in list"
                        :key="index"  
                        @click="activeCurrent=index" 
                        :style="{'background-color': activeCurrent==index ? indicatorActiveColor:indicatorColor}"
                        :class="['dotItem',`${mode}`, `${ activeCurrent==index ? 'defautActive':'' }` ]"> 
                        <span v-if="mode ==='index'">{{index+1}}</span> 
                    </div> 
                </template> 
            </slot>
        </div>
	</view>
</template>

<script>
	import zVideo from './video.vue'
	export default {
		name:'my-swiper', 
		components:{zVideo},
		props: {  	   
            list:{//滑块视图容器数据
              type:Array,
              default:_=>[
                  {
					type:'video',  
					poster:'https://img2.baidu.com/it/u=2141851239,1037607188&fm=26&fmt=auto&gp=0.jpg',
					src:'https://bjetxgzv.cdn.bspapp.com/VKCEYUGU-uni-app-doc/360e4b20-4f4b-11eb-8a36-ebb87efcf8c0.mp4',
				  }, 
                  {type:'image', src:'https://img0.baidu.com/it/u=1570602913,157918019&fm=26&fmt=auto&gp=0.jpg'},
                  {type:'image', src:'https://img0.baidu.com/it/u=3464142916,229554071&fm=26&fmt=auto&gp=0.jpg'},
                  {
					type:'video', 
					currentTime:120,//初始帧时间---默认缓存存储
					poster:'https://img1.baidu.com/it/u=1297253752,1185196455&fm=26&fmt=auto&gp=0.jpg',
					src:'https://bjetxgzv.cdn.bspapp.com/VKCEYUGU-uni-app-doc/a876efc0-4f35-11eb-97b7-0dc4655d6e68.mp4',
				  },
                  {type:'image', src:'https://img1.baidu.com/it/u=2057763469,3313822915&fm=26&fmt=auto&gp=0.jpg'},
                  {type:'image', src:'https://img0.baidu.com/it/u=1570602913,157918019&fm=26&fmt=auto&gp=0.jpg'},
              ]  
            },
			fileType: { type: String, default: 'type' }, // 文件类型映射
			videoKey:{ type:String, default:'src'},// 视频映射的键
			imageKey:{ type:String, default:'src'},//图片映射的键
            indicatorPos:{ type:String, default:'bottomCenter'},//指示器的位置:topLeft/topCenter/topRight/bottomLeft/bottomCenter/bottomRight
            mode:{ type:String, default:'round' },//指示器样式： default  circle  round index number none时不显示
            fullScreen:{ type:Boolean, default:false }, //是否全屏
            navHeight:{type:Number, default:44},//顶部导航高度，默认44---垂直全屏状态无导航栏可设置为0
            height:{ type:Number, default:160 },//swiper 高度单位px
			contentRadius:{ type:String, default:'0rpx' },//盒子圆角设置
            // topFloat:{ type:Boolean, default:true },//顶部不占位-浮动定位
            // fotterFloat:{ type:Boolean, default:true },//底部不占位-浮动定位
            bgColor:{type: String, default: '#f3f4f6'},//swiper背景色
            bgColorItem:{type: String, default: 'rgba(0,0,0,0)'},//swiper当前项背景色
			
			//顶部与底部设置-注：-顶部与底部根据需求自己拓展---也可用插槽自定义内容
			topTextKey:{  type:String, default:'topTip'},//顶部文字说明映射的键
			topColor:{ type:String, default:'#FFF'},//顶部文字颜色
			topBackground:{  type:String, default:'rgba(0, 0, 0, 0)'},//顶部背景色
			topTextAlign:{ type:String, default:'left'},//顶部文字位置
			bottomTextKey:{  type:String, default:'bottomTip'},//底部文字说明映射的键
			bottomColor:{ type:String, default:'#00F'},//底部文字颜色
			bottomBackground:{  type:String, default:'rgba(0, 0, 0, 0)'},//底部背景色
			bottomTextAlign:{ type:String, default:'left'},//底部文字位置
			//---end
			nextMargin:{ // 后边距，可用于露出后一项的一小部分，接受 px 和 rpx 值 头条小程序不支持
				type:String,
				default:'0rpx'
			},
			previousMargin:{//前边距，可用于露出前一项的一小部分，接受 px 和 rpx 值头条小程序不支持
				type:String,
				default:'0rpx'
			},
			vertical:{ type:Boolean, default:false },//滑动方向是否为纵向 卡牌不支持纵向以及同时显示的2块以上滑块数量
			interval:{ type:Number, default:2500 },// 自动切换时间间隔
			current:{ type:Number, default:0 },// 初始化时，默认显示第几项
			autoplay:{ type:Boolean, default:true },// 是否自动切换
			indicatorDots: { type: Boolean, default: false },//是否显示面板指示点--默认关闭使用自定义指示器mode设置指示器，原生指示器为true时 则不显示自定义指示器 
			indicatorColor:{ type:String, default:'rgba(0,0,0,0.3)' },// 指示点颜色
			indicatorActiveColor: { type: String, default: '#F1F1F1' },// 选中项指示点颜色
		},
		data() {
			return {
				swiperList:[],//列表数据
				videoContent:'',//视频实例
				videoPlaySataus:false, //视频播放状态---默认禁用
                activeCurrent:0,//当前选中索引
                swiperHeight:0, //轮播图高度
				moveX:0, 
			}
		}, 
        watch: {
            height:{//swiper高度
                handler(newValue) {
                    this.swiperHeight = newValue
                },
                immediate:true
            },
            current:{//初始化选中项
                handler(newValue) {
                    this.activeCurrent = newValue
                },
                immediate:true
            },
			list:{//初始化数据列表--- 处理vue不能直接改变prpos属性
                handler(newValue) {
                    this.swiperList = newValue || []
                },
                immediate:true
            },
			fullScreen:{
				handler(newValue) {
				    if(this.fullScreen){//全屏设置---默认初始化设置一次
				        uni.getSystemInfo({
				            success:(e)=>{
				                console.log('e',e);
				    			this.swiperHeight = e.screenHeight - this.navHeight
				    			// #ifdef APP-PLUS || MP-WEIXIN
				    				this.swiperHeight = e.screenHeight - this.navHeight - e.statusBarHeight  
				    			// #endif  
				            }
				        })
				    }else{
						this.swiperHeight = this.height
					}
				},
				immediate:true
			}
        }, 
		mounted(){
			
		},
		methods: { 
			// 播放视频时让轮播停止自动轮播
			stopSwiperAuto(e){
				console.log("111111111",e)
				this.videoPlaySataus = e
			},
			timeupdate(e){//播放进度变化时触发--更新播放缓存   
				this.$set(this.swiperList[this.activeCurrent],'currentTime',e.detail.currentTime)
			},
			clickItem(index){
				if(this.list.length>0){
					this.$emit('clickItem',this.list[index])
				}
            },   
			change(e){//轮播改变触发   
				try{// 切换前暂停之前视频 
					let preSwiper = this.swiperList[this.activeCurrent] 
					if(preSwiper[this.fileType]==='video'){ 
						// uni.createVideoContext(`video_${this.activeCurrent}`,this).pause();
						this.$refs[`video_${this.activeCurrent}`][0].pausePlay()  
					} 
				}catch(e){
					//TODO handle the exception
				}   
				this.videoPlaySataus = false //自动切换关闭视频播放状态 
                this.activeCurrent = e.detail.current;  
				this.$emit('change',e) 
			},
			animationfinish(e){//动画结束后调用    
				this.moveX = 0
				this.$emit('animationfinish',e)  
			},
			transition(e){//滑动
				// #ifdef APP-PLUS
					this.moveX = e.detail.dx 
				// #endif
			},
			touchStart(e){//触摸
				console.log("e触摸: ",e);
			},
			touchEnd(e){//触摸
				console.log("e触摸结束: ",e);
			},
			clickCover(e){
				console.log("点击: ",e);  
			},
			touchmove(e){
				console.log("滑动中: ",e);
			}
		}
	}
</script> 
<style lang="scss" scoped>
.swiperContent{//容器
    width:100%;
    position: relative;
    // background-color: #ccc;  
    .z-screen-swiper {//轮播图
        min-height: 320rpx; 
        // background-color: rgb(211, 235, 107); //--调试样式
        box-sizing: border-box;
        .z-swiper-item{ 
            box-sizing: border-box;
            overflow: initial;  
            .swiper-box{//轮播图内容
                // background-color: #e7ca8f;//--调试样式
                // background-color: rgba(0,0,0,0.1);//swiper当前项 背景色---已改为配置
                box-sizing: border-box;
                width: 100%;
                height: 100%;
                overflow: hidden;
                display: flex;
                flex-direction: column; 
                justify-content: space-between;
                position: relative;
                color: #FFF;
                .swiper-top{
                    top: 0;
                    // background-color: rgba(0,0,0,0.2);//背景色---已改为配置
                }
                .swiper-content{
                    // background-color: rgb(61, 41, 175);   
                    flex: 1;  
					display: flex;
					flex-direction: column;
					justify-content: center;
					image{
						width:100%;
						height: 100%;
						max-height: 100%; 
					}
					video {// 视频默认不全屏高度---防止全屏swiper滑动切换
						width: 100%;   
						height: 100%; 
						// height: 750rpx;
                        // pointer-events: auto;  
					} 
                } 
                .swiper-fotter{
                    bottom: 0;
                    // background-color: rgba(0, 0, 0, 0.2); //背景色---已改为配置
                } 
                .isFloat{//是否浮动 顶部、底部定位
                    position: absolute;
                    left: 0;
                    right: 0; 
                    z-index: 999;
                }
            }  
        }
    }
    // .effect3D{//3d模式样式 
    //     .z-swiper-item{//3d模式基础样式  
    //         .swiper-box{  
    //             border-radius: 10rpx; 
    //             opacity: 0.7;
    //             transition: all 0.1s ease-in 0s;  
    //         } 
    //     }  
    //     &.effect3D-X{ 
    //         .z-swiper-item{ //选项卡间隔 
    //             padding: 0 10rpx;   
    //         } 
    //         .swiper-box{   
    //             transform: scale(1,0.9);   
    //         }    
    //     } 
    //     &.effect3D-Y{ 
    //         .z-swiper-item{ //选项卡间隔 
    //             padding:10rpx 0;   
    //         } 
    //         .swiper-box{   
    //             transform: scale(0.9,1);   
    //         }    
    //     } 
    //     .active-swiper{//选中样式恢复 
    //         .swiper-box{
    //             transform:initial; 
    //             opacity: 1; 
    //             transition: all 0.1s ease-in 0s;
    //         }
    //     }
       
    // }

    .dot{//指示器
        position: absolute; 
        z-index: 9999;  
        display: flex; 
        color: #FFF;   
        .dotItem{//指示器 颜色与形状 
            background-color: #fff;   
			font-size: 24rpx;
			color: #e2e2e2;
            margin-right: 10rpx;
            &.default{ /*默认条状 */
                height: 8rpx;
                width: 40rpx;
            }
            &.circle{ /* 圆 */
                height: 20rpx;
                width: 20rpx;  
                border-radius: 50%;
            }
            &.index{ /* 数字索引 */
                height: 30rpx;
                width: 30rpx; 
                display: flex;
                justify-content: center;
                align-content: center;
                border-radius: 50%;
            } 
            &.defautActive{//选中项设置
                transition: background-color 0.3s ease-out 0s; //选中动画
            }
            &.round{ /* 弧形 */
                height: 20rpx;
                width: 20rpx;  
                border-radius: 50%;
                &.defautActive{//弧形选中项设置 
                     width: 60rpx;
                     height: 20rpx; 
                     border-radius: 10px; 
                     transition: background-color 0.3s ease-out 0s; //
                }
            } 
        } 
        // 定位位置
        &.verticalDot{//垂直方向 只写了支持右侧定位
            right: 20rpx;
            top: 50%;
            transform: translateY(-50%);
            display: block; 
            margin: 0 !important; 
            .dotItem{
                margin: 0;
                margin-bottom: 10rpx;
                &.round{ /* 弧形 */
                    height: 20rpx;
                    width: 20rpx;  
                    border-radius: 50%;
                    &.defautActive{//弧形选中  
                        width: 20rpx;
                        height: 60rpx; 
                        border-radius: 10px;
                    }
                } 
            }
        }
        &.bottomLeft{//左上角
            left: 20rpx;
            bottom: 20rpx;  
        }
        &.bottomCenter{//
            left: 50%;
            bottom: 20rpx; 
            transform: translateX(-50%);
        }
        &.bottomRight{
            right: 20rpx;
            bottom: 20rpx;  
        }
        &.topLeft{
            left: 20rpx;
            top: 10rpx;  
        }
        &.topCenter{
            left: 50%;
            top: 10rpx;  
            transform: translateX(-50%);
        }
        &.topRight{
            right: 20rpx;
            top: 10rpx; 
        }
    }
} 
</style>
<style lang="scss" scoped>
#coverViewVideo{
	height: 200rpx;
	background-color: #ccc;
	width: 100%; 
}
</style>
