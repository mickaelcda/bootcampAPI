const express = require("express");
const {
  getParcours,
  getParcoursById,
  createParcours,
  updateParcours,
  deleteParcours
  
} = require("../controllers/parcours");

const router = express.Router({ mergeParams: true });

router.route("/")
    .get(getParcours)
    .post(createParcours)
router.route("/:id")
    .get(getParcoursById)
    .put(updateParcours)
    .delete(deleteParcours)
    

module.exports = router;
