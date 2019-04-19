// pages/idea/idea.js
const app = getApp();
import Notify from '../../components/vant/notify/notify';
import Dialog from '../../components/vant/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contact: '',
    color: '#c0c0c0',
    content: '您有意见吗？有的话就在这里把您的宝贵意见砸向产品经理吧，一经采纳有奖励哦(^-^)',
    getContent: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      contact: wx.getStorageSync('account')
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
   * 文本域获取焦点
   */
  focusTextarea() {
    if (!this.data.getContent) {
      this.setData({
        content: '',
        color: '#151515'
      })
    }
  },
  /**
   * 文本域失去焦点
   */
  blurTextarea(e) {
    if (!e.detail.value) {
      this.setData({
        color: '#c0c0c0',
        content: '您有意见吗？有的话就在这里把您的宝贵意见砸向产品经理吧，一经采纳有奖励哦(^-^)',
        getContent: false
      })
    } else {
      this.setData({
        getContent: true
      })
    }
  },

  /**
   * 提交
   */
  formSubmit(e) {
    let subValue = e.detail.value;
    setTimeout(() => {
      if (!(subValue.content && this.data.getContent)) {
        Notify({
          text: '请输入反馈意见',
          duration: 1500
        });
        return false;
      };
      app.request({
        url: app.root.comment,
        data: subValue,
        success: function(res) {
          console.log(res);
          if (res.status === 200) {
            Dialog.alert({
              message: '反馈已提交',
            }).then(() => {
              wx.navigateBack();
            });
          }
        },
        fail: function() {},
        complete: function() {}
      });
    }, 20)
  }
})