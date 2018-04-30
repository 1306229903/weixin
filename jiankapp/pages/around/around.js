

// 引入SDK核心类
var QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');

// 实例化API核心类
var demo = new QQMapWX({
  key: 'HMDBZ-UOTRV-XNNPO-UQPCP-JWW6E-AOFDF' // 必填
});


Page({
  data:{
    hid: true,
    imghid: true,
    height:'100%',
    controls: [{
      id: 0,
      iconPath: '/images/map/ding.png',
      position: {
        left: 10,
        top: 270,
        width: 24,
        height: 24
      },
      clickable: true
    }, {
      id: 1,
      iconPath: '/images/map/sec.png',
      position: {
        left: 10,
        top: 320,
        width: 24,
        height: 24
      },
      clickable: true
    }] ,
    markers: [{
    }],
  },
  controltap(e) {
    console.log(e.controlId)
    if (e.controlId==0){
      this.mapCtx.moveToLocation()
    }
   else{
       wx.chooseLocation({
    success: function (res) {
      wx.openLocation({
        latitude: res.latitude,
        longitude: res.longitude,
        name: res.name,
        address: res.address,
      })
    },
 
  })


   }
   
  },
  markertap(e) {
    var that = this;
    var id = e.markerId;
    var tel
    if (that.data.markers[id].tel != ' '){
      tel = that.data.markers[id].tel
      that.setData({
        imghid: false,
      })
    }else{
      tel = '暂无'
      that.setData({
        imghid: true,
      })
    }
    that.setData({
      title: that.data.markers[id].title,
      distance: that.data.markers[id].distance,
      address: that.data.markers[id].address,
      tel: tel,
      hid:false,
      height:'80%',
    })

  },
  makephone: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone //仅为示例，并非真实的电话号码
    })
  },
onLoad(e){
  var that=this
  that.mapCtx = wx.createMapContext('myMap')
  wx.getLocation({
    type: 'gcj02',
    success: function (res) {
      var latitude = res.latitude
      var longitude = res.longitude
      that.setData({
        latitude: latitude ,
        longitude:longitude,
      })
    }
  })
  demo.search({
    keyword: '医院',
    page_size:20,
    success: function (res) {
      var markers=[]
      var temp
    for(var i=0;i<res.data.length;i++){
       temp = {
        iconPath: "/images/map/location.png", width: 15, height: 30,id:0,title:'',address:'',
        tel: '', distance: 0, latitude: 0, longitude: 0}
      temp.id = i
      temp.latitude = res.data[i].location.lat
      temp.longitude = res.data[i].location.lng
      temp.title = res.data[i].title
      temp.address = res.data[i].address
      temp.tel = res.data[i].tel
      temp.distance = res.data[i]._distance
      markers.push(temp)
    }
    that.setData({
      markers: markers
    })
    console.log(that.data.markers)
    },
  })
}
})



// var app = getApp()


// Page({
// data:{

// },
// onLoad(){
//   var that=this

//   wx.getLocation({
//     type: 'gcj02', //返回可以用于wx.openLocation的经纬度
//     success: function (res) {
//       var latitude = res.latitude
//       var longitude = res.longitude
//       wx.openLocation({
//         latitude: 30.5539,
//         longitude: 104.07482,
//         name:'温江公园',
//         address:'临江路南段13',
//         scale: 28
//       })
//     }
//   })

//   wx.chooseLocation({
//     success: function (res) {
//       // success
//       console.log(res)
//       that.setData({
//         hasLocation: true,
//         location: {
//           longitude: res.longitude,
//           latitude: res.latitude
//         }
//       })
//     },
//     fail: function () {
//       // fail
//     },
//     complete: function () {
//       // complete
//     }
//   })


// }



// })
