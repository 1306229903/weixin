//app.js
import wux from 'components/wux'
App({
  onLaunch: function (){

  },
  globalData: {
    userInfo: null
  },
  host_url:'https://mrxiao6.me/',

	// 通过scope来引入wux函数
	wux: (scope) => new wux(scope),
  

})




