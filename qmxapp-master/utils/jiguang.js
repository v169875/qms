// import {
// 	url
// } from '@/config/config.js'


const jyJPush = uni.requireNativePlugin('JY-JPush');
export const initJypush = function init() {
	// #ifdef APP-PLUS
	uni.getSystemInfo({
		success: (res) => {
			if (res.platform == 'ios') {	
				addListenter('ios')
			} else {
				jyJPush.android_init(res => {
          // uni.showToast({
          // icon:'none',
          // title: JSON.stringify(res)
          // })
          addListenter('android')
				})
			}
		}
	})
	// #endif
	// #ifdef H5
	 bindRegisterId('18071adc03fbc49f1f9', 'android')
	// #endif
}
// 绑定别名，别名一般为用户的id，登录后把id传过来
export function bindJiguangUser(user_id){
  jyJPush.setJYJPushAlias({
    userAlias:user_id,
    }, result=> {
    //  设置成功或者失败，都会通过这个result回调返回数据；数据格式保持极光返回的安卓/iOS数据一致
    //  注：若没有返回任何数据，考虑是否初始化完成
    // uni.showToast({
    // icon:'none',
    // title: JSON.stringify(result)
    // })
  });
};

function addListenter(system) {
  // 查询别名，没啥用
  jyJPush.getJYJPushAlias({
    //  可以不用传值进去，但是需要配置这项数据
    }, result=> {

  });
  // 获取极光返回的唯一id，每台设备不一样，每台设备可共用多个账号，退出登陆时不用清除
	jyJPush.getRegistrationID(
    //  返回的数据会有registrationID，errorCode
    result => {
      uni.setStorageSync('regs_id', result.registrationID)
      console.log('存入了registrationID',uni.getStorageSync('regs_id'))
      // bindRegisterId(result.registrationID, system)
  });
  // 关闭推送
  jyJPush.stopJYJPush(result => {
    console.log('我关闭了推送',result)
  });
  // 开启推送
  jyJPush.resumeJYJPush(result => {
    console.log('我开启了推送',result)
  });
	// 监听消息通知事件
	jyJPush.addJYJPushReceiveNotificationListener(result => {
		//  监听成功后，若收到推送，会在result返回对应的数据；数据格式保持极光返回的安卓/iOS数据一致
		console.log(result)
	});

	// 监听点击通知栏消息事件
	jyJPush.addJYJPushReceiveOpenNotificationListener(result => {
		//  监听成功后，若点击推送消息，会触发result；数据格式保持极光返回的安卓/iOS数据一致
		console.log(res)
	});

	// 监听消息点击事件（APP进程被杀死后，消息还存在通知栏的时候，点击消息会出触发这个方法）
	jyJPush.getLastPushInfo(result => {
		console.log(result)
	});
}
// function bindRegisterId(id, system) {
// 	uni.request({
// 		url: url + 'Jpush/addBindJpush',
// 		method: 'POST',
// 		data: {
// 			registration_id: id,
// 			uid: uni.getStorageSync('userinfo').id,
// 			_platform: system
// 		},
// 		header: {
// 			'content-type': 'application/json',
// 			'token': uni.getStorageSync('token')
// 		},
// 		success: (res) => {
// 			console.log({
// 				registration_id: id,
// 				uid: uni.getStorageSync('userinfo').id,
// 				_platform: system
// 			})
// 			console.log(res)
// 		}
// 	})
// }
