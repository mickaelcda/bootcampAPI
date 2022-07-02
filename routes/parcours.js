const express = require("express");
const {
  getParcours,
  getParcoursById,
  createParcours,
  updateParcours,
  deleteParcours
  
} = require("../controllers/parcours");

const router = express.Router({ mergeParams: true });

const { protect , authorize} = require('../midddleware/auth');

router.route("/")
    .get(getParcours)
    .post(protect, authorize('publisher', 'admin'), createParcours)
router.route("/:id")
    .get(getParcoursById)
    .put(protect, authorize('publisher', 'admin') ,updateParcours)
    .delete(protect, authorize('publisher', 'admin') , deleteParcours)
    

module.exports = router;
