// pages/record/record.js
var app = getApp()
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({
  data: {
    tabs: ["个人资料", "生活习惯", "其它信息"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    phone:'',
    age: 0,
    sex:'男',
    username:'',
    list:{
      listf: [{ name: '身高', value: 0 }, { name: '体重', value: 0 },
        { name: '婚姻', value: '已婚' }, { name: '是否有过敏史', value: '否' }
      ],
      lists: [{ name: '抽烟', value: '是' }, { name: '饮酒', value: '否' },
        { name: '饮食是否规律', value: '是' }, { name: '睡眠是否规律', value: '否' }
        , { name: '大小便是否正常', value: '否' }, { name: '是否长期服用止痛药或镇定催眠药', value: '否' }
        
      ],
       listt: ['暂无任何记录']
    },

    // 第一个数组
    multiArray: [['0', '1', '2'], ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']],
    multiIndex: [0, 0, 0],
    
    
    // 第二个数组
    multiArraytwo: [['0', '1'], ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']],
    multiIndextwo: [0, 0, 0],

  },
  onLoad: function () {
    var that = this
    wx.getStorage({
      key: 'phone',
      success: function (res) {
        that.setData({
          phone: res.data,
        })
        wx.request({
          url: app.host_url + 'recordfrcha', //仅为示例，并非真实的接口地址
          header: {
            "Content-Type": "application/json"
          },
          method: 'POST',
          data: that.data,
          success: function (res) {
            that.setData({
              ['list.listf[0].value']:res.data[0].height,
              ['list.listf[1].value']:res.data[0].weight,
              ['list.listf[2].value']:res.data[0].marriage,
              ['list.listf[3].value']:res.data[0].allergy,
              ['list.lists[0].value']: res.data[0].smoke,
              ['list.lists[1].value']: res.data[0].wine,
              ['list.lists[2].value']: res.data[0].diet,
              ['list.lists[3].value']: res.data[0].sleep,
              ['list.lists[4].value']: res.data[0].bowel,
              username:res.data[0].username,
              age:res.data[0].age,
              sex:res.data[0].sex,
              ['list.listt[0]']: res.data[0].medical_his
            })


          }
        })

      }

    })

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  // 第一个picker
  bindMultiPickerChange: function (e) {
    this.setData({
      multiIndex: e.detail.value,
      ['list.listf[0].value']: this.data.multiIndex.join('').replace(/\b(0+)/gi,"")
    })
    this.request()
  },
  bindMultiPickerColumnChange: function (e) {
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    this.setData(data);
  },
   // 第二个picker
  bindMultiPickerChangetwo: function (e) {
    this.setData({
      multiIndextwo: e.detail.value,
      ['list.listf[1].value']: this.data.multiIndextwo.join('').replace(/\b(0+)/gi, "")
    })
    this.request()
  },
  bindMultiPickerColumnChangetwo: function (e) {
    var data = {
      multiArraytwo: this.data.multiArraytwo,
      multiIndextwo: this.data.multiIndextwo
    };
    data.multiIndextwo[e.detail.column] = e.detail.value;
    this.setData(data);
  },
  my:function(){
    wx.navigateTo({
      url: '/pages/record/my'
    })
  },

 secondtap: function (e) {
   var index=e.currentTarget.id
    var that = this
    wx.showActionSheet({
      itemList: ['是', '否'],
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 1) {
            that.setData({
               [ 'list.lists['+index+'].value']:'否'
            })
         that.request()
          } else {
            that.setData({
              ['list.lists[' + index + '].value']: '是'
            })
            that.request()
          }
        }
      }
    });
  },
allergy:function(e){
  var that=this
  wx.showActionSheet({
    itemList: ['是','否'],
    success: function (res) {
      if(!res.cancel){
        if (res.tapIndex==1) {
          that.setData({
            ['list.listf[3].value']: '否'
          })
          that.request()

        } else {
          that.setData({
            ['list.listf[3].value']: '是'
          })
          that.request()
        }
      }
    }
  });
},
  marriage:function(e){
    var that = this
    wx.showActionSheet({
      itemList: ['已婚', '未婚'],
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 1) {
            that.setData({
              ['list.listf[2].value']: '未婚'
            })
           that.request()

          } else {
            that.setData({
              ['list.listf[2].value']: '已婚'
            })
            that.request()
          }
        }
      }
    });
  },
  bindblur:function(e){
    var that=this
    that.setData({
      ['list.listt[0]']: e.detail.value
    })
that.request()
  },
request:function(){
  var that=this
  wx.request({
    url: app.host_url + 'recordfr', //仅为示例，并非真实的接口地址
    header: {
      "Content-Type": "application/json"
    },
    method: 'POST',
    data: that.data,
    success: function (res) {

    }
  })
}


});