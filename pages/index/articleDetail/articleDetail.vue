<template>
  <view>
  <!--  <view class="top">
    	<image :src="detail.logoId" mode="" style="width: 100%;height: 215px;"></image>
    </view> -->
	
	<view class="middle" style="padding: 15px;">
		<view  style="font-size: 21px;margin-bottom: 5px;font-family: PingFangSC-Semibold, PingFang SC;font-weight: 600;color: rgba(0, 0, 0, 0.85);line-height: 29px;">
			{{detail.title}}
		</view>
		<view   style="margin-bottom: 15px;font-size: 12px;font-family: PingFang-SC-Regular, PingFang-SC;font-weight: 400;color: rgba(0, 0, 0, 0.2);line-height: 17px;display: flex;justify-content: space-between;align-items: center;">
			<view class="" style="display: flex;">
				<view class="" style="margin-right: 20rpx;">
					{{detail.publishUserName}}
				</view>
				<view>
					{{detail.createTime | year_date}}
					</view>
			</view>
			
			
			
			<image @click="open" src="../../../static/show/pdf_icon_gengduo@2x.png" style="width: 60px;height: 36px" mode=""></image>
			
		</view>
		<view class="" v-if="detail.tags" style="display: flex;align-items: center;font-size: 12px;
		font-family: PingFang-SC-Regular, PingFang-SC;
		font-weight: 400;
		color: #F5A623;
		margin-bottom: 20px;
		
		">
						<view class="" v-for="item1 in detail.tags.split(',')" :key="item1" style="margin-right: 12px;display: center;flex-wrap: wrap;align-items: center;height: 20px;background: rgba(245,166,35,0.2);border-radius: 4px;padding: 2px 12px;">
							{{item1}}
						</view>
					</view>
					
					<view class="" style="font-size: 16px;
						font-family: PingFangSC-Semibold, PingFang SC;
						font-weight: 600;
						color: #333333;
						margin-bottom: 12px;
						letter-spacing: 1px;
						">
						所属专题
					</view>
					<view class="gundongtiao" style="display: flex;font-size: 12px;
					font-family: PingFang-SC-Regular, PingFang-SC;
					font-weight: 400;
					color: rgba(0,0,0,0.85);
					letter-spacing: 1px;
					
					overflow: auto;
					margin-bottom: 20px;
					">
									<view class="" @click="gototopicName(item1.topicId,item1.topicName)" v-for="item1 in detail.topics" :key="item1.topicId" style="margin-right: 12px;
											padding: 5px 15px;
											display: flex;
											min-height: 46px;
											min-width: 100px;
											background: #F5F5F5;
											justify-content: center;
											align-items: center;
											border-radius: 4px;background: #F5F5F5;">
										{{item1.topicName}}
									</view>
								</view>
		<view>
			  <u-parse :html="detail.content"></u-parse>
		</view>
		
		
		<u-popup v-model="show" mode="bottom" border-radius="12" >
		          <view class="articleDetail_poi">
		            <view class="articleDetail_poi_item" >
		          	  <button class="shareBtn" open-type="share">
		          		  <image src="../../../static/index/weixin.png" mode=""></image>
		          		  <view>分享</view>
		          	  </button>
		              
		            </view>
		            <view class="articleDetail_poi_item" @click="collectStatus">
		              <image src="../../../static/index/articleCollect.png" v-if="detail.collectStatus" ></image>
		              <image src="../../../static/index/unArticleCollect.png" v-else ></image>
		              <view>{{detail.collectStatus ? '已收藏' : '未收藏'}}</view>
		            </view>
		            <view class="articleDetail_poi_item" @click="toCanvas">
		              <image src="../../../static/index/articleHaibao.png" mode=""></image>
		              <view>生成海报</view>
		            </view>
		          </view>
	</u-popup>
	</view>
  
    
  </view>
  
</template>
<script>
	import {
		getArticleDetail,
	  collectStatus,
	} from '../../../common/request.js'
  export default{
	  data(){
		  return {
			  show:false,
			  detail:{},
			  id:'',
			  share:{
				  title:''
			  }
		  }
	  },
		onLoad(opitons) {
				let pages = getCurrentPages(); //获取加载的页面
				console.log(pages)
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
						
			this.id = opitons.id ? opitons.id : opitons.scene
			this.getArticleDetail(this.id)
			  
			
		},
		onShow() {
			// this.getArticleDetail(this.id)
		},
	  methods:{
		  gototopicName(id,title){
			  console.log(id)
			  uni.navigateTo({
			  	url:'tipActicle/tipActicle?topicId='+ id +'&title=' + title
			  })
			
		  },
		  open(){
		  			this.show = this.show ? false : true
		  },
		  toCanvas() {
		  	
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
		   
			this.detail.name = this.detail.title
			let obj ={
				name:this.detail.name,
				id:this.detail.articleId,
				logoId:this.$imgUrl2 + this.detail.logoId.split('/')[3]
			}
			console.log(obj)
		   uni.navigateTo({
		     url: `/pages/index/articleDetail/articleCanvas/articleCanvas?detail=${JSON.stringify(obj)}`
		   })
		   
		  },
		  collectStatus() {
		    let token = uni.getStorageSync('token')
		    if (!token) {
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
		      mask:true,
		      title:'请求中'
		    })
		    collectStatus({articleId:this.id}).then(res=>{
		      if(res.code==0){
				  if(res.data.collectStatus){
					  uni.showToast({
					    title:"收藏成功",
					    
					  })
				  }else{
					  uni.showToast({
					    title:"取消收藏",
				  })
		        }
		        this.detail.collectStatus= !this.detail.collectStatus
		      }else{
		        uni.showToast({
		          title:res.msg,
		          icon:'none'
		          
		        })
		      }
		    })
		  },
		
		 
		  getArticleDetail(id){
			  getArticleDetail({
				  articleId:this.id
			  }).then(res=>{
				  if(res.code==1){
					  uni.navigateBack({
					  	delta:1,
						success() {
							uni.showToast({
								icon:'none',
								title:'该内容已不存在'
							})
						}
					  })
				  		return
				  }
				  if(res.code==0){
					  res.data.logoId = this.$imgUrl + res.data.logoId
					  this.share.imageUrl = res.data.logoId
					  this.share.title = res.data.title
					  this.detail = res.data
				  }
			  })
		  }
	  }
  }
</script>
<style lang="less" scoped>
	.gundongtiao::-webkit-scrollbar {
    display: none;
}
	.shareBtn {
	  padding: 0;
	   border: none !important;
	   display: flex;
	   background-color: transparent;
	   flex-direction: column;
	   justify-content: space-between;
	   font-size: 20rpx;
	   align-items: center;
	   font-family: PingFang-SC-Regular, PingFang-SC;
	   font-weight: 400;
	   color: rgba(0, 0, 0, 0.85);
	
	   image {
	     width: 80rpx;
	     height: 80rpx;
	   }
	 }
	 .shareBtn::after {
	   border: 0;
	 }
  .articleDetail_poi{
    width: 100%;
    height: 220rpx;
    display: flex;
	align-items: center;
    justify-content: space-around;
  }
  .articleDetail_poi_item{
    font-size: 20rpx;
    font-family: PingFang-SC-Regular, PingFang-SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.45);
    text-align: center;
    image{
      width: 96rpx;
      height: 96rpx;
      margin-bottom: 16rpx;
    }
  }
  
</style>