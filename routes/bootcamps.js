const express = require('express');
const {
    getBootcamps,
    createBootcamps,
    getBootcampsById,
    updateBootcamps,
    deleteBootcamps,
    getBootcampsInRadius
 } = require('../controllers/bootcamps');


//inclusion des ressources d'autres routeurs
const parcoursRouter = require('./parcours');

const router = express.Router();

//re-routage
router.use('/:bootcampId/parcours', parcoursRouter);

router
    .route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius)

router
    .route('/')
    .get(getBootcamps)
    .post(createBootcamps)

router
    .route('/:id')
    .get(getBootcampsById)
    .put(updateBootcamps)
    .delete(deleteBootcamps)

module.exports = router ;