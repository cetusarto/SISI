const router = require('express').Router();

const menuController = require('../controllers/menuController');
const auth = require('./authenticate')

router.get('/', auth, menuController.list);
router.get('/test', auth, menuController.test);

module.exports = router;