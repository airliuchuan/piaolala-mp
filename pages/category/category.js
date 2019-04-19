// pages/category/category.js
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: [{
        id: 0,
        name: "全部",
      },
      {
        id: 1,
        name: "演唱会",
      },
      {
        id: 3,
        name: "音乐会",
      },
      {
        id: 4,
        name: "儿童亲子",
      },
      {
        id: 8,
        name: "体育赛事",
      },
      {
        id: 2,
        name: "话剧歌剧",
      },
      {
        id: 6,
        name: "舞蹈芭蕾",
      },
      {
        id: 7,
        name: "戏曲综艺",
      },
      {
        id: 5,
        name: "休闲展览",
      },
    ],
    sortList: [{
        id: 1,
        name: '最新上架'
      },
      {
        id: 2,
        name: '好评优先'
      },
      {
        id: 3,
        name: '热度优先'
      }
    ],
    timeList: [{
        id: 1,
        name: '全部时间'
      },
      {
        id: 2,
        name: '本周末'
      },
      {
        id: 3,
        name: '一周内'
      },
      {
        id: 4,
        name: '一月内'
      },
    ],
    lineWidth: 40 * app.globalData.setUnit,
    currentCity: '北京',
    cityCode: '110100',
    cateId: 0,
    cateIndex: 0,
    sort: 1,
    sortName:'最新上架',
    time: 1,
    timeName:'全部时间',
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
      if (app.globalData.cateId) {
        this.setData({
          cateId: app.globalData.cateId,
          cateIndex: app.globalData.cateIndex
        });
        app.globalData.cateId = 0;
      }
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
    }
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
    this.setData({
      cateId: this.data.tabList[e.detail.index].id
    });
    this.initGoodsList();
  },
  /**
   * 切换 城市，排序，时间
   */
  getCurrentSubItem(e) {
    let index = e.currentTarget.dataset.index;
    this.changeSubModel(index);
  },
  /**
   * 切换城市
   */
  changeCitySubItem(e) {
    if (e.detail) {
      if (e.detail.cityCode != this.data.cityCode) {
        this.setData({
          currentCity: e.detail.currentCity,
          cityCode: e.detail.cityCode
        });
        this.initGoodsList();
      }
      this.changeSubModel(e.detail.index);
    }
  },
  /**
   * 切换排序
   */
  changeSortSubItem(e) {
    let index = e.currentTarget.dataset.index;
    if (this.data.sortList[index].id != this.data.sort) {
      this.setData({
        sort: this.data.sortList[index].id,
        sortName: this.data.sortList[index].name
      })
      this.initGoodsList();
    };
    this.changeSubModel(1);
  },
  /**
   * 切换时间
   */
  changeTimeSubItem(e) {
    let index = e.currentTarget.dataset.index;
    if (this.data.timeList[index].id != this.data.time) {
      this.setData({
        time: this.data.timeList[index].id,
        timeName: this.data.timeList[index].name
      })
      this.initGoodsList();
    }
    this.changeSubModel(2);
  },
  /**
   * 切换排序，时间  公用函数部分
   */
  toggleTopPopup(e) {
    console.log(e);
    this.changeSubModel(e.detail);
  },
  changeSubModel(index) {
    let models = ['showCityModel', 'showSortModel', 'showTimeModel'];
    let obj = {};
    models.forEach((val, key) => {
      if (key == index) {
        obj[val] = !this.data[val];
      } else {
        obj[val] = false;
      }
    });
    console.log(obj);
    this.setData(obj);
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
      url: app.root.getGoodsList,
      data: {
        pageNum: this.data.pageNum,
        pageSize: this.data.pageSize,
        cityCode: this.data.cityCode,
        time: this.data.time,
        sorts: this.data.sort,
        cateId: this.data.cateId,
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
            };
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