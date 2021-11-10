const router = require('express').Router();

const tableroController = require('../controllers/tableroController');
const auth = require('./authenticate')


router.get('/', auth, tableroController.list);
router.get('/resumen/:tabla',auth, tableroController.listS);
router.get('/:riesgo',auth, tableroController.listR);





module.exports = router;