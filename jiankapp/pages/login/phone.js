// pages/login/phone.js
var app = getApp()
Page({

  data: {
    username:'',
    phonenumber:''
  },


  onLoad: function (options) {
    // 引入toast框 
    this.$wuxToast = app.wux(this).$wuxToast
    
    this.setData({
     username:options.username
    })
    // 引入toast框 
    this.$wuxToast = app.wux(this).$wuxToast
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
  inputname: function (e) {
    this.setData({
      phonenumber: e.detail.value.replace(/\s/g, "")
    })
  
  },
  submit:function(e){
    var that=this
    if (!(/^1[34578]\d{9}$/.test(that.data.phonenumber))) {
      that.showToastnumber()
    }else{
      wx.request({
        url: app.host_url + 'wxphone',
        header: {
          "Content-Type": "application/json"
        },
        method: 'POST',
        data: that.data,
        success: function (res) {
          wx.setStorage({
            key: 'phone',
            data: that.data.phonenumber
          })
          wx.switchTab({
            url: '/pages/personal/personal',
          })
        }
      })


    }
  }
})