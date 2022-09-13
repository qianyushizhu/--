function year_seconds(date) {
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
function year_mintes(date) {
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
function year_date(date) {
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
  year_date,
  filterMoney,
  totalPrice,
  year_seconds,
  year_mintes,
  formatImage
}