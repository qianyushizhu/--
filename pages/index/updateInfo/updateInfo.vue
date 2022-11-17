<template>
	<view style="display: flex;justify-content: center;align-items: center;height: 800rpx;">
		<view class="layer4">
			<view class="block1">
				<text lines="1" class="word8">修改编辑</text>
				<view class="mod2"><input type="text" class="word9" v-model="userName" placeholder="请输入分享者名称…" /></view>
				<view class="mod3"><input type="text"  class="word10" v-model="title" placeholder="请输入标题…" /></view>
				<view class="mod4">
					<button @click="over" class="wrap2"><text lines="1" class="word11">取消</text></button>
					<button @click="comflim" class="wrap3"><text lines="1" class="info6">确认</text></button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userName:'',
				title:'',
			}
		},
		onLoad(opitons) {
			console.log(opitons)
			this.userName = opitons.name
			this.title = opitons.title
		},
		methods: {
			over() {
				uni.navigateBack({
					delta:1
				})
			},
			comflim() {
				let pages = getCurrentPages();  //获取所有页面栈实例列表
				let prevPage = pages[ pages.length - 2 ];  //上一页页面实例
				console.log(prevPage)
				
				uni.navigateBack({  //uni.navigateTo跳转的返回，默认1为返回上一级
					delta: 1,
					success: (res) => {
						prevPage.$vm.name = this.title
						prevPage.$vm.userName = this.userName
						prevPage.$vm.logo = prevPage.$vm.detail.logoId
						prevPage.$vm.headerImg = uni.getStorageSync('headLogoUrl')
						prevPage.$vm.comflim()
					}
				});
			},
		}
	}
</script>

<style>
.layer4 {
	box-sizing: border-box;
	height: 466rpx;
	border-radius: 16rpx;
	background-color: rgba(255, 255, 255, 1);
	width: 596rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	position: relative;
}
.block1 {
	width: 472rpx;
	height: 368rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
}
.word8 {
	width: 128rpx;
	height: 44rpx;
	display: block;
	overflow-wrap: break-word;
	color: rgba(35, 35, 35, 1);
	font-size: 32rpx;
	font-family: PingFang-SC-Medium;
	white-space: nowrap;
	line-height: 44rpx;
	text-align: left;
	align-self: flex-start;
	margin-left: 166rpx;
}
.mod2 {
	height: 64rpx;
	border-radius: 16rpx;
	border: 1px solid rgba(166, 166, 166, 1);
	margin-top: 52rpx;
	width: 472rpx;
	justify-content: center;
	align-items: flex-start;
	padding-left: 29rpx;
	display: flex;
	flex-direction: column;
}
.word9 {
	box-sizing: border-box;
	width: 100%;
	height: 34rpx;
	display: block;
	overflow-wrap: break-word;
	color: rgba(166, 166, 166, 1);
	font-size: 24rpx;
	font-family: PingFang-SC-Regular;
	white-space: nowrap;
	line-height: 34rpx;
	text-align: left;
}
.mod3 {
	height: 64rpx;
	border-radius: 16rpx;
	border: 1px solid rgba(166, 166, 166, 1);
	margin-top: 32rpx;
	width: 472rpx;
	justify-content: center;
	align-items: flex-start;
	padding-left: 29rpx;
	display: flex;
	flex-direction: column;
}
.word10 {
	box-sizing: border-box;
	width: 90%;
	height: 34rpx;
	display: block;
	overflow-wrap: break-word;
	color: rgba(166, 166, 166, 1);
	font-size: 24rpx;
	font-family: PingFang-SC-Regular;
	white-space: nowrap;
	line-height: 34rpx;
	text-align: left;
}
.mod4 {
	width: 472rpx;
	height: 72rpx;
	margin-top: 40rpx;
	flex-direction: row;
	display: flex;
	justify-content: space-between;
}
.wrap2 {
	height: 72rpx;
	border-radius: 16rpx;
	border: 1px solid #49C265;
	background-color: #fff;
	width: 216rpx;
	color: #49C265;
	justify-content: center;
	align-items: center;
	display: flex;
	flex-direction: column;
}
.word11 {
	width: 56rpx;
	height: 40rpx;
	display: block;
	overflow-wrap: break-word;
	font-size: 28rpx;
	font-family: PingFang-SC-Regular;
	white-space: nowrap;
	line-height: 40rpx;
	text-align: left;
}
.wrap3 {
	height: 72rpx;
	border-radius: 16rpx;
	background-color: #49C265;
	width: 216rpx;
	justify-content: center;
	align-items: center;
	display: flex;
	flex-direction: column;
}
.info6 {
	width: 56rpx;
	height: 40rpx;
	display: block;
	overflow-wrap: break-word;
	color: rgba(255, 255, 255, 1);
	font-size: 28rpx;
	font-family: PingFang-SC-Regular;
	white-space: nowrap;
	line-height: 40rpx;
	text-align: left;
}
</style>
