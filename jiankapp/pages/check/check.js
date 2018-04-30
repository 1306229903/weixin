var app = getApp()
const util = require('../../utils/util.js')

//体重、心率、血压、体温推送
var weight=function(that){
  var weightay=[]
  weightay = ['您的检测结果显示体重过轻，需要加强营养，补充优质蛋白（如：鸡蛋、牛奶、鸡胸肉、鱼肉等），保持三餐规律，适当进食”三高”（即高热量、高脂肪、高糖）食品；消化吸收能力较差的，建议少食多餐，并适当活动增进胃肠的蠕动，提高消化能力；因病或不明原因体重下降的，可上医院寻找医生咨询', '您的检测结果在正常范围之内，请继续保持哟！作息规律、饮食均衡、适量运动、保持心情舒畅是维持健康的不二法宝', '您的检测结果显示超重，建议控制饮食、减少肉类、”三高”(即高热量、高脂肪、高糖)食品的摄入，多吃含粗纤维的蔬菜、粗粮等；烹饪方式以凉拌、蒸、煮为主，少煎炸；三餐规律，晚上8点后尽量不再进食；保持规律作息，不熬夜；每周至少运动三次以上，每周运动时间不少于150分钟','您的检测结果显示肥胖，肥胖会增加患冠心病、高血压、糖尿病、等疾病的风险，建议您进行健康减肥，以每周瘦一斤为目标，调整作息（不熬夜），三餐规律，在饮食上控制热量摄入，通过以有氧运动为主、无氧运动为辅的方式进行运动，增加身体能量的消耗，每次至少运动1小时，隔天运动一次，以保证身体耗能维持在较高水平。如需帮助，可上医院寻找医生咨询']
  var weight = that.data.list[0].data
  if (20 <= weight && weight <= 40) {
    that.setData({
      colorw: '#943D92',
      ['imggu[0]']: '/images/check/water2.png',
      positionw: 0,
      ['list[0].result']: '极低',
      ['list[0].text']: weightay[0]
    })
  }
  else if (40 < weight && weight < 53.5) {
    that.setData({
      colorw: '#06B9D1',
      ['imggu[0]']: '/images/check/water4.png',
      positionw: '20%',
      ['list[0].result']: '偏低',
      ['list[0].text']: weightay[0]
    })

  }
  else if (53.5 <= weight && weight <= 69.1) {
    that.setData({
      colorw: '#3CB371',
      ['imggu[0]']: '/images/check/water.png',
      positionw: '47%',
      ['list[0].result']: '健康',
      ['list[0].text']: weightay[1]
    })

  }
  else if (69.1 < weight && weight <= 90) {
    that.setData({
      colorw: '#F5C400',
      ['imggu[0]']: '/images/check/water5.png',
      positionw: '75%',
      ['list[0].result']: '偏高',
      ['list[0].text']: weightay[2]
    })

  }
  else {
    that.setData({
      colorw: '#E8251E',
      ['imggu[0]']: '/images/check/water3.png',
      positionw: '93%',
      ['list[0].result']: '极高',
      ['list[0].text']: weightay[3]
    })

  }  
} 

var heart = function (that) {
  var heartay = []
  heartay = ['您的检测结果显示心跳过缓，如平时经常出现头晕、乏力、心悸、倦怠、精神差等症状，建议咨询医生。平时注意生活和情志的调理，饮食有节，起居有常，不妄作劳，避免使用能引起心率变慢的药物。在身体不适的情况下，运动员、老年人和睡眠时出现的心跳过缓，是正常的现象', '您的检测结果在正常范围之内，请继续保持哟！作息规律、饮食均衡、适量运动、保持心情舒畅是维持健康的不二法宝','您的检测结果显示心跳过速，如有心悸、胸痛、头昏、眩晕等症状，建议咨询医生。平时生活中要避免情绪激动，清淡饮食，控制好血压、血糖等，定期进行血压、心率监测，适当运动，如散步、太极拳等，不做剧烈运动，避免劳累、受凉等。正常人在体力活动、情绪激动、饱餐、饮浓茶、咖啡、吸烟、饮酒等情况下也会出现心跳过速的情况']
  var heart = that.data.list[1].data
  if (20 <= heart && heart<= 40) {
    that.setData({
      colorh: '#943D92',
      ['imggu[1]']: '/images/check/water2.png',
      positionh: 0,
      ['list[1].result']: '极低',
      ['list[1].text']: heartay[0]
    })
  }
  else if (40 < heart && heart < 60) {
    that.setData({
      colorh: '#06B9D1',
      ['imggu[1]']: '/images/check/water4.png',
      positionh: '20%',
      ['list[1].result']: '偏低',
      ['list[1].text']: heartay[0]
    })

  }
  else if (60 <= heart && heart <= 100) {
    that.setData({
      colorh: '#3CB371',
      ['imggu[1]']: '/images/check/water.png',
      positionh: '47%',
      ['list[1].result']: '健康',
      ['list[1].text']: heartay[1]
    })

  }
  else if (100 < heart && heart <= 160) {
    that.setData({
      colorh: '#F5C400',
      ['imggu[1]']: '/images/check/water5.png',
      positionh: '75%',
      ['list[1].result']: '偏高',
      ['list[1].text']: heartay[2]
    })

  }
  else {
    that.setData({
      colorh: '#E8251E',
      ['imggu[1]']: '/images/check/water3.png',
      positionh: '93%',
      ['list[1].result']: '极高',
      ['list[1].text']: heartay[2]
    })

  }
} 
var blood = function (that) {
  var blooday = []
  blooday = ['您的检测结果显示血压偏低，建议多饮水，增加血容量，可适当饮用咖啡、可可和浓茶；高营养、易消化和富含维生素的饮食，适当补充维生素C、维生素B族和维生素pp等；忌食生冷寒凉、破气降压的食物，如玉米、萝卜、芹菜、冷饮等；适当进行有助于改善心肺功能的运动，如太极拳、气功、慢跑等。如有贫血，宜适当多吃富含蛋白质、铁、铜、叶酸、维生素B12、维生素C及造血原料的食物，如猪肝、蛋黄、瘦肉、牛奶等。如是食少纳差者，宜适当食用能刺激食欲的食物和调味品，如姜、葱、醋等。如需帮助，可上医院咨询医生', '您的检测结果在正常范围之内，请继续保持哟！作息规律、饮食均衡、适量运动、保持心情舒畅是维持健康的不二法宝', '您的检测结果显示轻度高血压，建议均衡膳食，以低钠及高钙、钾、镁食物为主，控制体重；限盐（每天用盐量小于6克）、戒烟限酒；有恒、有序、有度的进行运动；提高自控能力，避免过度的喜怒哀乐，保持心情宽松平静，养成良好的睡眠习惯；学会血压监测，日常生活中可以降压茶、决明子茶、罗布麻茶为饮品，调节人体机理平衡，增强人体抵抗力。如血压持续维持在较高水平，建议在医生指导下，根据血压情况，选用降压药治疗。建议咨询医生','您的检测结果显示严重高血压，如血压持续维持在较高水平，建议在医生指导下服用降压药控制血压，进行血压监测。清淡饮食，一般体力及脑力劳动者每日食物种类：谷类以250~400g（粗细粮搭配）；蔬菜300~500g，以黄绿色为佳；水果100~200g；三份高蛋白，每份约100g；植物油（豆油、花生油、葵花籽油）18g；食盐5g；每餐八分饱。控制体重，戒烟戒酒，减轻精神压力，保持心理平衡，减少情绪波动，维持心情平静。必须在药物治疗及血压稳定后才可进行运动，以有氧运动为主要运动方式，如快步走、散步等，运动时间以身体无不适为度，一般30分钟/次。如需帮助，可上医院咨询医生']
  var  conblood = that.data.list[2].datasanf
  var exblood = that.data.list[2].datasans
  if (50 <= conblood && conblood <= 70 && 30 <= exblood && exblood <= 40) {
    that.setData({
      colorx: '#943D92',
      ['imggu[2]']: '/images/check/water2.png',
      positionx: 0,
      ['list[2].result']: '极低',
      ['list[2].text']: blooday[0]
    })
  }
  else if (70 < conblood && conblood <90 && 40 < exblood && exblood <60) {
    that.setData({
      colorx: '#06B9D1',
      ['imggu[2]']: '/images/check/water4.png',
      positionx: '20%',
      ['list[2].result']: '偏低',
      ['list[2].text']: blooday[0]
    })

  }
  else if (90 <= conblood && conblood <= 140 && 60 <= exblood && exblood <= 90) {
    that.setData({
      colorx: '#3CB371',
      ['imggu[2]']: '/images/check/water.png',
      positionx: '47%',
      ['list[2].result']: '健康',
      ['list[2].text']: blooday[1]
    })

  }
  else if (140 < conblood && conblood < 160 && 90 < exblood && exblood < 110) {
    that.setData({
      colorx: '#F5C400',
      ['imggu[2]']: '/images/check/water5.png',
      positionx: '75%',
      ['list[2].result']: '偏高',
      ['list[2].text']: blooday[2]
    })

  }
  else {
    that.setData({
      colorx: '#E8251E',
      ['imggu[2]']: '/images/check/water3.png',
      positionx: '93%',
      ['list[2].result']: '极高',
      ['list[2].text']: blooday[3]
    })

  }
} 
var tempra = function (that) {
  var tempraay = []
  tempraay = ['您的检测结果显示体温偏低。体温偏低可由低温环境、生理性及病理性原因引起，建议脱离低温环境后再进行测量，如持续体温偏低，伴呼吸心率减慢、嗜睡等，建议咨询医生，排除病理性原因影响；仅有体温偏低的情况无其他不适，建议合理安排作息，保证充足的睡眠、均衡营养的饮食和适当的运动，长期坚持可改善体温偏低的情况', '您的检测结果在正常范围之内，请继续保持哟！作息规律、饮食均衡、适量运动、保持心情舒畅是维持健康的不二法宝', '您的检测结果显示体温偏高，建议多饮温水，避免受凉，使用退热贴，采用温水擦浴的方法进行物理降温，如温度持续升高，建议在医生的指导下服用退烧药。如需帮助，可上医院咨询医生','您的检测结果显示体温过高，建议到医院就诊查明病因，使用药物退热。多饮温水，避免受凉，使用退热贴。如温度反复升高，不要担心，是正常现象，在引起发热的疾病未完全治愈的情况下，温度可反复升高']
  var tempra= that.data.list[3].data
  if (30 <= tempra && tempra <= 34) {
    that.setData({
      colort: '#943D92',
      ['imggu[3]']: '/images/check/water2.png',
      positiont: 0,
      ['list[3].result']: '极低',
      ['list[3].text']: tempraay[0]
    })
  }
  else if (34 < tempra && tempra <= 36) {
    that.setData({
      colort: '#06B9D1',
      ['imggu[3]']: '/images/check/water4.png',
      positiont: '20%',
      ['list[3].result']: '偏低',
      ['list[3].text']: tempraay[0]
    })

  }
  else if (36 < tempra && tempra <= 38) {
    that.setData({
      colort: '#3CB371',
      ['imggu[3]']: '/images/check/water.png',
      positiont: '47%',
      ['list[3].result']: '健康',
      ['list[3].text']: tempraay[1]
    })

  }
  else if (38 < tempra && tempra <= 41) {
    that.setData({
      colort: '#F5C400',
      ['imggu[3]']: '/images/check/water5.png',
      positiont: '75%',
      ['list[3].result']: '偏高',
      ['list[3].text']: tempraay[2]
    })

  }
  else {
    that.setData({
      colort: '#E8251E',
      ['imggu[3]']: '/images/check/water3.png',
      positiont: '93%',
      ['list[3].result']: '极高',
      ['list[3].text']: tempraay[3]
    })

  }
} 
var sleep= function (that) {
  var sleepay = []
  sleepay = ['您的检测结果显示睡眠不足，睡眠不足会带来许多身心的伤害：思考能力会下降、警觉力与判断力会削弱、免疫功能会失调、生物钟会失去平衡等等。建议您睡前不要过于兴奋，保持情绪平稳，晚餐吃一些比较容易消化的清淡食品，饮用一些促进入睡的汤类或饮品。按时就寝，不要熬夜，合理安排时间工作，养成良好的作息习惯', '您的检测结果在正常范围之内，请继续保持哟！作息规律、饮食均衡、适量运动、保持心情舒畅是维持健康的不二法宝','您的检测结果显示睡眠过量。睡眠过量易导致身体虚弱、疲劳，影响消化和神经系统功能。建议作息规律，合理安排时间，减少白天睡眠时间，小睡30分钟即可，晚上11点前就寝，劳逸结合']
  var sleep = that.data.sleep.data
  if ( 0< sleep && sleep  <= 4) {
    that.setData({
      percent:20,
      ['sleep.text']: sleepay[0]
    })
  }
  else if (4 < sleep && sleep < 8) {
    that.setData({
      percent: 40,
      ['sleep.text']: sleepay[0]
    })

  }
  else if (8 <= sleep && sleep <= 10) {
    that.setData({
      percent: 60,
      ['sleep.text']: sleepay[1]
    })

  }
  else if (10 < sleep && sleep <= 15) {
    that.setData({
      percent: 80,
      ['sleep.text']: sleepay[2]
    })

  }
  else {
    that.setData({
      percent: 90,
      ['sleep.text']: sleepay[2]
    })

  }
} 

var diet = function (that) {
  var dietay = []
  dietay = ['您的测试结果达到A级健康标准，祝贺您!能达到这个级别的人并不多，说明您非常了解如何健康地安排饮食，有良好的饮食健康意识和生活习惯，有高水准的饮食安全与营养方面的知识，请继续保持！', '您的测试结果达到B级健康标准，很出色!您和您的家人有较高水准的饮食安全与营养知识，有较高水平的健康饮食理念、方式和习惯。您的健康饮食水平高出平均水平，但还有可以提升的地方，请继续保持！', '您的测试结果达到C级健康标准，您的饮食健康状况处在中等水平。在越来越注重饮食健康的今天，您没有落伍，但还需要努力，才能更好地保持并增进健康。您需要关注食品健康方面的信息，以获取更多的食品安全与营养方面的知识，提高健康意识，注重改变健康饮食方式和习惯','您的测试结果达到D级健康标准，很遗憾，您的饮食状况不健康。如果不加以改变，饮食对身体造成的损害会以您意想不到的方式显现出来。为了您和您的家人的健康与幸福，请您马上对你的饮食方式和习惯做出调整，密切关注饮食健康和相关咨询，尽力改善现在的饮食状况']
  var diet = that.data.diet.data
  if (30 < diet && diet  <= 40) {
    that.setData({
      dietfour:'A级',
      ['diet.text']: dietay[0]
    })
  }
  else if (20 < diet && diet <= 30) {
    that.setData({
      dietfour: 'B级',
      ['diet.text']: dietay[1]
    })

  }
  else if (10 < diet && diet <= 20) {
    that.setData({
      dietfour: 'C级',
      ['diet.text']: dietay[2]
 
    })

  }
  else {
    that.setData({
      dietfour: 'D级',
      ['diet.text']: dietay[3]
    })

  }
} 
var  statu= function (that) {
  var statuay = []
  statuay = ['您的测试结果状况欠佳，精神状况较差，建议立即采取一定措施，加以改善。必要时可以去看专科或进行心理咨询', '您的测试结果状况一般，精神状况不稳定，很可能正在走下坡路，因此，对各种生活环境的适应能力也正在减退。这种状况要想得到好转，不仅需要一段时间，而且需要付出物质和意志方面的代价','您的测试结果状况较佳，精神状况良好。性格坚强，理解力、工作适应 能力、感情状况都不错。这为生活的幸福和事业的成功提供了好的先决条件。请继续保持！']
  var statu = that.data.statu.data
  if (9 <= statu && statu <=15 ) {
    that.setData({
      statufour: '欠佳',
      ['statu.text']: statuay[0]
    })
  }
  else if (15 < statu && statu<= 22) {
    that.setData({
      statufour: '一般',
      ['statu.text']: statuay[1]
    })

  }
  else {
    that.setData({
      statufour: '良好',
      ['statu.text']: statuay[2]
    })

  }
} 

Page({
data:{
  phone:'',
  username:'',
  sex:'',
  positionw: 0,
  positionh:0,
  positionx: 0,
  positiont: 0,
  colorw:'',
  colorh: '',
  colorx: '',
  colort: '',
list:[
  {
  name: '体重', time: '2017-06-12', namerus: '体重测量结果：', 
  imgurlf: '/images/check/weight.png', imgurls:'/images/check/doctor1.png',
  result:'健康',data:'54.0',  advice:'专项建议',
  text: '您的检测结果显示体重过轻，需要加强营养，补充优质蛋白 ' 
  },
  {
    name: '心率', time: '2016-01-12', namerus: '心率测量结果：',
    imgurlf: '/images/check/xin.png', imgurls: '/images/check/doctor2.png',
    result: '极低', data: '5', advice: '专项建议',
    text: '您的检测结果显示体重过轻，需要加强营养，补充优质蛋白 '
  },
  {
    name: '血压', time: '2016-01-03', namerus: '血压测量结果：',
    imgurlf: '/images/check/blood.png', imgurls: '/images/check/doctor3.png',
    result: '极低', datasanf: '20', datasans: '100', advice: '专项建议',
    text: '您的检测结果显示体重过轻，需要加强营养，补充优质蛋白 '
  },
  {
    name: '体温', time: '2015-01-03', namerus: '体温测量结果：',
    imgurlf: '/images/check/temp.png', imgurls: '/images/check/doctor4.png',
    result: '极高', data: '37.0', advice: '专项建议',
    text: '您的检测结果显示体重过轻，需要加强营养，补充优质蛋白 '
  },
],
  sleep: {data:10 ,text: '您的检测结果显示体重过轻，需要加强营养，补充优质蛋白 '},
  diet: { data: 20, text: '您的检测结果显示体重过轻，需要加强营养，补充优质蛋白 '},
  statu: { data: 27, text: '您的检测结果显示体重过轻，需要加强营养，补充优质蛋白 ' },
guding:['极低','健康','极高'],
  imggu: ['/images/check/water.png', '/images/check/water.png', '/images/check/water.png', '/images/check/water.png','/images/arrowdown.png'],
datause: ['kg', 'bpm', 'mmHg','℃']

},
onShow(options){
  var that = this
  that.setData({
    time: util.formatTime(new Date(), 'year'),
  })
  wx.getStorage({
    key: 'phone',
    success: function (res) {
      that.setData({
        phone: res.data,
      })
      wx.request({
        url: app.host_url + 'checkcha', //仅为示例，并非真实的接口地址
        header: {
          "Content-Type": "application/json"
        },
        method: "POST",
        data: that.data,
        success: function (res) {
        that.setData({
          ['list[0].data']:res.data[0].weight,
          ['list[1].data']: res.data[0].heart,
          ['list[2].datasanf']: res.data[0].conblood,
          ['list[2].datasans']: res.data[0].exblood,
          ['list[3].data']: res.data[0].temp,
          ['sleep.data']:res.data[0].sleep,
          ['diet.data']: res.data[0].diet,
          ['statu.data']: res.data[0].statu,
          username: res.data[0].username,
          sex: res.data[1].sex,
        }) 
        weight(that)
        heart(that)    
        blood(that) 
        tempra(that) 
        sleep(that)
        diet(that)
        statu(that)
        }
      })
    }
  })


},

checkst:function(e){
  var id = e.currentTarget.id
  wx.navigateTo({
    url: '/pages/check/hand?id='+id,
  })

},
heladvice:function(e){
  var that=this
  var id = e.currentTarget.id
  if(id==5){
    var content = that.data.sleep.text
  }else if(id==6){
    var content = that.data.diet.text
  } else if (id == 7){
    var content = that.data.statu.text
  }
  else{
    var content = that.data.list[id].text
  }

  wx.navigateTo({
    url: '/pages/check/heladvice?content='+content,
  })

}

})
