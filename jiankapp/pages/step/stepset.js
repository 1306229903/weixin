// pages/step/stepset.js
var app = getApp()
Page({


  data: {
  step:5000
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  listenerSlider: function (e) {
    var that=this
    wx.getStorage({
      key: 'phone',
      success: function (res) {
        that.setData({
          phone: res.data,
          step: e.detail.value
        })
        wx.request({
          url: app.host_url + 'testmb', //仅为示例，并非真实的接口地址
          header: {
            "Content-Type": "application/json"
          },
          method: 'POST',
          data: {
            'step': that.data.step,
            'phone': that.data.phone
          },
          success: function (res) {

        if(res.data[0].info){
          wx.showToast({
            icon: "success",
            title: "设置成功",
            duration: 1000
          })
          setTimeout(function () {
            wx.navigateBack({
              url: '/pages/step/step'
            })
          }, 2000)
        }


          }
        })
      }
    })
  
    
 

  },


  
})