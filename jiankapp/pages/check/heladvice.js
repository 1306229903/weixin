// pages/check/heladvice.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  temp:[]
  },


  onLoad: function (options) {
  this.setData({
    temp: options.content,
  })
  },

 

})