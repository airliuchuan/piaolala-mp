// pages/show/show.js
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiper: {
      indicatorDots: false,
      autoplay: true,
      circular: true,
      interval: 2000,
      duration: 1000,
    },
    swiperIndex: 1,
    Images: [{
      url: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      isChange: 1,
    }, {
      url: 'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      isChange: 2,
    }, {
      url: 'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg',
      isChange: 3,
    }, ],
    cityCode: '110100',
    pageSize: "15",
    pageNum: 1,
    goodsList: [],
    loadType:1
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
    //判断是否从详情也返回，如过是不刷新列表
    if (!this.data.lock) {
      if (app.globalData.city) {
        this.setData(app.globalData.city);
      };
      this.initGoodsList();
    } else {
      this.setData({
        lock: false
      })
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
    wx.stopPullDownRefresh();
    this.initGoodsList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.loadMore) {
      this.setData({
        pageNum: this.data.pageNum + 1,
      });
      this.getGoodsList();
    };
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 轮播图切换
   */
  swiperChange(e) {
    const that = this;
    that.setData({
      swiperIndex: e.detail.current,
    })
  },
  /**
   * 初始化商品列表
   */
  initGoodsList() {
    this.setData({
      goodsList: [],
      pageNum: 1,
      loadMore: true,
      noData: false
    });
    this.getGoodsList();
  },
  /**
   * 获取商品列表
   */
  getGoodsList() {
    let that = this;
    app.request({
      url: app.root.getHotGoodsList,
      data: {
        pageNum: this.data.pageNum,
        pageSize: this.data.pageSize,
        cityCode: this.data.cityCode,
      },
      success: function(res) {
        console.log(res);
        if (res.status === 200) {
          let result = res.data.data;
          let goodsList = [];
          for (let i in result) {
            if (new Date(parseInt(result[i].startTime * 1000)).toDateString() === new Date(parseInt(result[i].endTime * 1000)).toDateString()) {
              result[i].startTimeFormat = util.formatTime(result[i].startTime);
            } else {
              result[i].startTimeFormat = util.formatTime(result[i].startTime, 'fullDate');
              result[i].endTimeFormat = util.formatTime(result[i].endTime, 'shortDate');
            }
            result[i].price = result[i].quotePrice * (100 + parseInt(result[i].ratio)) / 10000;
            goodsList.push(result[i]);
          };
          if (goodsList.length < that.data.pageSize) {
            that.setData({
              loadMore: false
            })
          };
          that.setData({
            goodsList: that.data.goodsList.concat(goodsList)
          });

        } else if (res.status == 500) {
          //判断初始数据是否为空
          if (that.data.pageNum == 1) {
            that.setData({
              noData: true,
              loadMore: false
            })
          } else {
            that.setData({
              loadMore: false
            })
          }
        };
      },
      complete: function() {
        that.setData({
          loadType:2
        })
      }
    },this.data.loadType);
  }
})