<template>
	<!-- 我的拉黑 -->
	<view class="mine-black-content p-l-30 p-r-30">
		<top-navbar :title="title" :isShowBorder="true"></top-navbar>
		<u-gap height="30"></u-gap>
		<view class="black-item p-30 flex col-center radius-20 m-b-30" v-for="(item,index) in userList" :key="index">
			<u-avatar :src="item.black.avatar_format" size="92"></u-avatar>
			<view class="m-l-22 u-flex-1">
				<view class="flex col-center row-between m-b-8">
					<view class="text-333 font-30" style="width: 80%;">{{item.black.nickname}}</view>
					<view class="font-28" style="color: red;" @tap="handleRelieveBlock(item.id)">解除</view>
				</view>
				<view class="text-333 font-26">拉黑时间：{{item.black.createtime_format}}</view>
			</view>
		</view>
		<view class="middleC" v-if="userList.length <= 0">
			<u-empty text="暂无用户" mode="list"></u-empty>
		</view>
		<u-gap height="30"></u-gap>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:'我的拉黑',
				userList:[],
        listQuery:{
          page:1,
          limit:20,
        },
        isLoad:false,
			};
		},
		onLoad() {
			this.getUserList()
		},
		onReachBottom() {
			this.getUserList()
		},
		methods:{
			async getUserList(){
        if(this.isLoad) return;
        this.isLoad = true;
        const res = await this.$api.getBlackList(this.listQuery);
        if(res.code == 1){
          if(res.data.data.length > 0){
            this.userList = this.userList.concat(res.data.data);
            this.listQuery.page++;
            this.isLoad = false;
          }else{
            this.isLoad = false;
          }
        }
			},
      // 解除拉黑
      async handleRelieveBlock(id){
        let data = {
          black_log_id:id,
        };
        const res = await this.$api.cancelBlack(data);
        if(res.code == 1){
          this.$u.toast(res.msg);
          this.listQuery.page = 1;
          this.isLoad = false;
          this.userList = [];
          this.getUserList();
        }
      }
		}
	}
</script>

<style lang="scss" scoped>
	.mine-black-content{
		.black-item{
			box-shadow: 0px 0px 14px 0px rgba(48, 119, 251, 0.1);
		}
	}
</style>
