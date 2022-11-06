<template>
  <!-- 选择地区 -->
  <view>
    <top-navbar :title="title"></top-navbar>
    <t-index-address @select="select"></t-index-address>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        title:'地区选择',
        location:{},
      };
    },
    onLoad() {
      let location = uni.getStorageSync('location');
      if(location){
        this.location = location;
      }
    },
    methods:{
      select(data) {
        // let userLocation = {
        //   lng:data.lng,
        //   lat:data.lat,
        //   citys:data.name,
        // };
        this.getAddressDetail(data.lng,data.lat)
        
      },
      // 获取详细地址信息
      async getAddressDetail(lng,lat){
				// #ifdef APP-PLUS
        uni.request({
          //注意:这里的key值需要高德地图的 web服务生成的key  只有web服务才有逆地理编码
          url:`http://api.map.baidu.com/geocoder?location=${lat},${lng}&output=json`,
          success:(res)=>{
            if(res.data.status == 'OK'){
              var addressList = [];
              addressList.push(res.data.result.addressComponent.province,res.data.result.addressComponent.city,res.data.result.addressComponent.district);
              // var address = res.data.result.addressComponent.province + res.data.result.addressComponent.city + res.data.result.addressComponent.district; // 转换后的地理位置
              // var reg = /.+?(省|市|自治区|自治州|县|区)/g;
              // var addressList = address.match(reg).toString().split(",");
              var addressSlice = [];  //用于保留切割后的省市区
              // 只保留省市区  不用于首页定位
              if(addressList.length > 3){
                addressSlice = addressList.slice(0,3)
              }else{
                addressSlice = addressList;
              }
              let allAddress = addressSlice.join('/');  //斜杠拼接省市区
              //注意 首页定位专用 因为存在直辖市， 当所在地区为普通省市时，addressList.length == 3，city = addressList[1];当所在地区为直辖市时addressList.length == 2，city = addressList[0];
              let city = addressList.length >= 3?addressList[1]:addressList[0];
              let location = {
                lng:lng,
                lat:lat,
                citys:city,
                allAddress:allAddress,
                street: ''
              };
              if(this.location){
                Object.keys(location).forEach(key => {
                  this.location[key] = location[key];
                })
                console.log('获取中文街道地理位置成功',location)
                // 更新为选择后的省市区
                uni.setStorageSync('location',this.location);
                uni.$emit('location',this.location);
                this.$u.route({
                  type:'back',
                })
              }
            }else{
              this.getAddressDetail(lng,lat);
            }
          },
        })
				// #endif
				// #ifdef H5
				let data = {
					longitude: lng,
					latitude: lat
				}
				const res = await this.$api.reverseGeocoder(data);
				if (res.code == 1) {
					var addressList = [];
					addressList.push(res.data.province,res.data.city,res.data.district);
					// var address = res.data.result.addressComponent.province + res.data.result.addressComponent.city + res.data.result.addressComponent.district; // 转换后的地理位置
					// var reg = /.+?(省|市|自治区|自治州|县|区)/g;
					// var addressList = address.match(reg).toString().split(",");
					var addressSlice = [];  //用于保留切割后的省市区
					// 只保留省市区  不用于首页定位
					if(addressList.length > 3){
					  addressSlice = addressList.slice(0,3)
					}else{
					  addressSlice = addressList;
					}
					let allAddress = addressSlice.join('/');  //斜杠拼接省市区
					//注意 首页定位专用 因为存在直辖市， 当所在地区为普通省市时，addressList.length == 3，city = addressList[1];当所在地区为直辖市时addressList.length == 2，city = addressList[0];
					let city = addressList.length >= 3?addressList[1]:addressList[0];
					let location = {
					  lng:lng,
					  lat:lat,
					  citys:city,
					  allAddress:allAddress,
            street: ''
					};
					if(this.location){
					  Object.keys(location).forEach(key => {
					    this.location[key] = location[key];
					  })
					  console.log('获取中文街道地理位置成功',location)
					  // 更新为选择后的省市区
					  uni.setStorageSync('location',this.location);
					  uni.$emit('location',this.location);
					  this.$u.route({
					    type:'back',
					  })
					}
				}
				// #endif
        
        // var point = new plus.maps.Point(lng,lat);
        // plus.maps.Map.reverseGeocode(
        //   point, {},(event)=>{
        //     var address = event.address; // 转换后的地理位置
        //     var point = event.coord; // 转换后的坐标信息
        //     var coordType = event.coordType; // 转换后的坐标系类型
        //     var reg = /.+?(省|市|自治区|自治州|县|区)/g;
        //     console.log(address.match(reg));
        //     var addressList = address.match(reg).toString().split(",");
        //     var addressSlice = [];  //用于保留切割后的省市区
        //     // 只保留省市区  不用于首页定位
        //     if(addressList.length > 3){
        //     	addressSlice = addressList.slice(0,3)
        //     }else{
        //     	addressSlice = addressList;
        //     }
        //     let allAddress = addressSlice.join('/');  //斜杠拼接省市区
        //     //注意 首页定位专用 因为存在直辖市， 当所在地区为普通省市时，addressList.length == 3，city = addressList[1];当所在地区为直辖市时addressList.length == 2，city = addressList[0];
        //     let city = addressList.length >= 3?addressList[1]:addressList[0];
        //     let location = {
        //       lng:lng,
        //       lat:lat,
        //       citys:city,
        //       allAddress:allAddress,
        //     };
        //     if(this.location){
        //       Object.keys(location).forEach(key => {
        //         this.location[key] = location[key];
        //       })
        //       // 更新为选择后的省市区
        //       uni.setStorageSync('location',this.location);
        //       uni.$emit('location',this.location);
        //       this.$u.route({
        //         type:'back',
        //       })
        //     }
        //   },
        //   function(e) {}
        // );
      }
    }
  }
</script>

<style lang="scss">

</style>
