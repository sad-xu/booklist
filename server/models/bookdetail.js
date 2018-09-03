const mongoose = require('mongoose')

const bookdetailSchema = mongoose.Schema({
	id: {
		type: Number,
		required: true,
		unique: true
	},
	name: {
		type: String,
		required: true
	},
	cover: {
		type: String,
		required: true
	},
	wordage: {
		type: Number,
		required: true
	},
	chapter: {
		type: Number,
		required: true
	},
	from: {
		type: String
	},
	update: {
		type: Number
	},
	marknum: {
		type: Number
	},
	progress: {
		type: Array
	},
	info: {
		type: String
	},
	tag: {
		type: String,
		default: ''
	},
	comment: [
		{
			message: String,
			starnum: Number,
			reply: [String]
		}
	]
})


const Bookdetail = mongoose.model('Bookdetail', bookdetailSchema)

module.exports = Bookdetail