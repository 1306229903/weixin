// pages/sethelp/sethelp.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  exit: function () {
    wx.setStorage({
      key: 'phone',
      data: ''
    }),
      wx.removeStorage({
        key: 'islike',
      })
    setTimeout(function () {
      wx.navigateBack({})
    }, 1000)
  
   
  },
 
})