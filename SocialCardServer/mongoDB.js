var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var Author, Channel, Card;

var authorSchema = new Schema({
	author_id: Number,
	author_picture: { data: Buffer, contentType: String },
	author_name: String,
	author_username: { type: String, required: true, unique: true },
	author_password: String,
	author_about: String,
	created_at: Date,
	updated_at: Date,
})

var channelSchema = new Schema({
	channel_id: Number,
	channel_handel: String,
	channel_name: String,
	channel_picture: { data: Buffer, contentType: String },
	channel_tagline: String,
	channel_cards: Array,
})

var cardSchema = new Schema({
	card_id: Number,
	card_picture: { data: Buffer, contentType: String },
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
});

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
				.catch((err) => { console.log(err); cb("error"); })
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
						console.log("old: ",JSON.stringify(oldChannel.channel_cards));
						if (oldChannel.channel_cards == undefined) cards = [res.card_id];
						else cards = [...oldChannel.channel_cards, res.card_id];
						console.log("new: ",JSON.stringify(cards))
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

module.exports = mongodb;
