const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../midddleware/async");
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
        new ErrorResponse(`Ressource introuvable, l'id ${req.params.id} n'existe pas`, 404)
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
      return next(new ErrorResponse(`Ressource introuvable, l'id ${req.params.id} n'existe pas`,404)
      );
    }
    res.status(200).json({ success: true, data: {} });
});
