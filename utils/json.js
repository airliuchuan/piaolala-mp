/**
 *
 * json转字符串
 */
function stringToJson(data) {
  return JSON.parse(data);
}
/**
 *字符串转json
 */
function jsonToString(data) {
  return JSON.stringify(data);
}
/**
 *map转换为json
 */
function mapToJson(map) {
  return JSON.stringify(strMapToObj(map));
}
/**
 *json转换为map
 */
function jsonToMap(jsonStr) {
  return objToStrMap(JSON.parse(jsonStr));
}


/**
 *map转化为对象（map所有键都是字符串，可以将其转换为对象）
 */
function strMapToObj(strMap) {
  let obj = Object.create(null);
  for (let [k, v] of strMap) {
    obj[k] = v;
  }
  return obj;
}

/**
 *对象转换为Map
 */
function objToStrMap(obj) {
  let strMap = new Map();
  for (let k of Object.keys(obj)) {
    strMap.set(k, obj[k]);
  }
  return strMap;
}

/**
 *对象转换为url参数
 */
function jsonToUrl(json) {
  let params = Object.keys(json).map(function(key) {
    //return encodeURIComponent(key) + "=" + encodeURIComponent(json[key]);
    return key + "=" + json[key];
  }).join("&");
  return params;
}
/**
 * url转json对象
 */
function urlToJson(url) {
  let  query  =   (search  =  '')  =>  ((querystring  =  '')  =>  (
    q  =>  (querystring.split('&').forEach(item  =>  (
      kv  =>  kv[0]  &&  (q[kv[0]]  =  kv[1])
    )(item.split('='))),  q)
  )({}))(url);
  return query();
}

module.exports = {
  stringToJson: stringToJson,
  jsonToString: jsonToString,
  mapToJson: mapToJson,
  jsonToMap: jsonToMap,
  strMapToObj: strMapToObj,
  objToStrMap: objToStrMap,
  jsonToUrl: jsonToUrl,
  urlToJson: urlToJson
}