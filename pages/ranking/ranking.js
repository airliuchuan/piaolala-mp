// pages/ranking/ranking.js
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgOpa:.25,
    loadType:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    if(options.id){
      //设置标题
      wx.setNavigationBarTitle({
        title: decodeURIComponent(options.title),
      })
      //获取榜单id
      this.setData({
        id: options.id,
        bgRgb: options.rgb,
        color: options.color
      },function(){
        this.getRankingList();
      });
      
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 获取版单列表
   */
  getRankingList() {
    console.log(this.data.id);
    let that = this;
    app.request({
      url: app.root.getRankingList,
      data: {
        recId: this.data.id
      },
      success: function (res) {
        console.log(res);
        if (res.status === 200) {
          let rankingList = res.data;
          rankingList.forEach((item)=>{
            item.formatTime = util.formatTime(item.createTime);
            item.goodsPrice = item.price?item.price.quotePrice * (100 + parseInt(item.price.ratio)) / 10000:'';
          })
          console.log(rankingList);
          that.setData({
            rankingList: res.data
          })
        };
      },
      complete: function () {
        that.setData({
          loadType:2
        })
       }
    },this.data.loadType);
  }
})