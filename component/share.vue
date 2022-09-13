<template>
	<!-- 弹框 -->

</template>

<script>
	export default {
		
	}
</script>

<style lang="less" scoped>
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
			height: 140rpx;
	    display: flex;
	   
	    justify-content: space-between;
	  }
		.popup2 {
			width: 320rpx;
			height: 140rpx;
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
	  }
	}
</style>