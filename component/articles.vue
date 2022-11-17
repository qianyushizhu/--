<template>
	<view>
		<view v-for="(item, index) in articleListDetail" :key="index" @click="toArticleDetail(item.articleId, index)">
			<view class="articletypeone" v-if="item.logos">
				<view class="title">{{ item.title }}</view>
				<view class="img" style="position: relative;">
					<u-lazy-load
						style="width: 32%;"
						border-radius="10"
						height="156"
						img-mode="aspectFill"
						v-for="(item1, index1) in item.logos.split(',')"
						:key="index1"
						:image="'https://file.innopinenut.com/' + item1"
					></u-lazy-load>
					<text
						v-if="item.topicIdArr.length !== 0"
						style="width: 26px;
			  	position: absolute;
			  	right: 0;
			  	top: 0;
			  			background: #49C265;
			  			border-radius: 2px;
			  			color:#fff;
			  			display:inline-block;
			  			margin-left: 10px;
			  			text-align: center;
			  			box-sizing: content-box;
			  			line-height: 15px;
			  			font-size: 10px;
			  			font-family: PingFang-SC-Regular, PingFang-SC;
			  			font-weight: 400;
			  			padding: 3px 6px;
			  			color: #FFFFFF;
			  			"
					>
						专题
					</text>
				</view>
				<view class="collectTime" style="margin-bottom: 10px;">
					<view>{{ item.createTime | year_date }}</view>
				</view>
				<view
					v-if="item.tags!== ''"
					class=""
					style="display: flex;align-items: center;font-size: 12px;
		  font-family: PingFang-SC-Regular, PingFang-SC;
		  font-weight: 400;
		  color: #F5A623;
		  line-height: 17px;"
				>
					<view
						class=""
						v-for="item1 in item.tags.split(',')"
						:key="item1"
						style="margin-right: 12px;display: center;flex-wrap: wrap;;align-items: center;height: 20px;background: rgba(245,166,35,0.2);border-radius: 4px;padding: 2px 12px;"
					>
						{{ item1 }}
					</view>
				</view>
			</view>

			<view class="" v-else style="border-bottom: 2rpx solid rgba(0, 0, 0, 0.1) !important;padding: 40rpx 0;">
				<view class="articletypetwo">
					<view style="width: 222rpx;position: relative;">
						<u-lazy-load border-radius="10" height="156" img-mode="aspectFill" :image="'https://file.innopinenut.com/' + item.logoId"></u-lazy-load>
						<text
							v-if="item.topicIdArr.length !== 0"
							style="width: 26px;
					position: absolute;
					right: 0;
					top: 0;
							background: #49C265;
							border-radius: 2px;
							color:#fff;
							display:inline-block;
							margin-left: 10px;
							text-align: center;
							box-sizing: content-box;
							line-height: 15px;
							font-size: 10px;
							font-family: PingFang-SC-Regular, PingFang-SC;
							font-weight: 400;
							padding: 3px 6px;
							color: #FFFFFF;
							"
						>
							专题
						</text>
					</view>

					<view class="desc">
						<view class="desc_title">{{ item.title }}</view>
						<view class="desc_collect">
							<view>{{ item.createTime | year_date }}</view>
						</view>
					</view>
				</view>
				<view
				v-if="item.tags!== ''"
					class=""
					style="display: flex;align-items: center;font-size: 12px;
font-family: PingFang-SC-Regular, PingFang-SC;
font-weight: 400;
color: #F5A623;
line-height: 17px;"
				>
					<view
						class=""
						v-for="item1 in item.tags.split(',')"
						:key="item1"
						style="margin-right: 12px;display: center;flex-wrap: wrap;;align-items: center;height: 20px;background: rgba(245,166,35,0.2);border-radius: 4px;padding: 2px 12px;"
					>
						{{ item1 }}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
export default {
	props: {
		articleListDetail: null
	},
	onLoad() {
		console.log(this.articleListDetail);
	},
	data() {
		return {
			image: 'https://gtd.alicdn.com/sns_logo/i1/TB124_3NXXXXXasXVXXSutbFXXX.jpg_240x240xz.jpg',
			list: [
				{
					src: 'https://gtd.alicdn.com/sns_logo/i1/TB124_3NXXXXXasXVXXSutbFXXX.jpg_240x240xz.jpg'
				},
				{
					src: 'https://gtd.alicdn.com/sns_logo/i7/TB1IWtgQFXXXXcmXFXXSutbFXXX.jpg_240x240xz.jpg'
				},
				{
					src: 'https://gtd.alicdn.com/sns_logo/i1/TB1_f_PLXXXXXbVXpXXSutbFXXX.jpg_240x240xz.jpg'
				}
			]
		};
	},
	methods: {
		toArticleDetail(id, index) {
			console.log(id);
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
			if (this.articleListDetail[index].sourceType == 2) {
				console.log(encodeURIComponent(this.articleListDetail[index].urlMsg));
				let timestamp = Math.round(new Date() / 1000);
				if (timestamp - uni.getStorageSync('ActiclesubMsg') >= 60 * 60 * 1) {
					wx.requestSubscribeMessage({
						tmplIds: ['6Bc8Ax3DxUPVbXbSTs2O_GiTIgAwShXJ8Wh7GX6jLJI'],
						success(res) {
							console.log(res);
							let timestamp = Math.round(new Date() / 1000);
							uni.setStorageSync('ActiclesubMsg', timestamp);
						},
						fail(res) {
							console.log(res);
						}
					});
				}
				uni.navigateTo({
					url:
						'/pages/index/webView/webView?url=' +
						encodeURIComponent(this.articleListDetail[index].urlMsg) +
						'&title=' +
						this.articleListDetail[index].title +
						'&logoId=' +
						this.articleListDetail[index].logoId
				});
			} else if (this.articleListDetail[index].sourceType == 1) {
				let timestamp = Math.round(new Date() / 1000);
				if (timestamp - uni.getStorageSync('ActiclesubMsg') >= 60 * 60 * 1) {
					wx.requestSubscribeMessage({
						tmplIds: ['6Bc8Ax3DxUPVbXbSTs2O_GiTIgAwShXJ8Wh7GX6jLJI'],
						success(res) {
							console.log(res);
							let timestamp = Math.round(new Date() / 1000);
							uni.setStorageSync('ActiclesubMsg', timestamp);
						},
						fail(res) {
							console.log(res);
						}
					});
				}
				uni.navigateTo({
					url: '/pages/index/articleDetail/articleDetail?id=' + id
				});
			}
		}
	}
};
</script>

<style lang="less">
.articletypetwo {
	margin-bottom: 10px;
	display: flex;

	.desc {
		margin-left: 30rpx;
		flex: 1;
		display: flex;
		justify-content: space-between;
		flex-direction: column;
		.desc_collect {
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 24rpx;
			font-family: PingFang-SC-Regular, PingFang-SC;
			font-weight: 400;
			color: rgba(0, 0, 0, 0.45);
			.desc_collect_left {
				display: flex;
				align-items: center;
				image {
					width: 32rpx;
					height: 32rpx;
					margin-right: 10rpx;
				}
			}
		}
		.desc_title {
			overflow: hidden; //一定要写
			text-overflow: ellipsis; //超出省略号
			display: -webkit-box; //一定要写
			-webkit-line-clamp: 2; //控制行数
			-webkit-box-orient: vertical; //一定要写
			font-size: 32rpx;
			font-family: PingFang-SC-Medium, PingFang-SC;
			color: rgba(0, 0, 0, 0.75);
			line-height: 50rpx;
		}
	}
}

.articletypeone {
	border-bottom: 2rpx solid rgba(0, 0, 0, 0.1) !important;
	padding: 40rpx 0;

	.title {
		font-size: 30rpx;
		font-family: PingFang-SC-Medium, PingFang-SC;
		color: rgba(0, 0, 0, 0.75);
		line-height: 50rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.img {
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-between;
		margin-top: 22rpx;
	}

	.collectTime {
		margin-top: 16rpx;
		display: flex;
		justify-content: space-between;
		font-size: 24rpx;
		font-family: PingFang-SC-Regular, PingFang-SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.45);
		line-height: 34rpx;

		.collectTimeLeft {
			display: flex;
			align-items: center;
		}

		image {
			width: 32rpx;
			height: 32rpx;
			margin-right: 10rpx;
		}
	}
}
</style>
