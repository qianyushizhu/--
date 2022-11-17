<template>
  <view class="activePic">
    <view class="activePic_title">{{name}}</view>
    <view class="activePic_time">
      {{date}}
    </view>
    <view class="activePic_img">
	  <image v-if="item.fileType == 1" style="margin-right: 4px;margin-bottom: 5px;" v-for="(item,index) in list" :src="item.image" mode="" :key='index' @click="preview(item.image)"></image>
      <video v-else style="margin-right: 4px;margin-bottom: 5px;" :src="item.video"  :poster="item.poster"></video>
    </view>
  </view>
</template>
<script>
	import {getAlbumFiles} from '../../../../common/request.js'
  export default {
    data() {
      return {
        list: [],
		list2:[],
		id:'',
		name:'',
		date:'',
		currentPage:1,
      }
    },
	onLoad(options) {
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
		this.id = options.id
		this.name = options.name
		this.date = options.date
		console.log(options.date)
		this.getAlbumFiles()
	},
    methods:{
		
		preview(item){
			
			uni.previewImage({
				current:item,
				urls:this.list2
			})
		},
      getAlbumFiles(){
		  getAlbumFiles({
			  albumId:this.id,
			  page:this.currentPage,
			  pageSize:10
		  }).then(res=>{
			  let list = []
			res.data.forEach(item=>{
					if(item.fileType == 2){
						item. video = this.$imgUrl + item.fid
						if(item.posterId !=''){
							item. poster = this.$imgUrl + item.posterId
						}else{
							item. poster = this.$imgUrl+'EF49C6FF84E3'
						}
					}else{
						item. image = this.$imgUrl + item.fid
						this.list2.push(this.$imgUrl + item.fid)
					}
					
			})
			this.list = res.data
			
		  })
	  }
    }
  }
</script>
<style lang="less" scoped>
  .activePic{
    padding: 0 30rpx;
    .activePic_title{
      margin-top: 28rpx;
      font-size: 42rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.85);
      line-height: 58rpx;
    }
    .activePic_time{
      margin-top: 16rpx;
      font-size: 24rpx;
      font-family: PingFang-SC-Regular, PingFang-SC;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.45);
      line-height: 34rpx;
    }
    .activePic_img{
      margin-top: 24rpx;
      display: flex;
      flex-wrap: wrap;
      image{
       
        width: 222rpx;
        height: 222rpx;
		
      }
	  video{
	   
	    width: 222rpx;
	    height: 222rpx;
	  		
	  }
    }
  }
</style>