var app = getApp()
var maxTime = 60
var currentTime = maxTime //倒计时的事件（单位：s）  
var interval = null
var disabled = false



Page({
  data: {
    phone: "",
    confirmcode: "",
    time: currentTime,
    disabled: disabled
  },
  onLoad(options) {
    // 引入toast框 
    this.$wuxToast = app.wux(this).$wuxToast
    var that = this
    that.setData({
      phone: options.phone,
    })
    this.reSendPhoneNum()
  },
  onUnload: function () {
    currentTime = maxTime
    if (interval != null) {
      clearInterval(interval)
    }
  },
  showToastCancel() {
    const _this = this;
    _this.$wuxToast.show({
      type: 'cancel',
      timer: 1000,
      color: '#fff',
      text: '验证码有误',
      success: () => console.log('验证码有误')
    })
  },
  inputconfirm: function (e) {
    this.setData({
      confirmcode: e.detail.value.replace(/\s/g, "")
    })
  },
  confirm: function () {
    var that = this
    var phone = that.data.phone
    var confirmcode = that.data.confirmcode
    console.log(phone)


    wx.request({
      url: app.host_url + 'confyan',
      header: {
        "Content-Type": "application/json"
      },
      method: 'POST',
      data: that.data,
      success: function (res) {
        if (res.data[0].info == 1) {
             wx.redirectTo({
               url: '/pages/wangjitwo/wangjichong?phone='+phone
            })

        } else {

          that.showToastCancel()
        }
      }
    })


  },
  reSendPhoneNum: function () {
    var that = this
    clearInterval(interval)
    wx.request({
      url: app.host_url + 'test',
      header: {
        "Content-Type": "application/json"
      },
      method: 'POST',
      data: that.data,
      success: function (res) {
        console.log(res.data[0].code)
      }
    })
    if (currentTime > 0) {
      var that = this
      currentTime = maxTime
      interval = setInterval(function () {
        currentTime--
        that.setData({
          time: currentTime,
          disabled: true
        })

        if (currentTime < 0) {
          currentTime = maxTime
          clearInterval(interval)
          that.setData({
            time: currentTime,
            disabled: false
          })
        }
      }, 1000)
    } else {

    }
  }

})
