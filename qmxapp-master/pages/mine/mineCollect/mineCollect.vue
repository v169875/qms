<template>
	<!-- 我的收藏 -->
	<view class="mine-collect-content">
		<top-navbar :title="title" :isShowBorder="true"></top-navbar>
		<u-gap height="30"></u-gap>
		<view class="store-list p-l-34">
			<block v-if="storeList.length > 0">
				<view class="store-item p-b-24 m-b-20 flex col-center" v-for="(item,index) in storeList" :key="index" @tap="handleGoDetail(item)">
					<u-image width="152rpx" height="152rpx" border-radius="10" :src="item.school.school_cover_image_format" mode="aspectFill"></u-image>
					<view class="u-flex-1 m-l-36 m-r-36">
						<view class="flex col-center row-between">
							<view class="text-bold text-black font-28">{{item.school.school_name}}</view>
							<view class="font-20 text-white collect-tag" @tap.stop="handleCancelCollect(item)">取消收藏</view>
						</view>
						<view class="m-t-18 m-b-18">
							<u-rate 
								:count="5" 
								v-model="item.school.score" 
								active-icon="star-fill" 
								inactive-icon="star-fill" 
								active-color="#F6D350" 
								inactive-color="#999999" 
								disabled></u-rate>
							<text class="m-l-16 font-24 text-333">{{item.school.score}}分</text>
						</view>
						<view class="hidden_one font-26 text-333">{{item.school.school_desc}}</view>
					</view>
				</view>
			</block>
			<view class="middleC" v-else>
				<u-empty text="暂无店铺" mode="list"></u-empty>
			</view>
			<u-gap height="30"></u-gap>
		</view>
		<u-modal v-model="modalShow" content="是否取消收藏?" show-cancel-button @cancel="handleModalCancel" @confirm="handleConfirmCancelCollect"></u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:'我的收藏',
				modalShow:false,
				storeList:[],
				listQuery:{
					page:1,
					limit:10,
				},
				isLoad:false,
				cancelStoreItem:{}, //需要取消关注的学校
			};
		},
		onLoad() {
			this.getStoreList();
		},
		onReachBottom() {
			this.getStoreList();
		},
		methods:{
      // 跳转学校/机构详情
      handleGoDetail(item){
        this.$u.route({
          url:'/pages/index/organizationDetail/organizationDetail',
          params:{
            school_id:item.school_id,
          },
        })
      },
			// 获取收藏列表
			async getStoreList(){
				if(this.isLoad) return;
				this.isLoad = true;
				const res = await this.$api.getFavoriteList(this.listQuery);
				if(res.code == 1){
					if(res.data.data.length > 0){
						this.storeList = this.storeList.concat(res.data.data);
						this.listQuery.page++;
						this.isLoad = false;
					}else{
						this.isLoad = false;
					}
				}
			},
			// 显示取消收藏模态框
			handleCancelCollect(item){
				this.cancelStoreItem = Object.assign({},item);
				this.modalShow = !this.modalShow;
			},
			// 点击隐藏模态框
			handleModalCancel(){
				this.cancelStoreItem = {};
			},
			// 确认取消收藏
			async handleConfirmCancelCollect(){
				let data = {
					school_id:this.cancelStoreItem.school_id,
				};
				const res = await this.$api.delFavorite(data);
				if(res.code == 1){
					this.$u.toast(res.msg);
					this.storeList = [];
					this.listQuery.page = 1;
					this.isLoad = false;
					this.getStoreList();
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.mine-collect-content{
		.store-list{
			.store-item{
				border-bottom: 1px solid rgba(153, 153, 153, .1);
				.collect-tag{
					background: #B5B5B5;
					border-radius: 10rpx;
					text-align: center;
					padding: 4rpx 14rpx;
				}
			}
		}
	}
</style>
