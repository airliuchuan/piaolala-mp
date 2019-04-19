// pages/order-detail/order-detail.js
import Dialog from '../../components/vant/dialog/dialog';
import Toast from '../../components/vant/toast/toast';
const util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: {
      '1': '待支付',
      '2': '已支付',
      '3': '已发货',
      '4': '已完成',
      '5': '已关闭',
      '6': '已退款',
      '7': '已取消'
    },
    tel: '4008108080',
    loadType:1,
    deliverTypeJson: {
      '1': '快递取票',
      '2': '上门自取',
      '3': '现场取票',
      '5': '电子票'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.id) {
      this.setData(options);
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
    if (app.globalData.cityList) {
      this.setData({
        cityList: app.globalData.cityList
      });
      this.getOrderDetail();
    } else {
      this.getAreas();
    }
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
   * 用户点击右上角分享
   */
  getOrderDetail() {
    let that = this;
    app.request({
      url: app.root.getOrderDetail,
      data: {
        orderId: this.data.id
      },
      success: function(res) {
        console.log(res);
        if (res.status === 200) {
          res.data.orderTime = util.formatTime(res.data.createTime);
          res.data.total = parseInt(res.data.amount / 100);
          that.setData(res.data);
        } else if (res.status == 410) {
          Dialog.alert({
            message: '登录已失效，请重新登录',
          }).then(() => {
            wx.redirectTo({
              url: '/pages/login/login?type=orderDetail',
            })
          });
        } else {
          Toast(res.message);
        };
      },
      fail: function() {},
      complete: function() {
        that.setData({
          loadType:2
        })
      }
    },this.data.loadType);
  },
  /**
   * 获取所有省市列表
   */
  getAreas: function() {
    let that = this;
    app.getAreas({
      page: that,
      success() {
        this.getOrderDetail();
      }
    })
  },
  makePhoneCall: function() {
    var that = this
    wx.makePhoneCall({
      phoneNumber: that.data.tel,
      success: function() {
        console.log("成功拨打电话")
      }
    })
  },
  /**
   * 支付
   */
  pay() {
    let that = this;
    app.request({
      url: app.root.pay,
      data: {
        orderNum:this.data.orderNum
      },
      success: function(res) {
        console.log(res);
        if (res.status === 200) {
          let wechatData = res.data;
          wx.requestPayment({
            'timeStamp': wechatData.timeStamp,
            'nonceStr': wechatData.nonceStr, //随机字符串，长度为32个字符以下。
            'package': wechatData.package, //
            'signType': wechatData.signType, //
            'paySign': wechatData.paySign, //
            'success': function(res) { //支付成功
              console.log('success');
              wx.redirectTo({
                url: '/pages/pay-success/pay-success?deliverType=' + that.data.deliverType + '&orderNum=' + that.data.orderNum
              })
            },
            'fail': function(res) { //取消支付
              console.log('fail');
            },
            'complete': function(res) {
              console.log(res);
            }
          });
        } else {
          if (res.status == 410) {
            Dialog.alert({
              message: '登录已失效，请重新登录',
            }).then(() => {
              wx.navigateTo({
                url: `/pages/login/login?type=pay`,
              });
            });
          } else {
            Toast(res.message);
          }
        }
      },
      complete: function() {

      }
    });
  }
})