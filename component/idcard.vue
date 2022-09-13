<template>
	<view>
		<view class="idcard" @click="dianji">
			<view class="idcard_top">
				<view class="" style="width: 100%;margin-bottom: 20rpx;display: flex;just如ify-content: flex-start;align-items: center">
					<image :src="companyImage" style="width: 112rpx;height: 112rpx;margin-right: 20rpx;" mode=""></image>
					<view
						class="text1"
						style="font-size: 36rpx;
				text-align: center;
					font-family: PingFang-SC-Bold, PingFang-SC;
					font-weight: bold;
					color: rgba(0, 0, 0, 0.85);"
					>
						{{ campnyName }}
					</view>
				</view>
				<view class="idcard_top_bg4">
					<view class="idcard_top_bg4_left">
						<view style="display: flex;align-items: baseline;margin-bottom: 19rpx;">
							<view class="text2">{{ name }}</view>
							<view class="text3">{{ job }}</view>
						</view>

						<view class="">
							<view class="text4">
								<image src="../static/new/lj_icon_dianhua@2x.png"></image>
								<view>{{ phoneNumber }}</view>
							</view>
							<view class="text4">
							 <image src="../static/new/lj_icon_youxiang@2x.png"></image>
								<view>{{ email }}</view>
							</view>
							<view class="text4" style="align-items: center;">
								<image src="../static/new/lj_icon_dizhi@2x.png"></image>
								<view>{{ address }}</view>
							</view>
						</view>
					</view>
					<view class="idcard_top_bg4_right"><image :src="image" mode=""></image></view>
				</view>

				<!-- <image style="height: 6px;width: 100%;" src="../static/show/lj_icon_lvse@2x.png" mode=""></image> -->
			</view>

			<view class="idcard_bottom">
				<view class="idcard_bottom_left">感谢您的联系分享收藏</view>
				<view class="idcard_bottom_right">
					<image v-if="!isMine" src="../static/show/bluephone.png" @click="callPHone"></image>
					<button class="shareBtn" open-type="share" @click="sendCard"><image src="../static/show/lianjie.png"></image></button>

					<image v-if="!isMine" style="margin-right: 16rpx;" :src="!status ? '../static/show/shoucangG.png' : '../static/show/shoucangL.png'" @click="collectStatus"></image>
					<image v-else style="margin-right: 16rpx;" src="../static/new/lj_icon_dianhua2@2x.png" @click="update"></image>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
export default {
	props: {
		campnyName: '',
		name: '',
		job: '',
		phoneNumber: null,
		email: '',
		address: '',
		image: '',
		status: null,
		companyImage: '',
		isMine:false,
		cardId:""
	},
	data() {
		return {
			share:{
				title:'',
			     path:'',
			},
		};
	},
	

	mounted() {
		
	},
	onLoad() {
		// this.image =this.$imgUrl+this.image
		// this.companyImage =this.$imgUrl+this.companyImage
		// console.log(this.$imgUrl+this.image)
		// console.log(this.$imgUrl+this.companyImage)
		// console.log(this.status)
	},
	methods: {
		dianji(id){
			this.share.path = '/pages/my/shareCard/shareCard?shareId=' + this.cardId
			this.share.title = this.name+'的名片'
			console.log(this.share)
		},
		sendCard() {
			this.$emit('shareCard', this.share);
		},
		collectStatus() {
			this.$emit('collect', 'woshisb');
		},
		update() {
			this.$emit('update');
		},
		callPHone() {
			uni.makePhoneCall({
				phoneNumber: this.phoneNumber,
				success: res => {
					console.log('调用成功!');
				},
				// 失败回调
				fail: res => {
					console.log('调用失败!');
				}
			});
		}
	}
};
</script>
<style lang="less" scoped>
.shareBtn {
	padding: 0;
	border: none;
	display: flex;
	background-color: transparent;
	flex-direction: column;
	justify-content: space-between;
	font-size: 20rpx;
	align-items: center;
	font-family: PingFang-SC-Regular, PingFang-SC;
	font-weight: 400;
	color: rgba(0, 0, 0, 0.85);
}

.shareBtn::after {
	padding: 0;
	height: 0;
	width: 0;
	border: 0;
}
.idcard {
	overflow: hidden;
	margin-top: 24rpx;
	height: 482rpx;
	border-radius: 16rpx;
	background: #ffffff;
	box-shadow: 0px 4rpx 8rpx 2rpx rgba(0, 0, 0, 0.05);
	box-sizing: border-box;

	.idcard_top {
		border-top-left-radius: 16rpx;
		border-top-right-radius: 16rpx;
		height: 80%;
		background: #ffffff;
		box-shadow: 0px 4rpx 8rpx 0px rgba(0, 0, 0, 0.07);
		padding: 30rpx 30rpx 8rpx 30rpx;
		border-bottom-left-radius: 2px;
		border-bottom-right-radius: 2px;
		position: relative;

		.idcard_top_bg4 {
			// position: absolute;
			// left: 0;
			// top: 0;
			width: 100%;
			// z-index: 101;
			display: flex;
			justify-content: space-between;
			.idcard_top_bg4_right {
				margin-top: -40rpx;
				image {
					width: 176rpx;
					height: 240rpx;
					margin-right: 8rpx;
				}
			}
			.idcard_top_bg4_left {
				width: 63%;
				display: flex;
				height: 80%;
				flex-direction: column;
				justify-content: space-between;
				.text1 {
					font-size: 28rpx;
					font-family: PingFang-SC-Bold, PingFang-SC;
					font-weight: 500;
					color: rgba(0, 0, 0, 0.85);
					line-height: 21px;
				}
				.text2 {
					margin-right: 10rpx;
					font-size: 48rpx;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: 600;
					color: rgba(0, 0, 0, 0.85);
					line-height: 33px;
				}
				.text3 {
					font-size: 20rpx;
					font-family: PingFang-SC-Regular, PingFang-SC;
					font-weight: 400;
					color: rgba(0, 0, 0, 0.85);
					line-height: 17px;
				}
				.text4 {
					margin-bottom: 10rpx;
					display: flex;
					align-items: center;
					font-size: 24rpx;
					font-family: PingFang-SC-Regular, PingFang-SC;
					font-weight: 400;
					color: rgba(0, 0, 0, 0.85);

					line-height: 34rpx;
					image {
						width: 24rpx;
						height: 24rpx;
						margin-right: 10rpx;
					}
				}
			}
		}
	}

	.idcard_bottom {
		height: 20%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 30rpx;
		.idcard_bottom_left {
			font-size: 24rpx;
			font-family: PingFang-SC-Regular, PingFang-SC;
			font-weight: 400;
			color: #a6a6a6;
			line-height: 34px;
		}
		.idcard_bottom_right {
			display: flex;
			image {
				width: 56rpx;
				height: 56rpx;
				margin-left: 32rpx;
			}
		}
	}
}
</style>
