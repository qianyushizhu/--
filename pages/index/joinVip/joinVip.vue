<template>
	<view style="padding: 10rpx 10rpx;box-sizing: border-box;">
		<view class="">
			<!-- <view class="" style="font-size: 34rpx; font-weight: 550;margin-top: 15rpx;margin-left: 15rpx;">会员信息总览</view> -->
			<view class="item"><u-field v-model="company" label="公司名称" :disabled="userRole !== 4" placeholder="请填写公司名称"></u-field></view>
			<view class="item"><u-field v-model="name" label="联系人姓名" :disabled="userRole !== 4" placeholder="请填写联系人姓名"></u-field></view>
			<view class="item" style="padding: 35rpx 30rpx 35rpx 30rpx;border-bottom: 2rpx solid rgb(237, 245, 248);">
				<view class="" style="margin-bottom: 15rpx;font-size: 28rpx;">申请服务选项：</view>
				<u-checkbox-group @change="checkboxChange">
					<u-checkbox :disabled="userRole !== 4" size="28" label-size="28" v-model="item.checked" v-for="(item, index) in list" :key="index" :name="item.serviceId">
						{{ item.serviceName }}
					</u-checkbox>
				</u-checkbox-group>
			</view>
			<view class="item"><u-field v-model="phone" label="联系电话" :disabled="userRole !== 4" placeholder="请填写联系电话"></u-field></view>

			<view class="item"><u-field v-if="userRole !== 4" v-model="payTime" label="会员缴费时间" :disabled="userRole !== 4"></u-field></view>
			<view class="item"><u-field v-if="userRole !== 4" v-model="expireTime" label="会员到期时间" :disabled="userRole !== 4"></u-field></view>
			<view class="item" v-if="userRole == 4">
				<u-field v-model="code" label="验证码" placeholder="请填写验证码">
					<u-button size="mini" slot="right" type="primary" :disabled="isSend" @click="getCode">{{ !isSend ? codeText : '已发送验证码 ' + NUM }}</u-button>
				</u-field>
			</view>
			<view v-if="userRole == 4" class="item"><u-field v-model="remark" label="备注" placeholder="请填写备注" type="textarea"></u-field></view>
			<view style="display: flex;justify-content: center;width: 100%;margin-top: 100rpx;">
				<view class="shenqingbutton" v-if="userRole == 4" @click="companyApply">申请会员</view>
			</view>

			<view class="" style="padding: 0 20rpx;">
				<view class="text">关于我们</view>
				<view v-html="content"></view>
			</view>
			<!-- <u-select v-model="opitonsShow"  :list="list"></u-select> -->
		</view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
import { companyApply, getVipServiceMessage, sendSmsCode, getServiceList } from '../../../common/request.js';
export default {
	data() {
		return {
			list: [],
			company: '',
			opitonsShow: false,
			isSend: false,
			NUM: 60,
			opiton: '',
			opitonLabel: '',
			code: '',
			name: '',
			phone: '',
			remark: '',
			content: '',
			codeText: '发送验证码',
			userRole: '',
			payTime: '',
			expireTime: ''
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
		// uni.setStorageSync('userRole', 4);
		this.getVipServiceMessage();
		this.getServiceList();
		this.userRole = uni.getStorageSync('userRole');
		if (this.userRole !== 4) {
			this.company = uni.getStorageSync('companyName');
			this.payTime = this.$fifter.year_date(uni.getStorageSync('payTime'));
			this.expireTime = this.$fifter.year_date(uni.getStorageSync('expireTime'));
			this.phone = uni.getStorageSync('phone');
			this.opitonLabel = uni.getStorageSync('serviceName');

			this.name = uni.getStorageSync('userName');
		}
	},
	methods: {
		getCode() {
			uni.showLoading({
				title: '正在获取验证码'
			});
			var timer;
			sendSmsCode({
				phone: this.phone
			}).then(res => {
				uni.hideLoading();
				if (res.code == 0) {
					this.isSend = true;
					uni.showToast({
						title: '发送成功'
					});
					timer = setInterval(() => {
						this.NUM--;
						if (this.NUM == 0) {
							clearInterval(timer);
							this.isSend = false;
						}
					}, 1000);
				} else {
					uni.showToast({
						title: res.msg
					});
				}
			});
		},
		checkboxChange(e) {
			console.log(e);
			this.opiton = e.join(',');
		},
		openOpitonsShow() {
			if (this.userRole == 4) {
				this.opitonsShow = true;
			}
		},
		getServiceList() {
			getServiceList().then(res => {
				if (this.userRole == 4) {
					res.data.forEach(e => {
						e.checked = false;
					});
				} else {
					res.data.forEach(e => {
						e.checked = false;
					});
					let xxx = this.opitonLabel.split(' ');
					console.log(xxx);
					xxx.forEach(e => {
						res.data.forEach(i => {
							if (i.serviceName == e) {
								i.checked = true;
							}
						});
					});
				}

				this.list = res.data;
				console.log(this.list);
			});
		},
		getVipServiceMessage() {
			getVipServiceMessage().then(res => {
				this.content = res.data.content;
			});
		},
		companyApply() {
			companyApply({
				userName: this.name,
				account: this.phone,
				companyName: this.company,
				remark: this.remark,
				serviceId: this.opiton,
				code: this.code
			}).then(res => {
				if (res.code == 0) {
					wx.requestSubscribeMessage({
						tmplIds: ['OpnQMM8nMnKDk5j6IHMoUhIiV81hmwXByDWZXFBnhEk'],
						success(res) {
							console.log(res);
						},
						fail(res) {
							console.log(res);
						}
					});
					uni.navigateBack({
						delta: 1,
						success: () => {
							uni.showToast({
								icon: 'success',
								title: '申请成功',
								duration: 2000
							});
						}
					});
				} else {
					console.log(this.$refs)
					this.$refs.uToast.show({
						title: res.msg,
						type: 'error'
					});
				}
			});
		}
	}
};
</script>

<style lang="less">
/deep/ .u-field {
	padding: 40rpx 30rpx 30rpx 30rpx !important;
}
/deep/ .u-label {
	flex: 0 0 92px !important;
}
// .item{
// 	display: flex;
// 	align-items: center;
// }
.shenqingbutton {
	color: #fff;
	width: 80%;
	height: 82rpx;
	line-height: 82rpx;
	background: linear-gradient(142deg, #588bfb 0%, #588afb 54%, #3396ff 100%);
	border-radius: 12rpx;
	text-align: center;
}

.text {
	margin-top: 80rpx;
	margin-bottom: 40rpx;
	font-size: 36rpx;
	font-family: PingFangSC-Semibold, PingFang SC;
	font-weight: 600;
	color: rgba(0, 0, 0, 0.85);
}
</style>
