
export default{
    data(){
        return {
           //设置默认的分享参数
           //如果页面不设置share，就触发这个默认的分享
            share:{
                title:'和光荟',
                 path:'',
                imageUrl:require('../static/new/hgh_icon_logo@2x.png'),
                desc:'',
                content:''
            },
        }
    },
	
	onShow(){
		
	},
	
   onShareAppMessage(res) {
	   console.log(this.share)
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
				  console.log(this.share)
              },
              fail(res){
                  uni.showToast({
                      title:'分享失败',
                      icon:'none'
                  })
              }
          }
      },
   			onShareTimeline: (res) => {
   			  console.log(res)
   			  return {
				title:this.share.title,
				path:this.share.path,
				imageUrl:this.share.imageUrl,
				desc:this.share.desc,
				content:this.share.content,
   			  }
   			},
}