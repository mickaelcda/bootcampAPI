const express = require("express");
const {
  getParcours,
  getParcoursById,
  createParcours,
  updateParcours,
  deleteParcours
  
} = require("../controllers/parcours");

const router = express.Router({ mergeParams: true });

const { protect } = require('../midddleware/auth');

router.route("/")
    .get(getParcours)
    .post(protect, createParcours)
router.route("/:id")
    .get(getParcoursById)
    .put(protect, updateParcours)
    .delete(protect, deleteParcours)
    

module.exports = router;
