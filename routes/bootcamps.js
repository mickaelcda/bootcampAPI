const express = require('express');
const {
    getBootcamps,
    createBootcamps,
    getBootcampsById,
    updateBootcamps,
    deleteBootcamps,
    getBootcampsInRadius,
    bootcampPhotoUpload
 } = require('../controllers/bootcamps');

 const Bootcamp = require('../models/Bootcamp')
const advancedResults = require('../midddleware/advancedResults');



//inclusion des ressources d'autres routeurs
const parcoursRouter = require('./parcours');

const router = express.Router();

const { protect, authorize } = require('../midddleware/auth');

//re-routage
router.use('/:bootcampId/parcours', parcoursRouter);

router
    .route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius)

router
    .route('/')
    .get(advancedResults(Bootcamp,'parcours'), getBootcamps)
    .post(protect, authorize('publisher', 'admin'), createBootcamps)

router
    .route('/:id')
    .get(getBootcampsById)
    .put(protect, authorize('publisher', 'admin'), updateBootcamps)
    .delete(protect, authorize('publisher', 'admin'), deleteBootcamps)

router 
    .route('/:id/photo')
    .put(protect , authorize('publisher', 'admin'), bootcampPhotoUpload)

module.exports = router ;