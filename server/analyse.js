/* 数据分析 */
const mongoose = require('mongoose')

const Booklist = require('./models/booklist')
const Bookdetail = require('./models/bookdetail')

mongoose.connect('mongodb://localhost/BOOK', { useNewUrlParser: true })
	.then(res => console.log('数据库连接成功'))
	.catch(err => console.log(err))
mongoose.Promise = global.Promise;

/** 公用方法 **/
function chgTag(tag) {
	let tagObj = null
	if (tag === 'all') {
		tagObj = {}
	} else {
		tagObj = {tag: tag}
	}
	return tagObj
}


/** 
* 评分  最高/最低  (tag) 小说 
* {
*		tag 类别  默认所有
*		sort 排序方式  倒序 -1 正序 1   
*		num  返回条数  默认10
*	}
*/ 
function getScoreOfBook({tag = 'all', sort = -1, num = 10} = {}) {
	return Booklist.find(chgTag(tag)).sort({score: sort}).limit(num)
}

/** 
* 评论数  最多/最少  (tag) 小说
*	{
*		tag
*		sort
* 	num
* }
*/
function getCommentOfBook({tag = 'all', sort = -1, num = 10} = {}) {
	return Bookdetail.aggregate(
		[
			{ $match: chgTag(tag) },
			{ $project: {name: 1, arr_size: {$size: '$comment'}} }, 
			{ $sort: {arr_size: sort} }, 
			{ $limit: num }
		])
}


/*
*	评价人数  最多/最少  (tag) 小说
*	{
*		tag
*		sort
*		num
*	}
*/
function getMarknumOfBook({tag = 'all', sort = -1, num = 10} = {}) {
	return Bookdetail.find(chgTag(tag), {name: 1, marknum: 1}).sort({marknum: sort}).limit(num)
}



/*
*	5/4/3/2/1星比例  高/低 (tag) 小说
*	{
*		tag
*		star  5 4 3 2 1
*		sort
* 	num
* }
*/
function getStarOfBook({tag = 'all', star = 5, sort = -1, num = 10} = {}) {
	return Bookdetail.aggregate(
		[
			{ $match: chgTag(tag) },
			{ $project: {name: 1, progress: 1, val: {$slice: ['$progress', star, 1]}} }, 
			{ $sort: {val: sort} }, 
			{ $limit: num }
		]
	)
}

/*
*	最近更新 小说
* {
*		tag
*		num
*	}
*/
function getLastUpdate({tag = 'all', num = 10} = {}) {
	return Bookdetail.find(chgTag(tag), {update: 1, name: 1}).sort({update: -1}).limit(num)
}


/*
*	本书/tag/all 点赞数 最多 的 评论
* {
*		id/tag   
* 	num
* }
*/
function getStarnumOfComment({id = undefined, tag = 'all', num = 10} = {}) {
	let obj = {}
	if (id) {  // id
		obj = {id: id}
	} else {  // tag
		obj = chgTag(tag)
	}
	return Bookdetail.aggregate(
		[
			{ $match: obj },
			{ $unwind: '$comment' },
			{ $project: {name: 1, msg: '$comment.message', num: '$comment.starnum'} }, 
			{ $sort: {num: -1} }, 
			{ $limit: num }
		]
	)
}


/*
*	本书/tag/all 回复数 最多 的评论
* {
*		id/tag
*   num
* }
*/
function getReplyNumOfComment({id = undefined, tag = 'all', num = 10} = {}) {
	let obj = {}
	if (id) {	//id
		obj = {id: id}
	} else {	// tag
		obj = chgTag(tag)
	}
	return Bookdetail.aggregate(
		[
			{ $match: obj },
			{ $unwind: '$comment' },
			{ $project: {name: 1, msg: '$comment.message', size: {$size: '$comment.reply'}} },  // $comment 
			{ $sort: {size: -1} }, 
			{ $limit: num }
		]
	)
}

/*
*	本书/tag/all 字数 最多 的评论        // 字数最多300， 考虑修改为精选评论
* {
*		id/tag
*		num
*	}
*/
function getWordNumOfComment({id = undefined, tag = 'all', num = 10} = {}) {
	let obj = {}
	if (id) {
		obj = {id: id}
	} else {
		obj = chgTag(tag)
	}
	return Bookdetail.aggregate(
		[
			{ $match: obj },
			{ $unwind: '$comment' },
			{ $project: {name: 1, msg: '$comment.message', wordNum: {$strLenCP: '$comment.message'}} },
			{ $sort: {wordNum: -1} },
			{ $limit: num }
		]
	)
}


// getWordNumOfComment({})
// 	.then(res => {
// 		console.log(res)
// 	})
// 	.catch(err => console.log(err))

/*
getLastUpdate()
	.then(res => {
		console.log(res)
	})
	.catch(err => console.log(err))
*/

/*
// 指定书id
getStarnumOfComment(44193)
	.then(res => {
		console.log(res)
	})
	.catch(err => console.log(err))
// 全部
getStarnumOfAllComment()
	.then(res => {
		console.log(res)
	})
	.catch(err => console.log(err))
*/



/*
getMarknumOfBook(1)
	.then(res => {
		console.log(res)
	})
	.catch(err => console.log(err))
*/


/*
getCommentOfBook({tag: '玄幻奇幻'})
	.then(res => {
		console.log(res)
	})
	.catch(err => console.log(err))
*/

/*
getScoreOfBook({tag: '科幻灵异', num: 5})
	.then(res => {
		let arr = res.map((item, index) => {
			return {
				name: item.name,
				score: item.score,
				auth: item.auth,
				tag: item.tag
			}
		})
		console.log(arr)
	})
	.catch(err => console.log(err))
*/

