// pages/express/express.js
const app = getApp();
import Dialog from '../../components/vant/dialog/dialog';
import Toast from '../../components/vant/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status:{
      '-1': '暂无信息',//单号或代码错误
      '0': '暂无信息',//暂无轨迹
      '1': '快递收件',
      '2': '在途中',
      '3': '签收',
      '4': '问题件',
    },
    loadType:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.orderNum) {
      this.setData(options, function() {
        this.getExpressInfo();
      })
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
  /**
   * 用户点击右上角分享
   */
  getExpressInfo() {
    let that = this;
    app.request({
      url: app.root.getExpressInfo,
      data: {
        orderNum: this.data.orderNum
      },
      success: function(res) {
        console.log(res);
        if (res.status === 200) {
          let steps = [];
          res.data.expressDetails.forEach((item) => {
            console.log(item);
            steps.push({
              text: item.content
            })
          });
          that.setData({
            expressNum: res.data.expressNum,
            expressStatus: res.data.expressStatus,
            steps
          })
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
  }
})