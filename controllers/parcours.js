const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../midddleware/async");
const Parcours = require("../models/Parcours");
const Bootcamp = require("../models/Bootcamp");

//@desc     Recuperer tous les parcours
//@route    GET /api/v1/parcours
//@route    GET /api/v1/bootcamps/:bootcampId/parcours
//@access   Public
exports.getParcours = asyncHandler(async (req, res, next) => {
  let query;
  if (req.params.bootcampId) {
    query = Parcours.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Parcours.find().populate({
      path: "bootcamp",
      select: "nom description",
    });
  }
  const parcours = await query;
  res.status(200).json({
    success: true,
    count: parcours.length,
    data: parcours,
  });
    
});

//@desc     Recuperer tous les parcours
//@route    GET /api/v1/parcours/:id
//@access   Public
exports.getParcoursById = asyncHandler(async(req, res, next) => {
    const parcours = await Parcours.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'nom decritpion'
    });
    if (!parcours) {
        return next(new ErrorResponse(`Aucun parcours avec l'id suivant ${req.params.id}`), 404);
    }
    res.status(200).json({
        success: true,
        data: parcours
    });
})

//@desc     Ajouter un parcours 
//@route    POST /api/v1/bootcamps/:bootcampId/parcours
//@access   Private
exports.createParcours = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;
    const bootcamp = await Bootcamp.findById(req.params.bootcampId)
    if (!bootcamp) {
        return next(new ErrorResponse(`Aucun bootcamp avec l'id suivant ${req.params.bootcampId}`), 404);
    }
    const parcours = Parcours.create(req.body);
    res.status(200).json({
        success: true,
        data: parcours
    });
})

//@desc     Modifier un parcours 
//@route    PUT /api/v1/parcours/:id
//@access   Private
exports.updateParcours = asyncHandler(async (req, res, next) => {
    let parcours = await Parcours.findById(req.params.id)
    
    if (!parcours) {
        return next(new ErrorResponse(`Aucun parcours avec l'id suivant ${req.params.id}`), 404);
    }
    parcours = await Parcours.findByIdAndUpdate(req.params.id, req.body, {
        new: true, 
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data: parcours
    });
})

//@desc     Supprimer un parcours 
//@route    DELETE /api/v1/parcours/:id
//@access   Private
exports.deleteParcours = asyncHandler(async (req, res, next) => {
    const parcours = await Parcours.findById(req.params.id)
    
    if (!parcours) {
        return next(new ErrorResponse(`Aucun parcours avec l'id suivant ${req.params.id}`), 404);
    }
    await parcours.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
})