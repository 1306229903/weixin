//index.js
//获取应用实例
var app = getApp()

var load=function(that){
  wx.request({
    url: app.host_url + 'returnPost', //仅为示例，并非真实的接口地址
    header: {
      "Content-Type": "application/json"
    },
    method: "POST",
    data: that.data,
    success: function (res) {
      var temp = []
      var san = []
      var index = that.data.index + 3;
      var disgui = 0
      if (res.data[0].disgui){
        disgui=res.data.length
      }else{
         disgui=3
      }
      for (var i = 0; i < disgui ; i++) {
        temp.push(res.data[i])
      }
      that.setData({
        article: temp,
        all: res.data,
        index: index,
      })
      if (res.data.length<3){
        that.setData({
          isHideLoadMore: true,
          isHideLoadMore2: false,
        })
      }
    }
  })
}

Page({
  // 页面初始数据
  data: {
    currentTab: -1 ,
    colors: ['red', 'orange', 'yellow', 'green', 'purple'],
    // swiper 初始化
    // banner_url: fileData.getBannerData(),
    indicatorDots: true,
    indicatoractivecolor: "#fff",
    vertical: false,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    article: null,
    all: null,
    san: null,
    index: 0,
    isHideLoadMore: false,
    isHideLoadMore2: true,
    category: [
      {
        text: "养生",

      },
      {
        text: "营养",

      },
      {
        text: "精神心理",

      },
      {
        text: "中医",

      }, {
        text: "减肥",

      }, {
        text: "美容",

      },
      {
        text: "健康新闻",

      },
      {
        text: "微生活",

      }

    ],

  },
  //详情页
  content: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/content/content?id='+id,
    })
  },
  //搜索页
  searchye: function () {
    wx.navigateTo({
      url: '/pages/searchye/searchye',
    })
  },
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx,
      article: null,
      all: null,
      index: 0,
    })
    var that=this
    load(that)

  },
  onLoad() {
    var that = this
    wx.request({
      url: app.host_url + 'returnPosts', //仅为示例，并非真实的接口地址
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        that.setData({
          san:res.data
        })
      }
    })
    load(that)
  },

  //下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载

    //模拟加载
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1000);
  },
  //上拉加载
  onReachBottom: function () {

    var index = this.data.index
    var all = this.data.all
    var article = this.data.article

    for (var i = index; i < index + 3; i++) {
      if (i < all.length) {
        article.push(all[i])

      } else {
        this.setData({
          isHideLoadMore: true,
          isHideLoadMore2: false,
        })

      }

    }


      this.setData({
        article: article,
        index: index + 3,


      })
    


  }

})
