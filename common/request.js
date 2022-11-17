// const API_BASE_URL = 'http://192.168.2.165:8892'
const API_BASE_URL = 'https://api.innopinenut.com'
const pathMsg = "/api/"



// 登录接口
var request = (url, method, data) => {
	let token = uni.getStorageSync('token') || ''
  let header = {
    'Content-Type': 'application/json',
    'token': token
  }
  let _url = API_BASE_URL + pathMsg + url
  return new Promise((resolve, reject) => {
    uni.request({
      url: _url,
      method: method,
      data: data,
      header: header,
      success(res) {
        // console.log(request);
        // token失效
        if (res.data.result == 403) {
          if (uni.getStorageSync('token')) {
            uni.clearStorageSync()
            uni.showModal({
              title: '提示',
              content: 'token已过期,请重新登录',
              cancelText: '取消',
              success: (res) => {
                
                if (res.confirm) {
                  // uni.navigateTo({
                  //   url:'../pages/login/login'
                  // })
                } else {
                  console.log('else', res)
                }
              }
            })
          }
        } else {
          resolve(res.data)
        }
        // 请求出成功,关闭弹框

      },
      fail(error) {
        console.log(error)
        // 请求失败
        uni.showToast({
          icon: 'none',
          title: error.errMsg,
        })

        reject(error)
      },
      complete(aaa) {
        // 加载完成
      }
    })
  })
}

// 重新登录换取token
// var getNewToken = () => {
//   if(!uni.getStorageSync('account')){
//     uni.showToast({
//       mask:true,
//       icon:'none',
//       title: '您的账号信息已过期,请重新登录',
//       duration:1000,
//       success:()=>{
//         setTimeout(() => {
//           uni.reLaunch({
//           url: '../login/login',
//         })
//         }, 1000);

//       }
//     })

//     return
//   }

//   if(!uni.getStorageSync('password')){
//     uni.showToast({
//       mask:true,
//       icon:'none',
//       title: '您的账号信息已过期,请重新登录',
//       duration:1000,
//       success:()=>{
//         setTimeout(() => {
//           uni.reLaunch({
//           url: '../login/login',
//         })
//         }, 1000);

//       }
//     })

//     return
//   }

//   return new Promise((resolve, reject) => {
//     let _url = API_BASE_URL + pathMsg + 'Login/login'
//     uni.request({
//       url: _url,
//       method: 'post',
//       data: {
//         userName: uni.getStorageSync('account'),
//         password: uni.getStorageSync('password'),
//         version_code: '1800'
//       },
//       header: {
//         'Content-Type': 'application/json',
//         'Device-Type': 'PAD'
//       },
//       success(res) {
//         console.log(res);
//         // token失效
//         uni.setStorageSync('token', res.data.data.token)
//         uni.setStorageSync('nickName', res.data.data.nickName)
//         uni.setStorageSync('userId', res.data.data.userId)
//         uni.setStorageSync('mobile', res.data.data.mobile)
//         uni.setStorageSync('shopName', res.data.data.agent.agent_name)
//         resolve(res)

//         // request(url, method, data)
//       },
//       fail(error) {
//         reject()
//         console.error('uni', err);
//       },
//       complete(aaa) {
//         // 加载完成
//       }
//     })
//   })



// }


/**
 * 小程序的promise没有finally方法，自己扩展下
 */
Promise.prototype.finally = function(callback) {
  var Promise = this.constructor;
  return this.then(
    function(value) {
      Promise.resolve(callback()).then(
        function() {
          return value;
        }
      );
    },
    function(reason) {
      Promise.resolve(callback()).then(
        function() {
          throw reason;
        }
      );
    }
  );
}

module.exports = {
  request,
  // 用户登陆
  login: (data) => {
    return request('auth/login', 'post', data) //登陆
  },
  // 小程序用户注册
  register: (data) => {
    return request('auth/register', 'post', data) //登陆
  },
  // 获取sessionKey
  getSessionKey: (data) => {
    return request('auth/getSessionKey', 'post', data) //登陆
  },
  // 获取用户个人详情
  getUserMsg: (data) => {
    return request('userInfo/getUserInfo', 'get', data) //登陆
  },
  // 逆解析手机号
  decodePhone: (data) => {
    return request('auth/decodePhone', 'post', data) //登陆
  },
  // 编辑用户个人信息
  userInfo: (data) => {
    return request('userInfo/userInfo', 'post', data) //登陆
  },
	
	
	
 // 会员
 // 会员申请
 companyApply: (data) => {
   return request('company/companyApplyV2', 'post', data) //登陆
 },
 // 获取会员服务列表
 getServiceList: (data) => {
   return request('company/getServiceList', 'get', data) //登陆
 },
 // 获取会员公司详情
 getCompanyDetail: (data) => {
   return request('company/getCompanyDetail', 'get', data) //登陆
 },
 // 获取上线会员列表
 getCompanyList: (data) => {
   return request('company/getCompanyList', 'get', data) //登陆
 },
 // 获取当前用户账户信息
 getUserAccount: (data) => {
   return request('comAccount/getUserAccount', 'get', data) //登陆
 },
 // 账号登录（激活账号）
 accountActivate: (data) => {
   return request('comAccount/accountActivate', 'post', data) //登陆
 },
 // 新增公司子账号(主账户权限)
 addAccount: (data) => {
   return request('comAccount/addAccount', 'post', data) //登陆
 },
 // 编辑账号信息(主账号权限)
 modifyAccount: (data) => {
   return request('comAccount/modifyAccount', 'post', data) //登陆
 },
 // 删除账户（主账号权限）
 delAccount: (data) => {
   return request('comAccount/delAccount', 'post', data) //登陆
 },
 // 初始化（主账号权限）
 resetAccount: (data) => {
   return request('comAccount/resetAccount', 'post', data) //登陆
 },
 // 获取公司子账户列表(主账户权限)
 getCompanyAccounts: (data) => {
   return request('comAccount/getCompanyAccounts', 'get', data) //登陆
 },
 
 
  // 名片
  // 获取当前用户名片
  getUserCardMsg: (data) => {
    return request('card/getUserCardMsg', 'get', data) //登陆
  },
  // 获取名片详情
  getCompanyCardMsg: (data) => {
    return request('card/getCompanyCardMsg', 'get', data) //登陆
  },
  // 生成名片
  createCard: (data) => {
    return request('card/createCard', 'post', data) //登陆
  },
  // 编辑名片
  modifyCard: (data) => {
    return request('card/modifyCard', 'post', data) //登陆
  },
  // 收藏名片
  collectCard: (data) => {
    return request('card/collectCard', 'post', data) //登陆
  },
  // 获取用户收藏名片
  getUserCollectCardMsg: (data) => {
    return request('card/getUserCollectCardMsg', 'get', data) //登陆
  },
  // 获取公司名片列表
  getCompanyCardList: (data) => {
    return request('card/getCompanyCardList', 'get', data) //登陆
  },
  
  // 通用
  
  
  // 获取七牛上传token
  getUploadToken: (data) => {
    return request('file/getUploadToken', 'get', data) //登陆
  },
  // huoquleibie
  getTypes: (data) => {
    return request('cmsType/getTypes', 'get', data) //登陆
  },
  // 小程序码
  getAppletCode: (data) => {
    return request('code/getShareQrCode', 'post', data) //登陆
  },
  // 获取验证码
  sendSmsCode: (data) => {
    return request('sms/sendSmsCode', 'post', data) //登陆
  },
  
  
  
  
  
  
  
 
  
  
  //pdf
  // 获取pdf列表
  getPdfInfoList: (data) => {
    return request('PDFInfo/getPdfInfoList', 'get', data) //登陆
  },
  // 获取pdf类型
  getPdfClassify: (data) => {
    return request('classify/getPdfClassify', 'get', data) //登陆
  },
  // 获取推荐PDF列表
  getRecPDFList: (data) => {
    return request('PDFInfo/getRecPDFList', 'get', data) //登陆
  },
  // 获取pdf详情
  getPDFDetail: (data) => {
    return request('PDFInfo/getPDFDetail', 'get', data) //登陆
  },
  // 收藏pdf
  insMyCollectPdf: (data) => {
    return request('PDFInfo/collectPDF', 'post', data) //登陆
  },
  // shang bao xia zai pdf
  reportPDFDownload: (data) => {
    return request('PDFInfo/reportPDFDownload', 'post', data) //登陆
  },
  // 获取PDF收藏记录
  getPDFCollectRecords: (data) => {
    return request('PDFInfo/getPDFCollectRecords', 'get', data) //登陆
  },
  // 获取资讯收藏记录
  getArticleCollectRecords: (data) => {
    return request('article/getArticleCollectRecords', 'get', data) //登陆
  },
  // 获取pdf浏览记录
  getPdfViewRecords: (data) => {
    return request('PDFInfo/getPdfViewRecords', 'get', data) //登陆
  },
  // 获取资讯浏览记录
  getViewRecords: (data) => {
    return request('article/getViewRecords', 'get', data) //登陆
  },
 
 
 
  //资讯
  // 获取文章分类
  getArticleType: (data) => {
    return request('cmsType/getTypes', 'get', data) //登陆
  },
  // 收藏文章
  collectStatus: (data) => {
    return request('article/collectArticle', 'post', data) //登陆
  },
  // 分类查询文章
  getOnlineArticles: (data) => {
    return request('article/getOnlineArticles', 'get', data) //登陆
  },
  // 文章详情
  getArticleDetail: (data) => {
    return request('article/getArticleDetail', 'get', data) //登陆
  },
  
  
 
  

  
  
	//首页
	// 轮播图
	getAll: (data) => {
	  return request('rotation/getHomeRotations', 'get', data) //登陆
	},
	// 关于我们
  getCommonMsgByTypeId: (data) => {
    return request('commonMsg/getCommonMsgByTypeId', 'get', data) //登陆
  },
  
  // 联系我们
  getContactMsg: (data) => {
    return request('contactMsg/getContactMsg', 'get', data) //登陆
  },
  // 获取会员服务内容
  getVipServiceMessage: (data) => {
    return request('commonMsg/getVipServiceMessage', 'get', data) //登陆
  },
 
  
// 相册


	
	getAppActivityList: (data) => {
	  return request('activity/getAppActivityList', 'get', data) //登陆
	},
	getActivity: (data) => {
	  return request('activity/getActivity', 'get', data) //登陆
	},
	getAppAlbumList: (data) => {
	  return request('album/getAppAlbumList', 'get', data) //登陆
	},
	getAlbumFiles: (data) => {
	  return request('album/getAlbumFiles', 'get', data) //登陆
	},
	
	getTopicArticles: (data) => {
	  return request('article/getTopicArticles', 'get', data) //登陆
	},
	
getTopicPdfs: (data) => {
	  return request('PDFInfo/getTopicPdfs', 'get', data) //登陆
	},
	
	
	getAppActivityList: (data) => {
		  return request('activity/getAppActivityList', 'get', data) //登陆
		},
		getActivity: (data) => {
			  return request('activity/getActivity', 'get', data) //登陆
			},
			signUp: (data) => {
				  return request('activity/signUp', 'post', data) //登陆
				},
				getSignInfo: (data) => {
					  return request('activity/getSignInfo', 'get', data) //登陆
					},
					
					
					
			category: (data) => {
				  return request('category', 'get', data) //登陆
				},		
					
				TopicDetail: (data) => {
					  return request('topic/TopicDetail/'+data, 'post', data) //登陆
					},		
				topic: (data) => {
					  return request('topic/'+data, 'post', data) //登陆
					},	
						getTopics: (data) => {
							  return request('topic/getTopics', 'get', data) //登陆
							},	
							getPics: (data) => {
								  return request('topic/getPics', 'get', data) //登陆
								},	
								searchtopic: (data) => {
									  return request('topic/'+data, 'get', data) //登陆
									},	
							
							 
}
