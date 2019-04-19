// pages/user/user.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{
        id: 6,
        router: '/pages/coupons/coupons',
        icon: '/images/coupons.png',
        title: '我的优惠券',
        checkLogin: true,
        type: 'coupons'
      }, {
        id: 1,
        router: '/pages/order-list/order-list',
        icon: '/images/icon_order.png',
        title: '我的订单',
        checkLogin: true,
        type: 'orderList'
      },
      {
        id: 2,
        router: '/pages/address-list/address-list',
        icon: '/images/icon_address.png',
        title: '我的地址',
        checkLogin: true,
        type: 'addressList'
      }, {
        id: 3,
        router: '/pages/follow/follow',
        icon: '/images/follow.png',
        title: '我喜欢的',
        checkLogin: true,
        type: 'follow'
      }, {
        id: 4,
        router: '/pages/help/help',
        icon: '/images/icon_help.png',
        title: '帮助中心',
        checkLogin: false
      },
      {
        id: 5,
        router: '/pages/idea/idea',
        icon: '/images/icon_idea.png',
        title: '意见反馈',
        checkLogin: true,
        type: 'idea'
      },

    ],
    checkLogin: app.globalData.checkLogin
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.login({
      success: res => {
        if (res.code) {
          this.setData({
            code: res.code
          });
        } else {
          console.log('code lost');
        }
      }
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
    if (app.globalData.checkLogin) {
      this.setData({
        checkLogin: true
      })
    };
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
      let obj = {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      }
      wx.checkSession({
        success: function(res) {
          obj.code = that.data.code;
          that.login(obj);
        },
        fail: function(res) {
          wx.login({
            success: res => {
              if (res.code) {
                obj.code = res.code;
                that.setData({
                  code: res.data
                });
                that.login(obj);
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
   * 登录
   */
  login(obj) {
    let that = this;
    app.sendUserInfo({
      data: obj,
      success(res) {
        that.setData({
          checkLogin: true
        })
      }
    })
  },
  /**
   * routerPage 跳转页面
   */
  routerPage(e) {
    let index = e.currentTarget.dataset.index;
    let page = this.data.list[index];
    if (page.checkLogin) {
      if (this.data.checkLogin) {
        wx.navigateTo({
          url: page.router,
        });
      } else {
        wx.navigateTo({
          url: '/pages/login/login?type=' + page.type,
        })
      }
    } else {
      wx.navigateTo({
        url: page.router,
      })
    }
  },
  wechatSubLoad(e){
    if (e.detail.status == 0){
      this.setData({
        wechatShow: true
      })
    }
  }
})