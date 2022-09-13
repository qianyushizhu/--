<template>
  <view class="myCollect">
    
    
    <view class="pdfList_item" @click="toDetail(item.pdfId)" v-for="(item, i) in list" :key="i">
    	<view class="pdfList_item_top">{{ item.title }}.pdf</view>
    	<view class="pdfList_item_bottom">
    		<image src="../../../static/index/pdfShow.png" mode=""></image>
    		<text style="margin-left: 12rpx;">pdf</text>
    		<text style="margin-left: 16rpx;">{{ item.fileSize }}</text>
    		<text style="margin-left: 16rpx;">{{ item.totalPage }}页</text>
    		<text style="margin-left: 16rpx;">{{ item.createTime | year_date }}</text>
    	</view>
    </view>
    <u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" />
  </view>
</template>

<script>
	import {
	getPdfViewRecords,
	getViewRecords
	} from '../../../common/request.js'
  export default {
	
	  
    data(){
      return {
		
		  current: 0,
        list:[],
		currentPage:1,
		status: 'loadmore',
						iconType: 'flower',
						loadText: {
							loadmore: '',
							loading: '努力加载中',
							nomore: '没有更多数据'
						}
      }
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
		this.selMyCollectPdf()
	},
	onReachBottom() {
			this.currentPage = ++this.currentPage
			this.status = 'loading'
			
	},
    methods:{
		
		selMyCollectPdf() {
		  getPdfViewRecords({
		    page: this.currentPage,
		    pageSize: 10
		  }).then(res => {
			this.list = this.list.concat(res.data)
			if(this.list.length==res.count || res.count == 0) this.status = 'nomore'
			else this.status = 'loadmore'
			
		  })
		},
	
      toDetail(id){
		  console.log(id)
        uni.navigateTo({
          url:'/pages/index/pdfList/pdfDetail/pdfDetail?id='+id
        })
      }
    }
  }
</script>
<style lang="less">
	.myCollect{
		padding: 10px 15px;
	}
  .pdfList{
    padding: 0 30rpx ;
  }
  .pdfList_search{
    margin-top: 20rpx;
  }
  .pdfList_item{
    padding: 32rpx 0;
    border-bottom: 2rpx solid rgba(0, 0, 0, 0.15);
    .pdfList_item_top{
      font-size: 30rpx;
      font-family: PingFang-SC-Medium, PingFang-SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      line-height: 42rpx;
    }
    .pdfList_item_bottom{
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