//app.js
import Toast from 'components/vant/toast/toast';
const root = require('utils/interface.js');
var sign = require('/utils/sign.js');
const {
  $Toast
} = require('components/i-view/base/index');
App({
  root: root.root, //接口文档
  onLaunch: function() {
    var sysInfo = wx.getSystemInfoSync();
    //检查版本
    if (sysInfo.version.split('.')[0] < 6) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      });
    }

    //获取屏幕信息
    this.globalData.winWidth = sysInfo.windowWidth;
    this.globalData.winHeight = sysInfo.windowHeight;
    this.globalData.setUnit = sysInfo.windowWidth / 750;

    //判断用户是否登录
    if (wx.getStorageSync('tokens'))
      this.globalData.checkLogin = true;

    this.getAreas();
    
  },
  globalData: {
    userInfo: null,
    checkLogin: false
  },
  /**
   * 验证格式
   */
  check: {
    phone: /^1[3456789]\d{9}$/,
    time: /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/,
  },
  /**
   * 获取数据
   */
  request: function(object, loadType) {
    console.log(object);
    if (loadType == 1) {
      $Toast({
        image: '/images/loading.gif',
        duration: 0,
        mask: true
      });
    }
    wx.request({
      url: object.url,
      header: {
        'Content-Type': 'application/json',
        //"Content-Type": "application/x-www-form-urlencoded",
        'Tokens': wx.getStorageSync('tokens') || '',
        //'APPID': 1,
        'Sign': sign.setSign(Date.parse(new Date()) / 1000),
        'Timestamp': Date.parse(new Date()) / 1000
      },
      data: object.data || {},
      method: object.method || "POST",
      dataType: object.dataType || "json",
      success: function(res) {
        console.log(res);
        if (res.statusCode && res.statusCode != 200) {
          wx.showToast({
            title: '没有网络了~',
            image: '/images/wifi_error.png',
          });
          return;
        };
        if (object.success)
          object.success(res.data);
      },
      fail: function(res) {
        wx.showToast({
          title: '没有网络了~',
          image: '/images/wifi_error.png',
        });
        if (object.fail)
          object.fail(res);
      },
      complete: function(res) {
        if (loadType == 1) {
          //setTimeout(function() {
          $Toast.hide();
          //}, 1000)
        }
        if (object.complete)
          object.complete(res);
      }
    });
  },
  /**
   * 存储storage
   */
  setStorage: function(obj) {
    if (obj) {
      for (let key in obj) {
        if (obj[key])
          wx.setStorageSync(key, obj[key]);
      }
    }
  },
  /**
   * 通过百度api获取地理位置
   */
  getCityLocation(page) {
    let that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        wx.request({ // ②百度地图API，将微信获得的经纬度传给百度，获得城市等信息
          url: 'https://api.map.baidu.com/geocoder/v2/?ak=fPhAprl10Utf9oqGFTICVHNLC4bIGOYL&location=' + latitude + ',' + longitude + '&output=json&coordtype=wgs84ll',
          header: {
            'Content-Type': 'application/json'
          },
          success: function(res) {
            console.log(res)
            let baiduCode = res.data.result.cityCode
            that.request({
              url: that.root.getCityList,
              success: function(res) {
                console.log(res);
                console.log('=========================')
                if (res.status === 200) {
                  let baiduJson = {}
                  let citys = res.data.city;
                  for (let i in citys) {
                    for (let k in citys[i]) {
                      baiduJson[citys[i][k].baiduCode] = {
                        cityName: citys[i][k].cityName,
                        cityCode: citys[i][k].cityCode
                      };
                    };
                  };
                  if (baiduJson[baiduCode]) {
                    let obj = {
                      currentCity: baiduJson[baiduCode].cityName,
                      cityCode: baiduJson[baiduCode].cityCode
                    }

                    that.globalData.city = obj;
                    page.setData(obj, function() {
                      page.getRankingList();
                      page.getBannerList();
                    })
                  }
                };
              },
              complete: function() {}
            });
            // that.globalData.city = obj;
            // page.setData(obj);
          },
          fail: function(res) {
            console.log(res);
          },
          complete: function(res) {
            console.log(res);
            // complete
          }
        })
      },
      fail: function(res) {

      }
    });
  },
  /**
   * 用户请求登陆
   */
  sendUserInfo: function(obj) {
    Toast.loading({
      message: '登录中…',
      duration: 0
    });
    let that = this;
    that.request({
      url: that.root.login,
      data: obj.data,
      success: function(res) {
        Toast.clear();
        console.log(res);
        if (res.status === 200) {
          that.setStorage(res.data);
          that.globalData.checkLogin = true;
          if (obj.success)
            obj.success(res.data);
        } else {
          Toast(res.message);
        }
      },
      fail: function() {
        Toast.clear();
      },
      complete: function() {

      }
    });
  },
  /**
   * 获取所有省市列表
   */
  getAreas: function(obj) {
    let that = this;
    this.request({
      url: this.root.getAllCityList,
      success: function(res) {
        console.log(res);
        if (res.status === 200) {
          let cityList = {};
          for (let i = 0; i < res.data.length; i++) {
            cityList[res.data[i].code] = res.data[i].name;
          };
          that.globalData.cityList = cityList;
          if (obj) {
            obj.page.setData({
              cityList
            });
            if (obj.success)
              obj.success();
          }
        };
      },
      complete: function() {}
    });
  },
})