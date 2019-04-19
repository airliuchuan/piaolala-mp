const app = getApp();
// components/city/city.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    top: {
      type: Number,
      value: 0
    },
    currentCity: {
      type: String,
      value: '北京'
    },
    cityId: {
      type: Number,
      value: 2
    },
    cityCode: {
      type: String,
      value: '110100'
    },
    modelKey: {
      type: Number,
      value: 0
    },
    show: {
      type: Boolean,
      value: false
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    searchLetter: []
  },
  attached() {
    //获取城市列表
    this.getCityList();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //设置界面布局信息
    setCityShow() {
      var searchList = this.data.cityList;
      var sysInfo = wx.getSystemInfoSync();
      //console.log(sysInfo);
      var winWidth = sysInfo.windowWidth;
      var winHeight = sysInfo.windowHeight - this.data.top * (winWidth / 750);


      //添加要匹配的字母范围值
      //1、更加屏幕高度设置子元素的高度
      var itemH = winHeight / searchList.length;
      var tempObj = [];
      for (var i = 0; i < searchList.length; i++) {
        var temp = {};
        temp.name = searchList[i].initial;
        temp.tHeight = i * itemH;
        temp.bHeight = (i + 1) * itemH;

        tempObj.push(temp)
      }

      this.setData({
        winHeight,
        winWidth,
        itemH: itemH,
        searchLetter: tempObj,
      })
    },
    //获取城市列表
    getCityList() {
      let that = this;
      app.request({
        url: app.root.getCityList,
        success: function(res) {
          console.log(res);
          if (res.status === 200) {
            that.setData({
              hotCitys: res.data.hot,
              cityList: that.formatCityArr(res.data.city)
            });
            //组建布局配置
            that.setCityShow();
          };
        },
        complete: function() {}
      });
    },
    //数组格式化城市数据
    formatCityArr: function(obj) {
      var newArr = []
      for (var key in obj) {
        newArr.push({
          initial: key,
          cityInfo: obj[key]
        })
      }
      //console.log(newArr)
      return newArr
    },
    searchStart: function(e) {
      var showLetter = e.currentTarget.dataset.letter;
      var pageY = e.touches[0].pageY;
      this.setScrollTop(this, showLetter);
      this.nowLetter(pageY, this);
      this.setData({
        showLetter: showLetter,
        startPageY: pageY,
        isShowLetter: true,
      })
    },
    searchMove: function(e) {
      var pageY = e.touches[0].pageY;
      var startPageY = this.data.startPageY;
      var tHeight = this.data.tHeight;
      var bHeight = this.data.bHeight;
      var showLetter = 0;
      console.log(pageY);
      if (startPageY - pageY > 0) { //向上移动
        if (pageY < tHeight) {
          // showLetter=this.mateLetter(pageY,this);
          this.nowLetter(pageY, this);
        }
      } else { //向下移动
        if (pageY > bHeight) {
          // showLetter=this.mateLetter(pageY,this);
          this.nowLetter(pageY, this);
        }
      }
    },
    searchEnd: function(e) {
      // console.log(e);
      // var showLetter=e.currentTarget.dataset.letter;
      var that = this;
      setTimeout(function() {
        that.setData({
          isShowLetter: false
        })
      }, 1000)

    },
    nowLetter: function(pageY, that) { //当前选中的信息
      var letterData = this.data.searchLetter;
      var bHeight = 0;
      var tHeight = 0;
      var showLetter = "";
      for (var i = 0; i < letterData.length; i++) {
        if (letterData[i].tHeight <= pageY && pageY <= letterData[i].bHeight) {
          bHeight = letterData[i].bHeight;
          tHeight = letterData[i].tHeight;
          showLetter = letterData[i].name;
          break;
        }
      }

      this.setScrollTop(that, showLetter);

      that.setData({
        bHeight: bHeight,
        tHeight: tHeight,
        showLetter: showLetter,
        startPageY: pageY
      })
    },
    setScrollTop: function(that, showLetter) {
      var scrollTop = 0;
      var cityList = that.data.cityList;
      var cityCount = 0;
      var initialCount = 0;
      for (var i = 0; i < cityList.length; i++) {
        if (showLetter == cityList[i].initial) {
          scrollTop = initialCount * 30 + cityCount * 41;
          break;
        } else {
          initialCount++;
          cityCount += cityList[i].cityInfo.length;
        }
      }
      that.setData({
        scrollTop: scrollTop
      })
    },
    wxSortPickerViewItemTap: function(e) {
      let city = {
        cityId: e.currentTarget.dataset.citynum,
        currentCity: e.currentTarget.dataset.text,
        cityCode: e.currentTarget.dataset.citycode,
        index: this.data.modelKey
      }
      this.setData(city);
      //可以跳转了
      console.log('选择了城市：', e);
      this.triggerEvent('changeItem', city);
    },
    close() {
      let city = {
        cityId: this.data.cityId,
        currentCity: this.data.currentCity,
        cityCode: this.data.cityCode,
        index: this.data.modelKey
      };
      //可以跳转了
      console.log('选择了城市：', city);
      this.triggerEvent('changeItem', city);
    }
  },
})