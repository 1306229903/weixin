// pages/record/my.js
var app = getApp()
Page({

  data: {
    date: "2000-01-01",
    sex: '1',
    realname: '',
    phone: ''
  },
  radioChange: function (e) {
    var that= this
    that.setData({
      sex: e.detail.value
    })
   
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  nameChange: function (e) {
    this.setData({
      realname: e.detail.value
    })
  },

  onLoad: function () {
    var that = this
    wx.getStorage({
      key: 'phone',
      success: function (res) {
        that.setData({
          phone: res.data,
        })
        wx.request({
          url: app.host_url + 'recordcha', //仅为示例，并非真实的接口地址
          header: {
            "Content-Type": "application/json"
          },
          method: 'POST',
          data: that.data,
          success: function (res) {
            that.setData({
              date: res.data[0].date,
              sex: res.data[0].sex,
              realname: res.data[0].realname
            })
          

          }
        })
      }

    })
     
  },
  save: function () {
    var that = this
    wx.request({
      url: app.host_url + 'record',
      header: {
        "Content-Type": "application/json"
      },
      method: 'POST',
      data: that.data,
      success: function (res) {
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 1000
        })
      }
    })
  }
})