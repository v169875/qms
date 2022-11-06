<template>
	<!-- 我的粉丝 -->
	<view class="mine-attention-content p-l-30 p-r-30">
		<top-navbar :title="title" :isShowBorder="true"></top-navbar>
		<u-gap height="30"></u-gap>
		<view class="black-item p-30 flex col-center radius-20 m-b-30" v-for="(item,index) in userList" :key="index" @tap="handleUserDetail(item)">
			<u-avatar :src="item.fans.avatar_format" size="92"></u-avatar>
			<view class="m-l-22 u-flex-1">
				<view class="flex col-center row-between m-b-8">
					<view class="text-333 font-30" style="width: 70%;">{{item.fans.nickname}}</view>
				</view>
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
				title:'我的粉丝',
				userList:[],
				listQuery:{
          page:1,
          limit:15,
        },
        isLoad:false,
			};
		},
		onLoad() {
      let userInfo = uni.getStorageSync('userInfo');
      if(userInfo){
        this.userInfo = userInfo;
      }
			this.getUserList()
		},
		onReachBottom() {
			this.getUserList()
		},
		methods:{
      // 获取我的粉丝列表
			async getUserList(){
				if(this.isLoad) return;
        this.isLoad = true;
        const res = await this.$api.getFansList(this.listQuery);
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
      // 点击跳转用户主页
      handleUserDetail(item){
        this.$u.route({
          url:'/pages/mine/mineVideo/mineVideo',
          params:{
            user_id:item.follow_id,
            isAuthor:item.follow_id == this.userInfo.id,
          },
        })
      },
		}
	}
</script>

<style lang="scss" scoped>
	.mine-attention-content{
		.black-item{
			box-shadow: 0px 0px 14px 0px rgba(48, 119, 251, 0.1);
		}
	}
</style>
