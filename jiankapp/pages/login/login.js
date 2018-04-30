// pages/around/login.js
var app = getApp()

Page({
  data: {
    phone: "",
    password: "",
    userInfo: {},
    hasUserInfo: false,
  },
  onLoad() {

    // 引入toast框 
    this.$wuxToast = app.wux(this).$wuxToast
  },
  showToastErr() {
    const _this = this;
    _this.$wuxToast.show({
      type: 'forbidden',
      timer: 1000,
      color: '#fff',
      text: '账号或密码不能为空',
      success: () => console.log('账号或密码不能为空')
    })
  },
  showToastCancel() {
    const _this = this;
    _this.$wuxToast.show({
      type: 'cancel',
      timer: 1000,
      color: '#fff',
      text: '账户或密码有误',
      success: () => console.log('账户或密码有误')
    })
  },
  showToastnumber() {
    const _this = this;
    _this.$wuxToast.show({
      type: 'cancel',
      timer: 1000,
      color: '#fff',
      text: '手机号码格式有误',
      success: () => console.log('手机号码格式有误')
    })
  },
  register: function () {
    wx.navigateTo({
      url: '/pages/register/register',
    })
  },
  wangji:function(){
    wx.navigateTo({
      url: '/pages/wangji/wangji',
    })
  },

  //微信登录

  getUserInfo: function (e) {
    var that = this
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo
        that.setData({
          userInfo: userInfo,
          hasUserInfo: true
        })
        console.log(userInfo )
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        if (this.userInfoReadyCallback) {
          this.userInfoReadyCallback(res)
        }
        request(that, userInfo)
     
      }, fail: function () {
        wx.showModal({
          title: '警告',
          content: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。',
          success: function (res) {
            if (res.confirm) {
              wx.openSetting({
                success: (res) => {
                  if (res.authSetting["scope.userInfo"]) {////如果用户重新同意了授权登录
                    wx.getUserInfo({
                      success: function (res) {
                        var userInfo = res.userInfo;
                        that.setData({
                          userInfo: userInfo,
                          hasUserInfo: true
                        })
                        request(that, userInfo)
                      }
                    })
                  }
                }
              })

            }
          }
        })
      }

    })

  },
 
  inputphone: function (e) {
    this.setData({
      phone: e.detail.value.replace(/\s/g, "")
    })


  },
  inputpassword: function (e) {
    this.setData({
      password: e.detail.value.replace(/\s/g, "")
    })

  },
  login: function () {
    var that = this
    var phone = that.data.phone
    var password = that.data.password
    if (phone != "" && password != "") {
      if (!(/^1[34578]\d{9}$/.test(phone))) {
        that.showToastnumber()
      } else {
        wx.request({
          url: app.host_url + 'login',
          header: {
            "Content-Type": "application/json"
          },
          method: 'POST',
          data: that.data,
          success: function (res) {
            if (res.data[0].info == 1) {
              wx.setStorage({
                key: 'phone',
                data: that.data.phone
              })
              wx.showToast({
                icon: "success",
                title: "登录成功",
                duration: 1000
              })
              if (res.data[1].isusername) {
                setTimeout(function () {
                  wx.redirectTo({
                    url: '/pages/mine/name'
                  })
                }, 2000)
              } else {
                setTimeout(function () {
                  wx.switchTab({
                    url: '/pages/personal/personal'
                  })
                }, 2000)
              }
            } else {
              that.showToastCancel()
            }
          }
        })
      }
    }
    else {
      that.showToastErr()
    }
  }
})
var request = function (that, userInfo) {
  wx.request({
    url: app.host_url + 'wxlogin',
    header: {
      "Content-Type": "application/json"
    },
    method: 'POST',
    data: that.data,
    success: function (res) {
      if (res.data[0].zhu) {
        wx.redirectTo({
          url: '/pages/login/phone?username=' + userInfo.nickName,
        })
      } else {
        wx.setStorage({
          key: 'phone',
          data: res.data[1].phone
        })
        wx.switchTab({
          url: '/pages/personal/personal',
        })
      }
    }
  })

}
