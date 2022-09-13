<template>
	<view style="padding: 20rpx;box-sizing: border-box;background-color:#F6F6F6;min-height: 100vh;">
		<idcard  style="width: 100%;"  	@share="shareCard"   @collect='collect(obj.cardId)'
		 :address="obj.companyAddress"
		 :campnyName="obj.companyName"
		 :email="obj.email"
		 :job="obj.postInfo"
		 :phoneNumber="obj.tel"
		 :name="obj.userName"
		:image="obj.headLogo"
		:status="obj.collectStatus"
		:companyImage='obj.companyLogoId'
		 ></idcard>
	</view>
</template>

<script>
	import {
		  getCompanyCardMsg,
		  collectCard
		} from '../../../common/request.js'
		
	import idcard from '../../../component/idcard.vue'
	export default {
		data() {
			return {
				shareId:'',
				obj:{},
				share:null
			}
		},
		components:{
		  idcard
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
		onLoad(opitons) {
			console.log(opitons)
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
				this.shareId = opitons.shareId
				console.log(this.shareId)
				this.getCompanyCardMsg()
			
		},
		onShow() {
			
		},
		methods: {
			shareCard(share){
				this.share = share
			},
			collect(cardId) {
				var vm = this;
				let token = uni.getStorageSync('token');
				if (!token) {
					uni.showModal({
						title: '授权登录',
						showCancel: false,
						confirmColor: '#000',
						content: '您尚未授权登录,请先授权登录',
						success: res => {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages/index/login/login'
								});
							}
						}
					});
					return;
				}
				uni.showLoading({
					mask: true,
					title: '请求中'
				});
				collectCard({ cardId: cardId }).then(res => {
					if (!res.data.collectStatus) {
						uni.showToast({
							title: '已取消收藏'
						});
					} else {
						uni.showToast({
							title: '收藏成功'
						});
					}
			
					this.getCompanyCardMsg(this.id);
				});
			},
			getCompanyCardMsg(){
						getCompanyCardMsg({
							cardId:this.shareId
						}).then(res=>{
							if(res.code==0){
								res.data.headLogo = this.$imgUrl + res.data.headLogo
								res.data.companyLogoId = this.$imgUrl + res.data.companyLogoId
								this.obj = res.data
							}
						})
			},
		}
	}
</script>

<style>

</style>
