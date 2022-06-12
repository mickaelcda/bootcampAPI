const Bootcamp = require('../models/Bootcamp');

//@desc     Recuperer tous les bootcamps
//@route    GET /api/v1/bootcamps
//@access   Public
exports.getBootcamps = (req, res, next) => {
    res.status(200).json({ success: true, msg: 'Voir tous les bootcamps' });
}
//@desc     Recuperer bootcamps via Id
//@route    GET /api/v1/bootcamps/:id
//@access   Public
exports.getBootcampsById = (req, res, next) => {
    res.status(200).json({ success: true, msg: `voir un bootcamps ${req.params.id} ` });
}
//@desc     Creer un bootcamp
//@route    POST /api/v1/bootcamps/:id
//@access   Private
exports.createBootcamps = async(req, res, next) => {
   const bootcamp = await Bootcamp.create(req.body)
    console.log(req.body);
    res.status(201).json({ success: true, data: bootcamp });
}
//@desc     Modifier un bootcamp
//@route    PUT /api/v1/bootcamps/:id
//@access   Private
exports.updateBootcamps = (req, res, next) => {
    res.status(200).json({ success: true, msg: `Modifier un bootcamp ${req.params.id}` });
}
//@desc     Supprimer un bootcamp
//@route    DELETE /api/v1/bootcamps/:id
//@access   Private
exports.deleteBootcamps = (req, res, next) => {
    res.status(200).json({ success: true, msg: `Supprimer un bootcamp ${req.params.id}` });
}
