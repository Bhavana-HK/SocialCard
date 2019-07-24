var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var resource = require('./resource');

router.use(bodyParser.json());

// router.get('/:id', resource.getArticle);
router.get('/getLastestCards', resource.getLastestCards);

module.exports = router;