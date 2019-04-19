// pages/order-confirm/order-confirm.js
const json = require('../../utils/json.js');
import Dialog from '../../components/vant/dialog/dialog';
import Toast from '../../components/vant/toast/toast';
const app = getApp();
Page({
  /**
   * 订单提交控制
   */
  createOrderControl: {
    click: true,
    time: 5000,
    create: true
  },

  /**
   * 页面的初始数据
   */
  data: {
    deliverTypeJson: {
      '1': '快递取票',
      '2': '上门自取',
      '3': '现场取票',
      '5': '电子票'
    },
    loadType: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.id) {
      options.business = decodeURIComponent(options.business);
      console.log(decodeURIComponent(options.business));
      this.setData(options, function() {
        if (app.globalData.cityList) {
          this.setData({
            cityList: app.globalData.cityList
          });
          this.getSettlementInfo();
        } else {
          this.getAreas();
        }
      });
      options.type = 'orderConfirm';
      this.setData({
        params: json.jsonToUrl(options)
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
    if (app.globalData.adrChanged) {
      this.setData({
        address: app.globalData.addressInfo
      });
      app.globalData.adrChanged = false;
    };
    if (app.globalData.adrAdded) {
      app.globalData.adrAdded = false;
      this.getSettlementInfo();
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
   * 获取订单生成数据
   * deliverTypes 1快递 2自取 3现场自取 5电子票 
   */
  getSettlementInfo() {
    let that = this;
    app.request({
      url: app.root.settlement,
      data: {
        goodsId: this.data.id,
        priceId: this.data.priceId
      },
      success: function(res) {
        console.log(res);
        if (res.status === 200) {
          res.data.amount = parseInt(that.data.total);
          res.data.deliverType = res.data.price.deliverType[0];
          res.data.receiverName = res.data.address.receiverName;
          res.data.phone = res.data.address.phone;
          for (let i = 0; i < res.data.price.deliverType.length; i++) {
            if (res.data.price.deliverType[i] == 1) {
              if (res.data.price.isExpress == 1) {
                res.data.deliverType = 1;
                res.data.amount = parseInt(that.data.total) + 10
              } else {
                res.data.deliverType = res.data.price.deliverType[1];
              }
            }
          };
          that.setData(res.data);
        } else if (res.status == 410) {
          Dialog.alert({
            message: '登录已失效，请重新登录',
          }).then(() => {
            console.log(that.data.params);
            wx.redirectTo({
              url: `/pages/login/login?${that.data.params}`,
            });
          });
        } else {
          Toast(res.message);
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
   * 获取所有省市列表
   */
  getAreas: function() {
    let that = this;
    app.getAreas({
      page: that,
      success() {
        that.getSettlementInfo();
      }
    })
  },
  /**
   * 选择取票方式
   */
  changeDeliverType: function(e) {
    let type = e.currentTarget.dataset.type;
    if (this.data.deliverType != type) {
      this.setData({
        deliverType: type,
        amount: type == 1 ? parseInt(this.data.total) + 10 : parseInt(this.data.total)
      })
    }
  },
  /**
   * 生成订单
   */
  createOrder() {
    console.log(this.data.deliverType);
    let that = this;
    if (this.createOrderControl.create) { //首次点击未创建订单
      if (this.createOrderControl.click) {
        let obj = {
          goodsId: this.data.id,
          priceId: this.data.priceId,
          count: parseInt(this.data.num),
          amount: parseInt(this.data.amount * 100),
          deliverType: this.data.deliverType,
          payType: 1, //1 微信 2 支付宝
        };
        if (this.data.deliverType == 1) {
          //判断地址
          if (!this.data.address) {
            Toast.fail('请设置地址');
            return;
          };

          obj.addressId = this.data.address.addressId;
        } else {
          if (!this.data.receiverName) {
            Toast.fail('请输入用户名');
            return;
          };
          if (!app.check.phone.test(this.data.phone)) {
            Toast.fail('请输入手机号');
            return;
          };

          obj.receiverName = this.data.receiverName;
          obj.phone = this.data.phone
        }


        //禁用用户点击 
        this.createOrderControl.click = false;

        app.request({
          url: app.root.creatOrder,
          data: obj,
          success: function(res) {
            console.log(res);
            if (res.status === 200) {
              setTimeout(() => { //重置点击事件
                that.createOrderControl.click = true;
              }, that.createOrderControl.time);
              //获取订单号
              that.setData({
                orderNum: res.data.orderNum
              }, function() {
                that.pay(); //调用支付
              })
            } else {
              that.createOrderControl.click = true; //重置点击事件
              if (res.status == 410) {
                Dialog.alert({
                  message: '登录已失效，请重新登录',
                }).then(() => {
                  wx.navigateTo({
                    url: `/pages/login/login?type=pay`,
                  });
                });
              } else if (res.status == 510) {
                Toast.fail(res.message);
              } else if (res.status == 512) {
                Dialog.alert({
                  message: res.message,
                }).then(() => {
                  let pages = getCurrentPages();
                  let prevPage = pages[pages.length - 2];
                  prevPage.getPlanList();
                  wx.navigateBack();
                });
              } else {
                Toast(res.message);
              }
            }
          },
          fail: function() {
            that.createOrderControl.click = true; //重置点击事件
          },
          complete: function() {

          }
        });
      } else { //用户连续点击操作 默认 time:5s
        Toast.fail('订单生成中…');
      }
    } else { //订单已经创建,直接支付
      that.pay();
    }
  },

  /**
   * 支付
   */
  pay() {
    let that = this;
    app.request({
      url: app.root.pay,
      data: {
        openid: wx.getStorageSync('openId'),
        orderNum: that.data.orderNum
      },
      success: function(res) {
        console.log(res);
        if (res.status === 200) {
          let wechatData = res.data;
          wx.requestPayment({
            'timeStamp': wechatData.timeStamp,
            'nonceStr': wechatData.nonceStr, //随机字符串，长度为32个字符以下。
            'package': wechatData.package, //
            'signType': wechatData.signType, //
            'paySign': wechatData.paySign, //
            'success': function(res) { //支付成功
              console.log('success');
              wx.redirectTo({
                url: '/pages/pay-success/pay-success?deliverType=' + that.data.deliverType + '&orderNum=' + that.data.orderNum
              })
            },
            'fail': function(res) { //取消支付
              console.log('fail');
              wx.redirectTo({
                url: '/pages/order-list/order-list'
              })
            },
            'complete': function(res) {
              console.log(res);
              that.createOrderControl.create = false;
            }
          });
        } else if (res.status == 201) {
          wx.redirectTo({
            url: `/pages/order-list/order-list?status=2`,
          });
        } else {
          that.createOrderControl.create = false; //禁用创建订单
          if (res.status == 410) {
            Dialog.alert({
              message: '登录已失效，请重新登录',
            }).then(() => {
              wx.navigateTo({
                url: `/pages/login/login?type=pay`,
              });
            });
          } else {
            Toast(res.message);
          }
        }
      },
      fail: function() {
        that.createOrderControl.create = false; //禁用创建订单
      },
      complete: function() {

      }
    });
  },
  /**
   * 获取用户手机号
   */
  phoneConfirm(e) {
    if (app.check.phone.test(e.detail.value)) {
      this.setData({
        phone: e.detail.value
      })
    } else {
      Toast('请输入正确的手机号');
    }
  },
  /**
   * 获取用户名
   */
  userConfirm(e) {
    if (e.detail.value) {
      this.setData({
        receiverName: e.detail.value
      })
    } else {
      Toast('请输入用户名');
    }
  }
})