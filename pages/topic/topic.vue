<template>
	<view>
		<view class="" style="padding: 10px 15px;box-sizing: border-box;">
			<u-search placeholder="请输入专题名称" v-model="keyword" @search='searchvalue' :showAction='false'></u-search>
		</view>
		<view class="" style="width: 100%;display: flex;">
			<view class="" style="width: 25%;min-height: 100vh;margin-left: 1%;">
				<view class="" v-for="(e,i) in list" @click="select(e,i)" :class="[currentIndex == i ? 'selcetclass':'noselect'] " :key="i" style="
				display: flex;
				position: relative;
				justify-content: center;
				align-items: center;
				height: 56px;
				">
					<view class="" :class="[currentIndex == i ? 'selcetclass1':'noselect1'] ">
						{{e.categoryName}}
					</view>
					<view class="" v-if="currentIndex == i" style="
					width: 3px;
					height: 28px;
					position: absolute;
					top: 50%;
					left: 0;
					transform: translateY(-50%);
					background: #49C265;
					border-radius: 3px;">
						
					</view>
				</view>
			</view>
			
			<view class="" style="width: 73%;min-height: 100vh;background-color: #F1F1F1;padding: 0 10px;">
				<view class="" style="margin-bottom: 10px;">
				<u-swiper border-radius="10" interval='10000' mode='none' height="200" :list="banners" @click="godetail"></u-swiper>
				</view>
				<view class="" v-if="list2.length!=0">
					<view class="" v-for="(e,i) in list2" :key="i" @click="todetail(e)" style="
					padding: 15px 10px 12px 10px;							margin-bottom: 10px;
																	background: #FFFFFF;
																	border-radius: 8px;">
						<view class="overtext" style="margin-bottom: 12px;font-size: 15px;font-weight: 500;">
							{{e.topicName}}
						</view>
						<view class="" style="display:flex;align-items: center;" v-if="e.tags">
							<view class=""   v-for="ele in e.tags.split(',')" :key="e" style="
							height: 20px;
							margin-right: 12px;
							padding: 8px;
							display: flex;
							justify-content: center;
							align-items: center;
							font-size: 11px;
							font-weight: 400;
							color: #F5A623;
							background: rgba(245,166,35,0.2);
							border-radius: 4px;">
								{{ele}}
							</view>
						</view>
					</view>
				</view>
				<view class="" v-else style="margin-top: 50px;display: flex;justify-content: center;">
					<image src="../../static/show/lj_icon_quesheng@2x.png"  style="width: 120px; height: 100px;" mode=""></image>
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	import {category,topic,getPics} from '@/common/request.js'
	export default {
		data() {
			return {
				keyword:'',
				currentIndex:0,
				list:[],
				list2:[],
				banners:[]
			};
		},
		onLoad() {
			this.category()
			this.getPics()
		},
		onPullDownRefresh() {
			
			this.category()
			this.getPics()
			setTimeout(function () {
			           uni.stopPullDownRefresh();
			       }, 1000);
		},
		methods:{
			searchvalue(e){
				uni.navigateTo({
					url:'/pages/topic/search/search?key='+e
				})
			},
			godetail(index){
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
					url:'/pages/topic/topicDetail/topicDetail?topicId='+this.banners[index].topicId
				})
				
			},
			todetail(e){
				uni.navigateTo({
					url:'/pages/topic/topicDetail/topicDetail?topicId='+e.topicId
				})
			},
			
			getPics(){
				getPics().then(res=>{
					res.code == 0
					 ? (()=>{
						 for(var key in res.data){
						   res.data[key].image = this.$imgUrl + res.data[key].logoId
						 }
						this.banners = res.data
						
					 })()
					 :  uni.$u.toast(res.msg);
				})
			},
			category(){
				category().then(res=>{
					res.code == 0
					 ? (()=>{
						this.list = res.data
						this.topic(this.list[0].categoryId)
					 })()
					 :  uni.$u.toast(res.msg);
				})
			},
			topic(id){
				topic(id).then(res=>{
					res.code == 0
					 ? (()=>{
						this.list2 = res.data
					 })()
					 :  uni.$u.toast(res.msg);
				})
			},
			select(e,i){
				this.currentIndex = i
				this.topic(this.list[i].categoryId)
			}
		}
	}
</script>

<style lang="less">
.selcetclass{
	background: rgb(228,246, 232);
}
.noselect{
	
}
.selcetclass1{
	font-size: 14px;
	font-weight: 600;
	color: #49C265;
	opacity: 1 !important;
}
.noselect1{
	font-size: 14px;
	font-weight: 400;
	color: rgba(0,0,0,0.65);
}
</style>
