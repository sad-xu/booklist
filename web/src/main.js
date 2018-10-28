import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false



// 全局监听URL变化

// window.addEventListener("popstate", e => {
// 	console.log(e,11)
	// window.routers.forEach(item => {
	// 	item.push()
	// })
// })

// 监听url变化，并同时改变所有项目的路由
// NOW： 在每个项目里用vue-router监听
// TODO: 全局监听url改变事件
const NAME = 'home'
router.afterEach((to, from) => {
	// let routerName = to.path.split('/')[1]
	// console.log(to.path)
	// if (routerName.length) {
		window.routers.forEach(item => {
			if (item.name !== NAME) {
				item.router.push({path: to.fullPath})				
			}
		})
	// }
})

window.routers = [{name: NAME, router}]

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
