// pages/goods-detail/goods-detail.js
const app = getApp();
const WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadType: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    if (options.id) {
      this.setData({
        id: options.id,
      });
      this.getGoodsDetail();
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  getGoodsDetail() {
    let that = this;
    app.request({
      url: app.root.getGoodsDetail,
      data: {
        goodsId: this.data.id,
      },
      success: function(res) {
        console.log(res);
        if (res.status == 200) {
          let details = that.removeFontFamily(res.data.details);
          WxParse.wxParse('article', 'html', details, that);
        }
      },
      complete: function() {
        that.setData({
          loadType: 2
        })
      }
    }, this.data.loadType);
  },
  removeFontFamily(contnet) {
    var unique = function(arr) {
      var result = [],
        hash = {};
      for (var i = 0, elem;
        (elem = arr[i]) != null; i++) {
        if (!hash[elem]) {
          result.push(elem);
          hash[elem] = true;
        }
      }
      return result;
    }
    var arr = contnet.match(/(font-family:[^><;]*(;)?)/ig);
    console.log(arr);
    arr = unique(arr);
    for (var i = 0; i < arr.length; i++) {
      console.log(arr[i]);
      var reg = new RegExp(arr[i], "ig");
      contnet = contnet.replace(reg, "");
    }
    return contnet;
  }

})