const express = require("express");
const router = express.Router();
const collaborators = require('../controllers/collaborators.controller.js');

router.get("/", collaborators.read);
router.get("/:collaborator_id", collaborators.readById);
router.post("/", collaborators.save);
router.put('/collaborators/:collaborator_id', router.update);
router.delete('/collaborators/:collaborator_id', router.deleteID);

module.exports = router;