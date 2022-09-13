<template>
	<view style="display: flex;justify-content: center;min-height: 100vh;">
					<view class="" style="display: flex;flex-direction: column;align-items: center;margin-top: 200rpx;">
						<view class="">
							<image style="width: 168rpx;height: 168rpx;margin-bottom: 20px;" src="../../../static/my/songzi@2x.png" mode=""></image>
						</view>
						<view class="" style="margin-bottom: 20px;font-size: 16px;
						font-family: PingFangSC-Semibold, PingFang SC;
						font-weight: 600;
						color: rgba(0, 0, 0, 0.85);
						line-height: 22px;">
							松子
						</view>
						<view v-if="info" class="" style="font-size: 14px;
						font-family: PingFang-SC-Medium, PingFang-SC;
						font-weight: 500;
						color: rgba(0, 0, 0, 0.45);
						line-height: 20px;" >
							version {{info}}
						</view>
					</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info:''
			}
		},
		onLoad() {
			if (!uni.getStorageSync('token')) {
			  uni.showModal({
			    title: "授权登录",
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
			console.log(uni.getAccountInfoSync())
			this.info = uni.getAccountInfoSync().miniProgram.version
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
