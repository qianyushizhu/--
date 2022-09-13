const DialogPhone = function(text){
	uni.makePhoneCall({
	phoneNumber: text, 
	success: (res) => {
	console.log('调用成功!')	
	},
	// 失败回调
	fail: (res) => {
	console.log('调用失败!')
	}	
 });
}
const copyText = function(text,msg='已复制到剪贴板'){
	console.log(text)
	uni.setClipboardData({
				data: text,
				success: function(res) {
					uni.getClipboardData({
						success: function(res) {
							uni.showToast({
								title: msg
							});
						}
					});
				}
			});
}
const previewImg = function(item,list){
	
		  //图片预览
		  wx.previewImage({
		    current: item, // 当前显示图片的http链接
		    urls: list // 需要预览的图片http链接列表
		  })
		
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
//    时间转化---------------------------------------------------------------
function formatDate(date) {
  if(!date){
    return '------'
  }
  var date = new Date(date);
  var YY = date.getFullYear() + '-';
  var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
  var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
  var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
  return YY + MM + DD +" "+ hh + mm + ss;
}
function formatDate1(date) {
  if(!date){
    return '------'
  }
  var date = new Date(date);
  // var YY = date.getFullYear() + '-';
  var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
  var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
  // var ss = (date.getSeconds() < 10 ? '0' + datse.getSeconds() : date.getSeconds());
  return MM + DD +" "+hh + mm;
}
function formatImage(list,elementName) {
  if(!list){
    return 
  }
  // console.log(elementName)
  list.forEach(item=>{
	item.image = this.$imgUrl + item.image
  })
  return list;
}
function formatDate2(date) {
  if(!date){
    return '------'
  }
  var date = new Date(date);
  var YY = date.getFullYear() + '-';
  var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate())
  return YY + MM + DD;
}

function filterMoney(money){
  return (money/100).toFixed(2)
  
}
function totalPrice(list){
  if(!list || list.length==0){
    return
  }
  let total=0
  for(var key in list){
    total+=list[key].goodsNum * list[key].priceNum
  }
  return (total/100).toFixed(2)
}
		
export default {
	formatDate,
	filterMoney,
	totalPrice,
	formatDate1,
	formatDate2,
	formatImage,
	DialogPhone,
	copyText,
	openReport,
	sendFile,
	previewImg
}