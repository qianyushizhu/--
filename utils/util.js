const msg = (title, duration = 1500, mask = false, icon = 'none') => {
  //统一提示方便全局修改
  if (Boolean(title) === false) {
    return;
  }
  uni.showToast({
    title,
    duration,
    mask,
    icon
  });
}

const navTo = (url) => {
  uni.navigateTo({
    url: url
  })
}

const prePage = () => {
  let pages = getCurrentPages();
  let prePage = pages[pages.length - 2];
  // #ifdef H5
  return prePage;
  // #endif
  return prePage.$vm;
}

// 获取code
const getCode = function() {
  console.log(213)
  return new Promise(resolve => {
    uni.login({
      provider: 'weixin',
      success: (res) => {
        resolve(res)
      }
    })
  })

}
// 判断token是否存在
const isLogin = function() {
  return uni.getStorageSync('token') ? true : false
}

// 过滤商品变为创建订单参数
const changeGoodsList = function(list) {
  if (!list || list.length == 0) {
    return
  }
  let arr = []
  for (var key in list) {
    let obj = {}
    obj.goodsId = list[key].goodsId
    obj.unitPriceMsg = (list[key].priceNum / 100)
    obj.goodsNum = list[key].goodsNum
    obj.sizeId = list[key].sizeId
    arr.push(obj)
  }
  return arr
}


// 过滤文章图片拿第一个图片
const picFilter = function(list) {
  if (!list || list.length == 0) {
    return
  }
  for (var key in list) {
    let logo = list[key].logoId.split(',')
    list[key].logoId ='https://qiniu-shuyuan.minkang365.com/' + logo[0]
  }
  return list
}

// 下载pdf文件并且打开文件
const openReport = function(url) {
  uni.showLoading({
    title: '加载中',
    mask: true
  })
  if(!url){
    return
  }
  wx.downloadFile({
    url: url,
    filePath: wx.env.USER_DATA_PATH + '/temp.pdf',
    success: function(res) {
      uni.hideLoading()
      wx.openDocument({
        filePath: res.filePath,
        success: function(res) {
          console.log('打开文档成功')
        }
      })
    },
    fail: function(res) {
      uni.showToast({
        title:res.msg,
        icon:'none'
      })
      console.log(res)
    }
  })
}
// 下载pdf并发送给好友
const sendFile=function(url,name) {
  console.log(url,name)
  uni.showLoading({
    mask:true,
    title:'下载中...'
  })
  wx.downloadFile({
    url: url,
    success: (res) => {
      uni.showLoading({
        mask:true,
        title:'保存中...'
      })
      console.log('res', res);
      wx.shareFileMessage({
        filePath:res.tempFilePath,
        fileName:name+'.pdf',
        success:(res1)=>{
          console.log('res1:',res1)
        },
        fail:(error)=>{
          uni.showToast({
            title:error.errMsg,
            icon:'none'
          })
          console.log('error1:',error)
        }
      })
    }
  });
}



export default {
  getCode: getCode,
  prePage: prePage,
  isLogin: isLogin,
  changeGoodsList: changeGoodsList,
  picFilter: picFilter,
  openReport: openReport,
  sendFile:sendFile
}
