<template>
	<!-- 品牌介绍 -->
	<view class="brand-intr-detail-content">
		<top-navbar :title="title"></top-navbar>
		<u-gap height="30"></u-gap>
		<view class="flex col-center row-center">
			<u-image width="180rpx" height="180rpx" :src="schoolDetail.school_cover_image_format" mode="aspectFit"></u-image>
		</view>
		<view class="text-333 font-30 text-center m-t-28 m-b-26">{{schoolDetail.school_name}}</view>
		<scroll-view scroll-x class="brand-img-scroll flex col-center p-l-34 p-r-20">
			<view class="img-item m-r-16" v-for="(item,index) in swiperList" :key="index">
				<u-image width="216rpx" height="148rpx" :src="item" mode="aspectFill"></u-image>
			</view>
		</scroll-view>
		<view class="m-t-22 m-l-34 m-r-34 m-b-32">
			{{schoolDetail.school_introduce || '暂无'}}
		</view>
		<u-gap height="20" bg-color="#F5F5F5"></u-gap>
		<view class="m-t-30 p-l-34">
			
			<!--<view class="m-b-24">其他门店</view>-->
			<view class="other-item p-r-36 flex p-b-26 m-b-28" v-for="(item,index) in schoolList" :key="index" @tap="handleSchoolDetail(item.id)">
				<u-image width="148rpx" height="148rpx" :src="item.school_cover_image_format" mode="aspectFill"></u-image>
				<view class="other-right m-l-36 u-flex-1">
					<view class="flex col-top row-between">
						<view class="hidden_one" style="width: 80%;">{{item.school_name || '暂无'}}</view>
						<image src="/static/index/phone-icon.png" mode="aspectFit" @tap.stop="handleMakePhone(item.phone)"></image>
					</view>
					<view class="m-t-10 m-b-10 hidden_one">{{item.address_detail || '暂无'}}</view>
					<view class="">
						<u-icon name="map-fill" color="#666" size="28"></u-icon>
						<text class="font-26 text-333">{{item.km || '0'}}km</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				title:'品牌介绍',
        school_id:null,
        schoolDetail:{},
        swiperList:[],
        listQuery:{
          lng:'',
          lat:'',
          citys:'',
          page:1,
          limit:15,
          is_hot_switch:2,
          sort:1,
        },
        isLoad:false, 
        schoolList:[], //其他学校列表
			};
			
		},
    onLoad(options) {
      if(options.school_id){
        this.school_id = options.school_id * 1;
        this.getOrganSchoolDetail(this.school_id);
        let location = uni.getStorageSync('location');
        if(location){
          delete location.allAddress;
          Object.keys(location).forEach(key=>{
            this.listQuery[key] = location[key];
          })
          this.getSchoolList(this.listQuery);
        }
      }
    },
    onReachBottom() {
      this.getSchoolList(this.listQuery);
    },
    methods:{
      // 获取机构详情
      async getOrganSchoolDetail(school_id){
      	this.swiperList = [];
      	const res = await this.$api.getSchoolDetail({school_id});
      	if(res.code == 1){
      		this.schoolDetail = res.data;
      		this.swiperList = res.data.images_format;
      	}
      },
      // 获取其他学校/机构
      async getSchoolList(listQuery){
        const res = await this.$api.getSchoolList(listQuery);
        if(res.code == 1){
          if(res.data.data.length > 0){
            this.schoolList = this.schoolList.concat(res.data.data);
            this.listQuery.page++;
            this.isLoad = false;
          }else{
            this.isLoad = false;
          }
        }
      },
      // ?school_id=25
      // 跳转其他学校/机构详情
      handleSchoolDetail(school_id){
        this.$u.route({
          url:'/pages/index/organizationDetail/organizationDetail',
          params:{
            school_id
          }
        })
      },
      // 打电话事件
      handleMakePhone(phone) {
        uni.makePhoneCall({
      		phoneNumber:phone,
      		success: (res) => {
      			console.log(res);
      		},
        });
      },
    }
	}
</script>

<style lang="scss" scoped>
	.brand-intr-detail-content{
		.brand-img-scroll{
			white-space: nowrap;
			.img-item{
				display: inline-block;
			}
		}
		.other-item{
			border-bottom:1px solid rgba(153, 153, 153, .1);
			.other-right{
				image{
					width: 50rpx;
					height: 50rpx;
				}
			}
		}
	}
</style>
