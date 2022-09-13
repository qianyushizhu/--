<template>
  <view class="aboutUs">
    <view class="aboutUs_content" v-html="detail">
    </view>
	<view class="bottomFlxed_content">
		
	</view>
	<view class="bottomFlxed">
		<view class="bottomFlxed_item" v-for="(item,index) in typeList" :key='index' @click="select(index)" :class="currentIndex==index ? 'borderAddColor':''">
			{{item.typeName}}
		</view>
	</view>
  </view>
</template>

<script>
	import {
	  getCommonMsgByTypeId,
	  getTypes
	} from '../../../common/request.js'
	export default {
		data(){
			return{
				detail:'',
				typeList:[],
				currentIndex:0,
				typeId:''
			}
		},
		onLoad(){
			this.getTypes()
			
		},
		methods:{
			select(index){
				this.currentIndex = index
				this.typeId = this.typeList[index].typeId
				this.getCommonMsgByTypeId(this.typeId)
			},
			getTypes(){
				getTypes({
					typeGroup:'ABOUTUS'
				}).then(res=>{
					this.typeList = res.data
					this.getCommonMsgByTypeId(res.data[0].typeId)
				})
			},
			getCommonMsgByTypeId(typeId){
				getCommonMsgByTypeId({
					typeId:typeId
				}).then(res=>{
					console.log(res)
					this.detail = res.data.content
					this.$forceUpdate()
				}
				)
			}
		}
		
	}
</script>
<style scoped lang="less">
  .aboutUs{
	
	box-sizing: border-box;
  }
 
  .aboutUs_content{
	  
	   padding: 0 30rpx;
	  box-sizing: border-box;
    margin-top: 20rpx;
    font-size: 28rpx;
    font-family: PingFang-SC-Regular, PingFang-SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.85);
    line-height: 46rpx;
  }
  .aboutUs_img{
	  
    margin-top: 20rpx;
    image{
      width: 100%;
      height: 480rpx;
      border-radius: 12rpx;
    }
  }
  .bottomFlxed_content{
	   height: 88rpx;
	   width: 100%;
  }
  .bottomFlxed{
	  border-top: 1px solid #D8D8D8;
	  box-sizing: border-box;
	  position: fixed;
	  width: 100%;
	  display: flex;
	  justify-content: space-around;
	  align-items: center;
	  bottom: 0;
	  background-color: #fff;
	  height: 88rpx;
	  
	  .bottomFlxed_item{
		  text-align: center;
		  font-size: 14px;
		  font-family: PingFang-SC-Regular, PingFang-SC;
		  font-weight: 400;
		  color: rgba(0, 0, 0, 0.45);
		  
			border-right: 1px solid #D8D8D8;
		  line-height: 100%;
		  flex: 1;
	  }
	  
  }
  .borderAddColor{
	  font-family: PingFangSC-Semibold, PingFang SC;
	  font-weight: 600 !important;
	  color: #00B386 !important;
  }
</style>