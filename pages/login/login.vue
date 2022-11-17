<template>
	<view class="login">
		<view class="login_img"><image src="../../static/my/songzi@2x.png"></image></view>
		<view class="login_text">松子</view>

		<button class="login_btn1" @click="loginBack" v-show="showLoginBack">微信登录</button>
		<button class="login_btn" open-type="getPhoneNumber" v-show="showRegister" @getphonenumber="onGetPhoneNumber">微信登录</button>

		<!-- 登录的弹框 -->
		<u-popup v-model="show" mode="center" border-radius="14" width="80%">
			<view class="popup">
				<view class="popup_top">请授权登录</view>
				<view class="popup_center">请同意微信官方授权（获取你的昵称、头像、地区及性别）</view>
				<!-- <view class="popup_btn">同意</view> -->
				<button class="login_btn1" open-type="getUserProfile" @click="getUserProfile">同意</button>
			</view>
		</u-popup>
	</view>
</template>

<script>
import { login, decodePhone, getSessionKey, register ,getUserMsg} from '../../common/request.js';
export default {
	data() {
		return {
			data: '',

			showLoginBack: false,
			showRegister: false,

			share: {
				title: '载天文房',
				path: 'pages/index/index'
			},
			show: false,
			encryptedData: '',
			iv: '',
			userInfo: '',
			sessionKey: '',
			openId: ''
		};
	},
	onLoad(options) {
		this.judgeIslogin();
	},

	methods: {
		// 判断用户是否注册过
		judgeIslogin() {
			uni.login({
				success: res => {
					login({
						code: res.code
					}).then(res2 => {
						if (res2.code == 0) {
							console.log('已注册');
							this.showRegister = false;
							this.showLoginBack = true;
							this.data = res2.data;
						} else if (res2.code == 5 ) {
							console.log('未注册');
							this.sessionKey = res2.sessionKey;
							this.openId = res2.openId;
							this.showRegister = true;
							this.showLoginBack = false;
						}
					});
				}
			});
		},

		loginBack() {
			uni.login({
				success: res => {
					login({
						code: res.code
					}).then(res => {
						if (res.code == 0) {
							uni.setStorageSync('token', res.data.token);
							uni.setStorageSync('isLogin', true);
							getUserMsg().then(res=>{
								console.log(res)
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
									let pages = getCurrentPages(); // 当前页面
									let beforePage = pages[pages.length - 2];
									uni.showToast({
										title: '登录成功',
										mask: true,
										duration: 2000,
										success: () => {
											console.log(this);
											uni.reLaunch({
												url:beforePage.$page.fullPath,
												 success: () => {
												   beforePage.onLoad(); // 执行前一个页面的onLoad方法
												   beforePage.onShow(); // 执行前一个页面的onShow方法
												 }
											})
										}
									});
								}
								
							}
							)
							
							
						} else {
							uni.setStorageSync('isLogin', false);
							uni.showToast({
								icon: 'none',
								title: res.msg,
								duration: 2000
							});
						}
					});
				}
			});
			
		},
		onGetPhoneNumber(e) {
			if (e.detail.encryptedData && e.detail.iv) {
				//允许授权
				this.encryptedData = e.detail.encryptedData;
				this.iv = e.detail.iv;
				this.show = true;
				uni.login({
					success: res => {
						getSessionKey({
							code: res.code
						}).then(res => {
							this.sessionKey = res.data.sessionKey;
							decodePhone({
								encryptedData: this.encryptedData,
								iv: this.iv,
								sessionKey: this.sessionKey
							}).then(res => {
								uni.setStorageSync('phone', res.data.phone);
							});
						});
					}
				});
			} else {
				//用户决绝授权
				//拒绝授权后弹出一些提示
				uni.showToast({
					icon: 'none',
					title: '请绑定手机号',
					duration: 2000
				});
			}
		},
		// 用户同意授权获取头像的那个信息
		getUserProfile() {
			this.show = false;
			uni.getUserProfile({
				desc: '登录',
				success: res => {
					console.log(res);
					this.userInfo = res.userInfo;
					uni.showLoading({
						mask: true,
						title: '正在登录...'
					});
					this.register(this.userInfo.nickName, this.userInfo.gender, this.userInfo.avatarUrl);
				},
				fail: err => {
					uni.showToast({
						icon: 'none',
						title: '未绑定相关信息',
						duration: 2000
					});
					console.log(err);
				}
			});
		},

		// 注册用户
		register(nickName, gender, avatarUrl) {
			uni.login({
				success: res => {
					register({
						code: res.code,
						nickName: nickName,
						gender: gender,
						avatarUrl: avatarUrl,
						phone: uni.getStorageSync('phone')
					}).then(res2 => {
						if (res2.code == 0) {
							uni.showToast({
								title: '注册成功',
								mask: true,
								duration: 2000,
								success: () => {
									uni.login({
										success: res => {
											login({
												code: res.code
											}).then(res => {
												if (res.code == 0) {
													uni.setStorageSync('token', res.data.token);
													uni.setStorageSync('isLogin', true);
													getUserMsg().then(res=>{
														console.log(res)
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
															let pages = getCurrentPages(); // 当前页面
															let beforePage = pages[pages.length - 2];
															uni.showToast({
																title: '登录成功',
																mask: true,
																duration: 2000,
																success: () => {
																	console.log(this);
																	uni.reLaunch({
																		url:beforePage.$page.fullPath,
																		 success: () => {
																		   beforePage.onLoad(); // 执行前一个页面的onLoad方法
																		   beforePage.onShow(); // 执行前一个页面的onShow方法
																		 }
																	})
																}
															});
														}
														
													}
													)
													
													
												} else {
													uni.setStorageSync('isLogin', false);
													uni.showToast({
														icon: 'none',
														title: res.msg,
														duration: 2000
													});
												}
											});
										}
									});
								}
							});
						} else {
							uni.showToast({
								icon: 'none',
								title: res2.msg,
								duration: 2000
							});
						}
					});
				}
			});
		}
	}
};
</script>

<style scoped lang="less">
.login_img {
	width: 100rpx;
	height: 100rpx;
	margin: 0 auto;
	margin-top: 300rpx;

	image {
		width: 100rpx;
		height: 100rpx;
	}
}

.login_text {
	font-size: 30rpx;
	font-family: PingFangSC-Regular, PingFang SC;
	font-weight: 400;
	color: #515151;
	line-height: 34rpx;
	text-align: center;
	margin-top: 40rpx;
}

.login_btn {
	width: 80%;
	margin-top: 150rpx;
	background: #49C265;
	border-radius: 46rpx;
	font-size: 28rpx;
	font-family: PingFang-SC-Regular, PingFang-SC;
	font-weight: 400;
	color: #ffffff;
}

.login_btn1 {
	width: 80%;
	margin-top: 80rpx;
	background: #49C265;
	border-radius: 46rpx;
	font-size: 28rpx;
	font-family: PingFang-SC-Regular, PingFang-SC;
	font-weight: 400;
	color: #ffffff;
}

.popup_top {
	text-align: center;
	padding-top: 44rpx;
	font-size: 36rpx;
	font-family: PingFang-SC-Medium, PingFang-SC;
	font-weight: 500;
	color: #232323;
	line-height: 50rpx;
}

.popup_center {
	padding: 60rpx 70rpx 50rpx 70rpx;
	font-size: 28rpx;
	font-family: PingFang-SC-Regular, PingFang-SC;
	font-weight: 400;
	color: #000000;
	line-height: 40rpx;
}

.popup_btn {
	width: 80%;
	height: 72rpx;
	background: #49C265;
	border-radius: 36rpx;
	
	font-size: 28rpx;
	font-family: PingFang-SC-Medium, PingFang-SC;
	font-weight: 500;
	color: #ffffff;
	line-height: 72rpx;
	text-align: center;
	margin: 0 auto;
}

.popup {
	padding-bottom: 50rpx;
}
</style>
