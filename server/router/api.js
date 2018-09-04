const express = require('express')
const router = express.Router()

const redis = require('redis')
const client = redis.createClient({password:'xhc151136'})
client.on('error', err => console.log("Error " + err))


router.get('/test/:id', (req, res) => {
	let id = req.params.id
	client.get(id, (err, reply) => {
		if (reply) {  // 有缓存
			res.json({id:reply, source: 'redis cache'})
		} else {    // 无缓存
			client.setex(id, 60, id+'_value')
			res.json({id:id, source: 'no cache'})
		}
	})
})


module.exports = router