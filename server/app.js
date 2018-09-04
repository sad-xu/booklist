const app = require('express')()
const bodyParser = require('body-parser')
const api = require('./router/api.js')

// 解析post请求
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));

// 后端路由
// app.use('/', index);
app.use('/api', api);





app.listen(3000, () => {
	console.log('listening port 3000...')
})
