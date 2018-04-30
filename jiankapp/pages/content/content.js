var util = require("../../utils/util")
var app = getApp()
Page({
  data: {
    phone: '',
    isShow: false,//控制emoji表情是否显示
    isLoad: true,//解决初试加载时emoji动画执行一次
    content: "",//评论框的内容
    disabled: true,
    cfBg: false,
    id: '',
    currentTab: 1,
    like: 0,
    emojiChar: "☺-😋-😌-😍-😏-😜-😝-😞-😔-😪-😭-😁-😂-😃-😅-😆-👿-😒-😓-😔-😏-😖-😘-😚-😒-😡-😢-😣-😤-😢-😨-😳-😵-😷-😸-😻-😼-😽-😾-😿-🙊-🙋-🙏-✈-🚇-🚃-🚌-🍄-🍅-🍆-🍇-🍈-🍉-🍑-🍒-🍓-🐔-🐶-🐷-👦-👧-👱-👩-👰-👨-👲-👳-💃-💄-💅-💆-💇-🌹-💑-💓-💘-🚲",
    //0x1f---
    emoji: [
      "60a", "60b", "60c", "60d", "60f",
      "61b", "61d", "61e", "61f",
      "62a", "62c", "62e",
      "602", "603", "605", "606", "608",
      "612", "613", "614", "615", "616", "618", "619", "620", "621", "623", "624", "625", "627", "629", "633", "635", "637",
      "63a", "63b", "63c", "63d", "63e", "63f",
      "64a", "64b", "64f", "681",
      "68a", "68b", "68c",
      "344", "345", "346", "347", "348", "349", "351", "352", "353",
      "414", "415", "416",
      "466", "467", "468", "469", "470", "471", "472", "473",
      "483", "484", "485", "486", "487", "490", "491", "493", "498", "6b4"
    ],
    emojis: [],//qq、微信原始表情
    alipayEmoji: [],//支付宝表情
    title: ''//页面标题
  },
  play(e) {
  },
  pinglun: function () {
    var that = this
    wx.navigateTo({
      url: '/pages/pinglun/pinglun?id=' + that.data.id,
    })
  },
  showToastErr() {
    const _this = this;
    _this.$wuxToast.show({
      type: 'forbidden',
      timer: 1000,
      color: '#fff',
      text: '评论不能为空',
      success: () => console.log('评论不能为空')
    })
  },
  dianzan: function () {
    var that = this

    wx.getStorage({
      key: 'islike',
      success: function (res) {
      },
      fail: function (res) {
        wx.request({
          url: app.host_url + 'dianzan', //仅为示例，并非真实的接口地址
          header: {
            "Content-Type": "application/json"
          },
          method: "POST",
          data: that.data,
          success: function (res) {

            wx.setStorage({
              key: 'islike',
              data: true
            })
            that.setData({
              currentTab: 0,
              likes: res.data[0].likes

            })


          }
        })

      }
    })


  },
  onLoad: function (options) {
    // 引入toast框 
    this.$wuxToast = app.wux(this).$wuxToast
    
    var id = options.id
    wx.request({
      url: app.host_url + 'returnPostDetail', //仅为示例，并非真实的接口地址
      header: {
        "Content-Type": "application/json"
      },
      method: "POST",
      data: {
        'id': id
      },
      success: function (res) {
        that.setData({
          title: res.data[0].title,
          img: res.data[0].img,
          contents: res.data[0].content,
          time: res.data[0].time,
          likes: res.data[0].likes,
          comments: res.data[0].comments,
          types: res.data[0].types,
          author: res.data[0].author,
          id: id
        })
      }
    })
    var em = {}, that = this, emChar = that.data.emojiChar.split("-");
    var emojis = []
    that.data.emoji.forEach(function (v, i) {
      em = {
        char: emChar[i],
        emoji: "0x1f" + v
      };
      emojis.push(em)
    });
    that.setData({
      emojis: emojis
    })
    //alipayEmoji
    // for (var j = 1; j <= 121; j++) {
    //   if (j < 10) j = "0" + j;
    //   that.data.alipayEmoji.push("emotion_small_" + j)
    // }
  },


  //解决滑动穿透问题
  emojiScroll: function (e) {
    console.log(e)
  },
  //文本域失去焦点时 事件处理
  textAreaBlur: function (e) {

    this.setData({
      content: e.detail.value
    })

  },
  //文本域获得焦点事件处理
  textAreaFocus: function () {
    this.setData({
      isShow: false,
      cfBg: false
    })
  },
  //点击表情显示隐藏表情盒子
  emojiShowHide: function () {
    this.setData({
      isShow: !this.data.isShow,
      isLoad: false,
      cfBg: !this.data.false
    })
  },
  //表情选择
  emojiChoose: function (e) {
    //当前输入内容和表情合并
    this.setData({
      content: this.data.content + e.currentTarget.dataset.emoji
    })
  },
  //点击emoji背景遮罩隐藏emoji盒子
  cemojiCfBg: function () {
    this.setData({
      isShow: false,
      cfBg: false
    })
  },

  //发送评论评论 事件处理
  send: function (e) {
    var that = this
    wx.getStorage({
      key: 'phone',
      success: function (res) {
        that.setData({
          phone: res.data,
        })
    //此处延迟的原因是 在点发送时 先执行失去文本焦点 再执行的send 事件 此时获取数据不正确 故手动延迟100毫秒
    setTimeout(function () {
      if (that.data.content.trim().length > 0) {
            var phone = that.data.phone
            if (phone) {
              wx.request({
                url: app.host_url + 'comment', //仅为示例，并非真实的接口地址
                header: {
                  "Content-Type": "application/json"
                },
                method: "POST",
                data: that.data,
                success: function (res) {
                  wx.navigateTo({
                    url: '/pages/pinglun/pinglun?id=' + that.data.id
                  })
                  that.setData({
                    content: "",//清空文本域值
                    isShow: false,
                    cfBg: false
                  })
                }
              })
            } else {
              wx.navigateTo({
                url: '/pages/login/login',
              })
            }
 
      } else {
        that.showToastErr()
        that.setData({
          content: ""//清空文本域值
        })
      }
       
    }, 100)
      }
    })

  }
})