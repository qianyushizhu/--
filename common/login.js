export default{
    data(){
        return {
           //设置默认的分享参数
           //如果页面不设置share，就触发这个默认的分享
            
        }
    },
	onLoad(){
		if (!uni.getStorageSync('token')) {
		  uni.showModal({
		    title: "授权登录",
		    content: "您尚未授权登录,请先授权登录",
		    success: (res) => {
		      if (res.confirm) {
		      
		      }
		    }
		  })
		  return
		}
	},
    methods:{
		registerMine(){
			let vm = this
			uni.login({
				success: (res) => {
					getSessionKey({
						code:res.code
					}).then(res=>{
						console.log(res)
						uni.setStorageSync('sessionKey',res.data.sessionKey)
						decodePhone({
							 encryptedData: uni.getStorageSync('encryptedData'),
							iv: uni.getStorageSync('iv'),
							sessionKey: uni.getStorageSync('sessionKey'),
						}).then(res=>{
							uni.setStorageSync('phone',res.data.phone)
							uni.login({
								success: (res) => {
										register({
											code:res.code,
											nickName:uni.getStorageSync('userInfo').nickName,
											gender:uni.getStorageSync('userInfo').gender,
											avatarUrl:uni.getStorageSync('userInfo').avatarUrl,
											phone:uni.getStorageSync('phone'),
										}).then(res=>{
											if(res.code==0){
												uni.setStorageSync('isLogin',true)
												uni.setStorageSync('token',res.data.token)
												vm.token = res.data.token
												vm.nickName = uni.getStorageSync('userInfo').nickName
												vm.image = uni.getStorageSync('userInfo').avatarUrl
												vm.show = true
											}
										})
								}
							})
							
							
						})
					})
					
					
				}
			})
		},
	},
}