const Router = require('koa-router');
const BooksController = require('../controllers/books.js')

const router = new Router();
const BASE_URL = '/api/v1/books';
router.prefix(`${BASE_URL}`);

router.get('/', BooksController.all);

router.get('/:id', BooksController.getById);

router.post('/', BooksController.add);


module.exports = router;