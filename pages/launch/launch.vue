<template>
		<view style="width: 100vw;height: 100%;
		box-sizing: border-box;
		justify-content: center;display: flex;margin-top: 200rpx;boxs"><img src="../../static/new/hgh_icon_logo@2x.png" alt="" style='height: 448rpx;width: 462rpx;'></view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		onLoad () {
		    // let timer = setTimeout(() => {
		    //   clearTimeout(timer)
		    //   this.direct()
		    // }, 3000)
		  },
		methods: {
			direct () {
			  let url = '/pages/index/index'
			  wx.switchTab({
			    url,
			  })
			},
		
		}
	}
</script>

<style>

</style>
