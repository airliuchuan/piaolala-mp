// pages/login/login.js
const app = getApp();
const json = require('../../utils/json.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    map: {
      idea:{
        routerType: 1, //1 跳转  2 后退
        routerPage: '/pages/idea/idea'
      },
      orderList: {
        routerType: 1, //1 跳转  2 后退
        routerPage: '/pages/order-list/order-list'
      },
      orderDetail: {
        routerType: 2 //1 跳转  2 后退
      },
      addressList: {
        routerType: 1, //1 跳转  2 后退
        routerPage: '/pages/address-list/address-list',
      },
      addressEdit: {
        routerType: 2
      },
      settlement: {
        routerType: 1,
        routerPage: '/pages/settlement/settlement'
      },
      orderConfirm: {
        routerType: 1,
        routerPage: '/pages/order-confirm/order-confirm'
      },
      pay: {
        routerType: 2
      },
      follow: {
        routerType: 1,
        routerPage: '/pages/follow/follow'
      },
      coupons: {
        routerType: 1,
        routerPage: '/pages/coupons/coupons'
      },
      isFollow: {
        routerType: 2
      },
      prize:{
        routerType: 1,
        routerPage: '/pages/prize/prize'
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    let obj = {
      type: options.type || ''
    };
    obj[`map.${obj.type}.params`] = json.jsonToUrl(options);
    this.setData(obj, function() {
      let that = this;
      wx.login({
        success: res => {
          if (res.code) {
            that.setData({
              code: res.code
            });
          } else {
            console.log('code lost');
          }
        }
      })
    });
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
   * 获取用户信息
   */
  getPhoneNumber: function(e) {
    console.log(e)
    let that = this;
    if (!e.detail.encryptedData) {
      console.log('user cancel login');
    } else {
      let obj={
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      }
      wx.checkSession({
        success: function(res) {
          obj.code = that.data.code;
          that.mapController(obj);
        },
        fail: function(res) {
          wx.login({
            success: res => {
              if (res.code) {
                obj.code = res.code;
                that.mapController(obj);
              } else {
                console.log('code lost');
              }
            }
          })
        }
      })
    }
  },
  /**
   * 路由跳转
   */
  mapController(obj) {
    let that = this;
    app.sendUserInfo({
      data: obj,
      success(res) {
        if (that.data.type) {
          let router = that.data.map[that.data.type];
          console.log(router)
          if (router.routerType == 1) {
            wx.redirectTo({
              url: router.routerPage + `?${router.params}`,
            })
          } else {
            wx.navigateBack();
          };
        }
      }
    })
  }
})