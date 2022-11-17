<template>
	<view style="padding: 15px;min-height: 100vh;background-color: #F1F1F1;">
		<view class="" v-if="list.length!=0">
			<view class="" v-for="(e,i) in list" :key="i" @click="todetail(e)" style="
			padding: 15px 10px 12px 10px;							margin-bottom: 10px;
															background: #FFFFFF;
															border-radius: 8px;">
				<view class="overtext" style="margin-bottom: 12px;font-size: 15px;font-weight: 500;">
					{{e.topicName}}
				</view>
				<view class="" style="display:flex;align-items: center;" v-if="e.tags">
					<view class=""   v-for="ele in e.tags.split(',')" :key="e" style="
					width: 48px;
					height: 20px;
					margin-right: 12px;
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
			<image src="/static/show/lj_icon_quesheng@2x.png"  style="width: 120px; height: 100px;" mode=""></image>
		</view>
	</view>
</template>

<script>
	import {searchtopic} from '@/common/request.js'
	export default {
		data() {
			return {
				list:[],
				key:''
			};
		},
		onLoad(op) {
			console.log(op)
			this.key = op.key
			this.searchtopic()
		},
		methods:{
			todetail(e){
				uni.navigateTo({
					url:'/pages/topic/topicDetail/topicDetail?topicId='+e.topicId
				})
			},
			searchtopic(){
				searchtopic(this.key).then(res=>{
					res.code == 0
					 ? (()=>{
							this.list = res.data
					 })()
					 :  uni.$u.toast(res.msg);
				})
			}
		}
	}
</script>

<style lang="less">

</style>
