// pages/check/hand.js
var app = getApp()
const util = require('../../utils/util.js')

Page({

  data: {
  id:'',
  phone:'',
  temp: 0,
  temptwo: 0,
  diettemp:'',
  statutemp:'',
  dietlist:[
    { title: "1.常吃咸菜以及咸鱼、腊肉等腌制食品", radioname:'radio1'},
    { title: "2.经常吃方便面", radioname: 'radio2' },
    { title: "3.经常吃刚屠宰的猪、牛、羊肉，认为其最新鲜，质量最好", radioname: 'radio3' },
    { title: "4.喜爱吃动物内脏，如猪肝、猪大肠、羊杂碎等", radioname: 'radio4' },
    { title: "5.喜欢选购白的馒头、挂面等面食，认为颜色越白越好", radioname: 'radio5' },
    { title: "6.喜爱吃烧烤类食物，如羊肉串、烤鱿鱼等", radioname: 'radio6' },
    { title: "7.喜欢在看电视、读书或行走时吃东西", radioname: 'radio7' },
    { title: "8.不管食物营养价值如何，只要对胃口就买", radioname: 'radio8' },
    { title: "9.为了某种目的，时常节食或严格限制饮食", radioname: 'radio9' },
    { title: "10.喜欢用咖啡、冷饮或罐装甜饮料代替日常饮水", radioname: 'radio10' },
    { title: "11.用餐后马上吃水果", radioname: 'radio11' },
    { title: "12.您的晚餐是否通常是三餐中最丰盛的?", radioname: 'radio12' },
    { title: "13.经常不吃早餐", radioname: 'radio13' },
    { title: "14.常在农贸市场购买没有包装的豆腐和豆制品", radioname: 'radio14' },
    { title: "15.从小到现在一直偏爱某类食物", radioname: 'radio15' },
    { title: "16.菜里要是盐、味精放少了，会觉得没有味道很难下咽", radioname: 'radio16' },
    { title: "17.炒菜时，等油冒烟了才放菜", radioname: 'radio17' },
    { title: "18.放了好几天的剩菜，只要您觉得没放坏就加热后继续食用", radioname: 'radio18' },
    { title: "19.每天刷碗时都用洗洁精", radioname: 'radio19' },
    { title: "20.喜食甜食，烹炒各种菜时都喜欢放些糖", radioname: 'radio20' },
  ],
  statulist:[
    { title: '1、在做事条理性方面，更接近：', radioname: 'radio1', one:'每晚准备好明天上班要带的东西',
      two: '家庭摆设井井有条。随手可取', three:'每天晚上要花许多时间找东西'   },
    {
      title: '2、做事的态度更接近：', radioname: 'radio2', one: '凡是能做的，耐心做，决不拖拉',
      two: '遇到困难，不勉强自己，有时重做', three: '得过且过，“明天再做”'
    },
     {
       title: '3、当遇到使自己失望的事时，你的反应如何：', radioname: 'radio3', one: '能控制住感情，冷静思考后行动', two: '开始有些激动，最终能够控制自己', three: '有时麻木不仁，有时惊惶失措”'
    },
     {
       title: '4、与周围人相处时，自我感觉如何？', radioname: 'radio4', one: '能互相尊重，和睦相处', two: '与家人还可以，与其他人无所谓好坏', three: '对周围人疑虑重重'
     },
     {
       title: '5、假日或业余时间，是怎样度过的？', radioname: 'radio5', one: '事先己有充分安排', two: '根据当时的心情，即兴作出决定', three: '用于休息，很少外出'
     },
     {
       title: '6、睡眠情况如何？', radioname: 'radio6', one: '睡眠充裕，醒后很舒服', two: '睡得不深，易醒', three: '有失眠症，且常做恶梦'
     },
    {
      title: '7、对待本职工作，有何看法？', radioname: 'radio7', one: '觉得很有意义，工作愉快', two: '习以为常，没什么看法', three: '把工作看成负担，没有兴趣'
     },
     {
       title: '8、当你生病时如何做？', radioname: 'radio8', one: '立即去医院', two: '实在忍不住才去医院', three: '自己找些药服用'
    },
    {
      title: '9、对自己的记忆力，有何评价？', radioname: 'radio9', one: '和以往一样，没什么异常', two: '最近发生的事也难以记起', three: '过去发生的事已想不起来了'
     }

  ]
  },
  showToast() {
    const _this = this;
    _this.$wuxToast.show({
      type: 'forbidden',
      timer: 1000,
      color: '#fff',
      text: '选项不能留空',
      success: () => console.log('选项不能留空')
    })
  },
  onLoad: function (options) {
    // 引入toast框 
    this.$wuxToast = app.wux(this).$wuxToast

    var that=this
  var id=options.id
 that.setData({
 id:id,
 year: util.formatTime(new Date(), 'year'),
 hour: util.formatTime(new Date(), 'hour')
 })

  },

  showToastErr() {
    const _this = this;
    _this.$wuxToast.show({
      type: 'forbidden',
      timer: 1000,
      color: '#fff',
      text: '请输入合适的值',
      success: () => console.log('请输入合适的值')
    })
  },

  bindinput: function (e) {
this.setData({
   temp: e.detail.value
  })


  },
  bindinputsz: function (e) {
    this.setData({
      temptwo: e.detail.value
    })

  },

  formSubmit: function(e) {
    var that=this
    var diettemp = parseInt(e.detail.value.radio1) + parseInt(e.detail.value.radio2)+
      parseInt(e.detail.value.radio3) + parseInt(e.detail.value.radio4) + parseInt(e.detail.value.radio5) + parseInt(e.detail.value.radio6) + parseInt(e.detail.value.radio7)+
      parseInt(e.detail.value.radio8) + parseInt(e.detail.value.radio9) + parseInt(e.detail.value.radio10) + parseInt(e.detail.value.radio11) + parseInt(e.detail.value.radio12)+
      parseInt(e.detail.value.radio13) + parseInt(e.detail.value.radio14) + parseInt(e.detail.value.radio15) + parseInt(e.detail.value.radio16) + parseInt(e.detail.value.radio17)+
      parseInt(e.detail.value.radio18) + parseInt(e.detail.value.radio19) + parseInt(e.detail.value.radio20)
    if (diettemp){
      that.setData({
        diettemp: diettemp
      })
      that.savedata()
    }else
    {
      that.showToast()

    }
  },
  formSubmits:function(e){
    var that = this
    var statutemp = parseInt(e.detail.value.radio1) + parseInt(e.detail.value.radio2) + parseInt(e.detail.value.radio3) + parseInt(e.detail.value.radio4) + parseInt(e.detail.value.radio5) + parseInt(e.detail.value.radio6) + parseInt(e.detail.value.radio7) + parseInt(e.detail.value.radio8) + parseInt(e.detail.value.radio9)
    if (statutemp){
      that.setData({
        statutemp: statutemp
      })
      that.savedata()
    }else{
      that.showToast()
    }
  },
  savedata:function(){
    var that=this
    wx.getStorage({
      key: 'phone',
      success: function (res) {
        that.setData({
          phone: res.data,
        })
        wx.request({
          url: app.host_url + 'check', //仅为示例，并非真实的接口地址
          header: {
            "Content-Type": "application/json"
          },
          method: "POST",
          data: that.data,
          success: function (res) {
            if(res.data[0].info==0){
              that.showToastErr()
            }else{
              wx.navigateBack({})
            }
          
       
          }
        })
        }
        })


    

  },


  
})