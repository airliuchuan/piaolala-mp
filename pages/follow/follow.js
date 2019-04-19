// pages/follow/follow.js
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    followList: {},
    loadType: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    this.getFollowList();
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
  onPullDownRefresh: function() {},

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
  /**
   * 获取列表
   */
  getFollowList() {
    let that = this;
    app.request({
      url: app.root.getFollowList,
      success: function(res) {
        console.log(res);
        if (res.status === 200) {
          let result = res.data;
          let goodsList = [];
          for (let i in result) {
            result[i].createTimeFormat = util.formatTime(result[i].createTime, 'fullDate');
            if (new Date(parseInt(result[i].startTime * 1000)).toDateString() === new Date(parseInt(result[i].endTime * 1000)).toDateString()) {
              result[i].startTimeFormat = util.formatTime(result[i].startTime);
            } else {
              result[i].startTimeFormat = util.formatTime(result[i].startTime, 'fullDate');
              result[i].endTimeFormat = util.formatTime(result[i].endTime, 'shortDate');
            }
            result[i].price = result[i].quotePrice * (100 + parseInt(result[i].ratio)) / 10000;
            goodsList.push(result[i]);
          };
          let followList = {};
          goodsList.forEach((item, i) => {
            if (item.status != 3) {
              followList[item.createTimeFormat] ? followList[item.createTimeFormat].push(item) : followList[item.createTimeFormat] = [item];
            }
          });
          console.log(followList);
          that.setData({
            followList,
          });
          console.log(that.data.followList);
        } else if (res.status == 500) {
          that.setData({
            noData: true,
            loadMore: false,
            followList: []
          })
        };
      },
      complete: function() {
        that.setData({
          loadType: 2
        })
      }
    }, this.data.loadType);
  }
})