const BASE_URL = 'https://h.fqqmx.com/'
const httpUrl = BASE_URL + ""

// const httpUrl = "https://h.fqqmx.com/" // 接口地址
// const httpUrl = "http://qimingxintest.ewangnet.com/" // 接口地址
// const httpUrl = 'http://192.168.1.140/' // 接口地址

 const LOGIN_PAGE = '/pages/login/login' // 登录页面配置到这里，做登录检测的时候需要跳转的页面
// /static/noany.png
 let photo = ""

 const config = {
 	httpUrl,
	LOGIN_PAGE,
 	isImg(url) { // 图片地址前缀拼接
 		let URL = ''
 		if (url === null || url === undefined || url === '') {
 			URL = photo
 		} else if (typeof(url) === "string") {
 			if (url.includes('http://') || url.includes('https://') || url.includes('www') || url.includes('data:image')) {
 				URL = url;
 			} else {
 				URL = httpUrl + url;
 			}
 		} else {
 			URL = httpUrl + url;
 		}
 		return URL
 	},
 	filterImg(contents, cb) {
 		if (typeof contents !== 'string') {
 			throw new Error(`Expect to get the string, but get ${typeof contents}`);
 		}

 		let styleAttrRegexp = new RegExp('style="[^=>]*"([(s+w+=)|>])', 'ig');
 		var b = new RegExp(`<img [^>]*src=['"]([^'"]+)[^>]*>`, 'g'); // img 标签取src里面内容的正则

 		var s = contents.match(b); // 取到所有img标签 放到数组 s里面
 		if (!s) {
 			return contents
 		}
 		for (var i = 0; i < s.length; i++) {
 			var srcImg = s[i].replace(b, "$1"); //取src面的内容
 			if (srcImg.slice(0, 4) == "http" || srcImg.slice(0, 5) == "https") {
 				//若src前4位置或者前5位是http、https则不做任何修改
 				console.log("不做任何修改");
 			} else {
 				//修改富文本字符串内容 img标签src 相对路径改为绝对路径
 				contents = contents.replace(
 					new RegExp(srcImg, "g"),
 					baseUrl + srcImg
 				);
 			}
 		}



 		let result = contents.replace(b, (t) => {
 			let _str = t
 				.replace(styleAttrRegexp, '')
 				.replace(
 					'<img',
 					'<img style="max-width:100%;height:auto;vertical-align:top;"'
 				);
 			return _str;
 		});
 		if (cb) {
 			return cb(result, contents);
 		} else {
 			return result;
 		}
 	},
 }
 export default {
 	install: function(Vue) {
 		Vue.prototype.$config = config
 	},
 	...config
 }
