// pages/around/login.js
var app = getApp()
Page({
  data: {
    phone: "",
    password: "",
    confirmcode:""
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
  showToastzhu() {
    const _this = this;
    _this.$wuxToast.show({
      type: 'forbidden',
      timer: 1000,
      color: '#fff',
      text: '该账号已被注册',
      success: () => console.log('该账号已被注册')
    })
  },
  showToastCancel() {
    const _this = this;
    _this.$wuxToast.show({
      type: 'cancel',
      timer: 1000,
      color: '#fff',
      text: '手机号码格式有误',
      success: () => console.log('手机号码格式有误')
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
    wx.navigateBack({
      url: '/pages/login/login',
    })
  },
  register: function(){
    var that = this
    var phone = that.data.phone
    var password = that.data.password
    wx.request({
      url: app.host_url + 'register', 
      method: 'POST',
      data: that.data,
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        if (phone != "" && password != ""){
          if (res.data[0].zhu == 1) {
          if (!(/^1[34578]\d{9}$/.test(phone))) {
            that.showToastCancel()
          }
          else {
            wx.redirectTo({
              url: '/pages/confirm/confirm?phone=' + phone + '&password=' + password,
            })
          }
        }
        else {
            that.showToastzhu()
         
        }
        }else{
          that.showToastErr()
        }
      }
    })
   


  }

})
