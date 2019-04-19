// pages/pay-success/pay-success.js
const app = getApp();
import Dialog from '../../components/vant/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.deliverType) {
      this.setData({
        status: options.deliverType == 1 ? 2 : 3,
        orderNum: options.orderNum
      })
      
    }
    this.addPrizeCount(1);
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
  addPrizeCount(type) {
    let that = this;
    app.request({
      url: app.root.addPrizeCount,
      data: {
        type,
        orderNum: this.data.orderNum
      },
      success: function (res) {
        console.log(res);
        if (res.status === 200) {
          Dialog.confirm({
            title:'恭喜您',
            message: '获得新的抽奖机会~',
            confirmButtonText:'立即前往',
            closeOnClickOverlay: true
          }).then(() => {
            wx.navigateTo({
              url: '/pages/prize/prize',
            })
          }).catch(() => {
            console.log(3);
            // on cancel
          });
        }; 
      },
      complete: function () { }
    });
  }
})