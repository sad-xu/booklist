const fs = require('fs')

// 获取require的包名
function getRequires(str) {
	let arr = str.match(/require\('(\S*)'\)/mg)
	return arr.map(item => {
		return item.replace(/\\/g, '').replace(/'/g,'"').slice(9,-2)
	})
}

// 根据包名判断来源
function isNPM(str) {
	if (str[0] === '.' || str[0] === '.') {
		return false
	}
	return true
}

let mapArr = []

function start(str) {
	fs.readFile(str,'utf8', (err, data) => {
		if (err) throw err
		let requireArr = getRequires(data)	
		console.log(requireArr)
		requireArr.forEach((item, index) => {
			mapArr.push({from: item, to: str})
			if (!isNPM(item)) {
				start(item)
			}
		})
		console.log('map', mapArr)
	})	
}

start('./app.js')

