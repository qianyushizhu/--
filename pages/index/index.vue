<template>
  <view>
    <!-- <view class="index">
      <u-search :show-action="false" :animation="true" placeholder="请输入搜索内容"></u-search>
      <u-search placeholder="日照香炉生紫烟" v-model="keyword"></u-search>
    </view> -->
    <view class="index_swiper">
      <u-swiper border-radius="0" :title="true" interval='10000' indicator-pos="topRight" height="376" :list="banners" @click="godetail"></u-swiper>
    </view>
    <view class="index_content">
      <!-- tabs -->
      <view class="index_tabs">
        <view @click="toAboutUs">
          <image src="../../static/index/sz_icon_guanyuwomen@2x.png"></image>
          <text>关于我们</text>
        </view>
        <view @click="joinUs">
          <image src="../../static/index/sz_icon_guanyuhuodong@2x.png"></image>
          <text>关于活动</text>
        </view>
        
		
        <view @click="toPdf">
          <image src="../../static/index/sz_icon_hangyezixun@2x.png"></image>
          <text>研报</text>
        </view>
		<view @click="tozhuanti">
		  <image src="../../static/lj_icon_xiehuiwenku@2x.png"></image>
		  <text>专题</text>
		</view>
		
      </view>

      <!-- 滚动 -->
      <view class="index_notice">
        <view class="index_notice_left">
          <image src="../../static/new/gx_icon__pdf2@2x.png"></image>
		  <view class="">
		  	最新资料
		  </view>
        </view>
        <view style="flex: 1;margin-right: 10rpx;">
          <noticebar :list="pdfList"></noticebar>
        </view>
		<view class="" @click="toPdfList">
		 <image style="width: 40rpx;height: 40rpx;margin-top: 10rpx;" src="../../static/index/lj_icon_liebiao@2x.png"></image>
		</view>
		
      </view>

	


    </view>
		<view class="xxxxx">
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
			 :is-scroll="true" :current="current"
			  @change="change"></u-tabs>
		</view>
	
	  <!-- tabs -->
	  <view style="padding: 0 30rpx;">
	   
	    <!-- articles -->
	    <view>
	      <articles :articleListDetail="articleListDetail" ></articles>
		  <u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" />
	    </view>
	  </view>
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
</template>

<script>
  import noticebar from '../../component/noticebar.vue'
  import articles from '../../component/articles.vue'
  import {
    getAll,
    getPdfInfoList,
	getOnlineArticles,
	getTypes,
	getRecPDFList
  } from '../../common/request.js'
  export default {
    components: {
      noticebar,
      articles
    },
    data() {
      return {
		  vipShow:false,
		  share:{
		      title:'松子创业营',
		      path:'',
		      imageUrl:'',
		      desc:'',
		      content:''
		  },
        keyword: '',
        list1: [
          
        ],
        banners: [
        ],
        tabs: [],
        current: 0,
		articleListDetail:[],
		pdfList:[],
		typeId:'',
		currenPage:1,
				status: 'loadmore',
						iconType: 'flower',
						loadText: {
							loadmore: '',
							loading: '努力加载中',
							nomore: '没有更多数据'
						},
      }
    },
    onLoad() {
		
      this.getBanner()
      this.getRecPDFList()
      this.getTypes(true)
    },
	onReachBottom() {
			this.currenPage = ++this.currenPage
				this.getOnlineArticles(this.typeId)
			
	},
	onPullDownRefresh() {
		this.currenPage = 1
		this.getBanner()
		this.getRecPDFList()
		this.getTypes()
		this.getOnlineArticles(this.typeId,true)
		
		setTimeout(function () {
		           uni.stopPullDownRefresh();
		       }, 1000);
	},
    methods: {
		tozhuanti(){
			 uni.$u.toast('功能还未开放');
			// uni.switchTab({
			// 	url:'/pages/topic/topic'
			// })
		},
		toPdf(){
			uni.switchTab({
				url:'../pdfLibrary/index'
			})
		},
		
		confirmVip() {
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
			uni.navigateTo({
				url: '/pages/index/vipLogin/vipLogin'
			});
		},
		cancelVip() {
			
		},
      // 获取轮播图
      getBanner() {
        getAll({
          page: 1,
          pageSize: 1000,
        }).then(res => {
          console.log(res)
          if (res.code == 0) {
            for(var key in res.data){
              res.data[key].image = this.$imgUrl + res.data[key].logoId
            }
            this.banners = res.data
          }
        })
      },
      
      // 获取文章类别
      getTypes(first) {
        getTypes({
          typeGroup:'ARTICLE'
        }).then(res => {
         if(res.code==0){
			 res.data.forEach(e=>{
				 e.name = e.typeName
			 })
			 this.tabs = res.data
			 if(first){
				this.typeId = res.data[0].typeId 
				  this.getOnlineArticles(res.data[0].typeId)
			 } 
			 
			 
			
		 }
          
        })
      },
	  getRecPDFList() {
	  	getPdfInfoList({
			page:1,
			pageSize:12
		}).then(res => {
	  		if (res.code == 0) {
	  			let result = []
	  			let two  = []
				
	  			for(let i=0;i<res.data.length;i++){
	  				two.push(res.data[i])
	  				if(two.length==2){
	  					if(result.length!==6){
	  						result.push(two)
	  						two = []
	  					}else{
	  						return false
	  					}
	  					
	  					
	  				}
	  			}
				console.log(result)
	  			this.pdfList = result
				console.log(this.pdfList)
	  		}
	  	});
	  },
	  
      // 根据类别查询
      getOnlineArticles(typeId,isRefs) {
        getOnlineArticles({
          page:this.currenPage,
          pageSize: 10,
          typeId: typeId
        }).then(res => {
			if(isRefs) this.articleListDetail = res.data
			else  this.articleListDetail = this.articleListDetail.concat(res.data)
			if(this.articleListDetail.length==res.count || res.count == 0) this.status = 'nomore'
			else this.status = 'loading'
         
        })
      },
      change(index) {
		   if (uni.getStorageSync('status')==1){
			   return false
		   }
		  console.log(index)
		  this.currenPage = 1
		  this.articleListDetail = []
        this.current = index;
		this.typeId = this.tabs[index].typeId
		this.getOnlineArticles(this.typeId)
		
      },
	  
	  godetail(index) {
		  if (uni.getStorageSync('status')==1){
		  			   return false
		  }
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
	    if(this.banners[index].originType=='WEBURL'){
			uni.navigateTo({
			  url: '/pages/index/webView/webView?url=' + encodeURIComponent(this.banners[index].urlMsg)
			})
		}else if(this.banners[index].originType=='PDF'){
			
			let timestamp = Math.round(new Date() / 1000)
			if(timestamp-uni.getStorageSync('PDFsubMsg')>=60*60*1){
				wx.requestSubscribeMessage({
					tmplIds:['6Bc8Ax3DxUPVbXbSTs2O_GiTIgAwShXJ8Wh7GX6jLJI'],
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
			  url:'pdfList/pdfDetail/pdfDetail?id='+this.banners[index].originId 
			})
		}
		else if(this.banners[index].originType=='ACTIVITY'){
			
			uni.navigateTo({
			  url:'/pages/index/picture/activeDetail/activeDetail?activityId='+this.banners[index].originId 
			})
		}
		else{
			let timestamp = Math.round(new Date() / 1000)
			if(timestamp-uni.getStorageSync('ActiclesubMsg')>=60*60*1){
				wx.requestSubscribeMessage({
					tmplIds:['6Bc8Ax3DxUPVbXbSTs2O_GiTIgAwShXJ8Wh7GX6jLJI'],
					 success (res) { 
						 console.log(res)
						 let  timestamp = Math.round(new Date() / 1000)
						 uni.setStorageSync('ActiclesubMsg',timestamp)
					 },
					 fail (res) {
					 					 console.log(res)
					 }
				})
			}
			uni.navigateTo({
			  url:'/pages/index/articleDetail/articleDetail?id='+this.banners[index].originId 
			})
		}
		
	  },
      //跳转
      toPdfList() {
		  
		  if (uni.getStorageSync('status')==1){
		  			   return false
		  }
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
		  let timestamp = Math.round(new Date() / 1000)
		 if(timestamp-uni.getStorageSync('PDFsubMsg')>=60*60*1){
		 	wx.requestSubscribeMessage({
		 		tmplIds:['6Bc8Ax3DxUPVbXbSTs2O_GiTIgAwShXJ8Wh7GX6jLJI'],
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
		 
        uni.switchTab({
        	url:'../pdfLibrary/index'
        })
      },
      toArticleDetail() {
		  if (uni.getStorageSync('status')==1){
		  			   return false
		  }
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
        if(this.banners[index].originType=='WEBURL'){
        	uni.navigateTo({
        	  url: '/pages/index/webView/webView?url=' + encodeURIComponent(this.banners[index].urlMsg)
        	})
        }else if(this.banners[index].originType=='ARTICLE'){
			let timestamp = Math.round(new Date() / 1000)
			if(timestamp-uni.getStorageSync('ActiclesubMsg')>=60+60*1){
				wx.requestSubscribeMessage({
					tmplIds:['6Bc8Ax3DxUPVbXbSTs2O_GiTIgAwShXJ8Wh7GX6jLJI'],
					 success (res) { 
						 console.log(res)
						 let  timestamp = Math.round(new Date() / 1000)
						 uni.setStorageSync('ActiclesubMsg',timestamp)
					 },
					 fail (res) {
					 					 console.log(res)
					 }
				})
			}
        	uni.navigateTo({
        	  url:'/pages/index/articleDetail/articleDetail?id='+this.banners[index].recommendId + '&type=no'
        	})
        }
       
      },
      toAboutUs() {
		  if (uni.getStorageSync('status')==1){
		  			   return false
		  }
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
        uni.navigateTo({
          url: 'aboutUs/aboutUs'
        })
      },
      joinUs() {
		  if (uni.getStorageSync('status')==1){
		  			   return false
		  }
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
        uni.navigateTo({
          url: 'picture/picture'
        })
      },
      contactUs() {
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
        uni.navigateTo({
          url: 'contactUs/contactUs'
        })
      }
    }
  }
</script>

<style lang="less">
	.xxxxx{
		position: sticky;
		top: 0;
		left: 0;
		z-index: 9999;
	}
  .index {
    padding: 0 30rpx;
  }

  .index_swiper {
  }

  .index_content {
	  
	margin-bottom: 20rpx;
    padding: 0 30rpx;
  }

  .index_tabs {
	 font-size: 32rpx;
	  
    margin-top: 60rpx;
    display: flex;
    justify-content: space-around;

    image {
      width: 104rpx;
      height: 104rpx;
	  margin-bottom: 16rpx;
    }

    view {
      display: flex;
	  align-items: center;
      flex-direction: column;
    }
  }

  .index_notice {
    margin-top: 40rpx;
    height: 140rpx;
    background: #FFFFFF;
    box-shadow: 0px 4rpx 8rpx 4rpx rgba(0, 0, 0, 0.05);
    border-radius: 16rpx;
    padding: 22rpx 30rpx;
    display: flex;
    align-items: center;
	
  }
.u-tab-item{
	// font-size: 34rpx !important;
	// color: #BEBEBE;
}
  .index_notice_left {
	  margin-right: 8px;
	  height: 100%;
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  font-size: 20rpx;
	  font-family: PingFang-SC-Regular, PingFang-SC;
	  font-weight: 400;
	  color: #DC2E1B;
    image {
      width: 48rpx;
      height: 48rpx;
	  margin-bottom: 20rpx;

    }
  }
</style>
