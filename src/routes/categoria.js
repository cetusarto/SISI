const router = require('express').Router();

const categoriaController = require('../controllers/categoriaController');
const auth = require('./authenticate')


router.get('/', auth, categoriaController.list);
router.get('/add', auth, categoriaController.add);
router.post('/add', auth, categoriaController.create);
router.get('/update/:id', auth, categoriaController.edit);
router.post('/update/:id', auth, categoriaController.update);
router.get('/delete/:id', auth, categoriaController.delete);
router.get('/sort/:col/:dir', auth, categoriaController.sort);
router.get('/cajas/:id', auth, categoriaController.cajas);



module.exports = router;