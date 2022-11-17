<template>
  <view>
    <swiper class='swiper-container' autoplay='true' vertical='true' circular='true' interval='2500'>
        <block >
            <!-- <navigator url='/pages/notice/notice?title={{item.url}}' open-type='navigate'> -->
                <swiper-item catchtouchmove='catchTouchMove' v-for="(item,index) in list" :key='index'>
                    <view class='swiper-item'>
                      <view v-for="(item1,index1) in item" :key='index1' class="text" @click='goDetail(item1.pdfId,item.browsePermission)'>{{item1.title}}.pdf</view>
                    </view>
                </swiper-item>
                
            <!-- </navigator> -->
        </block>
    </swiper>
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
  export default {
    data(){
      return {
        vipShow:false
      }
    },
	props:{
		list:null
	},
    methods:{	
		confirmVip() {
			uni.navigateTo({
				url: '/pages/index/vipLogin/vipLogin'
			});
		},
		cancelVip() {
			
		},
		goDetail(id,browsePermission){
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
			if(uni.getStorageSync('userRole')==4 && browsePermission == 2){
				this.vipShow = true
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
			uni.navigateTo({
			  url:'/pages/index/pdfList/pdfDetail/pdfDetail?id='+id
			})
		},
      catchTouchMove(e){
        return false
      }
    }
  }
</script>

<style lang="less">
  .swiper-notice {
    font-size: 28rpx;
    color:#fa6016;
  }
   
  .swiper-container {
    margin-left: 10rpx;
    height:120rpx ;
  }
   
  .swiper-item {
    width: 100%;
    /* height:120rpx ; */
    position: absolute; 
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    font-size: 24rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    letter-spacing: 2rpx;
    view:first-child{
      margin-bottom:14rpx
    }
  }
  .text{
	   display: -webkit-box;
	    -webkit-box-orient: vertical;
	    -webkit-line-clamp: 1;
	    overflow: hidden;
	    text-overflow: ellipsis;
  }
</style>