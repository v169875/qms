<template>
	<!-- 足迹 -->
	<view class="mine-footprint-content">
		<top-navbar :title="title" :isShowBorder="true" :isShowFootPrint="true" @onClearFootPrint="handleClearFootPrint"></top-navbar>
		<u-gap height="30"></u-gap>
		<!-- 课程推荐 卡片 -->
		<view class="course-list">
			<block v-for="(item,index) in mineVideoList" :key="index">
				<course-card
					:courseItem="item" 
					:rowNum="3" 
					:isShowPriceRow="false" 
					:isShowLookNum="true"
					:isShowPlayIcon="true"
					:isShowDelIcon="true"
				  :videoIndex="index"
				  :dataList="mineVideoList"
				  :listQuery="listQuery"
          :isCourseCard="false"
				  isCardType='isVideo'
					>
				</course-card>
			</block>
		</view>
		<view class="middleC" v-if="mineVideoList.length <= 0">
			<u-empty text="暂无足迹" mode="data"></u-empty>
		</view>
		<u-gap height="30"></u-gap>
		<u-modal v-model="modalShow" content="是否清空足迹" show-cancel-button @confirm="handleConfirmClear"></u-modal>
	</view>
</template>

<script>
	// 课程卡片
	import courseCard from '@/components/course-card/course-card.vue'
	export default {
		components:{
			courseCard
		},
		data() {
			return {
				title:'足迹',
				modalShow:false,
        videoList:[],
        mineVideoList:[],
        listQuery:{
          page:1,
          limit:20,
        },
        isLoad:false,
			};
		},
		onLoad() {
      this.getMineFootprintList();
		},
		onReachBottom() {
      this.getMineFootprintList();
		},
		methods:{
			// 是否显示清空足迹弹窗
			handleClearFootPrint(show){
				this.modalShow = show;
			},
			// 点击确认清空足迹
			async handleConfirmClear(){
				const res = await this.$api.delAllFootprint();
        if(res.code == 1){
          this.$u.toast(res.msg);
          this.listQuery.page = 1;
          this.mineVideoList = [];
          this.isLoad = false;
          this.getMineFootprintList();
        }
			},
      // 获取我的足迹列表
      async getMineFootprintList(){
        if(this.isLoad) return;
        this.isLoad = true;
        const res = await this.$api.getFootprintList(this.listQuery);
        if(res.code == 1){
          if(res.data.data.length > 0){
            res.data.data.map((item,index)=>{
              this.$set(item.video,'isplay',true); //是否播放音频
              this.$set(item.video,'isShowProgressBarTime',false); //是否显示进度条（默认这个即可）
              this.$set(item.video,'state','pause'); //初始状态标志（不改）
              this.$set(item.video,'isShowimage',false); //是否显示封面（默认这个即可）
              this.$set(item.video,'playIng',false); //播放（默认这个即可）
              this.videoList.push(item.video);
            })
            this.mineVideoList = this.mineVideoList.concat(this.videoList);
            this.listQuery.page++;
            this.isLoad = false;
          }else{
            this.isLoad = false;
          }
        }
      },
		}
	}
</script>

<style lang="scss" scoped>
	.mine-footprint-content{
		
	}
</style>
