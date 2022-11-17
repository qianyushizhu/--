<template>
  <view class="pdfDetail">
   	<view class="" style="padding: 10px;">
   		<view  style="font-size: 21px;margin-bottom: 5px;font-family: PingFangSC-Semibold, PingFang SC;font-weight: 600;color: rgba(0, 0, 0, 0.85);line-height: 29px;">
   			{{pdfDetail.title}}
   		</view>
   		<view   style="margin-bottom: 5px;font-size: 12px;font-family: PingFang-SC-Regular, PingFang-SC;font-weight: 400;color: rgba(0, 0, 0, 0.2);line-height: 17px;display: flex;justify-content: space-between;align-items: center;">
   			<view class="" style="display: flex;">
   				<!-- <view class="" style="margin-right: 20rpx;">
   					{{pdfDetail.publishUserName}}
   				</view> -->
   				<view>
   					{{pdfDetail.upTime | year_date}}
   					</view>
   			</view>
   			
   			
   			
   			
   		</view>
   		<view class="" v-if="pdfDetail.tags" style="display: flex;align-items: center;font-size: 12px;
   		font-weight: 400;
   		color: #F5A623;
   		margin-bottom: 10px;
   		
   		">
   						<view class="" v-for="item1 in pdfDetail.tags.split(',')" :key="item1" style="margin-right: 12px;display: center;flex-wrap: wrap;align-items: center;height: 20px;background: rgba(245,166,35,0.2);border-radius: 4px;padding: 2px 12px;">
   							{{item1}}
   						</view>
   					</view>
   					
   					<view class="" v-if="pdfDetail.topicIdArr.length !== 0" style="font-size: 16px;
   						font-weight: 600;
   						color: #333333;
   						margin-bottom: 12px;
   						letter-spacing: 1px;
   						">
   						所属专题
   					</view>
   					<view class="gundongtiao" style="display: flex;font-size: 12px;
   					font-weight: 400;
   					color: rgba(0,0,0,0.85);
   					letter-spacing: 1px;
   					overflow: auto;
   					">
   									<view class="" @click="gototopicName(item1.topicId,item1.topicName)" v-for="item1 in pdfDetail.topics" :key="item1.topicId" style="margin-right: 12px;
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
   	</view>
	
	
	   <view class="" style="
	height: 6px;
	background: #F0F0F0;">
		
	   </view>
	   
	   
  <view style="margin-top: 30rpx;position: relative;">
    <u-lazy-load  @click="previewImg(item,cloudUrlList)"
      v-for="(item,i) in cloudUrlList" :key='i'
	  mode="widthFix"
	  is-effect
      :image="item" ></u-lazy-load>
    <view class="morePdf" v-if="isShowMore">
      <image @click="showMore" style="width:40rpx;height: 40rpx;margin-top: 120rpx;padding: 30rpx;"
        src="../../../static/morePdf.gif"></image>
    </view>
  </view>
    <!-- 按钮 -->
    <view class="poiBtn" @click="changeShow">
      <image v-if="!show" src="../../../../static/lj_icon_caidan@2x.png" mode=""></image>
      <image v-else src="../../../../static/lj_icon_guanbi@2x.png" mode=""></image>
    </view>

  
	
	<u-mask :show="show" @click="show = false">
	 	<view class="popup">
			
	 	  
	 	  <view class="popup2">
	 	    <view class="popup_item" @click="toCanvas">
	 	      <image src="../../../../static/lj_icon_shengchenghaibao@2x.png" mode=""></image>
	 	      <view>生成海报</view>
	 	    </view>
	 	    <view class="popup_item" >
	 	       				  <button  open-type="share" class="shareBtn">
	 	       					  <image src="../../../../static/lj_icon_fasongpengyou@2x.png"  mode=""></image>
	 	       					  <view style="color: #FFFFFF; font-size: 12px;line-height: 17px;">发送给朋友</view>
	 	       				  </button>
	 	  </view>
		 
		  </view>
		  <view class="popup1">
		  <view class="popup_item" @click="copyDownLoad">
		      <image src="../../../../static/lj_icon_xiiazai@2x.png" mode=""></image>
		      <view>复制下载链接</view>
		    </view>
		  			<view class="popup_item" @click="collect">
		  			  <image v-if="pdfDetail.collectStatus" src="../../../../static/lj_icon_shoucang@2x.png" mode=""></image>
		  			  <image v-else src="../../../../static/lj_icon_shoucang@2x(1).png" mode=""></image>
		  			  <view>{{pdfDetail.collectStatus ? '已收藏' : '收藏'}}</view>
		  			</view>
		      
		    </view>
	 		
	 	</view>
		 </u-mask>
			
			<u-modal
				v-model="vipShow"
				:mask-close-able="true"
				title="会员提醒"
				width="70%"
				:show-title="true"
				@confirm="confirmVip"
				@cancel="cancelVip"
				:content="content"
				:show-cancel-button="true"
			></u-modal>
			
			<u-mask :show="xxxshow"></u-mask>

  </view>


</template>
<script>
	import {
	getPDFDetail,
	insMyCollectPdf,
	reportPDFDownload
	} from '../../../../common/request.js'
  export default {
	 
    data() {
      return {
		  xxxshow:true,
		  time:'',
        show: false,
		pdfDetail:{
			title:'加载中',
			upTime:'加载中'
		},
		cloudUrlList:[],
			share:{
			    title:'',
			    desc:'',
			    content:''
			},
		id:'',
		logoId:'',
		shareId:'',
		content:'该内容需要会员才能观看,请登录',
		vipShow:false,
      }
    },
	
	onLoad(options) {
		let pages = getCurrentPages(); //获取加载的页面
		let currentPage = pages[pages.length - 1]; //获取当前页面的对象
		let url = currentPage.route ;//当前页面url
		
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
			title:'加载中',
			mask:true
		})	
		if (options) {
		this.id = options.id ? options.id : options.scene
			this.getPDFDetail(this.id)
		}
			
			
		console.log('onload')
		
		 
	},
	onShow() {
		console.log('onshow')
		// this.getPDFDetail(this.id)
	},
    methods:{
		gototopicName(id,title){
					  console.log(id)
					  uni.navigateTo({
					  	url:'../../pdfList/pdfList?topicId='+ id +'&title=' + title +'&type=topic' 
					  })
					
		},
		confirmVip() {
			uni.navigateTo({
				url: '/pages/index/vipLogin/vipLogin'
			});
		},
		cancelVip() {
			uni.navigateBack({
				delta:1
			})
		},
			copyDownLoad(){
				this.$Dialog.copyText(this.pdfDetail.downloadUrl)
				reportPDFDownload({
					pdfId:this.id
				}).then(res=>{
					
				})
			},
			collect(){
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
				  mask: true,
				  title: "加载中..."
				})
				insMyCollectPdf({
				  pdfId: this.id
				}).then(res => {
				  console.log(res)
				  if (res.code == 0) {
				    uni.hideLoading()
				    this.show = false
					if(res.data.collectStatus){
						uni.showModal({
						  title: "收藏成功",
						  content: "可前往我的页面中'我的收藏'中查看"
						})
					}else{
						uni.showModal({
						  title: "取消收藏",
						  content: "可前往我的页面中'我的收藏'中查看"
						})
					}
				    
					this.getPDFDetail(this.id)
				  } else {
				    uni.showToast({
				      title: res.msg,
				      icon: 'none'
				    })
				  }
				})
			},
		
		
		toCanvas() {
			
		  if (!uni.getStorageSync('token')) {
		    uni.showModal({
		      title: "授权登录",
		      content: "您尚未授权登录,请先授权登录",
		      success: (res) => {
		        if (res.confirm) {
					console.log(1)
		        uni.navigateTo({
		         url:'/pages/login/login'
		        })
		        }else if (res.cancel) {
					  console.log('用户点击取消')
					  wx.switchTab({
						  url:'/pages/index/index'
					  })
					  
					}
		      }
		    })
		    return
		  }
		  // console.log(this.pdfDetail.id)
		  let obj ={
		  	name:this.pdfDetail.title,
		  	id:this.pdfDetail.pdfId,
		  	logoId:this.$imgUrl2+this.pdfDetail.imgList[0],
			type:'pdf'
		  }
		uni.navigateTo({
		  url: `/pages/index/articleDetail/articleCanvas/articleCanvas?detail=${JSON.stringify(obj)}`
		})
		
		 
		},
      changeShow(){
        this.show = !this.show
		
      },
	previewImg: function(item, list) {
	  //图片预览
	  wx.previewImage({
	    current: item, // 当前显示图片的http链接
	    urls: list // 需要预览的图片http链接列表
	  })
	},
		 
		 
	  getPDFDetail(id){
		  getPDFDetail({
		  	 PDFId:id,
			 
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
			  
				if(res.data.browsePermission == 2){
					if(uni.getStorageSync('userRole')==4){
						this.vipShow = true
							return
					}
				}
		  	let arr = res.data.imgList.map((item)=>{
				return this.$imgUrl + item
			})
			
			// console.log(arr)
		  	this.cloudUrlList = arr
			this.pdfDetail = res.data
			this.share.title = this.pdfDetail.title
			uni.setStorageSync('pdfTitle',res.data.name)
			this.xxxshow = false
			uni.hideLoading()
			
			
		  })
	  }
    }
  }
</script>
<style lang="less" scoped>
	/deep/ .u-mask{
		background-color: #FFFFFF !important;
	}
  .pdfDetail {
    
    .pdfDetail_title {
		padding: 0 30rpx;
      margin-top: 36rpx;
      font-size: 42rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.85);
      line-height: 58rpx;
    }

    .pdfDetail_time {
      margin-top: 16rpx;
      font-size: 24rpx;
      font-family: PingFang-SC-Regular, PingFang-SC;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.45);
      line-height: 34rpx;
    }
  }
 .shareBtn {
   padding: 0;
   margin: 0;
    border: none;
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
      width: 100rpx;
      height: 100rpx;
    }
  }

  .shareBtn::after {
    border: 0;
  }
  .poiBtn {
    position: fixed;
    bottom: 200rpx;
	display: flex;
	justify-content: center;
	align-items: center;
    z-index: 100000;
    width: 140rpx;
    height: 140rpx;
    image {
      width: 100rpx;
      height: 100rpx;
    }

    left: 50%;
    transform: translateX(-50%);
  }

  .popup {
  	  width: 100%;box-sizing: border-box;
	height: 330rpx;
  	  position: fixed;
  	  bottom: 200rpx;
    
    display: flex;
    flex-direction: column;
  	align-items: center;
    justify-content: space-between;
    .popup1 {
  		width: 800rpx;
      display: flex;
     
      justify-content: space-between;
    }
  	.popup2 {
  		width: 500rpx;
  	  display: flex;
  	  align-items: center;
  	  justify-content: center;
  	}
  	.popup3{
  		width: 100%;
  	  display: flex;
  	 align-items: center;
  	  justify-content: center;
  	}
  
    .popup_item {
      width: 45%;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 12px;
      font-family: PingFang-SC-Regular, PingFang-SC;
      font-weight: 400;
      color: #FFFFFF;
      line-height: 17px;
    }
  
    image {
      width: 100rpx;
      height: 100rpx;
	  margin-bottom: 9px;
    }
  }
</style>
