const express = require('express');
const router = express.Router();
const controle =  require('../controllers/bootcamps')

router
    .route('/radius/:zipcode/:distance')
    .get(controle.getBootcampsInRadius)

router
    .route('/')
    .get(controle.getBootcamps)
    .post(controle.createBootcamps)

router
    .route('/:id')
    .get(controle.getBootcampsById)
    .put(controle.updateBootcamps)
    .delete(controle.deleteBootcamps)

module.exports = router ;