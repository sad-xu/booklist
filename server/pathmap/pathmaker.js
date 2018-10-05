const fs = require('fs')

// 获取require的包名
function getRequires(str) {
	let arr = str.match(/require\('(\S*)'\)/mg)
	return arr.map(item => {
		let name = item.replace(/\\/g, '').replace(/'/g,'"').slice(9,-2)
		if (isNPM(name)) return extract(name)
		else return name
	})
}

// 提取npm包名  a -> a   a/index.js -> a (防止同一个包,因写法不同导致被认为是两个)
function extract(str) {
	let match
  if (/^@/.test(str)) {
    match = /^(?:(@[^/]+)[/]+)([^/]+)[/]?/.exec(str)
    if (!match || !match[1] || !match[2]) return null
    return [ match[1], match[2] ].join('/')
  } else {
    match = /^([^/]+)[/]?/.exec(str)
    if (!match) return null
    return match[1] || null
  }
}

// 根据包名判断来源
function isNPM(str) {
	let reg = /^(?:\.\.?(?:\/|$)|\/|([A-Za-z]:)?[\\\/])/
	return !reg.test(str)
}

let mapArr = []

function start(str) {
	// sync
	let requireArr = getRequires(fs.readFileSync(str, 'utf8'))
	requireArr.forEach((item, index) => {
		mapArr.push({from: item, to: str})
		if (!isNPM(item)) {
			start(item)
		}
	})

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

function initData(data) {
	let nodeData = [],
			nodeArr = [],
			linkData = [];
	data.forEach((item, index) => {
		let {from, to} = item
		if (nodeArr.indexOf(to) < 0) nodeArr.push(to)
		if (nodeArr.indexOf(from) < 0) nodeArr.push(from)
		linkData.push({source: from, target: to})
	})
	nodeArr.forEach(item => {
		nodeData.push({name: item})
	})
	console.log(nodeData)
	console.log(linkData)
}


start('./app.js')
initData(mapArr)



