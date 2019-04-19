// pages/search/search.js
const util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyWords: '',
    searchList: [],
    hotList: ['周杰伦', '汪峰', '萧敬腾', '开心麻花', '张韶涵', '德云社'],
    pageSize: "15",
    pageNum: 1,
    cityCode: '110100',
    currentCity: '北京'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      historyList: wx.getStorageSync('history') || []
    });
    if(app.globalData.city){
      this.setData(app.globalData.city);
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
    wx.stopPullDownRefresh();
    if (this.data.keyWords) {
      this.initSearchList();
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.loadMore) {
      this.setData({
        pageNum: this.data.pageNum + 1,
      });
      this.getSearchList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /**
   * 点击搜索
   */
  onSearch(e) {
    let keyWords = e.detail;
    if (keyWords) {
      this.addHistoryItem(keyWords);
      this.setData({
        keyWords,
      }, function() {
        this.initSearchList();
      });
    }
  },
  /**
   * 清除监控
   */
  onChange(e) {
    let keyWords = e.detail;
    if (!keyWords) {
      this.setData({
        keyWords,
        searchList: []
      });
    }
  },
  /**
   * 取消搜索
   */
  onCancel() {
    wx.navigateBack();
  },
  /**
   * 点击标签搜索
   */
  searchItem(e) {
    console.log(e);
    let keyWords = e.currentTarget.dataset.words;
    this.addHistoryItem(keyWords);
    this.setData({
      keyWords
    }, function() {
      this.initSearchList();
    })
  },
  /**
   * 删除搜索记录
   */
  removeItem(e) {
    let index = e.currentTarget.dataset.index;
    let historyList = wx.getStorageSync('history');
    historyList.splice(index, 1);
    wx.setStorageSync('history', historyList);
    this.setData({
      historyList
    });
  },
  /**
   * 清空搜索记录
   */
  clearHistory() {
    wx.removeStorageSync('history');
    this.setData({
      historyList: []
    });
  },
  /**
   * 添加搜索记录
   */
  addHistoryItem(keyWords) {
    let historyList = wx.getStorageSync('history') || [];
    if (historyList.indexOf(keyWords) == -1) {
      historyList.push(keyWords);
      wx.setStorageSync('history', historyList);
      this.setData({
        historyList
      });
    };
  },
  /**
   * 初始化搜索列表
   */
  initSearchList() {
    this.setData({
      searchList: [],
      pageNum: 1,
      loadMore: true,
      noData: false
    });
    this.getSearchList();
  },
  /**
   * 获取搜索列表
   */
  getSearchList() {
    let that = this;
    app.request({
      url: app.root.getSearchList,
      data: {
        pageNum: this.data.pageNum,
        pageSize: this.data.pageSize,
        goodsName: this.data.keyWords,
        cityCode: this.data.cityCode
      },
      success: function(res) {
        console.log(res);
        if (res.status === 200) {
          let result = res.data.data;
          let searchList = [];
          for (let i in result) {
            if (new Date(parseInt(result[i].startTime * 1000)).toDateString() === new Date(parseInt(result[i].endTime * 1000)).toDateString()) {
              result[i].startTimeFormat = util.formatTime(result[i].startTime);
            } else {
              result[i].startTimeFormat = util.formatTime(result[i].startTime, 'fullDate');
              result[i].endTimeFormat = util.formatTime(result[i].endTime, 'shortDate');
            }
            result[i].price = result[i].quotePrice * (100 + parseInt(result[i].ratio)) / 10000;
            searchList.push(result[i]);
          };

          if (that.data.pageNum == 1) {
            that.setData({
              total: res.data.total
            })
          };
          if (searchList.length < that.data.pageSize) {
            that.setData({
              loadMore: false
            })
          };
          that.setData({
            searchList: that.data.searchList.concat(searchList)
          })
          console.log(searchList);
        } else if (res.status == 500) {
          //判断初始数据是否为空
          if (that.data.pageNum == 1) {
            that.setData({
              noData: true,
              loadMore: false,
              total: 0
            })
          } else {
            that.setData({
              loadMore: false
            })
          }
        };
      },
      complete: function() {}
    });
  }
})