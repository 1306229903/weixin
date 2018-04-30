// pages/step/step.js
var app = getApp()
const time = require('../step/time.js')
var rq=function(that){
  wx.request({
    url: app.host_url + 'testmbcha', //仅为示例，并非真实的接口地址
    header: {
      "Content-Type": "application/json"
    },
    method: 'POST',
    data: {
      'phone': that.data.phone
    },
    success: function (res) {
      that.setData({
        msteps: res.data[0].step
      })

    }
  })
}
var xingqi=function(day){
var str
if(day=='01'){
  return str='一'
}
else if(day=='02'){
  return str = '二'
}
else if (day == '03') {
  return str = '三'
}
else if (day == '04') {
  return str = '四'
}
else if (day == '05') {
  return str = '五'
}
else if (day == '06') {
  return str = '六'
}
else{
  return str = '日'
}
}



Page({

  data: {
    temp:[],
    tdsteps:0,
    msteps:5000,
    mile:'0.0',
    kalu:0,
    encryptedData:2,
    iv:'',
    list:[
      '一','二','三','四','五','六','日'
    ]
  },
  onReady: function () {

    // 页面渲染完成  
    var cxt_arc = wx.createCanvasContext('canvasArc');//创建并返回绘图上下文context对象。  
    cxt_arc.setLineWidth(16);
    cxt_arc.setStrokeStyle('#dbdbdb');
    cxt_arc.setLineCap('round')
    cxt_arc.beginPath();//开始一个新的路径  
    cxt_arc.arc(106, 106, 90, 0, 2 * Math.PI, false);
    //设置一个原点(106,106)，半径为100的圆的路径到当前路径  
    cxt_arc.stroke();//对当前路径进行描边  

    cxt_arc.setLineWidth(16);
    cxt_arc.setStrokeStyle('#3ea6ff');
    cxt_arc.setLineCap('round')
    cxt_arc.beginPath();//开始一个新的路径  
    
    if (this.data.tdsteps > 0 && this.data.tdsteps<50)
      cxt_arc.arc(106, 106, 90, 1.5 * Math.PI, Math.PI * 1.51, false);
    else if (this.data.tdsteps >= 50 && this.data.tdsteps < 100) 
    cxt_arc.arc(106, 106, 90, 1.5 * Math.PI, Math.PI * 1.55, false);
    else if (this.data.tdsteps >= 100 && this.data.tdsteps < 500)  
      cxt_arc.arc(106, 106, 90, 1.5 * Math.PI, Math.PI * 1.6, false);
    else if (this.data.tdsteps >=500 && this.data.tdsteps < 1000)  
      cxt_arc.arc(106, 106, 90, 1.5 * Math.PI, Math.PI * 1.7, false);
    else if (this.data.tdsteps >=1000 && this.data.tdsteps < 2500)  
      cxt_arc.arc(106, 106, 90, 1.5 * Math.PI, Math.PI * 2, false);
    else if (this.data.tdsteps >= 2500 && this.data.tdsteps < 3000)  
      cxt_arc.arc(106, 106, 90, 1.5 * Math.PI, Math.PI * 2.5, false);
    else if (this.data.tdsteps >=3000 && this.data.tdsteps <= 5000)
      cxt_arc.arc(106, 106, 90, 1.5 * Math.PI, Math.PI * 3.5, false);  
    else  
      cxt_arc.arc(106, 106, 90, Math.PI * 1 / 200000, Math.PI * 6 / 500000, false);

    cxt_arc.stroke();//对当前路径进行描边  

    cxt_arc.draw();

  },  

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    var that = this;

    wx.getNetworkType({
      success: function (res) {
         if(res.networkType=="none"){
           wx.showModal({
             title: '提示',
             content: '无法连接服务器,请检查网络连接',
             showCancel: false,
             confirmText: '确定'
           })
         }else{
           setTimeout(function () {
             wx.login({
               success: function (res) {

                 if (res.code) {
                   wx.request({
                     url: app.host_url + 'testst', //仅为示例，并非真实的接口地址
                     header: {
                       "Content-Type": "application/json"
                     },
                     method: 'POST',
                     data: {
                       'code': res.code,
                       'encryptedData': that.data.encryptedData,
                       'iv': that.data.iv,
                     },
                     success: function (res) {
                       var sjc = res.data.stepInfoList[30].timestamp
                       var steps = res.data.stepInfoList[30].step
                       var mile = (steps / 1500).toFixed(1)
                       var kalu = Math.round(mile * 52.5)
                       that.setData({
                         Y: time.formatTime(sjc, 'Y'),
                         M: time.formatTime(sjc, 'M'),
                         D: time.formatTime(sjc, 'D'),
                         d: xingqi(time.formatTime(sjc, 'd')),
                         tdsteps: steps,
                         mile:mile,
                         kalu:kalu,
                         temp: res.data.stepInfoList
                       })
                       that.onReady()

                     }
                   })
                 }
               }
             })
           }, 1000)
           wx.getWeRunData({
             success(res) {
               const encryptedData = res.encryptedData
               const iv = res.iv
               that.setData({
                 encryptedData: encryptedData,
                 iv: iv
               })
             },
             fail: function (res) {
               wx.showModal({
                 title: '提示',
                 content: '未开通微信运动，请关注“微信运动”公众号后重试',
                 showCancel: false,
                 confirmText: '知道了'
               })
             }
           })
         }
      }
    })
   
   
  },

  onShow(){
    var that=this
    wx.getStorage({
      key: 'phone',
      success: function (res) {
        that.setData({
          phone: res.data,
        })
       rq(that)
      }
    })

  },
  sett:function(){
wx.navigateTo({
  url: '/pages/step/stepset',
})
  },
  bian:function(e){
    var that=this
    var index = e.currentTarget.dataset.id
    var temp=that.data.temp
    var sjc = temp[30].timestamp
    var steps 
    var mile 
    var kalu 
  
    var timeday = time.formatTime(sjc, 'd').substr(1)
    if (timeday==0)
       timeday=7


    if (timeday>=index+1){

      if (timeday == index + 1){
        rq(that)
         sjc = temp[30].timestamp
         steps = temp[30].step
         mile = (steps / 1500).toFixed(1)
         kalu = Math.round(mile * 52.5)
         that.setData({
           activeIndex: index,
           Y: time.formatTime(sjc, 'Y'),
      M: time.formatTime(sjc, 'M'),
        D: time.formatTime(sjc, 'D'),
        d: xingqi(time.formatTime(sjc, 'd')),
        tdsteps: steps,
        mile: mile,
        kalu: kalu,
        msteps: that.data.msteps
         })
     
      }
      else if ((timeday-1)== index + 1){
         sjc = temp[29].timestamp
         steps = temp[29].step
         mile = (steps / 1500).toFixed(1)
         kalu = Math.round(mile * 52.5)
         that.setData({
           activeIndex: index,
           Y: time.formatTime(sjc, 'Y'),
           M: time.formatTime(sjc, 'M'),
           D: time.formatTime(sjc, 'D'),
           d: xingqi(time.formatTime(sjc, 'd')),
           tdsteps: steps,
           mile: mile,
           kalu: kalu,
           msteps:5000
         })
 
      }
      else if ((timeday - 2) == index + 1) {
        sjc = temp[28].timestamp
        steps = temp[28].step
        mile = (steps / 1500).toFixed(1)
        kalu = Math.round(mile * 52.5)
        that.setData({
          activeIndex: index,
          Y: time.formatTime(sjc, 'Y'),
          M: time.formatTime(sjc, 'M'),
          D: time.formatTime(sjc, 'D'),
          d: xingqi(time.formatTime(sjc, 'd')),
          tdsteps: steps,
          mile: mile,
          kalu: kalu,
          msteps: 5000
        })
      }
      else if ((timeday - 3) == index + 1) {
        sjc = temp[27].timestamp
        steps = temp[27].step
        mile = (steps / 1500).toFixed(1)
        kalu = Math.round(mile * 52.5)
        that.setData({
          activeIndex: index,
          Y: time.formatTime(sjc, 'Y'),
          M: time.formatTime(sjc, 'M'),
          D: time.formatTime(sjc, 'D'),
          d: xingqi(time.formatTime(sjc, 'd')),
          tdsteps: steps,
          mile: mile,
          kalu: kalu,
          msteps: 5000
        })
      }
      else if ((timeday - 4) == index + 1) {
         sjc = temp[26].timestamp
         steps = temp[26].step
         mile = (steps / 1500).toFixed(1)
         kalu = Math.round(mile * 52.5)
         that.setData({
           activeIndex: index,
           Y: time.formatTime(sjc, 'Y'),
           M: time.formatTime(sjc, 'M'),
           D: time.formatTime(sjc, 'D'),
           d: xingqi(time.formatTime(sjc, 'd')),
           tdsteps: steps,
           mile: mile,
           kalu: kalu,
           msteps: 5000
         })
      }
      else if ((timeday - 5) == index + 1) {
        sjc = temp[25].timestamp
        steps = temp[25].step
        mile = (steps / 1500).toFixed(1)
        kalu = Math.round(mile * 52.5)
        that.setData({
          activeIndex: index,
          Y: time.formatTime(sjc, 'Y'),
          M: time.formatTime(sjc, 'M'),
          D: time.formatTime(sjc, 'D'),
          d: xingqi(time.formatTime(sjc, 'd')),
          tdsteps: steps,
          mile: mile,
          kalu: kalu,
          msteps: 5000
        })
      }
      else{
        sjc = temp[24].timestamp
        steps = temp[24].step
        mile = (steps / 1500).toFixed(1)
        kalu = Math.round(mile * 52.5)
        that.setData({
          activeIndex: index,
          Y: time.formatTime(sjc, 'Y'),
          M: time.formatTime(sjc, 'M'),
          D: time.formatTime(sjc, 'D'),
          d: xingqi(time.formatTime(sjc, 'd')),
          tdsteps: steps,
          mile: mile,
          kalu: kalu,
          msteps: 5000
        })
      }

    that.onReady()
    }

  }


  // //获取encryptedData（没有解密的步数）和iv（加密算法的初始向量）
  // getData: function (appid, session_key) {
  //   wx.getSetting({
  //     success: function (res) {
  //       console.log(res);
  //       if (!res.authSetting['scope.werun']) {
  //         wx.showModal({
  //           title: '提示',
  //           content: '获取微信运动步数，需要开启计步权限',
  //           success: function (res) {
  //             if (res.confirm) {
  //               //跳转去设置
  //               wx.openSetting({
  //                 success: function (res) {

  //                 }
  //               })
  //             } else {
  //               //不设置
  //             }
  //           }
  //         })
  //       } else {
  //         wx.getWeRunData({
  //           success: function (res) {
  //             console.log(res);
  //             console.log("appid:" + appid + "session_key:" + session_key + "encryptedData:" + res.encryptedData + "iv:" + res.iv);
  //             var encryptedData = res.encryptedData;
  //             var iv = res.iv;
  //             //使用解密工具，链接地址：
  //             //https://codeload.github.com/gwjjeff/cryptojs/zip/master
  //             var pc = new WXBizDataCrypt(appid, session_key);
  //             console.log(pc);
  //             var data = pc.decryptData(encryptedData, iv)
  //             console.log(data)
  //           },
  //           fail: function (res) {
  //             wx.showModal({
  //               title: '提示',
  //               content: '开发者未开通微信运动，请关注“微信运动”公众号后重试',
  //               showCancel: false,
  //               confirmText: '知道了'
  //             })
  //           }
  //         })
  //       }
  //     }
  //   })
  // },

})