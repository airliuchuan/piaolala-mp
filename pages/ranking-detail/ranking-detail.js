// pages/ranking-detail/ranking-detail.js
const app = getApp();
const util = require('../../utils/util.js');
import Toast from '../../components/vant/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    move: true,
    num: 4,
    followStatus: 1,
    maskHidden: true, //绘制分享图
    checkLogin: app.globalData.checkLogin,
    loadType: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.scene) {
      let id = decodeURIComponent(options.scene);
      this.setData({
        id,
      }, function() {
        this.getRankingDetail();
      })
    } else if (options.id) {
      this.setData({
        id: options.id,
      }, function() {
        this.getRankingDetail();
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
    if (app.globalData.checkLogin) {
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
   * 切换分享窗口
   */
  toggleShare() {
    this.setData({
      show: !this.data.show,
      move: false
    })
  },
  /**
   * 切换分享窗口
   */
  closeShare() {
    if (this.data.show) {
      this.setData({
        show: false,
      })
    }
  },
  /**
   * 关闭分享窗口
   */
  closeShareModel() {
    this.setData({
      showShare: false
    })
  },
  /**
   * 打开分享窗口
   */
  showQrCode() {
    this.setData({
      showShare: true,
      qrcode: true,
      sqcode: false
    })
  },
  /**
   * 打开分享窗口
   */
  openShareModel() {
    if (this.data.imgSrc) {
      this.setData({
        showShare: true,
        qrcode: false,
        sqcode: true
      });
    } else {
      this.getSPcode();
    }
  },
  /**
   * 获取榜单详情
   */
  getRankingDetail() {
    let that = this;
    app.request({
      url: app.root.getRankingDetail,
      data: {
        recGoId: this.data.id
      },
      success: function(res) {
        console.log(res);
        if (res.status === 200) {
          let ranking = res.data;
          ranking.formatTime = util.formatTime(ranking.createTime);
          ranking.price = ranking.quotePrice ? ranking.quotePrice * (100 + parseInt(ranking.ratio)) / 10000 : '';
          ranking.commentList = JSON.parse(ranking.comments);
          ranking.star = (ranking.star / 10).toFixed(1);
          ranking.weight = (ranking.weight / 10).toFixed(1)
          console.log(ranking);
          console.log(typeof ranking.comments);
          that.setData({
            ranking,
          }, function() {
            that.getFollowStatus();
          })
        };
      },
      complete: function() {
        that.setData({
          loadType: 2
        })
      }
    }, this.data.loadType);
  },
  /**
   * 获取收藏状态
   */
  getFollowStatus() {
    let that = this;
    app.request({
      url: app.root.getFollowStatus,
      data: {
        goodsId: this.data.ranking.goodsId,
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
          goodsId: this.data.ranking.goodsId,
          type: 1
        },
        success: function(res) {
          console.log(res);
          if (res.status === 200) {
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
   * 打开地图
   */
  showMap() {
    wx.openLocation({
      latitude: parseFloat(this.data.ranking.latitude),
      longitude: parseFloat(this.data.ranking.longitude),
      name: this.data.ranking.venueName,
      //address: this.data.detaliObj.venueName,
      scale: 18
    })
  },
  saveImgToPhotos: function() {
    let that = this;
    if (this.data.qrcode) {
      if (this.data.qrImgLoad) {
        that.saveCotroller(this.data.qrImgLoad);
      } else {
        wx.downloadFile({
          url: this.data.ranking.qrImg,
          success: function(res) {
            that.setData({
              qrImgLoad: res.tempFilePath
            });
            that.saveCotroller(res.tempFilePath);
          },
          fail: function() {
            console.log('qrImg load fail');
          }
        })
      };

    };
    if (this.data.sqcode) {
      let that = this;
      if (this.data.sqImgLoad) {
        that.saveCotroller(this.data.sqImgLoad);
      } else {
        wx.downloadFile({
          url: that.data.imgSrc,
          success: function(res) {
            console.log(res)
            that.setData({
              sqImgLoad: res.tempFilePath
            });
            that.saveCotroller(res.tempFilePath);
          },
          fail: function() {
            console.log('sqImg Load fail')
          }
        })
      }
    }
  },
  saveCotroller(url) {
    wx.saveImageToPhotosAlbum({
      filePath:url,
      success: function(res) {
        console.log(res)
      },
      fail: function(res) {
        console.log(res);
        Toast('请在“我的-设置”，开启保存相册功能');
      }
    })
  },
  getSPcode() {
    let that = this;
    Toast.loading({
      message: '获取分享码…',
      duration: 0
    })
    app.request({
      url: app.root.getSPcode,
      data: {
        recGoId: this.data.id
      },
      success: function(res) {
        Toast.clear();
        console.log(res);
        if (res.status === 200) {
          that.setData({
            showShare: true,
            imgSrc: res.data.img,
            sqcode: true,
            qrcode: false
          });
        }
      },
      fail: function() {

      },
      complete: function() {

      }
    });
  }
})