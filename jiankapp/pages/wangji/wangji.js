// pages/wangji/wangji.js
var app = getApp()
Page({


  data: {
    phone:""
  
  },


  onLoad: function (options) {
    // 引入toast框 
    this.$wuxToast = app.wux(this).$wuxToast
  
  },
  showToastCancel() {
    const _this = this;
    _this.$wuxToast.show({
      type: 'cancel',
      timer: 1000,
      color: '#fff',
      text: '手机号不能为空',
      success: () => console.log('手机号不能为空')
    })
  },
  showToastCancelchang() {
    const _this = this;
    _this.$wuxToast.show({
      type: 'cancel',
      timer: 1000,
      color: '#fff',
      text: '系统不存在该用户或手机号格式有误',
      success: () => console.log('系统不存在该用户或手机号格式有误')
    })
  },
  inputphone: function (e) {
    this.setData({
      phone: e.detail.value.replace(/\s/g, "")
    })
  },
  conf:function(){
    var that=this
    var phone=that.data.phone
    if(phone){
      wx.request({
        url: app.host_url + 'wangji',
        method: 'POST',
        data: that.data,
        header: {
          "Content-Type": "application/json"
        },
        success: function (res) {
          if(res.data[0].infowang){
            wx.redirectTo({
              url: '/pages/wangjitwo/wangjitwo?phone='+phone,
            })
          }else{
            that.showToastCancelchang()
          }
    
        }
      })
  
    }else{
      that.showToastCancel()
    }
   
  }

 
})