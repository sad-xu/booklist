const mongoose = require('mongoose')

const booklistSchema = mongoose.Schema({
	id: {
		type: Number,
		required: true,
		unique: true
	},
	name: {
		type: String,
		required: true
	},
	tag: {
		type: String,
		default: ''
	},
	score: {
		type: Number,
		required: true
	},
	auth: {
		type: String,
		required: true
	}
})

const Booklist = mongoose.model('Booklist', booklistSchema)

module.exports = Booklist