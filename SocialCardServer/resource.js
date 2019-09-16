var formData = require('form-data');
var fs = require('fs');
var util = require('./util')
var _ = require('lodash')
var resource = {}

resource.getLastestCards = (req, res) => {
    util.getAllCards((cards) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify(cards))
        res.end()
    })
}
resource.createAuthor = (req, res) => {
    let inputData = req.body;
    inputData.author_picture = {}
    if (!_.isEmpty(req.file)) {
        inputData.author_picture.content = req.file.buffer;
        inputData.author_picture.contentType = req.file.mimetype;
    }
    util.createAuthor(inputData, (response) => {
        if (!_.isEmpty(response.result) && response.result == "error") {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.write(JSON.stringify(response))
            res.end()
        }
        else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify(response))
            res.end()
        }
    })
}

resource.editAuthor = (req, res) => {
    //edit this!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    let inputData = req.body;
    inputData.author_picture = {}
    if (!_.isEmpty(req.file)) {
        inputData.author_picture.content = req.file.buffer;
        inputData.author_picture.contentType = req.file.mimetype;
    }
    util.editAuthor(inputData, (response) => {
        if (!_.isEmpty(response.result) && response.result == "error") {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.write(JSON.stringify(response))
            res.end()
        }
        else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify(response))
            res.end()
        }
    })
}

resource.createCard = (req, res) => {
    let inputData = req.body;
    inputData.card_picture = {}
    if (!_.isEmpty(req.file)) {
        inputData.card_picture.content = req.file.buffer;
        inputData.card_picture.contentType = req.file.mimetype;
    }
    util.createCard(inputData, (response) => {
        if (!_.isEmpty(response.result) && response.result == "error") {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.write(JSON.stringify(response))
            res.end()
        }
        else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify(response))
            res.end()
        }
    })
}
resource.createChannel = (req, res) => {
    util.createChannel((createdChannel) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify(createdChannel))
        res.end()
    })
}

resource.signInAuthor = (req, res) => {
    let loginAuthor = req.body;
    console.log(loginAuthor);
    util.verifyAuthor(loginAuthor.userNameOrEmail, loginAuthor.password, (response) => {
        if (response) {
            if (response.result == "success") {
                console.log("succesfull signin")
                console.log(response);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify(response))
                res.end()
            }
            else {
                console.log("signin failed")
                console.log(response)
                res.writeHead(401, { "Content-Type": "application/json" });
                res.write(JSON.stringify(response))
                res.end()
            }
        }
        else {
            console.log("some error occured")
            response = {}
            response.data = "Some error error occured on the backend. Please try again later."
            res.writeHead(500, { "Content-Type": "application/json" });
            res.write(JSON.stringify(response))
            res.end()
        }
    })
}

/*resource.getArticle = (req, res) => {
    let articleId = req.params.id
    let encodedContent = migrationData.find((data)=> data._id==articleId).articleContent;
    let decodedContent = Buffer.from(encodedContent, 'base64');
    console.log(decodedContent);
    res.writeHead(200,{"Content-Type": "text/html"});
    res.write(decodedContent)
    res.end()
} */
module.exports = resource