<template>
  <view class="mycard">
	  <view class="text_chu" style="margin-bottom: 40rpx;">
	  	我的名片
	  </view>
	  <view class="" style="display: flex;justify-content: center;width: 100%;margin-bottom: 30rpx;" >
			<view class="" v-if="isAdd" @click="gotoAdd" style="height: 344rpx;
			width: 80%;
				border-radius: 16rpx;
				border: 2rpx dashed #A6A6A6;text-align: center;line-height: 344rpx;font-size: 24rpx;letter-spacing: 1rpx;
				font-family: PingFang-SC-Regular, PingFang-SC;
				font-weight: 400;
				color: #A6A6A6;">
				点击生成我的名片
			</view>
			
				<idcard v-else style="width: 100%;" @update='gotoAdd(1)' @shareCard='shareCard'  @collect='collect(detail.cardId)'
				 :address="obj.companyAddress"
				 :campnyName="obj.companyName"
				 :email="obj.email"
				 :job="obj.postInfo"
				 :phoneNumber="obj.tel"
				 :name="obj.userName"
				:image="obj.headLogo"
				:status="true"
				:cardId='obj.cardId'
				:companyImage='obj.companyLogoId'
				:isMine='true'
				 ></idcard>
	  </view>
	
	<view class="text_chu" style="margin-bottom: 40rpx;">
		我的收藏
	</view>
	<view class="">
		<view class="" v-if="list.length!==0">
			<idcard  v-for="(detail,index) in list" :key='index' 	@shareCard="shareCard"    @collect='collect(detail.cardId)'
			 :address="detail.companyAddress"
			 :campnyName="detail.companyName"
			 :email="detail.email"
			 :job="detail.postInfo"
			 :phoneNumber="detail.tel"
			 :name="detail.userName"
			:image="detail.headLogo"
			:status="true"
			:cardId='detail.cardId'
			:companyImage="detail.companyLogoId"
			 ></idcard>
		</view>
		
		 	<view  style="display: flex;justify-content: center;margin-top: 50rpx;" v-else>
		 		<image src="../../../static/show/lj_icon_quesheng@2x.png" style="width: 80px;height: 60px;" mode=""></image>
		 	</view>
	</view>
	
  
  </view>
</template>
<script>
	import {
	  getUserCollectCardMsg,
	  collectCard,
	  getUserCardMsg
	} from '../../../common/request.js'
	
  import idcard from '../../../component/idcard.vue'
  export default {
    components:{
      idcard
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
		this.getUserCollectCardMsg()
		this.getUserCardMsg()
	},
	onShareAppMessage(res) {
				  console.log(this.share.path)
	       return {
	           title:this.share.title,
	           path:this.share.path,
	           imageUrl:this.share.imageUrl,
	           desc:this.share.desc,
	           content:this.share.content,
	           success(res){
					  console.log(res)
	               uni.showToast({
	                   title:'分享成功'
	               })
					  console.log(this.share.path)
	           },
	           fail(res){
	               uni.showToast({
	                   title:'分享失败',
	                   icon:'none'
	               })
	           }
	       }
	   },
	data() {
	  return {
	    currentPage:1,
		list:[],
		obj:{},
		img:'',
		isAdd:true,
		oldobj:{},
		share:null
	  }
	},

	
		
	methods:{
		shareCard(share){
			this.share = share
		},
		gotoAdd(a){
			if(a == 1){
				uni.navigateTo({
					url:'../addCard/addCard?info=' + JSON.stringify(this.oldobj)
				})
				
			}else{
				uni.navigateTo({
					url:'../addCard/addCard'
				})
			}
			
		},
		collect(cardId){
			var vm = this
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
			collectCard({cardId:cardId}).then(res=>{
			  if(res.code==0){
				  if(!res.data.collectStatus){
					  uni.showToast({
					    title:"已取消收藏",
					  })
				  }else{
					  uni.showToast({
					    title:"收藏成功",
					  })
				  }
			    
				this.getUserCollectCardMsg()
			    
			  }else{
			    uni.showToast({
			      title:res.msg,
			      icon:'none'
			      
				  
			    })
			  }
			})
		},
		getUserCardMsg(){
			uni.login({
				success: (res) => {
					getUserCardMsg({
						code:res.code
					}).then(res=>{
						if(res.code==0){
						
							if(res.data){
								this.isAdd = false
								this.oldobj = res.data
								res.data.headLogo = this.$imgUrl + res.data.headLogo
								res.data.companyLogoId = this.$imgUrl + res.data.companyLogoId
								this.obj = res.data
							}else{
								this.isAdd = true
							}
						}
					})
				}
			})
			
		},
		getUserCollectCardMsg(){
			getUserCollectCardMsg({
				page:this.currentPage,
				pageSize:10,
			
			}).then(res=>{
				if(res.code==0){
					res.data.forEach(item=>{
						item.headLogo = this.$imgUrl + item.headLogo
						item.companyLogoId = this.$imgUrl + item.companyLogoId
					})
					this.list = res.data
					console.log(this.list)
				}
			})
		}
	},
    
  }
</script>
<style lang="less" scoped>
  .mycard{
    padding: 30rpx 30rpx;
	background-color: #F6F6F6;
	min-height: 100vh;
  }
  .text_chu{
	  font-size: 36rpx;
	  font-family: PingFangSC-Semibold, PingFang SC;
	  font-weight: 600;
	  color: rgba(0, 0, 0, 0.85);
	  line-height: 50rpx;
  }
</style>