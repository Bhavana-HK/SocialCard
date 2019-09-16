var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var multer = require('multer');
var resource = require('./resource');
let upload  = multer({ storage: multer.memoryStorage() });

router.use(bodyParser.json());

// router.get('/:id', resource.getArticle);
router.get('/getLastestCards', resource.getLastestCards);
router.post('/createCard', upload.single('card_picture'), resource.createCard); // name of the field should be card_image for the file.
router.post('/createChannel', resource.createChannel);
router.post('/createAuthor', upload.single('author_picture'),resource.createAuthor);
router.post('/signIn', resource.signInAuthor);
router.post('/editAuthor', upload.single('author_picture'),resource.editAuthor);
//router.post('/signup', resource.signUpAuthor);

module.exports = router;