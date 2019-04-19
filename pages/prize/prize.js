// pages/przie/przie.js
import Toast from '../../components/vant/toast/toast';
const app = getApp()
Page({
  data: {
    rouletteData: {
      speed: 10,
      /**转盘速度 */
      /**奖项内容 */
      fontColor: '#e21b58',
      /**文字颜色 */
      font: '12px Arial',
      bgOut: '#b136b9',
      /**外层 */
      bgMiddle: '#ffc046',
      /**中间层 */
      bgInner: ['#fff2ca', '#fdd890', '#fff2ca', '#fdd890', '#fff2ca', '#fdd890'],
      speedDot: 1000,
      /**点切换速度 */
      dotColor: ['#FE4D32', '#FFDF2F'],
      dotColor_1: ['#FE4D32', '#FFDF2F'],
      dotColor_2: ['#FFDF2F', '#FE4D32'],
      angel: 0 /**选择角度 */
    },
    lotteryNum: 0,
    isRunning: false,
    loadType: 1
  },
  onLoad: function() {
    this.getPrizeInfo();
  },
  onShareAppMessage(){
    let that = this;
    return {
      title: this.data.rouletteData.fontColor,
      path: 'pages/prize/prize',
      success(){
        that.addPrizeCount(2);
      }
    }
  },
  getPrizeInfo() {
    let that = this;
    app.request({
      url: app.root.getPrizeInfo,
      data:{
        activityId:1
      },
      success: function(res) {
        console.log(res);
        if (res.status === 200) {
          let prize = res.data.prize;
          let award = [];
          for (let i in prize) {
            award.push({
              rid: i,
              level: prize[i]
            })
          }
          that.setData({
            'rouletteData.award': award,
            lotteryNum: res.data.total_num
          })
        } else if (res.status == 410) {
          Toast.fail('请先登录');
          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/login/login?type=prize',
            })
          }, 1000);
        }
      },
      complete: function() {
        that.setData({
          loadType: 2
        }) 
      }
    },this.data.loadType);
  },
  getAngel(e) {
    var that = this;
    if (that.data.isRunning) return;
    let lotteryNum = that.data.lotteryNum;
    if (lotteryNum > 0) {
      app.request({
        url: app.root.getPrize,
        success: function(res) {
          console.log(res);
          if (res.status === 200) {
            let index;
            for (let i = 0; i < that.data.rouletteData.award.length; i++) {
              if (res.data.prizeId == that.data.rouletteData.award[i].rid) {
                index = i;
                break;
              };
            }
            let randNum = that.getRandNum(index);
            console.log(randNum);
            that.setData({
              angel: randNum,
              isRunning: true,
              prize: res.data.przieName
            })
          } else if (res.status == 410) {
            Toast.fail('请先登录');
            setTimeout(() => {
              wx.redirectTo({
                url: '/pages/login/login?type=prize',
              })
            }, 1000);
          } else {
            wx.showToast({
              title: res.message,
              icon: 'none'
            })
          }
        },
        complete: function() {}
      });
    } else {
      wx.showToast({
        title: '暂无抽奖机会啦~',
        icon: 'none'
      })
    }
  },
  getPrize(e) {
    var that = this;
    let angel = that.data.angel;
    let index = parseInt(that.data.angel / 60);
    let lotteryNum = that.data.lotteryNum;
    lotteryNum--;
    wx.showModal({
      title: '本次抽奖结果',
      content: that.data.prize,
      showCancel: false,
      success: function(res) {
        that.setData({
          index: index,
          lotteryNum: lotteryNum,
          isRunning: false
        })
      }
    })
  },
  getRandNum(num) {
    let randNum = Math.floor((num + (Math.random() * 8 + 1) / 10) * 60);
    if (randNum === this.data.angel) {
      this.getRandNum(num);
    } else {
      return randNum;
    }
  },
  addPrizeCount(type) {
    let that = this;
    app.request({
      url: app.root.addPrizeCount,
      data: {
        type,
      },
      success: function(res) {
        console.log(res);
        if (res.status === 200) {
          that.setData({
            lotteryNum: res.data.total_num
          })
        } else if (res.status == 410) {
          Toast.fail('请先登录');
          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/login/login?type=prize',
            })
          }, 1000);
        }
      },
      complete: function() {}
    });
  }
})