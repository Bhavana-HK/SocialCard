var util = require('./util')
var resource = {}

resource.getLastestCards = (req,res) => {
    util.createCard((cards)=>{
        res.writeHead(200,{"Content-Type": "application/json"});
        res.write(JSON.stringify(cards))
        res.end()
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