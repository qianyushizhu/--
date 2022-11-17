<template>
	<view>
		<web-view :src="url"></web-view>
	</view>
</template>

<script>
	import {
	reportOpenShare
	} from '../../../common/request.js'
	export default {
		data() {
			return {
				url:'',
				share:{
				    title:'松子创业营',
				    path:'/pages/index/webView/webView?url=',
					imageUrl:''
				},
			}
		},
		onLoad(opitons) {
		console.log(decodeURIComponent(opitons.url))
			
			this.url = decodeURIComponent(opitons.url)
			this.share.path += 	encodeURIComponent(this.url)
			this.share.title = 	opitons.title
			this.share.imageUrl = this.$imgUrl2+opitons.logoId
			console.log(this.share)
		},
		
		    
		onShow() {
		},
		onHide() {
			
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
