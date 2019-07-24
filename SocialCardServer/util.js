var mongodb = require('./mongoDB');
var util = {}

util.createCard = (cb) => {
	let data = JSON.parse(` {
    "card_id" : 2000,
    "card_picture" : "",
    "card_authod_id" : 1,
    "card_channel_id" : 1,
    "card_creation_date" : "",
    "card_heading" : "Starting guide to learn react",
    "card_body" : "Can't pry yourself from the tutorials? The cure is to make tiny little expirement apps.",
    "card_website" : "dev.to",
    "card_likes" : {
        "liked_authors" : [
            1,
            3,
            4,
            5,
            6,
            7,
            8
        ],
        "liked" : "true"
    },
    "card_comments" : [
        {
            "comment_author" : "bhavana_hk",
            "comment_content" : "loved the post!"
        },
        {
            "comment_author" : "dave",
            "comment_content" : "great work ^^"
        }
    ],
    "card_share" : {
        "share_count" : 20,
        "shared" : "true"
    }
}`)
	mongodb.createCard(data, (res) => {
		cb(res)
	})
}

util.createAuthor = (cb) => {
	data = {
		author_id: 1,
		author_picture: "",
		author_name: "Bhavana HK",
		author_username: "bhavana_hk",
		author_password: "123345",
		author_about: "Hey there, I’m Bhavana. I’m a software engineer in the Boston area. These days I build frontend UIs with React. A couple years ago it was Angular. Long ago, I wrote software in C and C++ (not even for the web).\n\nThis blog contains my best answers to questions that UI developers struggle with. Most of the posts are about React or Angular, with a few other random things thrown in.\n\nI wrote a book about how to learn React – it’s called Pure React and you should check it out if you’ve wanted to learn React but have had trouble getting going.\n\nI also publish a weekly(ish) newsletter which you can sign up for right here. You’ll be granted access to my vault of Subscriber-Only Goodies when you sign up.\n\nI am @dceddia on Twitter. Follow me and say hi :)"
	};
	mongodb.createAuthor(data, (res) => {
		cb(res)
	})
}

util.createChannel  = (cb) => {
	let data = JSON.parse(` {
    "channel_id" : 1,
    "channel_handel" : "ThePracticalDev",
    "channel_name" : "The Practical Dev",
    "channel_picture" : "",
    "channel_tagline" : "Learning react? Start small",
    "channel_card_id" : [
        1000
    ]}`)
	mongodb.createChannel(data, (res) => {
		cb(res)
	})
}

module.exports = util;

/*

DB looks like:
author : {
    "_id" : ObjectId("5d358133d6d6c52cb4d86042"),
    "author_id" : 1.0,
    "author_picture" : "",
    "author_name" : "Bhavana HK",
    "author_username" : "bhavana_hk",
    "author_password" : "123345",
    "author_about" : "Hey there, I’m Bhavana. I’m a software engineer in the Boston area. These days I build frontend UIs with React. A couple years ago it was Angular. Long ago, I wrote software in C and C++ (not even for the web).\n\nThis blog contains my best answers to questions that UI developers struggle with. Most of the posts are about React or Angular, with a few other random things thrown in.\n\nI wrote a book about how to learn React – it’s called Pure React and you should check it out if you’ve wanted to learn React but have had trouble getting going.\n\nI also publish a weekly(ish) newsletter which you can sign up for right here. You’ll be granted access to my vault of Subscriber-Only Goodies when you sign up.\n\nI am @dceddia on Twitter. Follow me and say hi :)"
}
channel : {
    "_id" : ObjectId("5d358531d6d6c52cb4d86046"),
    "channel_id" : 1.0,
    "channel_handel" : "ThePracticalDev",
    "channel_name" : "The Practical Dev",
    "channel_picture" : "",
    "channel_tagline" : "Learning react? Start small",
    "channel_card_id" : [
        1000.0
    ]
}
card : {
    "_id" : ObjectId("5d358754d6d6c52cb4d86047"),
    "card_id" : NumberLong(1000),
    "card_picture" : "",
    "card_authod_id" : NumberLong(1),
    "card_channel_id" : NumberLong(1),
    "card_creation_date" : Timestamp(1563804000, 0),
    "card_heading" : "Starting guide to learn react",
    "card_body" : "Can't pry yourself from the tutorials? The cure is to make tiny little expirement apps.",
    "card_website" : "dev.to",
    "card_likes" : {
        "liked_authors" : [
            1.0,
            3.0,
            4.0,
            5.0,
            6.0,
            7.0,
            8.0
        ],
        "liked" : true
    },
    "card_comments" : [
        {
            "comment_author" : "bhavana_hk",
            "comment_content" : "loved the post!"
        },
        {
            "comment_author" : "dave",
            "comment_content" : "great work ^^"
        }
    ],
    "card_share" : {
        "share_count" : 20.0,
        "shared" : true
    }
}
*/
