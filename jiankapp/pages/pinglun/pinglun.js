
//获取应用实例
var app = getApp()

Page({

data:{
all:'',
  id: '',
  hide:true
},
onLoad(options){
  var that = this
  var id = options.id
  that.setData({
    id: id
  })
  wx.request({
    url: app.host_url + 'commentshow', //仅为示例，并非真实的接口地址
    header: {
      "Content-Type": "application/json"
    },
    method: "POST",
    data: that.data,
    success: function (res) {
      if (res.data.length){
        that.setData({
          all: res.data,
        })
    }else{
        that.setData({
          hide: false,
        })
    }

    }
  })
}
  
})
