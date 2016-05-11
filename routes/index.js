var express = require('express');
var router = express.Router();
var commentController = require('../controllers/comment_controller');
var quizController = require('../controllers/quiz_controller');
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

//router.get('/question', quizController.question);
//router.get('/check', quizController.check);

router.param('quizId', quizController.load); //autoload: quizId

//definición de rutas de /quizzes
router.get('/quizzes.:format?', quizController.index);
router.get('/quizzes/:quizId(\\d+).:format?', quizController.show);
router.get('/quizzes/:quizId(\\d+)/check', quizController.check);
router.get('/quizzes/:quizId(\\d+)/edit',  quizController.edit);
router.put('/quizzes/:quizId(\\d+)',       quizController.update);
router.get('/quizzes/new',                 quizController.new);
router.post('/quizzes',                    quizController.create);
router.delete('/quizzes/:quizId(\\d+)',    quizController.destroy);
router.get('/author', function(req, res) {
  res.render('author', {title: 'Autores del Quiz'});
});

router.get('/quizzes/:quizId(\\d+)/comments/new',  commentController.new);
router.post('/quizzes/:quizId(\\d+)/comments',     commentController.create);

module.exports = router;
