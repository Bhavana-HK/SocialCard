var mongoose = require('mongoose')
var _ = require('lodash')
var Schema = mongoose.Schema;
var Author, Channel, Card;

var authorSchema = new Schema({
	author_id: { type: Number, unique: true, index: true, required: true },
	author_picture: { content: Buffer, contentType: String },
	author_name: String,
	author_username: { type: String, required: [true, "username cannot be empty"], unique: [true, "username not available"] },
	author_password: { type: String, required: true, minlength: 5, maxlength: 12 },
	author_about: String,
	author_email: { type: String, required: true, unique: [true,"account already associated with this email"] },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })

var channelSchema = new Schema({
	channel_id: { type: Number, unique: true, index: true, required: true },
	channel_handel: String,
	channel_name: String,
	channel_picture: { content: Buffer, contentType: String },
	channel_tagline: String,
	channel_cards: Array,
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

var cardSchema = new Schema({
	card_id: { type: Number, unique: true, index: true, required: true },
	card_picture: { content: Buffer, contentType: String },
	card_id: Number,
	card_authod_id: Number,
	card_channel_id: Number,
	card_creation_date: Date,
	card_heading: String,
	card_body: String,
	card_website: String,
	card_likes: {
		liked_authors: Array,
		liked: Boolean
	},
	card_comments: [{
		comment_author: String,
		comment_content: String
	}],
	card_share: { share_count: Number, shared: Boolean }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

var connect = (cb) => {
	// return new Promise((resolve, reject)=>{
	mongoose.connect('mongodb://localhost:27017/admin', { useNewUrlParser: true });
	var db = mongoose.connection;
	db.on('error', () => {
		console.error.bind(console, 'connection error:')
		cb("error");
	});
	db.once('open', function () {
		console.log("connected")
		Author = mongoose.model('author', authorSchema);
		Channel = mongoose.model('channel', channelSchema);
		Card = mongoose.model('card', cardSchema);
		cb("connected");
	})
	// })
}

var mongodb = {}

mongodb.createAuthor = (data, cb) => {
	connect((res) => {
		if (res == "connected") {
			var authorDocumnet = new Author(data);
			authorDocumnet.save()
				.then((res) => { cb(res) })//contains the inserted data
				.catch((err) => { console.log(err); cb(null,err); })
		}
		else { cb("error") }
	})
}

mongodb.createChannel = (data, cb) => {
	connect((res) => {
		if (res == "connected") {
			var channelDocumnet = new Channel(data);
			channelDocumnet.save()
				.then((res) => { cb(res) })
				.catch((err) => { console.log(err); cb("error"); })
		}
		else { cb("error") }
	})
}

mongodb.createCard = (data, cb) => {
	connect((res) => {
		if (res == "connected") {
			var cardDocumnet = new Card(data);
			cardDocumnet.save()
				.then((res) => {
					//update the channel as well
					Channel.findOne({ channel_id: res.card_channel_id }, (err, oldChannel) => {
						console.log("Channel found! ", JSON.stringify(oldChannel))
						console.log("old: ", JSON.stringify(oldChannel.channel_cards));
						if (oldChannel.channel_cards == undefined) cards = [res.card_id];
						else cards = [...oldChannel.channel_cards, res.card_id];
						console.log("new: ", JSON.stringify(cards))
						Channel.findOneAndUpdate({ channel_id: res.card_channel_id }, { $set: { channel_cards: cards } }, { new: true }, (err, updatedChannel) => {
							if (err) cb("error")
							console.log("Channel Updated!", JSON.stringify(updatedChannel))
						});
					})
					cb(res)
				})
				.catch((err) => { console.log(err); cb("error"); })
		}
		else { cb("error") }
	})
}

mongodb.getMaxCardId = (cb) => {
	connect((res) => {
		if (res == "connected") {
			Card.find({})
				.sort({ "card_id": -1 })
				.limit(1)
				.exec(function (err, doc) {
					let maxCardId = doc[0].card_id;
					console.log("max id", maxCardId)
					cb(maxCardId)
				});
		}
		else {
			cb("err")
		}
	})
}

mongodb.getMaxChannelId = (cb) => {
	connect((res) => {
		if (res == "connected") {
			Channel.find({})
				.sort({ "channel_id": -1 })
				.limit(1)
				.exec(function (err, doc) {
					let maxChannelId = doc[0].channel_id;
					console.log("max id", maxChannelId)
					cb(maxChannelId)
				});
		}
		else {
			cb("err")
		}
	})
}

mongodb.getMaxAuthorId = (cb) => {
	connect((res) => {
		if (res == "connected") {
			Author.find({})
				.sort({ "author_id": -1 })
				.limit(1)
				.exec(function (err, doc) {
					let maxAuthorId = doc[0].author_id;
					console.log("max id", maxAuthorId)
					cb(maxAuthorId)
				});
		}
		else {
			cb("err")
		}
	})
}

mongodb.getAllCards = (cb) => {
	connect((res) => {
		if (res == "connected") {
			Card.find({})
				.sort({ "card_creation_date": -1 })
				.lean()
				.exec((err, docs) => {
					cb(docs);
				})
		}
		else cb("err")
	})
}

mongodb.verifyUsernameOrEmailAndPassword = (usernameOrEmail, password, cb) => {
	connect((res) => {
		if (res == "connected") {
			Author.find({
				$or: [
					{ $and: [{ author_username: usernameOrEmail }, { author_password: password }] },
					{ $and: [{ author_email: usernameOrEmail }, { author_password: password }] }
				]
			})
				.exec((err, doc) => {
					console.log("DB: verifyUsernameOrEmailAndPassword: ", doc)
					if (err) {
						console.log(err); cb(null);
					}
					else {
						if (!_.isEmpty(doc)) cb(doc);
						else cb(null)
					}
				})
		}
	})
}

mongodb.verifyUsernameOrEmailExists = (usernameOrEmail, cb) => {
	connect((res) => {
		if (res == "connected") {
			Author.find({ $or: [{ author_username: usernameOrEmail }, { author_email: usernameOrEmail }] })
				.exec((err, doc) => {
					console.log("DB: verifyUsernameOrEmailExists: ", doc)
					if (err) {
						console.log(err); cb(null);
					}
					else {
						if (!_.isEmpty(doc)) cb(doc);
						else cb(null)
					}
				})
		}
	})
}

module.exports = mongodb;
