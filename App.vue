
<script>
	import { login,getContactMsg,getUserMsg} from './common/request.js'
	export default {
		onLaunch: function() {
				
				const updateManager = wx.getUpdateManager()
				
				updateManager.onCheckForUpdate(function (res) {
				  // 请求完新版本信息的回调
				  console.log(res.hasUpdate)
				})
				
				updateManager.onUpdateReady(function () {
				   updateManager.applyUpdate()
				})
				
				updateManager.onUpdateFailed(function () {
				  // 新版本下载失败
				  wx.showToast({
				    title: '新版本下载失败',
				   
				  })
				})
			
				uni.login({
					success: (res) => {
						login({
							code:res.code
						}).then(res=>{
							if(res.code == 0){
								uni.setStorageSync('token', res.data.token)
								uni.setStorageSync('userId', res.data.userId)
								uni.setStorageSync('isLogin', true)
								getContactMsg().then(res=>{
									console.log(res)
									if(res.data){
										uni.setStorageSync('wxkefu', res.data.tel)
										
									}
								}
								)
								
								getUserMsg().then(res=>{
									console.log(res.data.companyName)
									if(res.data){
									uni.setStorageSync('payTime', res.data.payTime);
									uni.setStorageSync('loginTimes', res.data.loginTimes);
									uni.setStorageSync('userId', res.data.userId);
									uni.setStorageSync('userName', res.data.userName);
									uni.setStorageSync('headLogoUrl', res.data.headLogoUrl);
									uni.setStorageSync('userRole', res.data.userRole);
									uni.setStorageSync('accountLevel', res.data.accountLevel);
									uni.setStorageSync('account', res.data.account);
									uni.setStorageSync('expireTime', res.data.expireTime);
									uni.setStorageSync('companyName', res.data.companyName);
									uni.setStorageSync('companyId', res.data.companyId);
									uni.setStorageSync('phone', res.data.phone);
									uni.setStorageSync('serviceName', res.data.serviceName);
										if(uni.getStorageSync('expireTime')){
											var timestamp = Math.round(new Date() / 1000)
											let guoqishijian = uni.getStorageSync('expireTime')/1000
											let leftTime = guoqishijian-30*24*3600
											if(res.data.userRole == 2 || res.data.userRole == 3){
												if(leftTime <= timestamp){
													uni.setStorageSync('kuaidaoqi',true)
												}else{
													uni.setStorageSync('kuaidaoqi',false)
												}
											}
										}
									}
									
								}
								)
								
								
							}else{
								uni.setStorageSync('isLogin',false)
							}
								
						})
					}
				})
				
				
				
				
				
				
		},
		
	
		onShow: function() {
			let a = ""
			console.log(a.length)
			console.log(a == "")
			console.log(a === "")
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	// image{
	// 	 image-rendering:-moz-crisp-edges;
	// 	        image-rendering:-o-crisp-edges;
	// 	        image-rendering:-webkit-optimize-contrast;
	// 	        image-rendering: crisp-edges;
	// 	        -ms-interpolation-mode:nearest-neighbor;

	// }
	/*每个页面公共css */
  @import "uview-ui/index.scss";
</style>
