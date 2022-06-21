const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../midddleware/async");
const geocoder = require("../utils/geocoder");


//@desc     Recuperer tous les bootcamps
//@route    GET /api/v1/bootcamps
//@access   Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.find();
  res
    .status(200)
    .json({ success: true, count: bootcamp.length, data: bootcamp });
});
//@desc     Recuperer bootcamps via Id
//@route    GET /api/v1/bootcamps/:id
//@access   Public
exports.getBootcampsById = asyncHandler(async (req, res, next) => {
  let { id } = req.params;
  const bootcamp = await Bootcamp.findById(id);

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
  const bootcamp = await Bootcamp.findByIdAndDelete(id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Ressource introuvable, l'id ${req.params.id} n'existe pas`,
        404
      )
    );
  }
  res.status(200).json({ success: true, data: {} });
});

//@desc     Recuperer les bootcamps avec la distance 
//@route    GET /api/v1/bootcamps/radius/:zipcode/:distance
//@access   Public
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  //Recuperer la longitude et la latitude via geocoder
  const loc = await geocoder.geocode(zipcode);
  console.log(loc[0]);
  const lat = loc[0].latitude;
  const long = loc[0].longitude;
 
  //calculer le radius en utilisant les radians
  //diviser la distance par le radius de la terre
  // radius de la terre en km = 6,3778 
  const radius = distance / 6378;

  console.log(radius);
  console.log(loc[0]);


  const bootcamps = await Bootcamp.find({
    localisation: 
       { $geoWithin: { $centerSphere: [[long, lat], radius] } }
});
  // console.log(localisation.$geoWithin.$centerSphere);
  console.info(bootcamps);
  
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  })

});







