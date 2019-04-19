// pages/home/home.js
const app = getApp();
const util = require('../../utils/util.js');
const color = require('../../utils/color.js');
import Toast from '../../components/vant/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cateList: [{
        id: 1,
        name: '演唱会',
        imgUrl: '/images/vocal.png'
      },
      {
        id: 3,
        name: '音乐会',
        imgUrl: '/images/concert.png'
      },
      {
        id: 4,
        name: '儿童亲子',
        imgUrl: '/images/children.png'
      },
      {
        id: 8,
        name: '体育赛事',
        imgUrl: '/images/sports.png'
      },
      {
        id: 2,
        name: '话剧歌剧',
        imgUrl: '/images/drama.png'
      },

      {
        id: 6,
        name: '舞蹈芭蕾',
        imgUrl: '/images/dance.png'
      },
      {
        id: 7,
        name: '戏曲综艺',
        imgUrl: '/images/opera.png'
      },
      {
        id: 5,
        name: '休闲展览',
        imgUrl: '/images/exhibition.png'
      },
    ],
    bannerList: [],
    swiper: {
      indicatorDots: true,
      autoplay: true,
      circular: true,
      interval: 3000,
      duration: 1200,
    },
    currentCity: '北京',
    cityCode: '110100',
    pageSize: "15",
    pageNum: 1,
    sort: 1,
    time: 1,
    cateId: 0,
    goodsList: [],
    rankingList: [],
    rankingOpa: .25,
    loadType: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getBannerList();
    this.getRankingList();
    this.getUserLocation();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

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
    this.getRankingList();
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
   * 用户点击右上角分享
   */
  selCateId(e) {
    console.log(e.currentTarget.dataset);
    let {
      id,
      index
    } = e.currentTarget.dataset;
    console.log(index)
    app.globalData.cateId = id;
    app.globalData.cateIndex = index + 1;
    wx.navigateTo({
      url: '/pages/category/category',
    })
  },
  /**
   * 打开城市选择model
   */
  showCityModel() {
    this.setData({
      showCityModel: !this.data.showCityModel
    })
  },
  /**
   * 切换城市
   */
  changeCity(e) {
    console.log(e);
    if (e.detail) {
      if (e.detail.cityCode != this.data.cityCode) {
        let obj = {
          currentCity: e.detail.currentCity,
          cityCode: e.detail.cityCode
        }
        app.globalData.city = obj;
        this.setData(obj, function() {
          this.getRankingList();
          this.getBannerList();
        });
      }
      this.showCityModel();
    }
  },
  /**
   * 获取城市定位
   */
  getUserLocation() {
    app.getCityLocation(this);
  },
  /**
   * 获取banner图
   */
  getBannerList() {
    let that = this;
    this.setData({
      bannerList: []
    })
    app.request({
      url: app.root.getBannerList,
      data: {
        cityCode: this.data.cityCode
      },
      success: function(res) {
        console.log(res);
        if (res.status === 200) {
          that.setData({
            bannerList: res.data
          })
        } else if (res.status == 500) {
          that.setData({
            bannerList: []
          })
        } else {

        }
      },
      complete: function() {

      }
    });
  },

  /**
   * 获取榜单列表
   */
  getRankingList(loadType) {
    let that = this;
    app.request({
      url: app.root.getHomeRanking,
      data: {
        cityCode: this.data.cityCode
      },
      success: function(res) {
        console.log(res.status);
        if (res.status === 200) {
          let rankingList = res.data;
          rankingList.forEach((item) => {
            item.bgRgb = color.colorRgb(item.backColor);
          });
          console.log(rankingList);
          that.setData({
            rankingList,
            goodsList: [],
            loadMore: false,
            noData: false
          })
        } else if (res.status == 500) {
          that.setData({
            rankingList: [],
            noData: true,
            goodsList: [],
            loadMore: true,
            noGoodsData: false
          }, function() {
            that.getGoodsList();
          })
        }
      },
      complete: function() {
        that.setData({
          loadType: 2
        })
      }
    }, this.data.loadType);
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
              noGoodsData: true,
              loadMore: false
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