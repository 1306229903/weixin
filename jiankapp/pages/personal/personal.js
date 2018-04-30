
var app = getApp()


Page({
  onShareAppMessage: function (res) {
    return {
      title: '康动我心',
      path: '/page/personal/personal',
      imageUrl:'/images/app.png',
      success: function (res) {
        console.log(1)
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    }
  },
  data: {
    phone: '',
    sign:0,
    item: {
      username: '',
      userimg: '/images/1.png',
    }
  },
  onLoad (){
    var that=this
    this.$wuxToast = app.wux(this).$wuxToast
    wx.showShareMenu({
      withShareTicket: true
    })
    wx.getStorage({
      key: 'phone',
      success: function (res) {
      if(res.data==''){
        that.setData({
          sign: 0,
          phone: '',
          item: {
            username: '',
            userimg: '/images/1.png',
          }
        })
        that.onReady()
      }
      }
      })


  },
  showToastErr() {
    const _this = this;
    _this.$wuxToast.show({
      type: 'forbidden',
      timer: 1000,
      color: '#fff',
      text: '今日已签到',
      success: () => console.log('今日已签到')
    })
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
          url: app.host_url + 'namefind',
          header: {
            "Content-Type": "application/json"
          },
          method: 'POST',
          data: that.data,
          success: function (res) {
            that.setData({
              ['item.username']: res.data[0].username,
              sign: res.data[1].money,
              ['item.userimg']: res.data[2].img

            })
          }
        })
        
      }

    })
    
    that.onLoad()  
  },
mine: function(){
  var that=this
  var phone=that.data.phone
  if (phone){
    wx.navigateTo({
      url: '/pages/mine/mine',
    })
  }else{
    wx.navigateTo({
      url: '/pages/login/login',
    })
  }
  },
recommend:function(){
  wx.showModal({
    title: '提示',
    content: '请点击app右上角转发给朋友',
    showCancel: false,
    confirmColor: "#426ab3",
  })


},
sethelp: function () {
  var that=this
  var phone=that.data.phone
  if(phone){
    wx.navigateTo({
      url: '/pages/sethelp/sethelp',
    })
  }else{
    wx.navigateTo({
      url: '/pages/login/login',
    })
  }

},
check: function () {
  var that=this
  var  phone=that.data.phone
  if(phone){
    wx.navigateTo({
      url: '/pages/check/check',
    })
  }else{
    wx.navigateTo({
      url: '/pages/login/login',
    })
  }

  },
  money:function(){
    var that=this
    var phone = that.data.phone
    if(phone){
      wx.navigateTo({
        url: '/pages/money/money',
      })
    }else{
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }

  },
  step: function () {
    var that = this
    var phone = that.data.phone
    if (phone) {
      wx.navigateTo({
        url: '/pages/step/step',
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }

  },
deng: function () {
  wx.navigateTo({
    url: '/pages/login/login',
  })
},
sign:function(){
  var that=this
var sign=that.data.sign
wx.request({
  url: app.host_url + 'sign',
  header: {
    "Content-Type": "application/json"
  },
  method: 'POST',
  data: that.data,
  success: function (res) {
    var phone = that.data.phone
    if(phone){
      if (res.data[0].info) {
        that.setData({
          sign: res.data[1].money

        })
        wx.showToast({
          icon: "success",
          title: "签到成功",
          duration: 1000
        })
      }
      else {
        that.showToastErr()
      }
    }else{
      wx.navigateTo({
        url: '/pages/login/login',
      })

    }
  
    
  }
})
},
record:function(){
  var that = this
  var phone = that.data.phone
  if(phone){
  wx.navigateTo({
    url: '/pages/record/record',
  })
  }else{
    wx.navigateTo({
      url: '/pages/login/login',
    })
  }
}
})
