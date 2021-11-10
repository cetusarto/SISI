const router = require('express').Router();

const productoController = require('../controllers/productoController');
const auth = require('./authenticate')

router.get('/',auth, productoController.list);
router.get('/add', auth,productoController.add);
router.post('/add',auth, productoController.create);
router.get('/update/:id',auth, productoController.edit);
router.post('/update/:id',auth, productoController.update);
router.get('/delete/:id',auth, productoController.delete);
router.get('/sort/:col/:dir',auth, productoController.sort);
router.get('/cajas/:id',auth, productoController.cajas);



module.exports = router;