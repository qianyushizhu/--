<template>
  <view class="contactUs">
    <view class="contactUs_box">
      <view class="item1">
        <view class="title1">
          联系人
        </view>
        <view class="title2">
          {{detail.linkMan ? detail.linkMan : '暂无'}}
        </view>
      </view>
      <view class="item2" @click="callPHone">
        <view>
          <view class="title1">
            联系电话
          </view>
          <view class="title2">
            {{detail.phone ? detail.phone : '暂无'}}
          </view>
        </view>
        <image src="../../../static/index/phone.png" mode=""></image>
      </view>
	  <view class="item2" @click="callPHone2">
	    <view>
	      <view class="title1">
	        座机
	      </view>
	      <view class="title2">
	        {{detail.tel ? detail.tel : '暂无'}}
	      </view>
	    </view>
	    <image src="../../../static/index/phone.png" mode=""></image>
	  </view>
      
      <view class="item2">
        <view>
          <view class="title1">
            邮箱
          </view>
          <view class="title2">
            {{detail.email ? detail.email : '暂无'}}
          </view>
        </view>
        <view class="btn" @click="copy1">
          点击复制
        </view>
      </view>
      
      <view class="item2">
        <view>
          <view class="title1">
            地址
          </view>
          <view class="title2">
            {{detail.address ? detail.address : '暂无'}}
          </view>
        </view>
      </view>
      
      <view class="item2">
        <view>
          <view class="title1">
            微信客服
          </view>
          <view class="title2">
            {{detail.wxId ? detail.wxId : '暂无'}}
          </view>
        </view>
        <view class="btn" @click="copy2">
          点击复制
        </view>
      </view>
      <view class="item2">
        <view>
          <view class="title1">
            公众号二维码
          </view>
          <view v-if="detail.wxCode" style="margin-top: 30rpx;" @click="preview('https://oss.juxinban.cn/'+ detail.wxCode)">
            <image style="width: 216rpx;height: 216rpx;" :src="'https://oss.juxinban.cn/'+ detail.wxCode" mode=""></image>
          </view>
		  <view v-else style="margin-top: 30rpx;" >
		    暂无
		  </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
	import {
	  getContactMsg
	} from '../../../common/request.js'
	export default {
		data(){
			return{
				detail:{}
			}
		},
		onLoad(){
			getContactMsg().then(res=>{
				console.log(res)
				this.detail = res.data
				
			}
			)
		},
		methods:{
			preview(url){
				this.$Dialog.previewImg(url,[url])
			},
			copy1(){
					uni.setClipboardData({
								data: this.detail.email,
								success: function(res) {
									uni.getClipboardData({
										success: function(res) {
											uni.showToast({
												title: '已复制到剪贴板'
											});
										}
									});
								}
							});
				 
			
			},
			copy2(){
					uni.setClipboardData({
								data: this.detail.wxId,
								success: function(res) {
									uni.getClipboardData({
										success: function(res) {
											uni.showToast({
												title: '已复制到剪贴板'
											});
										}
									});
								}
							});
				 
			
			},
			callPHone(){
				
				this.$Dialog.DialogPhone(this.detail.phone)
			},
			callPHone2(){
				
				this.$Dialog.DialogPhone(this.detail.tel)
			},
		}
		
	}
</script>
<style scoped lang="less">
  .contactUs {
    padding: 20rpx;
	background: #F5F5F5;
	min-height: 100vh;
  }

  .contactUs_box {
    
    box-shadow: 0px 4rpx 8rpx 4rpx rgba(0, 0, 0, 0.05);
    border-radius: 16rpx;
    
    .btn{
      width: 156rpx;
      height: 48rpx;
      border-radius: 8rpx;
      border: 2rpx solid #00B386;
      font-size: 24rpx;
      font-family: PingFang-SC-Regular, PingFang-SC;
      font-weight: 400;
      color: #00B386;
      text-align: center;
      line-height: 46rpx;
    }
    .title1 {
      font-size: 36rpx;
      font-family: PingFang-SC-Medium, PingFang-SC;
      font-weight: 500;
      color: #333333;
      line-height: 50rpx;
    }

    .title2 {
      margin-top: 12rpx;
      font-size: 28rpx;
      font-family: PingFang-SC-Regular, PingFang-SC;
      font-weight: 400;
      color: #333333;
      line-height: 40rpx;
    }
	.item1{
		margin-bottom: 16rpx;
		background: #FFFFFF;
		padding: 44rpx 40rpx;
		border-radius: 16rpx;
	}
    .item2{
		border-radius: 10rpx;
      margin-bottom: 16rpx;
      display: flex;
	  background: #FFFFFF;
      justify-content: space-between;
      align-items: center;
	  padding: 44rpx 40rpx;
      image{
        width: 72rpx;
        height: 72rpx;
      }
    }
  }
</style>
