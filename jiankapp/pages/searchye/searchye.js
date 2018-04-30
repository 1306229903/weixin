
var app = getApp()
Page({
  data: {
    article: null,
    condition: '',
  },
  //详情页
  content: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/content/content?id=' + id,
    })
  },
  setCondition: function (e) {
    var conn = e.detail.value;
    this.setData({
      condition: conn
    })
  },
  serach: function (e) {
    var that = this

    wx.request({
      url: app.host_url + 'returnSerach', //仅为示例，并非真实的接口地址
      header: {
        "Content-Type": "application/json"
      },
      method: 'POST',
      data: {
        'condition': that.data.condition
      },
      success: function (res) {
        
        if (res.data.length != 0) {
          that.setData({
            article: res.data,
          })
        }else{
          wx.showModal({
            title: '暂无该信息',
            content: '请重新输入查询信息',
          })
        }

      }
    })
  },
  onLoad() {
    var that = this
    wx.request({
      url: app.host_url + 'returnSerach', //仅为示例，并非真实的接口地址
      header: {
        "Content-Type": "application/json"
      },
      method: 'POST',
      data: {
        'condition': that.data.condition
      },
      success: function (res) {

        if (res.data.length != 0) {
          that.setData({
            article: res.data,
          })
        } 

      }
    })


  },

})