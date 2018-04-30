// pages/wangji/wangji.js
var app = getApp()
Page({


  data: {
    phone: "",
    password:''

  },

  onLoad: function (options) {
    // 引入toast框 
    this.$wuxToast = app.wux(this).$wuxToast

    this.setData({
      phone: options.phone,
    })
  },
  showToastCancel() {
    const _this = this;
    _this.$wuxToast.show({
      type: 'cancel',
      timer: 1000,
      color: '#fff',
      text: '密码不能为空',
      success: () => console.log('密码不能为空')
    })
  },

  inputphone: function (e) {
    this.setData({
      password: e.detail.value.replace(/\s/g, "")
    })
  },
  chongzhi: function () {
    var that = this
    var password = that.data.password
    if (password) {
      wx.request({
        url: app.host_url + 'chongzhi',
        method: 'POST',
        data: that.data,
        header: {
          "Content-Type": "application/json"
        },
        success: function (res) {   
          if(res.data[0].xiuinfo){
            wx.showToast({
              icon: "success",
              title: "密码修改成功",
              duration: 1000
            })
            setTimeout(function () {
              wx.redirectTo({
                url: '/pages/login/login'
              })
            }, 2000)
          }else{
            console.log("修改失败")
          }
      
        }
      })

    } else {
      that.showToastCancel()
    }

  }


})