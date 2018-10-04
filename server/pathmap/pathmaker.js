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
	if (str[0] === '.') {
		return false
	}
	return true
}

let mapArr = []


let num = 0

function start(str) {
	num++
	console.log(num)
	// sync
	let requireArr = getRequires(fs.readFileSync(str, 'utf8'))
	requireArr.forEach((item, index) => {
		mapArr.push({from: item, to: str})
		if (!isNPM(item)) {
			start(item)
		}
	})
	num--
	console.log(num)

	// async
	// fs.readFile(str,'utf8', (err, data) => {
	// 	if (err) throw err
	// 	num--
	// 	let requireArr = getRequires(data)
	// 	requireArr.forEach((item, index) => {
	// 		mapArr.push({from: item, to: str})
	// 		if (!isNPM(item)) {
	// 			start(item)
	// 		}
	// 	})
	// 	console.log('map', mapArr)
	// })
	
}

start('./app.js')
console.log('map', mapArr)
initData(mapArr)


function initData(data) {
	let nodeData = [],
			nodeArr = [],
			linkData = [];
	data.forEach((item, index) => {
		let {from, to} = item
		if (nodeArr.indexOf(from) < 0) nodeArr.push(from)
		if (nodeArr.indexOf(to) < 0) nodeArr.push(to)
		linkData.push({source: from, target: to})
	})
	nodeArr.forEach(item => {
		nodeData.push({id: item, name: item})
	})
	console.log(nodeData)
	console.log(linkData)
}