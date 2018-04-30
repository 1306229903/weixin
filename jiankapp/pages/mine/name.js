
var app = getApp()
Page({
  data: {
   username: "",
   phone: "",
   isusername:'',
  },
  onLoad(options) {
    
    var that=this
    that.setData({
      username: options.username,
    })
    var username=that.data.username
 
    if (!username){
      that.setData({
        isusername: "，请输入您的昵称",
      })
    }
    wx.getStorage({
      key: 'phone',
      success: function (res) {
        that.setData({
          phone: res.data,

        })
      }

    })
  },
  inputname: function (e) {
    this.setData({
      username: e.detail.value.replace(/\s/g, "")
    })
  },
submit: function(){
  
  var that=this
  var username = that.data.username
  if (/^[a-zA-Z0-9\u4e00-\u9fa5]{1,12}$/.test(username)){
    var re = /[\u4E00-\u9FA5]/g  
    var usertest = username.match(re)
    if (usertest ? usertest.length <= 6 : !usertest ){
      wx.request({
        url: app.host_url + 'name',
        header: {
          "Content-Type": "application/json"
        },
        method: 'POST',
        data: that.data,
        success: function (res) {
        }
      }),
        wx.switchTab({
          url: '/pages/personal/personal',
        })
    }
    else{
      console.log("最多6个汉字")
    }
   
  }else{
    console.log("不符合格式")
  }
  }
 

})
