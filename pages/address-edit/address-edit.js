// pages/address-edit/address-edit.js
const app = getApp();
import Dialog from '../../components/vant/dialog/dialog';
import Notify from '../../components/vant/notify/notify';
import Toast from '../../components/vant/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    provinceName: '北京市',
    cityName: '北京市',
    countyName: '东城区',
    provinceCode: 110000,
    cityCode: 110100,
    countyCode: 110101,
    value: [0, 0, 0]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      openType: options.openType || null
    })
    if (options.addressId) {
      wx.setNavigationBarTitle({
        title: '修改地址',
      })
      this.setData({
        addressId: options.addressId
      });
      this.getAddressInfo(options.addressId);
    } else {
      this.getAreas();
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
   * 用户名验证
   */
  userFocus() {
    this.setData({
      userError: false
    })
  },
  userBlur(e) {
    console.log(e);
    if (!e.detail.detail.value) {
      this.setData({
        userError: true
      })
    }
  },
  /**
   * 手机号验证
   */
  phoneFocus() {
    this.setData({
      phoneError: ''
    })
  },
  phoneBlur(e) {
    if (!app.check.phone.test(e.detail.detail.value)) {
      this.setData({
        phoneError: '手机号格式错误'
      })
    }
  },
  /**
   * 选择城市
   */
  toggleBottomPopup() {
    this.setData({
      showCityModel: !this.data.showCityModel
    })
  },
  /**
   * 用户详细地址验证
   */
  detailAdrFocus() {
    this.setData({
      detailAdrError: false
    })
  },
  detailAdrBlur(e) {
    if (!e.detail.detail.value) {
      this.setData({
        detailAdrError: true
      })
    }
  },
  /**
   * 获取表单数据
   */
  formSubmit(e) {
    let subValue = e.detail.value;
    subValue.status = subValue.status[0] ? subValue.status[0] : 2;
    subValue.provinceId = this.data.provinceCode;
    subValue.cityId = this.data.cityCode;
    subValue.countyId = this.data.countyCode;
    console.log(subValue);
    if (subValue.receiverName && app.check.phone.test(subValue.phone) && subValue.detailedAddress) {
      if (this.data.addressId) {
        subValue.addressId = this.data.addressId;
        this.editAddress(subValue);
      } else {
        this.addAddress(subValue);
      }
    } else {
      Notify({
        text: '请完善信息',
        duration: 1500
      });
    }
  },
  /**
   * 获取所有省市列表
   */
  getAreas: function(addressId) {
    let that = this;
    app.request({
      url: app.root.getAllCityList,
      success: function(res) {
        //console.log(res);
        if (res.status === 200) {
          let myCityList = [];
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].parentCode == 0) {
              myCityList.push(res.data[i]);
            } 
          };
          for (let i = 0; i < myCityList.length; i++) {
            myCityList[i].citys = [];
            for (let j = 0; j < res.data.length; j++) {
              if (myCityList[i].code == res.data[j].parentCode) {
                myCityList[i].citys.push(res.data[j]);
              } 
            }
          };
          for (let i = 0; i < myCityList.length; i++) {
            for (let j = 0; j < myCityList[i].citys.length; j++) {
              myCityList[i].citys[j].areas = [];
              for (let k = 0; k < res.data.length; k++) {
                if (myCityList[i].citys[j].code == res.data[k].parentCode) {
                  myCityList[i].citys[j].areas.push(res.data[k]);
                }
              }
            }
          }
          console.log(myCityList);
          that.setData({
            provinces: myCityList,
            citys: myCityList[0].citys,
            areas: myCityList[0].citys[0].areas,
          })
          if (addressId) {
            let obj = {};
            for (let i = 0; i < myCityList.length; i++) {
              if (myCityList[i].code == that.data.provinceCode) {
                obj.provinceName = myCityList[i].name;
                obj.citys = myCityList[i].citys;
                for (let j = 0; j < myCityList[i].citys.length; j++) {
                  if (myCityList[i].citys[j].code == that.data.cityCode) {
                    obj.cityName = myCityList[i].citys[j].name;
                    obj.areas = myCityList[i].citys[j].areas;
                    for (let k = 0; k < myCityList[i].citys[j].areas.length; k++) {
                      if (myCityList[i].citys[j].areas[k].code == that.data.countyCode) {
                        obj.countyName = myCityList[i].citys[j].areas[k].name
                        obj.value = [i, j, k]
                      }
                    }
                  }
                }
              }
            };
            that.setData(obj);
          }
        };
      },
      complete: function() {
        wx.hideLoading();
      }
    });
  },
  /**
   * 滑动选择城市
   */
  cityChange: function(e) {
    var value = e.detail.value
    var provinces = this.data.provinces
    var citys = this.data.citys
    var areas = this.data.areas
    var provinceNum = value[0]
    var cityNum = value[1]
    var countyNum = value[2]
    let obj = {};
    if (this.data.value[0] != provinceNum) {
      obj = {
        value: [provinceNum, 0, 0],
        citys: provinces[provinceNum].citys,
        areas: provinces[provinceNum].citys[0].areas,
        provinceCode: provinces[provinceNum].code,
        provinceName: provinces[provinceNum].name,
        cityCode: provinces[provinceNum].citys[0].code,
        cityName: provinces[provinceNum].citys[0].name,
        countyCode: provinces[provinceNum].citys[0].areas[0].code,
        countyName: provinces[provinceNum].citys[0].areas[0].name,
      }
    } else if (this.data.value[1] != cityNum) {
      obj = {
        value: [provinceNum, cityNum, 0],
        areas: citys[cityNum].areas,
        cityCode: citys[cityNum].code,
        cityName: citys[cityNum].name,
        countyCode: citys[cityNum].areas[0].code,
        countyName: citys[cityNum].areas[0].name,
      };
    } else {
      obj = {
        value: [provinceNum, cityNum, countyNum],
        countyCode: areas[countyNum].code,
        countyName: areas[countyNum].name,
      };
    }
    this.setData(obj);
  },
  /**
   * 获取地址信息
   */
  getAddressInfo(addressId) {
    let that = this;
    Toast.loading({
      message: '地址加载中…',
      duration: 0
    })
    app.request({
      url: app.root.getAdrInfo,
      data: {
        addressId,
      },
      success: function(res) {
        console.log(res);
        if (res.status === 200) {
          that.setData({
            receiverName: res.data.receiverName,
            phone: res.data.phone,
            provinceCode: res.data.provinceId,
            cityCode: res.data.cityId,
            countyCode: res.data.countyId,
            detailedAddress: res.data.detailedAddress,
            status: res.data.status,
          });
          that.getAreas(addressId);
        }
      },
      complete: function() {
        Toast.clear();
      }
    });
  },
  /**
   * 添加地址
   */
  addAddress(obj) {
    let that = this;
    app.request({
      url: app.root.addAddress,
      data: obj,
      success: function(res) {
        console.log(res);
        if (res.status === 200) {
          Toast.success('添加成功');
          if(that.data.openType == 2){
            app.globalData.adrAdded = true;
          }
          setTimeout(() => {
            wx.navigateBack();
          }, 500);
        } else if (res.status == 410) {
          Dialog.alert({
            message: '登录已失效，请重新登录',
          }).then(() => {
            wx.navigateTo({
              url: '/pages/login/login?type=addressEdit',
            });
          });
        } else {
          Toast(res.message);
        }
      },
      complete: function() {

      }
    });
  },
  /**
   * 修改地址
   */
  editAddress(obj) {
    let that = this;
    app.request({
      url: app.root.editAddress,
      data: obj,
      success: function(res) {
        console.log(res);
        if (res.status === 200) {
          Toast.success('修改成功');
          setTimeout(() => {
            wx.navigateBack();
          }, 500)
        } else if (res.status == 410) {
          Dialog.alert({
            message: '登录已失效，请重新登录',
          }).then(() => {
            wx.navigateTo({
              url: '/pages/login/login?type=addressEdit',
            });
          });
        } else {
          Toast(res.message);
        }
      },
      complete: function() {

      }
    });
  }
})