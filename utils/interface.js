//api入口
//const INTERFACE_URL = "https://api-small.piao.com";//生产环境
const INTERFACE_URL = "https://api-small-test.piao.com"; //测试环境
//请求接口
const root = {
  getCityList: INTERFACE_URL + '/common/city/list', //获取城市列表
  getHomeRanking: INTERFACE_URL + '/small_v2/home/get-list', //获取首页榜单
  getRankingList: INTERFACE_URL + '/small_v2/rec/list', //获取榜单列表
  getRankingDetail: INTERFACE_URL + '/small_v2/rec/details', //获取榜单详情
  getGoodsList: INTERFACE_URL + '/small_v2/cate/list', //获取商品列表（城市，排序，时间）
  getSearchList: INTERFACE_URL + '/small_v2/home/search', //搜索列表
  getAdrList: INTERFACE_URL + '/common/address/list', //获取用户地址列表
  getAllCityList: INTERFACE_URL + '/common/address/district', //获取全国省市县列表
  getBannerList: INTERFACE_URL + '/small_v2/home/banner', //获取banner列表
  getAdrInfo: INTERFACE_URL + '/common/address/show-update', //获取用户地址信息
  addAddress: INTERFACE_URL + '/common/address/add', //添加地址
  editAddress: INTERFACE_URL + '/common/address/update', //修改地址
  delAddress: INTERFACE_URL + '/common/address/delete', //删除地址
  getHotGoodsList: INTERFACE_URL + '/small_v2/perform/hot-list', //获取热门商品列表
  getFollowStatus: INTERFACE_URL + '/small_v2/collect/is-collect', //获取商品收藏状态
  getFollowList: INTERFACE_URL + '/small_v2/collect/list', //收藏列表
  followAdd: INTERFACE_URL + '/small_v2/collect/add', //添加收藏
  followCancel: INTERFACE_URL + '/small_v2/collect/delete', //取消收藏
  getGoodsDetail: INTERFACE_URL + '/small_v2/goods/detail', //获取商品详细信息
  getPlans: INTERFACE_URL + '/small_v2/goods/plan', //查询排期和价格
  settlement: INTERFACE_URL + '/common/confirm/detail', //结算数据
  login: INTERFACE_URL + '/common/login/login', //登录
  creatOrder: INTERFACE_URL + '/common/order/create', //创建订单
  pay: INTERFACE_URL + '/common/pay/pay', //支付
  getOrderList: INTERFACE_URL + '/small_v2/my-order/list', //订单列表
  getOrderDetail: INTERFACE_URL + '/small_v2/my-order/detail', //订单详情
  getExpressInfo: INTERFACE_URL + '/small_v2/express-detail/detail',//获取快递信息
  getSPcode: INTERFACE_URL + '/small_v2/rec/x-img',//获取版单详情二维码
  comment: INTERFACE_URL + '/small_v2/member-feedback/add',//意见反馈
  getPrizeInfo: INTERFACE_URL + '/activity/activity/prize-info',//获取奖品信息
  getPrize: INTERFACE_URL + '/activity/activity/get-prize',//获取奖品
  addPrizeCount: INTERFACE_URL + '/activity/activity/use-num',//增加抽奖次数
  getCouponList: INTERFACE_URL + '/small_v2/my-coupon/list'//获取优惠券列表
};

module.exports = {
  root,
}