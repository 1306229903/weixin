
var app = getApp()
Page({
  data: {
    sign: 0,
    phone: "",
    angle:'',
    moneyused:0,
    moneyusing:0,
    cash:0

  },
  onLoad(){
    this.$wuxToast = app.wux(this).$wuxToast
  },
  onShow() {
    var that = this
    wx.getStorage({
      key: 'phone',
      success: function (res) {
        that.setData({
          phone: res.data,

        }),
          wx.request({
            url: app.host_url + 'deposit',
            header: {
              "Content-Type": "application/json"
            },
            method: 'POST',
            data: that.data,
            success: function (res) {
              that.setData({
                moneyused: res.data[1].moneyused,
                sign: res.data[1].money,
                cash: res.data[1].cash.toFixed(2)

              })
            }
          })
        // wx.onAccelerometerChange(function (res) {
        //   var angle = -(res.x * 30).toFixed(1);
        //   if (angle > 14) { angle = 14; }
        //   else if (angle < -14) { angle = -14; }
        //   if (that.data.angle !== angle) {
        //     that.setData({
        //       angle: angle
        //     });
        //   }
        // });

      }

    })


  },
  tixian:function(){
    var that = this
    wx.showActionSheet({
      itemList: ['500', '1000', '2000','5000','自定义'],
      success: function (res) {
        if (res.tapIndex==4){
          wx.navigateTo({
            url: '/pages/money/deposit'
          })
        }else{
          if (!res.cancel) {
            if (res.tapIndex == 0) {
              that.setData({
                moneyusing: 500
              })

            }
            if (res.tapIndex == 1) {
              that.setData({
                moneyusing: 1000
              })

            }
            if (res.tapIndex == 2) {
              that.setData({
                moneyusing: 2000
              })
            }
            if (res.tapIndex == 3) {
              that.setData({
                moneyusing: 5000
              })
            }
            wx.showModal({
              title: '提示',
              confirmColor: "#426ab3",
              content: '确认提现？',
              success: function (res) {
                if (res.confirm) {
                 
                  wx.request({
                    url: app.host_url + 'deposit',
                    header: {
                      "Content-Type": "application/json"
                    },
                    method: 'POST',
                    data: that.data,
                    success: function (res) {
                      if (res.data[0].informa) {
                       
                        that.setData({
                          moneyused: res.data[1].moneyused,
                          sign: res.data[1].money,
                          cash: res.data[1].cash.toFixed(2)

                        })
                      } else {
                        wx.showModal({
                          title: '提示',
                          content: '金币数不足或者不满2000',
                          showCancel: false,
                          confirmColor: "#426ab3",
                          success: function (res) {
                       
                          }
                        })
                      }

                    }
                  })
                } 
              }
            })
           
            // console.log(res.tapIndex)
          }
        }
        
      }
    });
  }
  


})
