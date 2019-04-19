var mdfun = require('md5.js');
//排序的函数
function objKeySort(arys) {
  var newobj = Object.keys(arys)
  var newkey = Object.keys(arys).sort();
  //console.log('newkey='+newkey);
  var newObj = {}; //创建一个新的对象，用于存放排好序的键值对
  for (var i = 0; i < newkey.length; i++) {
    //遍历newkey数组
    newObj[newkey[i]] = arys[newkey[i]];
    //向新创建的对象中按照排好的顺序依次增加键值对

  }
  return newObj; //返回排好序的新对象
}
//大小写转换函数
function upperJSONKey(jsonObj) {
  for (var key in jsonObj) {
    jsonObj[key.toLowerCase()] = jsonObj[key];
    delete(jsonObj[key]);
  }
  return jsonObj;
}
//生成签名
function setSign(data) {
  //排序
  //let jsonstr =objKeySort(data);
  //转换小写
  //let newObjArr = upperJSONKey(jsonstr)
  //转换成url参数
  // var params = Object.keys(newObjArr).map(function(key) {
  //   return key + "=" + newObjArr[key];
  // }).join("&");
  // let stringB = params + '&' + 'key' + '=SAD23SF3DSACAS'
  let stringB = data + 'SAD23SF3DSACAS';
  return mdfun.hexMD5(stringB).toUpperCase() //加密大写
}
module.exports = {
  objKeySort: objKeySort,
  upperJSONKey: upperJSONKey,
  setSign,
}