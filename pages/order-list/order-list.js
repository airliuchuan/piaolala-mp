// pages/order-list/order-list.js
import Dialog from '../../components/vant/dialog/dialog';
import Toast from '../../components/vant/toast/toast';
const app = getApp(); 
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: [{
        id: 1,
        name: "待支付",
      },
      {
        id: 2,
        name: "待发货",
      },
      {
        id: 3,
        name: "已发货",
      },
      {
        id: 4,
        name: "已完成",
      }
    ],
    lineWidth: 40 * app.globalData.setUnit,
    key: 0,
    status: 1,
    loadType:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    if (options.status) {
      this.setData({
        status: options.status,
        key: options.status-1
      })
    };
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
    this.getOrderList();
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
    this.setData({
      clearTimer: true
    });
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
      orderList: []
    });
    this.getOrderList();
  },
  /**
   * 获取订单列表
   */
  getOrderList() {
    let that = this;
    Toast.loading({
      message: '订单加载中…',
      duration: 0
    });
    app.request({
      url: app.root.getOrderList,
      data: {
        status: that.data.status
      },
      success: function(res) {
        Toast.clear();
        if (res.status === 200) {
          if (res.data && that.data.status == 1) {
            for (let i = 0; i < res.data.length; i++) {
              var time = new Date(parseInt(res.data[i].createTime*1000));
              console.log(time);
              var b = 15; //分钟数
              time.setMinutes(time.getMinutes() + b, time.getSeconds(), 0);
              console.log(time);
              res.data[i].orderTime = time.getTime();
            }
          } else {
            res.data.forEach((item) => {
              item.formatTime = util.formatTime(item.createTime);
            })
          };
          console.log(res.data);
          that.setData({
            orderList: res.data,
            noData: false
          })
        } else if (res.status == 410) {
          Dialog.alert({
            message: '登录已失效，请重新登录',
          }).then(() => {
            wx.redirectTo({
              url: '/pages/login/login?type=orderList',
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
      fail: function() {
        Toast.clear();
      },
      complete: function() {
        that.setData({
          loadType:2
        })  
      }
    },this.data.loadType);
  },
  /**
   * 监听倒计时
   */
  myLinsterner(e) {
    console.log(e);
    let index = e.detail.index;
    let obj = {};
    obj[`orderList[${index}].timeover`] = true
    console.log(obj);
    this.setData(obj);
  },
  /**
   * 支付
   */
  pay(e) {
    let orderNum = e.currentTarget.dataset.order;
    let deliverType = e.currentTarget.dataset.type;
    let that = this;
    app.request({
      url: app.root.pay,
      data: {
        openid: wx.getStorageSync('openId'),
        orderNum,
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
                url: '/pages/pay-success/pay-success?deliverType=' + deliverType + '&orderNum=' + orderNum
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