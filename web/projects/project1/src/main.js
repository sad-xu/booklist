// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

// 
const NAME = 'project1'
router.afterEach((to, from) => {
	// let routerName = to.path.split('/')[1]
	// if (routerName.length) {
		window.routers.forEach(item => {
			if (item.name !== NAME) {
				item.router.push(to.fullPath)				
			}
		})
	// }
})

window.routers.push({name: NAME, router})  // 




/* eslint-disable no-new */
new Vue({
  el: '#project1',
  router,
  components: { App },
  template: '<App/>'
})
