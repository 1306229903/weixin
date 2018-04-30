
var app = getApp()
Page({
  data: {
    phone: "",
    username:"",
    tempFilePaths:"",
    userimg:null
  },
  onLoad() {
    var that=this
    wx.getStorage({
      key: 'phone',
      success: function (res) {
        console.log(res.data)
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
              username: res.data[0].username,
              userimg: res.data[2].img
            })
          }
        })
      }

    })
    
   
  },
  profileup:function(){
    var that=this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          userimg: res.tempFilePaths
        })  
     
        var tempFilePaths = res.tempFilePaths
        
        wx.uploadFile({
          url: app.host_url + 'profile', 
          header: {
            "Content-Type": "multipart/form-data"
          },
          filePath: tempFilePaths[0],
          name: 'file',
          success: function (res) {
         
            var data = res.data
            console.log(data)
   
            //do something
          },
        })
      },
      
    })
  },
name:function(){
  var that=this
   var username=that.data.username
  wx.navigateTo({
    url: '/pages/mine/name?username='+username,
  })
}  

})
