const router = require('express').Router();

const proveedorController = require('../controllers/proveedorController');
const contactoController = require('../controllers/contactoController');
const auth = require('./authenticate')


router.get('/', auth,proveedorController.list);
router.get('/add',auth, proveedorController.add);
router.post('/add',auth, proveedorController.create);
router.get('/update/:id',auth, proveedorController.edit);
router.post('/update/:id',auth, proveedorController.update);
router.get('/delete/:id', auth,proveedorController.delete);
router.get('/sort/:col/:dir',auth, proveedorController.sort);
router.get('/cajas/:id',auth, proveedorController.cajas);


//Contacto Routes
router.get('/contacto/:id', contactoController.list);


module.exports = router;