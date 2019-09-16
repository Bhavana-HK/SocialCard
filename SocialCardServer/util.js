var fs = require('fs')
var mongodb = require('./mongoDB');
var util = {}

util.createCard = (inputData, cb) => {
    
    //console.log(data.card_picture.content)
    inputData.card_creation_date = Date.now();
    mongodb.getMaxCardId((maxCardId) => {
        inputData.card_id = maxCardId + 1;
        mongodb.createCard(inputData, (res) => {
            cb(res)
        })
    })
}

util.createAuthor = (inputData, cb) => {
    mongodb.getMaxAuthorId((maxAuthorId) => {
        inputData.author_id = maxAuthorId + 1;
        mongodb.createAuthor(inputData, (res, err) => {
            if (err) {
                res = {};
                res.result = "error";
                res.data = err.message;
                cb(res);
            }
            else {
                res = res.toObject();
                if (res.author_picture && res.author_picture.content) {
                    res.author_picture.content = res.author_picture.content.toString('base64')
                }
                cb(res)
            }
        })
    })
}

util.editAuthor = (inputData, cb) => {
    mongodb.modifyAuthor(inputData, (res, err) => {
        if (err) {
            res = {};
            res.result = "error";
            res.data = err.message;
            cb(res);
        }
        else {
            res = res.toObject();
            if (res.author_picture && res.author_picture.content) {
                res.author_picture.content = res.author_picture.content.toString('base64')
            }
            cb(res)
        }
    })
}

util.createChannel = (cb) => {
    let data = JSON.parse(` {
    "channel_handel" : "ThePracticalDev",
    "channel_name" : "The Practical Dev",
    "channel_picture" : "",
    "channel_tagline" : "Learning react? Start small",
    "channel_card_id" : [
        1000
    ]}`);
    mongodb.getMaxChannelId((maxChannelId) => {
        data.channel_id = maxChannelId + 1;
        mongodb.createChannel(data, (res) => {
            cb(res)
        })
    })
}

util.getAllCards = (cb) => {
    mongodb.getAllCards((cards) => {
        cards.forEach((card) => {
            if (card.card_picture && card.card_picture.content) {
                card.randomProperty = "teheee";
                card.card_picture.content = card.card_picture.content.toString('base64')
            }
        })
        console.log(cards)
        cb(cards);
    })
}

util.verifyAuthor = (usernameOrEmail, password, cb) => {
    let response = {}
    mongodb.verifyUsernameOrEmailAndPassword(usernameOrEmail, password, (author) => {
        if (author) {
            console.log("UTIL: verifyUsernameOrEmailAndPassword success ", author)
            response.result = "success";
            response.data = author;
            cb(response)
        }
        else {
            console.log("UTIL: verifyUsernameOrEmailAndPassword fail. Password and username/email not found")
            mongodb.verifyUsernameOrEmailExists(usernameOrEmail, (author) => {
                if (author) {
                    console.log("UTIL: verifyUsernameOrEmailExists success. User Exists")
                    response.result = "invalidPassword";
                    response.data = "Please enter the correct password";
                    cb(response)
                }
                else {
                    console.log("UTIL: verifyUsernameOrEmailExists fail. User doesnot exist")
                    response.result = "invaildUsernameOrEmail";
                    response.data = "Please enter a vaild Username or email address";
                    cb(response);
                }
            })
        }
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
