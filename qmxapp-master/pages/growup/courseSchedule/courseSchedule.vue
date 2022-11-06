<template>
  <view class="course-schedule-content">
    <top-navbar :title="title" :isShowBorder="true"></top-navbar>
    <u-gap height="46"></u-gap>
    <view class="flex schedule-tab">
      <view class="text-center main-color font-28" :class="{'active-schedule-tab':scheduleIdx == index}"
        v-for="(item,index) in scheduleTabs" :key="index" @tap="handleChangeTabs(index)">
        {{item}}
      </view>
    </view>
    <view class="select-row flex col-center row-center m-t-26 m-b-26">
      <view class="flex col-center class-title rela" @click="timeShow = !timeShow">
        <view class="m-r-14">{{nowdate}}</view>
        <u-icon name="arrow-down-fill" color="#666666" size="28"></u-icon>
      </view>
    </view>
    <view class=" schedule-body" :class="scheduleIdx == 0 ? 'p-l-34 p-r-34' : ''" v-if="weekList.length > 0">
      <!-- 日显示 -->
      <view class="" v-if="scheduleIdx == 0">
        <!-- 星期行 -->
        <view class="flex col-center row-between text-center">
          <view v-for="(item,index) in weekList" :key="index" class="p-6 text-bold text-666"
            :style="index == isDay ? 'background:#D6E4FE;color:#3077FB;' : ''">
            <view class="flex-col row-center" :style="index == isDay ? 'color:#3077FB;' : ''"
              @click="handleChangeWeek(index)">
              <view class="font-28 schedule-th">{{item.week_name}}</view>
              <view class="font-26 schedule-th">{{item.week_time_foramt}}</view>
            </view>
          </view>
        </view>
        <block v-if="weekList[isDay]">
          <view class="flex col-center row-between m-t-16 m-b-16" v-for="(item,index) in weekList[isDay].today_data"
            :key="index">
            <view style="text-align: left;">
              <text class="font-26">{{item.start_hour}}</text>
            </view>
            <view style="text-align: left;">
              <text class="font-26">{{item.class_name}}</text>
            </view>
            <view>
              <view class="font-24 check-detail-btn radius-35 p-t-2 p-b-2" @tap="handleCourseDetailShow(item)">查看课程详情
              </view>
            </view>
          </view>
          <view class="" v-if="weekList[isDay].today_data.length <= 0">
            <u-gap height="300"></u-gap>
            <u-empty text="暂无课程" mode="data"></u-empty>
          </view>
        </block>
      </view>
      <!-- 周显示 -->
      <view class="" v-if="scheduleIdx == 1">
        <!-- 星期行  -->
        <scroll-view scroll-x class="flex col-center row-between text-center new-schedule-scroll p-l-40">
          <!--   m-l-68 -->
          <view class="flex col-center top-th text-666" :style="{'width': (weekList.length + 1) * 120 + 'rpx'}">
            <view class="new-week-th ">
              <view class="schedult-logo">
                <u-image style="margin: 0 auto;" src="/static/growup/schedule-icon.png" width="60rpx" height="60rpx" mode="aspectFit"></u-image>
              </view>
            </view>

            <view v-for="(item,index) in weekList" :key="index" class="p-6 text-bold new-week-th">
              <view class="flex-col row-center">
                <view class="font-28 schedule-th">{{item.week_name}}</view>
                <view class="font-26 schedule-th">{{item.week_time_foramt}}</view>
              </view>
            </view>
          </view>
          <view class="course-body":style="{'width': (weekList.length + 1) * 120 + 'rpx'}">
            <!-- 周一 -->
            <block v-if="weekList">
              <view class="flex col-center m-t-16 m-b-16 course-row"
                v-for="(item,index) in weekList[0].today_data" :key="index + 'one'">
                <view class="start-time">{{item.start_hour}}</view>
                <view class="day-course-row flex u-flex-1">
                  <!-- 一 -->
                  <view class="course-item" @tap="handleCourseDetailShow(item)">{{item.class_name.length > 4 ?  item.class_name.slice(0,4) + '..' : item.class_name}}</view><!-- 判断课程名称长度 -->
                  <!-- 二 -->
                  <view class="course-item"></view>
                  <!-- 三 -->
                  <view class="course-item"></view>
                  <!-- 四 -->
                  <view class="course-item"></view>
                  <!-- 五 -->
                  <view class="course-item"></view>
                  <!-- 六 -->
                  <view class="course-item"></view>
                  <!-- 七 -->
                  <view class="course-item"></view>
                </view>
              </view>
            </block>
            <!-- 周二 -->
            <block v-if="weekList">
              <view class="flex col-center m-t-16 m-b-16 course-row"
                v-for="(item,index) in weekList[1].today_data" :key="index + 'two'">
                <view class="start-time">{{item.start_hour}}</view>
                <view class="day-course-row flex u-flex-1">
                  <!-- 一 -->
                  <view class="course-item"></view>
                  <!-- 二 -->
                  <view class="course-item" @tap="handleCourseDetailShow(item)">{{item.class_name.length > 4 ?  item.class_name.slice(0,4) + '..' : item.class_name}}</view><!-- 判断课程名称长度 -->
                  <!-- 三 -->
                  <view class="course-item"></view>
                  <!-- 四 -->
                  <view class="course-item"></view>
                  <!-- 五 -->
                  <view class="course-item"></view>
                  <!-- 六 -->
                  <view class="course-item"></view>
                  <!-- 七 -->
                  <view class="course-item"></view>
                </view>
              </view>
            </block>
            <!-- 周三 -->
            <block v-if="weekList">
              <view class="flex col-center m-t-16 m-b-16 course-row"
                v-for="(item,index) in weekList[2].today_data" :key="index + 'three'">
                <view class="start-time">{{item.start_hour}}</view>
                <view class="day-course-row flex u-flex-1">
                  <!-- 一 -->
                  <view class="course-item"></view>
                  <!-- 二 -->
                  <view class="course-item"></view>
                  <!-- 三 -->
                  <view class="course-item" @tap="handleCourseDetailShow(item)">{{item.class_name.length > 4 ?  item.class_name.slice(0,4) + '..' : item.class_name}}</view><!-- 判断课程名称长度 -->
                  <!-- 四 -->
                  <view class="course-item"></view>
                  <!-- 五 -->
                  <view class="course-item"></view>
                  <!-- 六 -->
                  <view class="course-item"></view>
                  <!-- 七 -->
                  <view class="course-item"></view>
                </view>
              </view>
            </block>
            <!-- 周四 -->
            <block v-if="weekList">
              <view class="flex col-center m-t-16 m-b-16 course-row"
                v-for="(item,index) in weekList[3].today_data" :key="index + 'four'">
                <view class="start-time">{{item.start_hour}}</view>
                <view class="day-course-row flex u-flex-1">
                  <!-- 一 -->
                  <view class="course-item"></view>
                  <!-- 二 -->
                  <view class="course-item"></view>
                  <!-- 三 -->
                  <view class="course-item"></view>
                  <!-- 四 -->
                  <view class="course-item" @tap="handleCourseDetailShow(item)">{{item.class_name.length > 4 ?  item.class_name.slice(0,4) + '..' : item.class_name}}</view><!-- 判断课程名称长度 -->
                  <!-- 五 -->
                  <view class="course-item"></view>
                  <!-- 六 -->
                  <view class="course-item"></view>
                  <!-- 七 -->
                  <view class="course-item"></view>
                </view>
              </view>
            </block>
            <!-- 周五 -->
            <block v-if="weekList">
              <view class="flex col-center m-t-16 m-b-16 course-row"
                v-for="(item,index) in weekList[4].today_data" :key="index + 'five'">
                <view class="start-time">{{item.start_hour}}</view>
                <view class="day-course-row flex u-flex-1">
                  <!-- 一 -->
                  <view class="course-item"></view>
                  <!-- 二 -->
                  <view class="course-item"></view>
                  <!-- 三 -->
                  <view class="course-item"></view>
                  <!-- 四 -->
                  <view class="course-item"></view>
                  <!-- 五 -->
                  <view class="course-item" @tap="handleCourseDetailShow(item)">{{item.class_name.length > 4 ?  item.class_name.slice(0,4) + '..' : item.class_name}}</view><!-- 判断课程名称长度 -->
                  <!-- 六 -->
                  <view class="course-item"></view>
                  <!-- 七 -->
                  <view class="course-item"></view>
                </view>
              </view>
            </block>
            <!-- 周六 -->
            <block v-if="weekList">
              <view class="flex col-center m-t-16 m-b-16 course-row"
                v-for="(item,index) in weekList[5].today_data" :key="index + 'six'">
                <view class="start-time">{{item.start_hour}}</view>
                <view class="day-course-row flex u-flex-1">
                  <!-- 一 -->
                  <view class="course-item"></view>
                  <!-- 二 -->
                  <view class="course-item"></view>
                  <!-- 三 -->
                  <view class="course-item"></view>
                  <!-- 四 -->
                  <view class="course-item"></view>
                  <!-- 五 -->
                  <view class="course-item"></view>
                  <!-- 六 -->
                  <view class="course-item" @tap="handleCourseDetailShow(item)">{{item.class_name.length > 4 ?  item.class_name.slice(0,4) + '..' : item.class_name}}</view><!-- 判断课程名称长度 -->
                  <!-- 七 -->
                  <view class="course-item"></view>
                </view>
              </view>
            </block>
            <!-- 周日 -->
            <block v-if="weekList">
              <view class="flex col-center m-t-16 m-b-16 course-row"
                v-for="(item,index) in weekList[0].today_data" :key="index + 'seven'">
                <view class="start-time">{{item.start_hour}}</view>
                <view class="day-course-row flex u-flex-1">
                  <!-- 一 -->
                  <view class="course-item"></view>
                  <!-- 二 -->
                  <view class="course-item"></view>
                  <!-- 三 -->
                  <view class="course-item"></view>
                  <!-- 四 -->
                  <view class="course-item"></view>
                  <!-- 五 -->
                  <view class="course-item"></view>
                  <!-- 六 -->
                  <view class="course-item"></view>
                  <!-- 七 -->
                  <view class="course-item" @tap="handleCourseDetailShow(item)">{{item.class_name.length > 4 ?  item.class_name.slice(0,4) + '..' : item.class_name}}</view><!-- 判断课程名称长度 -->
                </view>
              </view>
            </block>
          </view>
        </scroll-view>

      </view>
    </view>
    <!-- 选择日期 -->
    <u-calendar v-model="timeShow" mode="date" @change="handleConfirmTime"></u-calendar>
    <!-- 课程详情 -->
    <u-popup v-model="courseDetailShow" mode="center" width="80%" border-radius="30">
      <u-gap height="30"></u-gap>
      <view class="flex col-center row-between p-l-40 p-r-40">
        <u-icon name="close" color="#666666" size="28" style="visibility: hidden;"></u-icon>
        <view class="font-30">课程详情</view>
        <u-icon name="close" color="#666666" size="28" @tap="handleCloseCoursePopup()"></u-icon>
      </view>
      <view class="flex col-center row-between m-l-44 m-r-44 m-t-22 m-b-22">
        <view class="m-r-22">课程名称：</view>
        <view class="u-flex-1 text-right">{{courseDetailInfo.class_name || '未填写'}}</view>
      </view>
      <view class="flex col-center row-between m-l-44 m-r-44 m-t-22 m-b-22">
        <view class="m-r-22">上课日期：</view>
        <view class="u-flex-1 text-right">{{courseDetailInfo.start_time || '未填写'}}</view>
      </view>
      <view class="flex col-center row-between m-l-44 m-r-44 m-t-22 m-b-22">
        <view class="m-r-22">上课时间：</view>
        <view class="u-flex-1 text-right">{{courseDetailInfo.start_hour || '未填写'}}</view>
      </view>
      <view class="flex col-center row-between m-l-44 m-r-44 m-t-22 m-b-22">
        <view class="m-r-22">下课时间：</view>
        <view class="u-flex-1 text-right">{{courseDetailInfo.end_hour || '未填写'}}</view>
      </view>
      <view class="flex col-center row-between m-l-44 m-r-44 m-t-22 m-b-22">
        <view class="m-r-22">是否接送提醒：</view>
        <view class="u-flex-1 text-right">{{courseDetailInfo.is_remind == 1 ? '是' : '否' || '未填写'}}</view>
      </view>
      <view class="flex col-center row-between m-l-44 m-r-44 m-t-22 m-b-22">
        <view class="m-r-22">接送人：</view>
        <view class="u-flex-1 text-right">{{courseDetailInfo.driver_real_name || '未填写'}}</view>
      </view>
      <view class="flex col-center row-between m-l-44 m-r-44 m-t-22 m-b-22">
        <view class="m-r-22">上课地址：</view>
        <view class="u-flex-1 text-right">{{courseDetailInfo.class_address || '未填写'}}</view>
      </view>
      <view class="flex col-center row-between m-l-44 m-r-44 m-t-22 m-b-22">
        <view class="m-r-22">上课老师:</view>
        <view class="u-flex-1 text-right">{{courseDetailInfo.class_teacher || '未填写'}}</view>
      </view>
      <view class="flex col-center row-between m-l-44 m-r-44 m-t-22 m-b-22">
        <view class="m-r-22">联系方式：</view>
        <view class="u-flex-1 text-right">{{courseDetailInfo.class_teacher_phone || '未填写'}}</view>
      </view>
      <u-gap height="46"></u-gap>
      <view class="dyan-btn">
      	<view class="btn-1">
      		<u-button :custom-style="customBtnStyle1" shape="circle" :hair-line="false" @click="handleDeleteCourse()">删除课程</u-button>
      	</view>
      </view>
      <u-gap height="46"></u-gap>
    </u-popup>
    <view class="add-journey" @tap="handleCreateCourse()">
      <u-image width="124rpx" height="124rpx" src="/static/growup/add-journey-icon.png" mode="aspectFit">
      </u-image>
    </view>
    <u-modal v-model="deleteCourseShow" content="是否删除该课程?" show-cancel-button @cancel="handleCancelModal" @confirm="handleConfirmModal"></u-modal>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        title: '课程表',
        scheduleTabs: ['日', '周'],
        scheduleIdx: 0, //tabs下标
        isDay: 1, //今天
        timeShow: false, //日期月份选择
        params: {
          year: true,
          month: true,
          day: false,
          hour: false,
          minute: false,
          second: false
        },
        // 星期列表
        weekList: [],
        nowdate: new Date().toISOString().slice(0, 10), //今天的年月日
        courseDetailShow: false, //课程详情弹窗
        courseDetailInfo: {}, //课程详情
        customBtnStyle1:getApp().globalData.customStyle1,
        deleteCourseShow:false,  //删除课程模态框
      };
    },
    onShow() {

      // 进入页面默认获取今天日期
      this.getWeekTabList(this.nowdate)
    },
    methods: {
      // 切换tab
      handleChangeTabs(index) {
        if (this.scheduleIdx == index) return;
        this.scheduleIdx = index;
        this.getWeekTabList(this.nowdate);
      },
      // 点击选择日期或者月份
      handleConfirmTime(e) {
        this.nowdate = e.result;
        this.getWeekTabList(this.nowdate);
      },
      // 切换周几
      handleChangeWeek(index) {
        if (this.isDay == index) return;
        this.isDay = index;
      },
      // 获取课程列表
      async getWeekTabList(date) {
        let data = {
          class_type: this.scheduleIdx == 0 ? 1 : 2,
          start_time: this.GetMonday(date),
          end_time: this.GetSunday(date),
        };
        const res = await this.$api.getTimeTableList(data);
        if (res.code == 1) {
          var str = "周" + "日一二三四五六".charAt(new Date().getDay());
          this.weekList = res.data;
          this.weekList.map((item, index) => {
            if (item.week_name == str) {
              this.isDay = index;
            }
          })
        }
      },
      // 获取某天周一的日期
      GetMonday(date) {
        var dd = new Date(date)
        var week = dd.getDay(); //获取时间的星期数
        var minus = week ? week - 1 : 6;
        dd.setDate(dd.getDate() - minus); //获取周一日期
        var y = dd.getFullYear();
        var m = dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1;
        var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();
        return y + "-" + m + "-" + d;
      },
      // 获取某天周日的日期
      GetSunday(date) {
        var dd = new Date(date)
        var week = dd.getDay(); //获取时间的星期数
        var minus = week ? week - 1 : 6;
        dd.setDate(dd.getDate() - minus); //获取周一日期
        dd.setDate(dd.getDate() + 6) //加6得到周日日期
        var y = dd.getFullYear();
        var m = dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1;
        var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();
        return y + "-" + m + "-" + d;
      },
      // 点击跳转到添加课程
      handleCreateCourse() {
        this.$u.route({
          url: '/pages/growup/courseSchedule/createCourse/createCourse',
        })
      },
      // 点击查看课程详情
      async handleCourseDetailShow(item) {
        let data = {
          id: item.id,
        };
        const res = await this.$api.getTimeTableDetail(data);
        if (res.code == 1) {
          this.courseDetailInfo = res.data;
          this.courseDetailShow = !this.courseDetailShow;
        }
      },
      // 点击关闭课程详情
      handleCloseCoursePopup() {
        this.courseDetailShow = false;
        this.courseDetailInfo = {};
      },
      // 详情弹窗内删除课程按钮，显示是否删除模态框
      handleDeleteCourse(){
        this.deleteCourseShow = !this.deleteCourseShow;
      },
      // 取消删除模态框
      handleCancelModal(){
        this.deleteCourseShow = false;
        this.handleCloseCoursePopup();
      },
      // 确认删除模态框
      async handleConfirmModal(){
        const res = await this.$api.delTimeTable({id:this.courseDetailInfo.id});
        if(res.code == 1){
          this.$u.toast(res.msg);
          this.deleteCourseShow = false;
          this.handleCloseCoursePopup();
          this.getWeekTabList(this.nowdate);
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  .course-schedule-content {
    .schedule-tab {
      padding: 0 137rpx;

      >view {
        width: calc(100% / 2);
        border: 1px solid #3077FB;
        padding: 16rpx 0;
      }

      >view:first-child {
        border-top-left-radius: 35rpx;
        border-bottom-left-radius: 35rpx;
      }

      >view:last-child {
        border-top-right-radius: 35rpx;
        border-bottom-right-radius: 35rpx;
      }

      .active-schedule-tab {
        background: #3077FB;
        color: #fff !important;
      }
    }

    .select-row {
      .class-title {
        padding: 6rpx 19rpx;
        border: 1px solid #666;
        border-radius: 10rpx;
      }
    }

    .schedule-body {
      .check-detail-btn {
        color: #3077FB !important;
        border: 1px solid #3077FB;
        padding: 4rpx 10rpx;
      }
      // 周课程表样式
      .new-schedule-scroll{
        white-space: nowrap;
        .top-th{
          background: #F8F8F8;
        }
        .schedult-logo {
          background: #D6E4FE;
          padding: 20rpx 0;
        }
        .new-week-th{
          min-width: 120rpx;
        }
        .course-row {
          font-size:22rpx;
          .start-time{
            min-width: 120rpx;
          }
          .day-course-row{
            .course-item{
              text-align: center;
              width:calc(100% / 7 - 20rpx);
              min-width: 120rpx;
              padding: 6rpx 0;
              background: #D6E4FE;
              color: #3077FB;
              border: 4rpx solid #fff;
            }
          }
        }
      }
      // 日课程表样式
      .schedule-scroll {
        white-space: nowrap;

        /deep/ .uni-scroll-view-content {
          display: flex;
          align-items: center;
          flex-direction: column;

          .schedult-logo {
            background: #D6E4FE;
          }

          .scroll-item {
            width: 100rpx;
            display: inline-block;
          }
          .course-body {
            width: 100%;
            padding-left: 26rpx;
            // view{
            //   width: calc(100% / 7 + 10rpx);
            //   border:1px solid red;
            // }
          }
        }

      }

      // .u-table {
      // 	/deep/ .u-tr {


      // 		& .u-th:nth-child(var(--isDay)) {
      // 			background: #D6E4FE !important;
      // 			// color: var(--isDay) !important;
      // 			color: #3077FB !important;
      // 		}

      // 		.schedule-th {
      // 			// color: #666;
      // 		}
      // 	}
      // }
    }

    .add-journey {
      position: fixed;
      bottom: 176rpx;
      right: 28rpx;
    }
  }
</style>
