const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../midddleware/async");
const geocoder = require("../utils/geocoder");
const path = require('path')

//@desc     Recuperer tous les bootcamps
//@route    GET /api/v1/bootcamps
//@access   Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {

  res.status(200).json(res.advancedResults);
  
});
//@desc     Recuperer bootcamps via Id
//@route    GET /api/v1/bootcamps/:id
//@access   Public
exports.getBootcampsById = asyncHandler(async (req, res, next) => {

  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp introuvable avec l'id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});
//@desc     Creer un bootcamp
//@route    POST /api/v1/bootcamps/:id
//@access   Private
exports.createBootcamps = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({ success: true, data: bootcamp });
  } catch (err) {
    next(err);
  }
};
//@desc     Modifier un bootcamp
//@route    PUT /api/v1/bootcamps/:id
//@access   Private
exports.updateBootcamps = asyncHandler(async (req, res, next) => {
  let { id } = req.params;
  const bootcamp = await Bootcamp.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Ressource introuvable, l'id ${req.params.id} n'existe pas`,
        404
      )
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});
//@desc     Supprimer un bootcamp
//@route    DELETE /api/v1/bootcamps/:id
//@access   Private
exports.deleteBootcamps = asyncHandler(async (req, res, next) => {
  let { id } = req.params;
  const bootcamp = await Bootcamp.findById(id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Ressource introuvable, l'id ${req.params.id} n'existe pas`,
        404
      )
    );
  }
  bootcamp.remove();
  res.status(200).json({ success: true, data: {} });
});

//@desc     Recuperer les bootcamps avec la distance
//@route    GET /api/v1/bootcamps/radius/:zipcode/:distance
//@access   Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  //Recuperer la longitude et la latitude via geocoder
  const loc = await geocoder.geocode(zipcode);
  // console.log(loc[0]);
  const lat = loc[0].latitude;
  const long = loc[0].longitude;

  //calculer le radius en utilisant les radians
  //diviser la distance par le radius de la terre
  // radius de la terre en km = 6,3778
  const radius = distance / 6378;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[long, lat], radius] } },
  });

  // console.info(bootcamps);

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

//@desc     Upload photo pour les bootcamps
//@route    PUT /api/v1/bootcamps/:id/photo
//@access   Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Ressource introuvable, l'id ${req.params.id} n'existe pas`,
        404
      )
    );
  }
  if (!req.files) {
    return next(
      new ErrorResponse(`Merci de choisir un fichier a uploader`, 400)
    );
  }

  const file = req.files.file
  
  //verifier que l image est bie nune photo 
  if (!file.mimetype.startsWith('image')) {
    return next(
      new ErrorResponse(`Merci de choisir un fichier de type image`, 400)
    );
  }
  //verifier la taille de l image 
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(`Merci de choisir un fichier plus petit que ${process.env.MAX_FILE_UPLOAD}`, 400)
    );
  }
  //Creer un nom personalise pour chaue photo
  file.name =`photo_${bootcamp._id}${path.parse(file.name).ext}`
  console.log(file.name);

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      return next(
        new ErrorResponse(`probleme avec le fichier uploader`, 400)
      );
    }
  })

  await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name })
  
  res.status(200).json({
    success: true, 
    data: file.name
  })
});

