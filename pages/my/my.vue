<template>
	<view class="my">
			<view class="my_top" >
				<view class="my_top_unLogin2" v-if="showLogin">
					<view class="" style="display: flex;align-items: center;">
						<image :src="image" style="margin-right: 40rpx;width: 128rpx;height: 128rpx;border-radius: 50%;"></image>
						<view class="my_top_right">
							<view class="" style="display: flex;justify-content: space-around;height: 60rpx;" @click="goLogin">
								<view
									class=""
									style="font-size: 28rpx;font-family: PingFangSC-Semibold, PingFang SC;font-weight: 600;color: rgba(0, 0, 0, 0.85);margin-right: 20rpx;"
								>
									{{ nickName }}
								</view>
								
							</view>
							<view style="font-size: 24rpx;font-family: PingFang-SC-Regular, PingFang-SC;">手机号：{{ phone ? phone : '---------' }}</view>
						</view>
					</view>
					
				</view>
				<view class="my_top_unLogin" style='display: flex;' v-else>
					<image src="../../static/my/unLogo.png" style="margin-right: 40rpx;width: 128rpx;height: 128rpx;border-radius: 50%;"></image>
					<button @click="login" style="justify-content: center;display: flex;align-items: center;margin: 0;">快来登录吧！</button>
				</view>
			</view>
			<view class="" style="border-bottom: 1px solid rgba(0,0,0,0.15);margin-bottom: 34rpx;">
				
			</view>

		<view class="my_item">
			
			
			<view class="my_item_part" @click="tocollect">
				<image src="../../static/my/sz_icon_wodeshoucang@2x.png" mode=""></image>
				<view>我的收藏</view>
			</view>
			<view class="my_item_part" @click="toDownload">
				<image src="../../static/my/sz_icon_wendangxiazai@2x.png" mode=""></image>
				<view>我的下载</view>
			</view>
			<view class="my_item_part" @click="changeKefu">
				<image src="../../static/my/sz_icon_kefu@2x.png" mode=""></image>
				<view>联系我们</view>
			</view>

			<view class="my_item_part" @click="goabout">
				<image src="../../static/my/lj_icon_guanyu@2x.png" mode=""></image>
				<view>关于</view>
			</view>
		</view>

		<u-popup v-model="showKefu" mode="bottom" height="30%" border-radius="20">
			<view style="height: 100%;display: flex;flex-direction: column;">
				<view
					style="font-size: 32rpx;font-family: PingFang-SC-Medium, PingFang-SC;font-weight: 500;color: rgba(0, 0, 0, 0.85);line-height: 44rpx;margin-top: 48rpx;text-align: center;"
				>
					请选择客服
				</view>
				<view class="showKefu" style="flex: 1;">
					<button style="height: 110rpx;" open-type="contact" class="contactBtn">
						<image style="width: 56rpx;height: 56rpx;" src="../../static/my/weixinCon.png"></image>
						<view>微信客服</view>
					</button>
					<view @click="takePhone">
						<image src="../../static/my/phoneCon.png"></image>
						<view>电话客服</view>
					</view>
				</view>
			</view>
		</u-popup>
		
	</view>
</template>
<script>
import { login, register, decodePhone, getSessionKey, getUserMsg } from '../../common/request.js';
export default {
	data() {
		return {
			showKefu: false,
			vipShow: false,
			vipShowxxxxx: false,
			showLogin: false,
			token: '',
			image: require('../../static/my/unLogo.png'),
			nickName: '',
			expireTime: '',
			account: '',
			userRole: '',
			phone: '',
			payTime: '',
			loginTimes: '',
			companyName:''
		};
	},
	onPullDownRefresh() {
		
	
		 setTimeout(function () {
		            uni.stopPullDownRefresh();
		        }, 1000);
	
	},
	
	onLoad() {
		this.phone = uni.getStorageSync('phone') ? uni.getStorageSync('phone') : '----';
		this.showLogin = uni.getStorageSync('isLogin') ? true : false;
		this.image = uni.getStorageSync('headLogoUrl');
		this.token = uni.getStorageSync('token');
		this.nickName = uni.getStorageSync('userName');
		this.expireTime = uni.getStorageSync('expireTime');
		this.userRole = uni.getStorageSync('userRole');
		this.payTime = uni.getStorageSync('payTime');
		this.loginTimes = uni.getStorageSync('loginTimes');
		let timestamp = Math.round(new Date() / 1000);
		// console.log(timestamp)
		if (uni.getStorageSync('kuaidaoqi') && timestamp - uni.getStorageSync('lastShowTime') >=  60*60) {
			this.vipShow = true;
			let timestamp = Math.round(new Date() / 1000);
			uni.setStorageSync('lastShowTime', timestamp);
		}
		
	},
	onShow() {
		this.phone = uni.getStorageSync('phone') ? uni.getStorageSync('phone') : '----';
		this.showLogin = uni.getStorageSync('isLogin') ? true : false;
		this.image = uni.getStorageSync('headLogoUrl');
		this.token = uni.getStorageSync('token');
		this.nickName = uni.getStorageSync('userName');
		this.expireTime = uni.getStorageSync('expireTime');
		this.userRole = uni.getStorageSync('userRole');
		this.payTime = uni.getStorageSync('payTime');
		this.loginTimes = uni.getStorageSync('loginTimes');
		let timestamp = Math.round(new Date() / 1000);
		console.log(11111111111);
		if (uni.getStorageSync('kuaidaoqi') && timestamp - uni.getStorageSync('lastShowTime') >= 60*60) {
			this.vipShow = true;
			let timestamp = Math.round(new Date() / 1000);
			uni.setStorageSync('lastShowTime', timestamp);
		}
	},
	
	methods: {
		refsh(){
			uni.showLoading({
				title:'刷新中'
			})
			setTimeout(()=>{
				uni.hideLoading()
			},800)
			getUserMsg().then(res => {
				if (res.data) {
					uni.setStorageSync('payTime', res.data.payTime);
					uni.setStorageSync('loginTimes', res.data.loginTimes);
					uni.setStorageSync('userId', res.data.userId);
					uni.setStorageSync('userName', res.data.userName);
					uni.setStorageSync('headLogoUrl', res.data.headLogoUrl);
					uni.setStorageSync('userRole', res.data.userRole);
					uni.setStorageSync('accountLevel', res.data.accountLevel);
					uni.setStorageSync('phone', res.data.phone);
					uni.setStorageSync('expireTime', res.data.expireTime);
					uni.setStorageSync('phone', res.data.phone);
					uni.setStorageSync('serviceName', res.data.serviceName);
						const pages=getCurrentPages();
						const perpage=pages[pages.length-1];
						perpage.onShow();
				}
			});
			
		},
		goCanvas() {
			uni.navigateTo({
				url: '/pages/my/inviteCanvas/inviteCanvas'
			});
		},
		goLogin() {
			if(this.userRole == 4){
				uni.navigateTo({
					url: '../index/vipLogin/vipLogin'
				});
			}else{
				uni.navigateTo({
					url: '../index/joinVip/joinVip'
				});
			}
			
		},
		login() {
			uni.navigateTo({
				url: '../login/login'
			});
		},
		confirmVip() {
			this.vipShowxxxxx = false;
		},
		cancelVip() {
			this.vipShowxxxxx = false;
		},
		goabout() {
			if (uni.getStorageSync('status')==1){
						   return false
			}
			if (!uni.getStorageSync('token')) {
				uni.showModal({
					title: '授权登录',
					showCancel: false,
					confirmColor: '#000',
					content: '您尚未授权登录,请先授权登录',
					success: res => {
						if (res.confirm) {
							uni.navigateTo({
								url: '/pages/login/login'
							});
						}
					}
				});
				return;
			}
			uni.navigateTo({
				url: 'about/about'
			});
		},
		toAccount() {
			if (!uni.getStorageSync('token')) {
				uni.showModal({
					title: '授权登录',
					showCancel: false,
					confirmColor: '#000',
					content: '您尚未授权登录,请先授权登录',
					success: res => {
						if (res.confirm) {
							uni.navigateTo({
								url: '/pages/login/login'
							});
						}
					}
				});
				return;
			}
			if (uni.getStorageSync('userRole') == 4) {
				this.vipShowxxxxx = true;
				return;
			}
			uni.navigateTo({
				url: 'accountManagement/accountManagement'
			});
		},
		registerMine() {
			let vm = this;
			uni.login({
				success: res => {
					getSessionKey({
						code: res.code
					}).then(res => {
						console.log(res);
						uni.setStorageSync('sessionKey', res.data.sessionKey);
						decodePhone({
							encryptedData: uni.getStorageSync('encryptedData'),
							iv: uni.getStorageSync('iv'),
							sessionKey: uni.getStorageSync('sessionKey')
						}).then(res => {
							uni.setStorageSync('phone', res.data.phone);
							uni.login({
								success: res => {
									register({
										code: res.code,
										nickName: uni.getStorageSync('userInfo').nickName,
										gender: uni.getStorageSync('userInfo').gender,
										avatarUrl: uni.getStorageSync('userInfo').avatarUrl,
										phone: uni.getStorageSync('phone')
									}).then(res => {
										if (res.code == 0) {
											uni.setStorageSync('isLogin', true);
											uni.setStorageSync('token', res.data.token);
											uni.setStorageSync('userName', res.data.userName);
											uni.setStorageSync('headLogo', vm.$imgUrl + res.data.headLogo);
											vm.token = res.data.token;
											vm.nickName = res.data.userName;
											vm.image = vm.$imgUrl + res.data.headLogo;
											vm.show = true;
										}
									});
								}
							});
						});
					});
				}
			});
		},

		getPhoneNumber(e) {
			console.log(e);
			if (e.detail.errMsg == 'getPhoneNumber:ok') {
				uni.setStorageSync('encryptedData', e.detail.encryptedData);
				uni.setStorageSync('iv', e.detail.iv);
			}
		},

		toCard() {
			if (!uni.getStorageSync('token')) {
				uni.showModal({
					title: '授权登录',
					showCancel: false,
					confirmColor: '#000',
					content: '您尚未授权登录,请先授权登录',
					success: res => {
						if (res.confirm) {
							uni.navigateTo({
								url: '/pages/login/login'
							});
						}
			 	}
				});
				return;
			}
			uni.navigateTo({
				url: 'myCard/myCard'
			});
		},
		tocollect() {
			if (uni.getStorageSync('status')==1){
						   return false
			}
			if (!uni.getStorageSync('token')) {
				uni.showModal({
					title: '授权登录',
					showCancel: false,
					confirmColor: '#000',
					content: '您尚未授权登录,请先授权登录',
					success: res => {
						if (res.confirm) {
							uni.navigateTo({
								url: '/pages/login/login'
							});
						}
			 	}
				});
				return;
			}
			uni.navigateTo({
				url: 'myCollect/myCollect'
			});
		},
		toDownload() {
			
			if (uni.getStorageSync('status')==1){
						   return false
			}
			if (!uni.getStorageSync('token')) {
				uni.showModal({
					title: '授权登录',
					showCancel: false,
					confirmColor: '#000',
					content: '您尚未授权登录,请先授权登录',
					success: res => {
						if (res.confirm) {
							uni.navigateTo({
								url: '/pages/login/login'
							});
						}
					}
				});
				return;
				
			}
			uni.navigateTo({
				url: 'myDownload/myDownload'
			});
		},
		changeKefu() {
			if (uni.getStorageSync('status')==1){
						   return false
			}
			// this.showKefu = !this.showKefu;
			uni.navigateTo({
				url: 'conactUs/conactUs'
			});
		},
		takePhone() {
			wx.makePhoneCall({
				phoneNumber: uni.getStorageSync('wxkefu')
			});
			this.showKefu = false;
		}
	}
};
</script>

<style lang="less" scoped>

.text_hui {
	font-size: 24rpx;
	font-family: PingFang-SC-Regular, PingFang-SC;
	font-weight: 400;
	color: rgba(0, 0, 0, 0.45);
}
.my_top {
	
	padding: 50rpx 28rpx;
	background: #ffffff;
	border-radius: 14rpx;
	.my_top_unLogin1 {
		display: flex;
		align-items: center;
	}
	.my_top_unLogin2 {
		display: flex;
		flex-direction: column;
	}
}
.my_top_right {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 100%;
}
.my_item {
	.my_item_part {
		padding: 26rpx 50rpx;
		display: flex;
		align-items: center;
		font-size: 30rpx;
		font-family: PingFang-SC-Regular, PingFang-SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.85);
		line-height: 42rpx;
		image {
			width: 48rpx;
			height: 48rpx;
			margin-right: 20rpx;
		}
	}
}
.showKefu {
	display: flex;
	justify-content: space-around;
	align-items: center;

	text-align: center;

	image {
		width: 56rpx;
		height: 56rpx;
	}

	view {
		// margin-top: 14rpx;
		font-size: 28rpx;
		font-family: PingFang-SC-Regular, PingFang-SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.65);
		line-height: 40rpx;
	}
}
.contactBtn {
	font-size: 28rpx;
	font-family: PingFang-SC-Regular, PingFang-SC;
	font-weight: 400;
	color: rgba(0, 0, 0, 0.65);
	line-height: 40rpx;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	background-color: transparent;
	padding: 0;
	margin: 0;
	align-items: center;
	// display: block;
}
.contactBtn::after {
	border: none;
}
</style>
