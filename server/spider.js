// 龙空精选集


const axios = require('axios')
const cheerio = require('cheerio')

const LIST_URL = 'http://www.yousuu.com/topshow/digest?page='  // 列表
const DETAIL_URL = 'http://www.yousuu.com/book/'               // 详情
const COMMENT_URL = 'http://www.yousuu.com/ajax/nextcomment?' // 评论 bid=116784&nexttime=1534058196708
const REPLY_URL = 'http://www.yousuu.com/ajax/getonecomment?cid='  // 评论的回复

/**************** 请求 *********************/
// 列表爬虫入口 
function listSpider(num) {
	let url = LIST_URL + num;
	axios.get(url)
		.then(res => {
			if (res.status === 200) {
				getListData(res.data)
			} else {
				console.log('page=' + num + '!err:' + res.status)
			}
		})
		.catch(err => {
			console.log(err)
		})
}

// 详情爬虫入口
function detailSpider(id) {
	let url = DETAIL_URL + id
	axios.get(url)
		.then(res => {
			if (res.status === 200) {
				getDetailData(res.data)
			} else {
				console.log('id=' + id + '!err' + res.status)
			}
		})
		.catch(err => {
			console.log(err)
		})
}

// 评论入口
function getComments(bid, nexttime) {
	let url = COMMENT_URL + 'bid=' + bid + '&nexttime=' + nexttime
	axios.get(url)
		.then(res => {
			let data = res.data;
			if (data.ok) {
				getCommentsData(data.comment).then(next => {
					console.log(next)
					if (next) {
						setTimeout(function() {
							getComments(bid, next)
						}, 2000)
					} else {
						return false
					}
				})
				.catch(err => console.log(err))
			} else {
				console.log('bid=' + bid + ' time=' + nexttime + ' !err' + res.status)
			}
		})
		.catch(err => {
			console.log(err)
		})
}

// 回复入口
function getReply(cid) {
	let url = REPLY_URL + cid
	return axios.get(url)
		.then(res => {
			if (res.status === 200) {
				let data = res.data
				return getReplyData(data)
			} else {
				console.log('cid=' + cid + '!err' + res.status)
			}
		})
		.catch(err => {
			console.log(err)
		})
}

/************************ 处理 ********************************/
/* 列表数据处理
	id    
	name  书名
	auth  作者
	tag   标签
	score 评分
*/
function getListData(d) {
	const $ = cheerio.load(d)
	let bookList = $('.table').find('.yshover')
	bookList.each(function(item, index) {
		let tr = $(this),
				obj = {};
		obj.id = tr.attr('id').split('_')[1]  // id
		let tds = tr.children()
		let arr = tds.eq(0).text().split(']')
		obj.tag = arr[0].slice(1)
		obj.name = arr[1].trim()
		obj.auth = tds.eq(1).text()
		obj.score = tds.eq(2).text()
		// console.log(obj)

	})
}


/* 详情数据处理
	cover 封面
	wordage 字数
	chapter 章节数 
	from 来源
	update 更新时间
	marknum 评价数
	progress 评分比例
*/
function getDetailData(d) {
	const $ = cheerio.load(d)
	let obj = {}
	// 封面
	let cover = $('.bookavatar').first().attr('src')  
	let bookmain = $('.ys-bookmain').find('li')
	// 字数
	let wordage = Number(bookmain.eq(1).text().split(':')[1].trim().slice(0,-1))  
	// 章节数
	let chapter = Number(bookmain.eq(2).text().split(':')[1].trim().slice(0,-1)) 
	// 来源
	let from = bookmain.eq(3).text().split(':')[1].trim()
	// 更新时间
	let update = new Date('20' + bookmain.eq(4).text().slice(6)).getTime()
	// 评价数
	let marknum = Number($('.ys-book-averrate').first().children().last().text().match(/\d+/g)[0]) 
	// 评分比例
	let progress = $('.progress').text().split('%').slice(0,-1).join(';')
	// 简介
	let bookinfo = $('#bookinfo').text()
	obj = {
		cover: cover,
		wordage: wordage,
		chapter: chapter,
		from: from,
		update: update,
		marknum: marknum,
		progress: progress,
		bookinfo: bookinfo
	}
	console.log(obj)

	// 评论区
	
}


/* 评论区
	cid 
	time
*/
function getCommentsData(comment) {
	const $ = cheerio.load(comment)
	let wrapper = $('.thumbnail .caption')
	let arr = []
	wrapper.each(function(i) {
		let item = $(this).children().first()
		let obj = {
			cid: item.attr('data-cid'),  // 评论id
			time: new Date(item.find('.small').text()).getTime()  // 评论发布时间
		}
		arr.push(obj)
	})
console.log(arr)
	// 一批20个评论
	return Promise.all(
			arr.map(function(item, index) {
				return getReply(item.cid)
					.then(res => {
						res.time = item.time
						console.log(res)  // 完整的评论数据  待存储
					})
					.catch(err => console.log(err))
			})
		)
		.then(res => {
			// 是否有下一页
			if ($('#next_comment_btn').length) {
				let msg = $('#next_comment_btn').children().first().attr('onclick').split("'")
				// bid msg[1]
				let nexttime = msg[3]
				console.log('下一页', nexttime)
				return nexttime
			} else {
				console.log('最后一页')
				return false
			}
		})
		.catch(err => console.log(err))
}




/* 评论详情及回复
	message 
	starnum
	replynum
	reply  [str]
*/
function getReplyData(data) {
	let obj = {}
	let comment = data.comment
	obj.message = cheerio.load(comment.message).text().trim()  // 评论内容
	obj.starnum = comment.starnum ? comment.starnum : 0  // 赞同数
	obj.replynum = comment.replynum ? comment.replynum : 0   // 回复数
	// 回复
	let arr = []
	let replys = data.replys
	replys.forEach(function(item, index) {
		let msg = item.message
		// if (msg.indexOf('</a>') >= 0) {  // 包含a标签
		// 	let i = msg.indexOf('</a>')
		// 	msg = msg.substring(i + 4)
		// }
		arr.push(cheerio.load(msg).text().trim())
	})
	obj.reply = arr
	return obj
}


// listSpider(4)
// detailSpider(43326)
getComments(46970, 1534060143850)
