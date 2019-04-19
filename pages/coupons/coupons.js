// pages/coupons/coupons.js
const util = require('../../utils/util.js');
import Dialog from '../../components/vant/dialog/dialog';
import Toast from '../../components/vant/toast/toast';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: [{
        id: 1,
        name: "未使用",
      },
      {
        id: 2,
        name: "已使用",
      },
      {
        id: 3,
        name: "已过期",
      }
    ],
    lineWidth: 40 * app.globalData.setUnit,
    key: 0,
    status: 1,
    loadType: 1,
    allTheme: '/images/coupon1.png', //@yan
    subTheme: '/images/coupon2.png', //@yan
    couponBadge: {
      2: '/images/coupon_used.png',
      3: '/images/coupon_expire.png'
    },
    couponList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getCouponList();
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
  /**
   * 获取当前的tabId
   */
  onChange(e) {
    let index = e.detail.index;
    this.setData({
      key: index,
      status: this.data.tabList[index].id,
      noData: false,
      couponList: []
    });
    this.getCouponList();
  },
  /**
   * 获取优惠券列表
   */
  getCouponList() {
    let that = this;
    app.request({
      url: app.root.getCouponList,
      data: {
        status: this.data.status
      },
      success: function(res) {
        console.log(res);
        if (res.status === 200) {
          res.data.forEach((item) => {
            item.money = item.money / 100;
            item.startTimeFormat = util.formatTime(item.startTime, 'fullDate');
            item.endTimeFormat = util.formatTime(item.endTime, 'fullDate');
            item.fullMoney = item.condition.fullMoney/100;
          })
          that.setData({
            couponList: res.data,
            noData: false
          })
        } else if (res.status == 410) {
          Dialog.alert({
            message: '登录已失效，请重新登录',
          }).then(() => {
            wx.redirectTo({
              url: '/pages/login/login?type=coupons',
            })
          });
        } else if (res.status == 500) {
          that.setData({
            noData: true
          });
        } else {
          Toast(res.message);
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