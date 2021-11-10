const router = require('express').Router();

const cajaController = require('../controllers/cajaController');
const auth = require('./authenticate')


router.get('/',auth, cajaController.menu);
router.get('/inventario/',auth, cajaController.listI);
router.get('/historial/',auth, cajaController.listH);
router.get('/add',auth, cajaController.add);
router.post('/add',auth, cajaController.create);

router.get('/update/:id',auth, cajaController.edit);
router.get('/update/:id/:extra',auth, cajaController.edit);
router.post('/update/:id', auth,cajaController.update);
router.post('/update/:id/:extra',auth, cajaController.update);

router.get('/delete/:id', auth,cajaController.delete);
router.get('/delete/:id/:extra',auth, cajaController.delete);
router.get('/sort/:col/:dir',auth, cajaController.sortI);
router.get('/historial/sort/:col/:dir',auth, cajaController.sortH);





module.exports = router;