// pages/address-list/address-list.js
import Dialog from '../../components/vant/dialog/dialog';
import Toast from '../../components/vant/toast/toast';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    adrList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    this.setData({
      openType: options.openType || 0
    })
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
      this.getUserAdrList();
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
   * 获取所有省市列表
   */
  getAreas: function() {
    let that = this;
    app.getAreas({
      page: that,
      success() {
        this.getUserAdrList();
      }
    })
  },
  /**
   * 获取用户地址列表
   */
  getUserAdrList() {
    let that = this;
    this.setData({
      noData: false
    });
    app.request({
      url: app.root.getAdrList,
      success: function(res) {
        console.log(res);
        if (res.status === 200) {
          if (res.data == undefined) {
            that.setData({
              noData: true,
              adrList: []
            });
          } else {
            that.setData({
              adrList: res.data,
            })
          }
        } else if (res.status == 410) {
          Dialog.alert({
            message: '登录已失效，请重新登录',
          }).then(() => {
            wx.redirectTo({
              url: `/pages/login/login?type=addressList&openType=${that.data.openType}`,
            })
          });
        } else if (res.status == 500) {
          that.setData({
            noData: true,
            adrList: []
          })
        } else {
          Toast(res.message);
        }
      },
      complete: function() {

      }
    });
  },
  /**
   * 修改用户地址
   */
  editAddress(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/address-edit/address-edit?addressId=' + id,
    })
  },
  /**
   * 删除用户地址
   */
  delAddress(e) {
    let id = e.currentTarget.dataset.id;
    let that = this;
    Dialog.confirm({
      message: '确认要删除该地址吗？',
      addressId: id
    }).then(() => {
      app.request({
        url: app.root.delAddress,
        data: {
          addressId: id
        },
        success: function(res) {
          console.log(res);
          if (res.status === 200) {
            that.getUserAdrList();
          };
        },
        complete: function() {

        }
      });
      // on confirm
    }).catch(() => {
      console.log(3);
      // on cancel
    });
  },
  /**
   * 选择地址
   */
  chooseAddress(e) {
    if (this.data.openType == 1) {
      let index = e.currentTarget.dataset.index;
      app.globalData.adrChanged = true;
      app.globalData.addressInfo = this.data.adrList[index];
      wx.navigateBack();
    };
  }
})