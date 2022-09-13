<template>
  <view class="myCollect">
    <u-sticky>
     
		<u-tabs :list="tabs"
		font-size='34'
		 :active-item-style="{
			  color: '#49C265',
			 fontWeight: 'bold',
			 transform: 'scale(1.15)'
		 }"
		 :bar-style="{
		 				  backgroundColor: '#49C265',
		 }"
		 :is-scroll="false" :current="current"
		  @change="change"></u-tabs>
		
    </u-sticky>
    <view class="articles" v-if="current==0&&list.length!==0">
      <articles :articleListDetail="list" ></articles>
    </view>
    <view v-else-if='current==1&&list.length!==0' class="pdfList_item" @click="toDetail(item.pdfId)" v-for="(item, i) in list" :key="i">
    	<view class="pdfList_item_top">{{ item.title }}.pdf</view>
    	<view class="pdfList_item_bottom">
    		<image src="../../../static/index/pdfShow.png" mode=""></image>
    		<text style="margin-left: 12rpx;">pdf</text>
    		<text style="margin-left: 16rpx;">{{ item.fileSize }}</text>
    		<text style="margin-left: 16rpx;">{{ item.totalPage }}页</text>
    		<text style="margin-left: 16rpx;">{{ item.createTime | year_date }}</text>
    	</view>
    </view>
	<view  style="display: flex;justify-content: center;margin-top: 50rpx;" v-else>
		<image src="../../../static/show/lj_icon_quesheng@2x.png" style="width: 80px;height: 60px;" mode=""></image>
	</view>
    <u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" />
  </view>
</template>

<script>
	import articles from'../../../component/articles.vue'
	import {
	getPDFCollectRecords,
	getArticleCollectRecords
	} from '../../../common/request.js'
  export default {
	  components:{
	    articles
	  },
	  
    data(){
      return {
		  tabs: [{
		    name: '资讯'
		  }, {
		    name: '文库'
		  }],
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
		this.getMyCollect()
	},
	onReachBottom() {
			this.currentPage = ++this.currentPage
			this.status = 'loading'
			
			if(this.current==0){
				this.getMyCollect()
			}else{
				this.selMyCollectPdf()
			}
			
	},
    methods:{
		change(index){
		  this.current=index
		  this.currentPage = 1
		  this.list  = []
		  if(index==0){
			  this.getMyCollect()
		  }else{
			  this.selMyCollectPdf()
		  }
		},
		// 获取pdf列表
		selMyCollectPdf() {
		  getPDFCollectRecords({
		    page: this.currentPage,
		    pageSize: 10
		  }).then(res => {
		    
			
			this.list = this.list.concat(res.data)
			if(this.list.length==res.count || res.count == 0) this.status = 'nomore'
			else this.status = 'loadmore'
			
		  })
		},
		// 获取资讯
		getMyCollect() {
		  getArticleCollectRecords({
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
    padding: 32rpx;
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