<template>
	<view class="">
		<view class="" v-if="type=='topic'" style="height: 44px;background: rgba(73,194,101,0.2);display: flex;align-items: center;justify-content: center;font-size: 16px;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: #49C265;">
						{{title}}
					</view>
		<view class="pdfList" v-if="list.length!==0">
			
		  <view class="pdfList_item" @click="toDetail(item.pdfId,item.browsePermission)" v-for="(item, i) in list" :key="i">
		  	<view class="pdfList_item_top">{{ item.title }}.pdf
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
		  		<image src="../../../static/index/pdfShow.png" mode=""></image>
		  		<text style="margin-left: 12rpx;">pdf</text>
		  		<text style="margin-left: 16rpx;">{{ item.fileSize }}</text>
		  		<text style="margin-left: 16rpx;">{{ item.totalPage }}页</text>
					<text style="margin-left: 16rpx;">{{ item.createTime | year_date }}</text>
		  	
		  	</view>
				<view
					class=""
					style="display: flex;align-items: center;font-size: 12px;
					font-family: PingFang-SC-Regular, PingFang-SC;
					font-weight: 400;
					color: #F5A623;
					line-height: 17px;"
				>
					<view
						class=""
						v-for="item in 3"
						:key="item"
						style="margin-right: 12px;display: center;flex-wrap: wrap;;align-items: center;height: 20px;background: rgba(245,166,35,0.2);border-radius: 4px;padding: 2px 12px;"
					>
						政务
					</view>
				</view>
				
		  </view>
		  
			<u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" />
			<u-modal
				v-model="vipShow"
				:mask-close-able="true"
				title="会员提醒"
				width="70%"
				:show-title="true"
				@confirm="confirmVip"
				@cancel="cancelVip"
				content="该内容需要会员才能观看,请登录"
				:show-cancel-button="true"
			></u-modal>
		</view>
		<view  style="display: flex;justify-content: center;margin-top: 50rpx;" v-else>
			<image src="../../../static/show/lj_icon_quesheng@2x.png" style="width: 80px;height: 60px;" mode=""></image>
		</view>
	</view>
</template>
<script>
	import {
	getPdfInfoList,
	getTopicPdfs
	} from '../../../common/request.js'
  export default {
    data(){
      return {
		  vipShow:false,
        list:[],
		currentPage:1,
		status: 'loadmore',
						iconType: 'flower',
						loadText: {
							loadmore: '',
							loading: '努力加载中',
							nomore: '没有更多数据'
						},
						keyword:'',
						topicId:'',
						type:'',
						title:""
      }
    },
	onLoad(opitons) {
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
		console.log(opitons)
		if(opitons.type ==  'topic'){
			this.type =  'topic'
			this.topicId = opitons.topicId
			this.title = opitons.title
			this.getTopicPdfs()
		}else{
			this.keyword = opitons.keyword
			this.getPdfInfoList()
		}
	},
	
	onReachBottom() {
			this.currentPage = ++this.currentPage
			this.status = 'loading'
			this.getPdfInfoList()
			
	},
	
    methods:{
		
		confirmVip() {
			uni.navigateTo({
				url: '/pages/index/vipLogin/vipLogin'
			});
		},
		cancelVip() {
			
		},
		// 获取pdf列表
		getPdfInfoList() {
			console.log(this.keyword)
				getPdfInfoList({
				  page: this.currentPage,
				  pageSize:10,
				  title:this.keyword
				}).then(res => {
							if (res.code == 0) {
								this.list = this.list.concat(res.data);
								if (this.list.length == res.count || res.count == 0) this.status = 'nomore';
								else this.status = 'loadmore';
							}
				})
		},
		getTopicPdfs() {
				getTopicPdfs({
				  page: this.currentPage,
				  pageSize:10,
				  topicId:this.topicId
				}).then(res => {
							if (res.code == 0) {
								this.list = this.list.concat(res.data);
								if (this.list.length == res.count || res.count == 0) this.status = 'nomore';
								else this.status = 'loadmore';
							}
				})
		},
     toDetail(id,browsePermission){
		 if(uni.getStorageSync('userRole')==4 && browsePermission == 2){
		 	this.vipShow = true
		 	return
		 }
		let timestamp = Math.round(new Date() / 1000)
		if(timestamp-uni.getStorageSync('PDFsubMsg')>=60*60*1){
			wx.requestSubscribeMessage({
				tmplIds:['UFE9-Ma7eyhyfScxZL6eMWosKAKcCHRpN6LmZMAEOBU'],
				 success (res) { 
					 console.log(res)
					 let  timestamp = Math.round(new Date() / 1000)
					 uni.setStorageSync('PDFsubMsg',timestamp)
				 },
				 fail (res) {
				 					 console.log(res)
				 }
			})
		}
       uni.navigateTo({
         url:'../../index/pdfList/pdfDetail/pdfDetail?id='+id
       })
     },
    }
  }
</script>
<style lang="less">
  .pdfList{
    padding: 0 30rpx ;
  }
  .pdfList_search{
    margin-top: 20rpx;
  }
  .pdfList_item{
    padding: 32rpx 0;
    border-bottom: 2rpx solid rgba(0, 0, 0, 0.1) !important;
    .pdfList_item_top{
      font-size: 30rpx;
      font-family: PingFang-SC-Medium, PingFang-SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      line-height: 42rpx;
    }
    .pdfList_item_bottom{
		display: flex;
		margin-bottom: 10px;
		align-items: center;
      margin-top: 22rpx;
      font-size: 24rpx;
      font-family: PingFang-SC-Regular, PingFang-SC;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.45);
      line-height: 34rpx;
      image{
        width: 24rpx;
        height: 28rpx;
      }
    }
  }
</style>