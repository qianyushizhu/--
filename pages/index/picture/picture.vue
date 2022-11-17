<template>
  <view class="picture">
	  <view class="" style="margin-bottom: 10px;">
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
	  </view>
    <view class="picture_search" style="">
      <u-search :show-action="false" :animation="true" v-model="searchValue" placeholder="请输入搜索内容" @change="search"></u-search>
      <!-- <u-search placeholder="日照香炉生紫烟" v-model="keyword"></u-search> -->
    </view>
	<template v-if="current == 1 && list.length!==0">
		<view class="picture_item"   @click="toDetail(item.albumId,item.title,item.createTime)" v-for="(item,index) in list" :key='index'>
		  <view class="picture_item_title">
		    {{item.title}}
		  </view>
		  <view class="picture_item_img">
		    <u-lazy-load style="width: 32%;margin-right: 10px;flex: 1;" border-radius="10" height="156" img-mode="aspectFill"
		      v-for="(item1, index1) in item.fileList" :key="index1" :image="item1.route"></u-lazy-load>
		  </view>
		  <view class="picture_item_bottom">
		    <view>
		     {{item.createTime | year_mintes}}
		    </view>
		    <view class="picture_item_bottom_right">
		      <view>共{{item.fileNum}}张</view>
		      <view class="picture_item_btn" >查看全部</view>
		    </view>
		  </view>
		</view>
	</template>
   
	  <!-- articles -->
	  <view v-else-if="current == 0 && articleListDetail.length!==0">
		  <view class="articletypetwo" v-for="(item,index) in articleListDetail" :key="index" @click="toactiveDetail(item)">
		  	<view style="width: 222rpx;position: relative;">
		  		<u-lazy-load border-radius="10" height="156" img-mode="aspectFill" :image="'https://file.innopinenut.com/' + item.logoId"></u-lazy-load>
		  		
		  	</view>
		  
		  	<view class="desc">
		  		<view class="desc_title">{{ item.title }}</view>
		  		<view class="desc_collect">
		  			<view>截至时间：{{ item.endSignTime | year_date }}</view>
					<view class="" v-if='item.canSign' style="width: 80px;
						height: 30px;
						display: flex;
						font: 12px;
						color: #fff;
						justify-content: center;
						align-items: center;
						background: #49C265;
						border-radius: 12px;">
						立即报名
					</view>
		  		</view>
		  	</view>
		  </view>
	  </view>
	  
	  <view  v-else-if="current == 0 && articleListDetail.length == 0 || current == 1 && list.length==0" style="display: flex;justify-content: center;margin-top: 50rpx;">
	  	<image src="../../../static/show/lj_icon_quesheng@2x.png" style="width: 80px;height: 60px;" mode=""></image>
	  </view>
	  
	<u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" />
  </view>
</template>
<script>
	import {
	getAppActivityList,
	getActivity,
	getAppAlbumList,
	getAlbumFiles,
	} from '../../../common/request.js'
  export default {
	 
    data() {
      return {
		  tabs: [{
		    name: '活动介绍'
		  }, {
		    name: '活动相册'
		  }],
		  current: 0,
        list: [],
		searchValue:'',
		currentPage:1,
		
		articleListDetail:[],
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
		this.getAppActivityList()
	},
	onReachBottom() {
			this.currentPage = ++this.currentPage
			this.status = 'loading'
			if(this.searchValue!==''){
				this.getAppAlbumList_server(this.searchValue)
			}else{
				this.getAppAlbumList_server()
			}
			
			
	},
	onPullDownRefresh() {
		
		getAppAlbumList({
			page:this.currentPage,
			pageSize:10
		}).then(res=>{
			res.data.forEach(item=>{
				item.fileList.forEach(Element=>{
					
					if(Element.fileType == 2){
						if(Element.posterId!=''){
							Element.route = this.$imgUrl + Element.posterId
						}else{
							Element.route = '/static/dwdw.png'
						}
					}else{
						Element.route = this.$imgUrl + Element.fid
					}
				})
			})
			this.list = res.data
			if(this.list.length==res.count || res.count == 0) this.status = 'nomore'
			else this.status = 'loadmore'
		})
		
	},
    methods:{
		getAppActivityList() {
		  getAppActivityList({
		    page:this.currentPage,
		    pageSize: 10,
		  }).then(res => {
					 this.articleListDetail = this.articleListDetail.concat(res.data)
					if(this.articleListDetail.length==res.count || res.count == 0) this.status = 'nomore'
					else this.status = 'loadmore'
		   
		  })
		},
		toactiveDetail(item) {
			let timestamp = Math.round(new Date() / 1000);
			if (timestamp - uni.getStorageSync('ordersubMsg') >= 60 * 60) {
				wx.requestSubscribeMessage({
					tmplIds: ['HjopjHv0BDoxcE4IHVc85qIWZ8wEDbMtSlipfYGXtkg'],
					success(res) {
						console.log(res);
						let timestamp = Math.round(new Date() / 1000);
						uni.setStorageSync('ordersubMsg', timestamp);
					},
					fail(res) {
						console.log(res);
					}
				});
			}
			if(item.originType == 1){
				uni.navigateTo({
					url:
						'/pages/index/webView/webView?url=' +
						encodeURIComponent(item.url) +
						'&title=' +
						item.title +
						'&logoId=' +
						item.logoId
				});
			}else{
				uni.navigateTo({
				  url:`/pages/index/picture/activeDetail/activeDetail?activityId=${item.activityId}`
				})
			}
			
		},
		change(index){
		  this.current=index
		  this.currentPage = 1
		  console.log(index)
		  if(index==0){
			  this.articleListDetail  = []
			  this.getAppActivityList()
		  }else{
			  this.list  = []
			  this.getAppAlbumList_server(this.searchValue)
		  }
		},
		search(){
			this.list = []
			this.getAppAlbumList_server(this.searchValue)
		},
		getAppAlbumList_server(name){
			if(name){
				getAppAlbumList({
					page:this.currentPage,
					pageSize:10,
					title:this.searchValue
				}).then(res=>{
					res.data.forEach(item=>{
						item.fileList.forEach(Element=>{
							if(Element.fileType == 2){
								if(Element.posterId!=''){
									Element.route = this.$imgUrl + Element.posterId
								}else{
									Element.route = '/static/dwdw.png'
								}
							}else{
								Element.route = this.$imgUrl + Element.fid
							}
						})
					})
					this.list = this.list.concat(res.data)
					if(this.list.length==res.count || res.count == 0) this.status = 'nomore'
					else this.status = 'loadmore'
					
					
				})
			}else{
				getAppAlbumList({
					page:this.currentPage,
					pageSize:10
				}).then(res=>{
					res.data.forEach(item=>{
						item.fileList.forEach(Element=>{
							if(Element.fileType == 2){
								if(Element.posterId!=''){
									Element.route = this.$imgUrl + Element.posterId
								}else{
									Element.route = '/static/dwdw.png'
								}
							}else{
								Element.route = this.$imgUrl + Element.fid
							}
						})
					})
					this.list = this.list.concat(res.data)
					if(this.list.length==res.count || res.count == 0) this.status = 'nomore'
					else this.status = 'loadmore'
				})
			}
			
		},
      toDetail(id,name,date){
		 let date1 = this.$fifter.year_mintes(date)
		 console.log(date1)
        uni.navigateTo({
          url:`./activePic/activePic?id=${id}&name=${name}&date=${date1}`
        })
      }
    }
  }
</script>
<style scoped lang="less">
	.articletypetwo {
		display: flex;
		padding: 20px 0;
		border-bottom: 1px solid rgba(0,0,0,0.2);;
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
	
  .picture {
    padding: 0 30rpx;
  }
  .picture_item{
    padding: 40rpx 0;
    border-bottom: 2rpx solid rgba(0, 0, 0, 0.1) !important;
    .picture_item_title{
      font-size: 36rpx;
      font-family: PingFang-SC-Medium, PingFang-SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      overflow: hidden; //一定要写
      text-overflow: ellipsis; //超出省略号
      display: -webkit-box; //一定要写
      -webkit-line-clamp: 1; //控制行数
      -webkit-box-orient: vertical; //一定要写
    }
    .picture_item_img{
      margin-top: 16rpx;
      display: flex;
     
	 
    }
    .picture_item_bottom{
      margin-top: 20rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 24rpx;
      font-family: PingFang-SC-Regular, PingFang-SC;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.85);
      .picture_item_bottom_right{
        display: flex;
        align-items: center;
        .picture_item_btn{
          margin-left: 60rpx;
        width:160rpx;
        height: 56rpx;
        background: #00B386;
        border-radius: 8rpx;
        text-align: center;
        line-height: 56rpx;
        font-size: 24rpx;
        font-family: PingFang-SC-Regular, PingFang-SC;
        font-weight: 400;
        color: #FFFFFF;
      }
      }
      
    }
  }
</style>
