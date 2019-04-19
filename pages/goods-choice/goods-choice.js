// pages/goods-choice/goods-choice.js
const app = getApp();
import Toast from '../../components/vant/toast/toast';
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    followStatus: 1,
    checkLogin: app.globalData.checkLogin,
    loadType:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    if (options.id) {
      if (options.rId) {
        wx.setNavigationBarTitle({
          title: '榜单购买',
        })
      } else {
        wx.setNavigationBarTitle({
          title: '票品购买',
        })
      }
      this.setData({
        id: options.id,
        rId: options.rId || ''
      }, function() {
        this.getGoodsDetail();
        this.getFollowStatus();
      })
    };
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
    if (wx.getStorageSync('tokens')) {
      this.setData({
        checkLogin: true
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
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      lock: true
    })
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
   * 获取商品详情
   */
  getGoodsDetail() {
    let that = this;
    app.request({
      url: app.root.getGoodsDetail,
      data: {
        goodsId: this.data.id,
      },
      success: function(res) {
        console.log(res);
        if (res.status == 200) {
          let goods = res.data;
          if (new Date(parseInt(goods.startTime * 1000)).toDateString() === new Date(parseInt(goods.endTime * 1000)).toDateString()) {
            goods.startTimeFormat = util.formatTime(goods.startTime);
          } else {
            goods.startTimeFormat = util.formatTime(goods.startTime, 'fullDate');
            goods.endTimeFormat = util.formatTime(goods.endTime, 'shortDate');
          }
          console.log(goods);
          goods.price = Math.ceil(goods.quotePrice * (100 + parseInt(goods.ratio)) / 10000)
          that.setData({
            goods,
          }, function() {
            that.getPlans();
          });
        }
      },
      complete: function() {
        
      }
    },this.data.loadType);
  },
  /**
   * 获取收藏状态
   */
  getFollowStatus() {
    let that = this;
    app.request({
      url: app.root.getFollowStatus,
      data: {
        goodsId: this.data.id,
        type: 1
      },
      success: function(res) {
        console.log(res);
        if (res.status === 200) {
          that.setData({
            followStatus: res.data.status
          })
        };
      },
      complete: function() {}
    });
  },
  /**
   * 收藏/取消收藏
   */
  follow() {
    let that = this;
    if (this.data.checkLogin) {
      app.request({
        url: app.root[(this.data.followStatus == 1 ? 'followAdd' : 'followCancel')],
        data: {
          goodsId: this.data.id,
          type: 1
        },
        success: function(res) {
          console.log(res);
          if (res.status === 200) {
            console.log('=======')
            that.setData({
              followStatus: that.data.followStatus == 1 ? 2 : 1
            })
          } else if (res.status == 410) {
            Toast.fail('请先登录');
            setTimeout(() => {
              wx.navigateTo({
                url: '/pages/login/login?type=isFollow',
              })
            }, 1000);
          }
        },
        complete: function() {}
      });
    } else {
      Toast.fail('请先登录');
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/login/login?type=isFollow',
        })
      }, 1000);
    }
  },
  /**
   * 获取排期
   */
  getPlans() {
    let that = this;
    app.request({
      url: app.root.getPlans,
      data: {
        goodsId: this.data.id
      },
      success: function(res) {
        console.log(res);
        if (res.status === 200) {
          let attrList = res.data ? res.data : [];
          let planInfo = that.getDefultPlan(attrList[0].levelArr);
          console.log(attrList[0].levelArr[0]);
          that.setData({
            planIndex: 0,
            planId: attrList[0].planId,
            planName: attrList[0].planName ? attrList[0].planName : '',
            attrList,
            priceList: attrList[0].levelArr,
            planInfo,
          })
        } else if (res.status == 402) {
          that.setData({
            planInfo: {}
          });
          Toast.fail('暂无演出数据');
        }
      },
      complete: function() {
        that.setData({
          loadType:2
        })
      }
    });
  },
  /**
   * 获取默认选择票档
   */
  getDefultPlan(arr) {
    let planInfo = {
      price: 0,
      num: 0,
      total: 0
    };
    out:
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].priceArr.length; j++) {
          if (arr[i].priceArr[j].stock > 0) {
            planInfo = arr[i].priceArr[j];
            planInfo.num = 1;
            planInfo.levelPrice = parseInt(arr[i].levelName)/100;
            planInfo.price = Math.ceil(parseInt(planInfo.quotePrice) * (100 + parseInt(this.data.goods.ratio)) / 10000);
            planInfo.total = planInfo.price;
            planInfo.levelTotal = planInfo.levelPrice;
            planInfo.index = i;
            planInfo.key = j;
            break out;
          } else {
            continue;
          }
        }
      };
    console.log(planInfo);
    return planInfo;
  },
  /**
   * 选择价格
   */
  confirmPrice(e) {
    let index = e.currentTarget.dataset.index;
    if (index != this.data.planInfo.index && this.data.priceList[index].priceArr.length > 0) {
      let planInfo = {
        price: 0,
        num: 0,
        total: 0
      };
      for (let j = 0; j < this.data.priceList[index].priceArr.length; j++) {
        if (this.data.priceList[index].priceArr[j].stock > 0) {
          planInfo = this.data.priceList[index].priceArr[j];
          planInfo.num = 1;
          planInfo.price = Math.ceil(parseInt(planInfo.quotePrice) * (100 + parseInt(this.data.goods.ratio)) / 10000);
          planInfo.levelPrice = parseInt(this.data.priceList[index].levelName) / 100;
          planInfo.total = planInfo.price;
          planInfo.levelTotal = planInfo.levelPrice;
          planInfo.index = index;
          planInfo.key = j;
          break;
        } else {
          continue;
        }
      };
      this.setData({
        planInfo
      })
      console.log(this.data.planInfo);
    }
  },
  /**
   * 选择商家
   */
  confirmBrand(e) {
    console.log(e);
    let index = e.currentTarget.dataset.index;
    if (index != this.data.planInfo.key && this.data.priceList[this.data.planInfo.index].priceArr[index].stock > 0) {
      let priceIndex = this.data.planInfo.index;
      let planInfo = this.data.priceList[this.data.planInfo.index].priceArr[index];
      planInfo.num = 1;
      planInfo.price = Math.ceil(parseInt(planInfo.quotePrice) * (100 + parseInt(this.data.goods.ratio)) / 10000);
      planInfo.levelPrice = parseInt(this.data.priceList[this.data.planInfo.index].levelName) / 100;
      planInfo.total = planInfo.price;
      planInfo.levelTotal = planInfo.levelPrice;
      planInfo.key = index;
      planInfo.index = priceIndex;
      console.log(planInfo)
      this.setData({
        planInfo
      });
    }
  },
  /**
   * 更改数量
   */
  onChange(e) {
    let value = e.detail;
    if (value != this.data.planInfo.num) {
      this.setData({
        'planInfo.num': value,
        'planInfo.total': this.data.planInfo.stock - value == 1 ? this.data.planInfo.price * value + parseInt(this.data.planInfo.extraFee) : this.data.planInfo.price * value,
        'planInfo.levelTotal': this.data.planInfo.levelPrice * value
      });
      console.log(this.data.planInfo);
    }
  },
  /**
   * 切换时间排期model
   */
  toggleBottomPopup() {
    this.setData({
      showPlanModel: !this.data.showPlanModel
    })
  },
  /**
   * 切换排期
   */
  changePlan(e) {
    let index = e.currentTarget.dataset.index;
    if (index != this.data.planIndex) {
      let attrList = this.data.attrList;
      let planInfo = this.getDefultPlan(attrList[index].levelArr);
      console.log(planInfo);
      this.setData({
        planIndex: index,
        planId: attrList[index].planId,
        planName: attrList[index].planName ? attrList[index].planName : '',
        priceList: attrList[index].levelArr,
        planInfo
      }, function() {
        this.toggleBottomPopup();
      });
    }
  },
  /**
   * 提交选择商品信息
   */
  choiceConfirm() {
    if (this.data.planInfo.priceId) {
      if (this.data.checkLogin) {
        wx.navigateTo({
          url: `/pages/order-confirm/order-confirm?id=${this.data.id}&priceId=${this.data.planInfo.priceId}&num=${this.data.planInfo.num}&total=${this.data.planInfo.total}&business=${this.data.planInfo.company}`,
        })
      } else {
        wx.navigateTo({
          url: `/pages/login/login?type=orderConfirm&id=${this.data.id}&priceId=${this.data.planInfo.priceId}&num=${this.data.planInfo.num}&total=${this.data.planInfo.total}&business=${this.data.planInfo.company}`,
        })
      }
    } else {
      Toast.fail({
        message: '当前票档售罄'
      });
    }
  },
  /**
   * 打开地图
   */
  showMap() {
    wx.openLocation({
      latitude: parseFloat(this.data.goods.latitude),
      longitude: parseFloat(this.data.goods.longitude),
      name: this.data.goods.venueName,
      //address: this.data.detaliObj.venueName,
      scale: 18
    })
  },
})