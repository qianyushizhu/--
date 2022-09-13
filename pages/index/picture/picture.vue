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
    <view class="picture_search">
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
	    <articles :articleListDetail="articleListDetail" ></articles>
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
					Element.route = this.$imgUrl + Element.fid
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
							Element.route = this.$imgUrl + Element.fid
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
							Element.route = this.$imgUrl + Element.fid
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
