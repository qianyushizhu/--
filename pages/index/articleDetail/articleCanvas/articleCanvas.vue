<template>
	<view class="canvasGoods" style="position: relative;">
		<canvas  style="width: 300px; height: 510px;margin:0 auto;margin-top: 100rpx;" canvas-id="firstCanvas" id="firstCanvas" class="firse_cavas"></canvas>
		<view style="margin: 0 auto;margin-top: 100rpx;">
			<view class="saveImg" @click="saveCanvas">保存图片</view>
			<view class="saveImg1" @click="uditCanvas">修改</view>
		</view>
		
	</view>
</template>

<script>
import { getAppletCode } from '../../../../common/request.js';
export default {
	data() {
		return {
			logo: '',
			name: '',
			erweimaCode: '',
			userName: '',
			headerImg: '',
			id: '',
			str: '松子创业营',
			show: false,
			context: null,
			detail:{},
			type:''
		};
	},
	onLoad(options) {
		console.log(options);
			let detail = JSON.parse(options.detail)
			this.detail = detail;
		if (options) {
			this.name = detail.name;
			this.logo =  detail.logoId;
			this.type =  detail.type;
			this.id = detail.id;
			console.log(this.logo, this.name, this.id);
			this.headerImg = uni.getStorageSync('headLogoUrl');
			this.userName = uni.getStorageSync('userName')
			
		}
		this.getCode();
	},
	methods: {
		over() {
			this.show = false;
		},
		comflim() {
			console.log(this.userName.length)
			
			this.context = uni.createCanvasContext('firstCanvas', this);
			// this.context.clearRect(0, 0, this.context.width, this.context.height);
			this.getCode();
		
		},
		drawCanvas() {
			var _this = this;
			_this.showCanvas = true;
			_this.context = uni.createCanvasContext('firstCanvas', _this);
			_this.context.width = 300;
			_this.context.height = 510;
			_this.context.drawImage('/static/bg.png', 0, 0, 300, 510);
			
			_this.context.drawImage(_this.logo, 48, 140, 205, 272);
			_this.context.drawImage(_this.erweimaCode, 210,425, 70, 70) //二维码
			
			
			// _this.context.setFontSize(15);
			// _this.context.setFillStyle('#A6A6A6');
			// _this.context.fillText('为您推荐', 80, 105); //文字
			// _this.context.save();
			// 标题
			_this.context.font = 'normal 13px Arial';
			_this.context.setFillStyle('rgba(0, 0, 0, 0.85)');
			_this.drawtext(_this.context,_this.name, 30,420, 150);
			let a = this.userName
				if(a.length>7){
					a= a.slice(0,7)+'...'
				}else{
					a =a
				}
			
			// 昵称
			_this.context.font = 'normal bold 20px Arial';
			_this.context.setFillStyle('#000');
			_this.context.fillText(a, 85, 85);
			_this.context.save();
			_this.context.font = 'PingFangSC-Semibold, PingFang SC;';
			_this.context.setFontSize(15);
			_this.context.setFillStyle('rgba(0, 0, 0, .65)');
			_this.context.fillText('带来的分享', 85, 105); //文字
			// 头像
			_this.context.arc(50 / 2 + 24, 50 / 2 + 65, 50 / 2, 0, Math.PI * 2, false);
			_this.context.clip(); //画好了圆 剪切  原始画布中剪切任意形状和尺寸。
			_this.context.drawImage(_this.headerImg, 24, 65, 50, 50);
			_this.context.restore(); //恢复之前保存的绘图上下文 恢复之前保存的绘图问下文即状态 还可以继续绘制
			_this.context.save();
			
			_this.context.draw(true);
		
			
		},
		uditCanvas() {
			uni.navigateTo({
				url:'../../updateInfo/updateInfo?name=' + this.userName +'&title=' + this.name,
			})
		},
		saveCanvas() {
			//保存图片到本地
			let _this = this;

			uni.canvasToTempFilePath({
				// 保存canvas为图片
				canvasId: 'firstCanvas',
				quality: 1,
				complete: function(res) {
					console.log(res);
					uni.saveImageToPhotosAlbum({
						filePath: res.tempFilePath,
						success: function() {
							console.log('save success');
							uni.showToast({
								title: '保存成功'
							});
							setTimeout(() => {
								_this.showCanvas = false;
							}, 2000);
						},
						fail() {
							console.log('save fail');
							uni.showToast({
								title: '位置异常',
								icon: 'none'
							});
							setTimeout(() => {
								_this.showCanvas = false;
							}, 1000);
						}
					});
				}
			});
		},
		// 文字换行
		drawtext(ctx, t, x, y, w) {
			console.log('重画了');
			//参数说明
			//ctx：canvas的 2d 对象，t：绘制的文字，x,y:文字坐标，w：文字最大宽度
			let chr = t.split('');
			let temp = '';
			let row = [];

			for (let a = 0; a < chr.length; a++) {
				if (ctx.measureText(temp).width < w && ctx.measureText(temp + chr[a]).width <= w) {
					temp += chr[a];
				} else {
					row.push(temp);
					temp = chr[a];
				}
			}
			row.push(temp);
			for (let b = 0; b < row.length; b++) {
				ctx.fillText(row[b], x, y + (b + 1) * 20); //每行字体y坐标间隔20
			}
		},
		getCode() {
			uni.showLoading({
				title: '生成中...'
			});
			let a ={}
			if(this.type == 'acticle'){
				a.pagePath =  'pages/index/articleDetail/articleDetail' ,
				a.scene = this.id
			}else{
				a.pagePath =  'pages/index/pdfList/pdfDetail/pdfDetail' ,
				a.scene = this.id
			}
			getAppletCode(a).then(res => {
				if (res.code == 0) {
					Promise.all([this.onlineToLocal(this.$imgUrl2 + res.data.fid, 1), this.onlineToLocal(this.logo, 2), this.onlineToLocal(this.headerImg, 3)])
						.then(result => {
							console.log('success' + result); //['成功了', 'success']
							if (result.length > 0) {
								this.drawCanvas();
								wx.hideLoading();
							}
						})
						.catch(error => {
							wx.hideLoading();
							console.log(error);
						});
				}
			});
		},
		// 线上图片转为本地
		onlineToLocal(url, type) {
			var that = this;
			return new Promise(resolve => {
				wx.downloadFile({
					url: url,
					success(res) {
						console.log(res);
						if (res.statusCode === 200) {
							if (type == 1) {
								that.erweimaCode = res.tempFilePath;
								console.log(that.erweimaCode)
							} else if (type == 3) {
								that.headerImg = res.tempFilePath;
							} else {
								that.logo = res.tempFilePath;
							}
							resolve(res.tempFilePath);
						}
					},
					fail: err => {
						console.log(err);
					}
				});
			});
		}
	}
};
</script>

<style scoped lang="less">

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
	border: 0.5px solid rgba(166, 166, 166, 1);
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
	border: 0.5px solid rgba(166, 166, 166, 1);
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
	border: 0.5px solid #49C265;
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
.canvasGoods {
	min-height: 100vh;
	background-color: #f1f1f1;
	padding-top: 12rpx;
}
.canvasGoods_copy {
	width: 95%;
	margin: 0 auto;
	padding: 30rpx;
	background-color: #ffffff;
	.canvasGoods_copy_bottom {
		margin-top: 34rpx;
		font-size: 28rpx;
		font-family: PingFang-SC-Regular, PingFang-SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.45);
	}
	.canvasGoods_copy_top {
		display: flex;
		justify-content: space-between;
		font-size: 28rpx;
		font-family: PingFang-SC-Regular, PingFang-SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.85);
		view:last-child {
			border-radius: 8rpx;
			border: 2rpx solid #49C265;
			font-size: 24rpx;
			font-family: PingFang-SC-Regular, PingFang-SC;
			font-weight: 400;
			color: #49C265;
			padding: 2rpx 22rpx;
		}
	}
}
.saveImg {
	margin: 0 auto;
	margin-top: 76rpx;
	width: 526rpx;
	height: 84rpx;
	background: #49C265;
	border-radius: 42rpx;
	border-radius: 16rpx;
	font-family: PingFang-SC-Regular, PingFang-SC;
	font-weight: 400;
	color: #ffffff;
	text-align: center;
	line-height: 84rpx;
	margin-bottom: 40rpx;
}
.saveImg1 {
	margin: 0 auto;
	width: 526rpx;
	height: 84rpx;
	border-radius: 16rpx;
	font-size: 28rpx;
	font-family: PingFang-SC-Regular, PingFang-SC;
	font-weight: 400;
	color: #49C265;
	text-align: center;
	line-height: 84rpx;
	background-color: #ffffff;
}
</style>
