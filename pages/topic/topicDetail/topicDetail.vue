<template>
	<view>
		<image :src="detail.cmsTopicInfo.logoId" style="height: 169px;width: 100%;" mode=""></image>
		<view class="" style="padding: 15px;">
			<view class="" style="margin-bottom: 10px;font-size: 20px;
			font-weight: 600;
			color: #000000;">
				{{detail.cmsTopicInfo.topicName}}
			</view>
			<view class="overtext" style="margin-bottom: 20px;">
				<text style="font-weight: 500;color: #49C265;font-size: 500;">摘要：</text><text style="color: #A6A6A6;font-size: 500;">				{{detail.cmsTopicInfo.abstracts}}</text>
			</view>
			
			<view class="" v-if="detail.tags" style="display:flex;align-items: center;">
				<view class="" v-for="e in detail.tags.split(',')" :key="e" style="
				height: 20px;
				padding: 8px;
				margin-right: 12px;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 11px;
				font-weight: 400;
				color: #F5A623;
				background: rgba(245,166,35,0.2);
				border-radius: 4px;">
					{{e}}
				</view>
			
			</view>
		</view>
		<view class="" style="width: 375px;
		height: 6px;
		background: #F0F0F0;">
			
		</view>
		
		<view class="" v-if="detail.pdfInfoList.length!=0 || detail.articleInfoList.length != 0">
			<view class="pdfList_item"  @click="toDetail(item)" v-for="(item, i) in detail.pdfInfoList" :key="i">
				<view class="pdfList_item_top">
					
					{{ item.title }}.pdf
					<text
						style="width: 26px;
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
				
				<view class="pdfList_item_bottom">
					<image src="/static/index/pdfShow.png" mode=""></image>
					<text style="margin-left: 12rpx;">pdf</text>
					<text style="margin-left: 16rpx;">{{ item.fileSize }}</text>
					<text style="margin-left: 16rpx;">{{ item.totalPage }}页</text>
					<text style="margin-left: 16rpx;">{{ item.createTime | year_date }}</text>
				</view>
				<view
				v-if='item.tags'
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
					{{item1}}
					</view>
				</view>
				
			</view>
			<view class="" style="padding: 0 32rpx;">
				<articles :articleListDetail="detail.articleInfoList" ></articles>
			</view>
		</view>
		
		<view class="" v-else style="margin-top: 50px;display: flex;justify-content: center;">
			<image src="/static/show/lj_icon_quesheng@2x.png"  style="width: 120px; height: 100px;" mode=""></image>
		</view>
		
		<view class="" style="width: 126rpx;height: 126rpx;position: fixed;bottom: 50rpx;right: 50rpx;display: flex;justify-content: center;align-items: center;">
			<button style="width: 126rpx;height: 126rpx;border: none;background-color: transparent;" plain open-type="share">
				<image src="/static/fenxiang@2x.png" style="width: 126rpx;height: 126rpx;position: absolute;top: 0;left: 0;" mode=""></image>
			</button>
			
		</view>
		<u-mask :show="xxxshow"></u-mask>
	</view>
</template>

<script>
	import articles from '@/component/articles.vue'
	import {TopicDetail} from '@/common/request.js'
	export default {
		components: {
		  articles
		},
		data() {
			return {
				topicId:'',
				detail:{
					pdfInfoList:[],
					articleInfoList:[]
				},
				xxxshow:true,
				share: {
					title: '松子创业营',
					path: '',
					imageUrl:'' ,
					desc: '',
					content: ''
				},
			};
		},
		onLoad(op) {
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
			uni.showLoading({
				title:'加载中'
			})
			
			this.topicId = op.topicId
			this.TopicDetail()
		},
		
		methods:{
			toDetail(item) {
				if (uni.getStorageSync('status')==1){
							   return false
				}
				
				let timestamp = Math.round(new Date() / 1000);
				if (timestamp - uni.getStorageSync('subMsg') >= 21600) {
					wx.requestSubscribeMessage({
						tmplIds: ['6Bc8Ax3DxUPVbXbSTs2O_GiTIgAwShXJ8Wh7GX6jLJI'],
						success(res) {
							console.log(res);
							let timestamp = Math.round(new Date() / 1000);
							uni.setStorageSync('subMsg', timestamp);
						},
						fail(res) {
							console.log(res);
						}
					});
				}
				uni.navigateTo({
					url: '/pages/index/pdfList/pdfDetail/pdfDetail?id=' + item.pdfId
				});
			},
			TopicDetail(){
				TopicDetail(this.topicId).then(res=>{
					res.code == 0
					 ? (()=>{
						this.detail = res.data
						this.detail.cmsTopicInfo.logoId = this.$imgUrl2 + this.detail.cmsTopicInfo.logoId
						
						this.share.content = this.detail.cmsTopicInfo.topicName
						this.share.imageUrl = this.detail.cmsTopicInfo.logoId
						this.share.path = '/pages/topic/topicDetail/topicDetail?topicId='+this.detail.cmsTopicInfo.topicId
						this.share.desc = this.detail.cmsTopicInfo.abstracts
						this.xxxshow = false
						uni.hideLoading()
					 })()
					 :  uni.$u.toast(res.msg);
				})
			},
		}
	}
</script>

<style lang="less" scoped>
	/deep/ .u-mask{
		background-color: #FFFFFF !important;
	}
.pdfList_item {
	padding: 32rpx;
	border-bottom: 2rpx solid rgba(0, 0, 0, 0.1) !important;
	.pdfList_item_top {
		font-size: 30rpx;
		font-family: PingFang-SC-Medium, PingFang-SC;
		font-weight: 500;
		color: rgba(0, 0, 0, 0.85);
		line-height: 42rpx;
	}
	.pdfList_item_bottom {
		display: flex;
		margin-bottom: 10px;
		align-items: center;
		margin-top: 22rpx;
		font-size: 24rpx;
		font-family: PingFang-SC-Regular, PingFang-SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.45);
		line-height: 34rpx;
		image:nth-child(1) {
			width: 24rpx;
			height: 28rpx;
		}
		image:nth-child(2) {
			width: 52rpx;
			height: 30rpx;
		}
	}
}
</style>
