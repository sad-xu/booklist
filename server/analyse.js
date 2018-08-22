/* 数据分析 */
const mongoose = require('mongoose')

const Booklist = require('./models/booklist')
const Bookdetail = require('./models/bookdetail')

mongoose.connect('mongodb://localhost/BOOK', { useNewUrlParser: true })
	.then(res => console.log('数据库连接成功'))
	.catch(err => console.log(err))
mongoose.Promise = global.Promise;



/** 
* 评分  最高/最低  小说 
*	sort 排序方式  倒序 -1 正序 1   
*	num  返回条数  默认10
*/ 
function getScoreOfBook(sort = -1, num = 10) {
	return Booklist.find().sort({score: sort}).limit(num)
		.then(res => {
			return res
		})	
		.catch(err => console.log(err))	
}

/** 
* 评论数  最多/最少  小说
*	sort
* num
*/
function getCommentOfBook(sort = -1, num = 10) {
	return Bookdetail.aggregate(
		[
			{
				$project: {
					name: 1,
					arr_size: {$size: '$comment'}   // 数组长度
				}
			}, {
				$sort: {arr_size: sort}
			}, {
				$limit: num
			}
		]).then(res => {
			return res
		}).catch(err => console.log(err))
}


/*
*	评价人数  最多/最少  小说
*	sort
*	num
*/
function getMarknumOfBook(sort = -1, num = 10) {
	return Bookdetail.find({}, {name: 1, marknum: 1}).sort({marknum: sort}).limit(num)
		.then(res => {
			return res
		})
		.catch(err => console.log(err))
}


getMarknumOfBook(1)
	.then(res => {
		console.log(res)
	})
	.catch(err => console.log(err))






/*
getCommentOfBook(1)
	.then(res => {
		console.log(res)
	})
	.catch(err => console.log(err))
*/

/*
getScoreOfBook(1, 10)
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
