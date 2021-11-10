const router = require('express').Router();

const contactoController = require('../controllers/contactoController');
const auth = require('./authenticate')


router.get('/list/:id',auth, contactoController.list);
router.get('/add/:id',auth, contactoController.add);
router.post('/add',auth, contactoController.create);
router.get('/update/:id',auth, contactoController.edit);
router.post('/update/:id',auth, contactoController.update);
router.get('/delete/:id',auth,contactoController.delete);





module.exports = router;