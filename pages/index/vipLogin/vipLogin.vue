<template>
	<view style="padding: 20rpx 30rpx;">
		<view class="vipLogin_top">
			<view class="top_item">
				<text class="text_style">账号：</text>
				<input type="text" v-model="account" />
			</view>
			<view class="top_item">
				<text class="text_style">密码：</text>
				<input type="password" v-model="password" />
			</view>
		</view>
		<view class="middle ">
			如果您还未获取账户，请电话联系专属客服获取或者点击
			<text @click="goJoin" style="color: #007AFF;">申请会员</text>
		</view>
		<view style="display: flex;justify-content: center;width: 100%;margin-top: 80rpx;"><view @click="enterLogin" class="shenqingbutton">确认登陆</view></view>
		<view class="" style="padding: 0 20rpx;">
			<view class="text">
				会员服务
			</view>
			<view v-html="content">
				      
				
			</view>
		</view>
	</view>
</template>

<script>
	import {
	  accountActivate,
	  getVipServiceMessage,
	  getUserMsg
	} from '../../../common/request.js'
	import md5 from 'js-md5';
export default {
	data() {
		return {
			account:'',
			password:'',
			content:''
		};
	},
	onLoad() {
		if (!uni.getStorageSync('token')) {
		  uni.showModal({
		    title: "授权登录",
			showCancel:false,
			confirmColor:'#000',
		    content: "您尚未授权登录,请先授权登录",
		    success: (res) => {
		      if (res.confirm) {
		       uni.navigateTo({
		        url:'/pages/login/login'
		       })
		      }
		    }
		  })
		  return
		}
		
		this.getVipServiceMessage()
	},
	methods: {
		getVipServiceMessage(){
			getVipServiceMessage().then(res=>{
				this.content = res.data.content
			})
		},
		goJoin() {
			uni.navigateTo({
				url: '../joinVip/joinVip'
			});
		},
		enterLogin() {
			
			
			accountActivate({
				account:this.account,
				password:md5(this.password)
			}).then(res=>{
				if(res.code == 0){
					getUserMsg().then(res => {
						console.log(res);
						if (res.data) {
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
							uni.switchTab({
								url:'/pages/my/my',
								  success: function () {
								    var page = getCurrentPages().pop();
								    if (page == undefined || page == null) return;
								    page.onLoad(); //重新刷新device-info页面
									uni.showToast({
										icon:'success',
										title:'激活成功'
									})
								  }
							})
						}
					});
					
				}else{
					uni.showToast({
					  title:res.msg,
					  icon:'none'
					})
				}
			})
		},
	}
};
</script>

<style lang="less">
.vipLogin_top {
	box-sizing: border-box;
	padding: 30rpx 30rpx 0 30rpx;
	display: flex;
	flex-direction: column;
}
.middle {
	text-indent: 2rem;
	font-size: 30rpx;
	font-family: PingFang-SC-Regular, PingFang-SC;
	font-weight: 400;
	color: #232323;
	line-height: 48rpx;
}
.text{
		margin-top: 80rpx;
		margin-bottom: 40rpx;
		font-size: 36rpx;
		font-family: PingFangSC-Semibold, PingFang SC;
		font-weight: 600;
		color: rgba(0, 0, 0, 0.85);
	}
.shenqingbutton {
	color: #fff;
	width: 80%;
	height: 82rpx;
	line-height: 82rpx;
	background: linear-gradient(142deg, #588bfb 0%, #588afb 54%, #3396ff 100%);
	border-radius: 12rpx;
	text-align: center;
	font-size: 28rpx;
	font-family: PingFang-SC-Regular, PingFang-SC;
font-weight: 400;
}
.text_style {
	font-size: 28rpx;
	font-family: PingFang-SC-Regular, PingFang-SC;
	font-weight: 400;
	color: rgba(0, 0, 0, 0.85);
}
.top_item {
	box-sizing: border-box;
	display: flex;
	width: 100%;
	height: 68rpx;
	align-items: center;
	margin-bottom: 40rpx;
	text {
		width: 120rpx;
	}
	input {
		width: 100%;
		height: 100%;
		border-radius: 8rpx;
		border: 1rpx solid #a6a6a6;
		padding-left: 20rpx;
	}
}
</style>
